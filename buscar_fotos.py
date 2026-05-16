"""
Busca automatica de fotos reais dos produtos.

Estrategia 1: Bing Images via requests — extrai URLs full-size do JSON
              embutido na pagina HTML (rapido, sem navegador).
Estrategia 2: Playwright em Zappos — fotos profissionais de produto.
Estrategia 3: Screenshot fallback.
"""

import os, asyncio, io, requests, re, json
from playwright.async_api import async_playwright
from PIL import Image

IMGS = os.path.join(os.path.dirname(os.path.abspath(__file__)), "imagens_produto")
os.makedirs(IMGS, exist_ok=True)

UA_DESK = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36"
UA_MOBILE = "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1"

BUSCAS = {
    "hoka": {
        "bing_query": "Hoka Speedgoat 7 trail running shoe product photo white background",
        "zappos_url": "https://www.zappos.com/product/9687264",
        "fallback_url": "https://www.hoka.com/en-us/trail-running/speedgoat-7/1141100.html",
    },
    "brooks": {
        "bing_query": "Brooks Ghost 18 running shoe product photo white background side view",
        "zappos_url": "https://www.zappos.com/product/9584739",
        "fallback_url": "https://www.brooksrunning.com/en_us/ghost-18-mens-road-running-shoe/120381.html",
    },
    "reebok": {
        "bing_query": "Reebok Floatride Energy 5 shoe product photo white background",
        "zappos_url": "https://www.zappos.com/product/9647123",
        "fallback_url": "https://www.reebok.com/en-us/floatride-energy-5-shoes/GX5139.html",
    },
}


# ── Bing Images ─────────────────────────────────────────────────────────────

def bing_imagens(query, n=12):
    """
    Faz GET no Bing Images e extrai URLs das imagens originais
    do JSON embutido no HTML. Retorna lista de URLs.
    """
    try:
        url = "https://www.bing.com/images/search"
        r = requests.get(url, params={
            "q": query, "form": "HDRSC3", "first": "1",
            "tsc": "ImageHoverTitle", "mmasync": "1",
        }, headers={
            "User-Agent": UA_DESK,
            "Accept-Language": "en-US,en;q=0.9",
            "Accept": "text/html,application/xhtml+xml",
            "Referer": "https://www.bing.com/",
        }, timeout=12)

        if r.status_code != 200:
            print(f"  Bing status {r.status_code}")
            return []

        # Bing embute dados de imagem como JSON dentro de atributo m="{...}"
        # Formato: m="{&quot;murl&quot;:&quot;URL&quot;,...}"
        # Ou em formato decodificado nos dados JS: "murl":"URL"
        urls = []

        # Extrai mediaUrl / murl do HTML
        for pattern in [
            r'"murl":"(https?://[^"]+\.(?:jpg|jpeg|png|webp)[^"]*)"',
            r'"mediaUrl":"(https?://[^"]+\.(?:jpg|jpeg|png|webp)[^"]*)"',
            r'murl&quot;:&quot;(https?://[^&]+\.(?:jpg|jpeg|png|webp)[^&]*)',
        ]:
            found = re.findall(pattern, r.text, re.IGNORECASE)
            for u in found:
                u_clean = u.replace("&amp;", "&").replace("\\u0026", "&")
                if u_clean not in urls:
                    urls.append(u_clean)
            if len(urls) >= n:
                break

        print(f"  Bing: {len(urls)} URLs encontradas")
        return urls[:n]

    except Exception as e:
        print(f"  Bing erro: {e}")
        return []


def baixar(url, referer="https://www.bing.com/"):
    """Baixa imagem de URL. Retorna PIL Image ou None."""
    try:
        r = requests.get(url, headers={
            "User-Agent": UA_DESK,
            "Referer": referer,
            "Accept": "image/avif,image/webp,image/apng,image/*",
        }, timeout=12)
        if r.status_code == 200 and len(r.content) > 15_000:
            img = Image.open(io.BytesIO(r.content)).convert("RGBA")
            w, h = img.size
            if w >= 300 and h >= 300 and min(w, h) / max(w, h) > 0.5:
                return img
    except Exception:
        pass
    return None


def melhor_bing(query):
    """Retorna a melhor PIL Image encontrada via Bing ou None."""
    urls = bing_imagens(query)
    candidatos = []
    for i, url in enumerate(urls):
        img = baixar(url)
        if img:
            score = img.width * img.height * (min(img.width, img.height) / max(img.width, img.height)) ** 2
            candidatos.append((score, img))
            print(f"  [{i+1}] {img.width}x{img.height} score={int(score):,}")
            if score > 2_000_000:  # ja e excelente
                break
    if candidatos:
        candidatos.sort(reverse=True)
        return candidatos[0][1]
    return None


# ── Playwright / Zappos ──────────────────────────────────────────────────────

JS_PRODUTO = """
() => {
    const imgs = Array.from(document.images);
    let best = null, bestScore = 0;
    for (const img of imgs) {
        const w = img.naturalWidth, h = img.naturalHeight;
        if (w < 250 || h < 250) continue;
        const ratio = Math.min(w,h)/Math.max(w,h);
        if (ratio < 0.55) continue;
        const score = w * h * ratio * ratio;
        if (score > bestScore) { bestScore = score; best = img; }
    }
    if (!best) return null;
    const rect = best.getBoundingClientRect();
    const src = best.currentSrc || best.src || '';
    return {
        w: best.naturalWidth, h: best.naturalHeight,
        vw: Math.round(rect.width),
        src: src.startsWith('data:') ? '' : src
    };
}
"""

async def playwright_produto(url, ignore_ssl=False):
    """Playwright: navega na URL, tenta extrair e baixar a foto do produto."""
    async with async_playwright() as p:
        browser = await p.chromium.launch(
            headless=True,
            args=["--no-sandbox", "--disable-blink-features=AutomationControlled"],
            ignore_default_args=["--enable-automation"],
        )
        ctx = await browser.new_context(
            viewport={"width": 1280, "height": 900},
            user_agent=UA_DESK,
            ignore_https_errors=ignore_ssl,
        )
        page = await ctx.new_page()
        try:
            print(f"  Playwright: {url[:65]}")
            await page.goto(url, wait_until="domcontentloaded", timeout=28000)
            await page.wait_for_timeout(3500)
            await page.evaluate("window.scrollTo(0, 500)")
            await page.wait_for_timeout(2000)

            info = await page.evaluate(JS_PRODUTO)
            if info:
                print(f"  Img encontrada: {info['w']}x{info['h']}  vw={info['vw']}")
                if info["src"]:
                    img = baixar(info["src"], referer=url)
                    if img:
                        await browser.close()
                        return img
                if info["vw"] > 80:
                    el = await page.evaluate_handle("""
                    () => {
                        const imgs = Array.from(document.images);
                        let b=null, bs=0;
                        for(const i of imgs){
                            const w=i.naturalWidth,h=i.naturalHeight;
                            if(w<250||h<250) continue;
                            const r=Math.min(w,h)/Math.max(w,h);
                            if(r<0.55) continue;
                            const s=w*h*r*r;
                            if(s>bs){bs=s;b=i;}
                        }
                        return b;
                    }
                    """)
                    el_js = el.as_element() if el else None
                    if el_js:
                        await el_js.scroll_into_view_if_needed()
                        await page.wait_for_timeout(400)
                        shot = await el_js.screenshot()
                        img = Image.open(io.BytesIO(shot)).convert("RGBA")
                        if img.width >= 300:
                            await browser.close()
                            return img
        except Exception as e:
            print(f"  Playwright erro: {e}")
        finally:
            await browser.close()
    return None


async def screenshot_fallback(url):
    """Screenshot da pagina, crop direita."""
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True, args=["--no-sandbox"])
        ctx = await browser.new_context(viewport={"width": 1280, "height": 800}, user_agent=UA_DESK,
                                         ignore_https_errors=True)
        page = await ctx.new_page()
        try:
            await page.goto(url, wait_until="domcontentloaded", timeout=25000)
            await page.wait_for_timeout(5000)
            data = await page.screenshot()
            base = Image.open(io.BytesIO(data))
            w, h = base.size
            return base.crop((w//2, 0, w, int(h*0.72))).resize((700, 700), Image.LANCZOS).convert("RGBA")
        except Exception as e:
            print(f"  Screenshot erro: {e}")
        finally:
            await browser.close()
    return None


# ── Principal ────────────────────────────────────────────────────────────────

async def capturar(marca, cfg):
    path = os.path.join(IMGS, f"{marca}.png")

    if os.path.exists(path):
        kb = os.path.getsize(path) // 1024
        try:
            w, h = Image.open(path).size
            if kb > 80 and min(w,h)/max(w,h) > 0.6:
                print(f"  [{marca}] Foto local OK ({kb}kb {w}x{h}).")
                return True
        except Exception:
            pass
        os.remove(path)

    print(f"\n[{marca.upper()}] Buscando foto...")

    # 1. Bing Images (mais rapido, sem browser)
    print(f"  Tentando Bing Images...")
    img = melhor_bing(cfg["bing_query"])
    if img:
        img.save(path, "PNG")
        print(f"  Salva via Bing: {img.width}x{img.height}px")
        return True

    # 2. Playwright no Zappos
    print(f"  Tentando Zappos...")
    img = await playwright_produto(cfg["zappos_url"])
    if img:
        img.save(path, "PNG")
        print(f"  Salva via Zappos: {img.width}x{img.height}px")
        return True

    # 3. Screenshot fallback
    print(f"  Screenshot fallback...")
    img = await screenshot_fallback(cfg["fallback_url"])
    if img:
        img.save(path, "PNG")
        print(f"  Screenshot salvo: 700x700px")
        return True

    print(f"  AVISO: nenhuma foto para {marca}.")
    return False


async def main():
    print("=== Buscando fotos dos produtos ===")
    for marca, cfg in BUSCAS.items():
        await capturar(marca, cfg)
    print("\nConcluido. Fotos em:", IMGS)

if __name__ == "__main__":
    asyncio.run(main())
