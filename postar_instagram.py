"""
Posta automaticamente no Instagram o carrossel gerado por gerar_cards.py.

Primeira execucao: abre navegador visivel para voce fazer login manualmente.
                  A sessao e salva em instagram_session.json.
Proximas vezes:   usa a sessao salva (headless, totalmente automatico).

Uso:
  python postar_instagram.py                   # usa a pasta de cards mais recente
  python postar_instagram.py --login           # forca novo login
  python postar_instagram.py --pasta "caminho" # pasta especifica
"""

import os, sys, asyncio, glob, json, time
from pathlib import Path
from playwright.async_api import async_playwright

BASE        = Path(__file__).parent
SESSION     = BASE / "instagram_session.json"
CARDS_DIR   = BASE / "cards_output"

LEGENDA = """\
3 marcas esportivas. Apostas diferentes para 2026.
Hoka, Brooks e Reebok — cada uma foi em uma direção.
Qual acertou em cheio pra você?

Comenta aqui em baixo 👇

#vidadecorredor #runnersdobrasil #trailbr #hokaoneone #brooksrunning #reebok #calcadosesportivos"""

# ─── Utilitarios ────────────────────────────────────────────────────────────

def pasta_mais_recente():
    pastas = sorted(glob.glob(str(CARDS_DIR / "post_*")), reverse=True)
    if not pastas:
        raise FileNotFoundError("Nenhuma pasta de cards encontrada. Rode gerar_cards.py primeiro.")
    return Path(pastas[0])

def listar_slides(pasta):
    slides = sorted(pasta.glob("slide_*.png"))
    if not slides:
        raise FileNotFoundError(f"Nenhum slide PNG em {pasta}")
    print(f"  Slides encontrados: {len(slides)}")
    for s in slides:
        print(f"    {s.name}")
    return [str(s) for s in slides]

# ─── Login manual (primeira vez) ────────────────────────────────────────────

async def fazer_login(playwright):
    print("\nAbrindo Chrome para login manual no Instagram...")
    print("Faca login normalmente. O script aguarda ate voce estar no feed.")
    browser = await playwright.chromium.launch(headless=False, slow_mo=100)
    ctx = await browser.new_context(viewport={"width": 430, "height": 932})
    page = await ctx.new_page()
    await page.goto("https://www.instagram.com/accounts/login/", wait_until="domcontentloaded")

    print("\nAguardando login... (pode demorar, complete o login e aguarde o feed carregar)")
    # Espera ate a URL mudar para o feed
    await page.wait_for_url("https://www.instagram.com/", timeout=180_000)
    await page.wait_for_timeout(3000)

    # Salva sessao
    storage = await ctx.storage_state()
    SESSION.write_text(json.dumps(storage, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"  Sessao salva em: {SESSION}")
    await browser.close()
    return True

# ─── Postar carrossel ───────────────────────────────────────────────────────

async def postar(slides, legenda, headless=True):
    async with async_playwright() as p:
        ctx_args = {
            "storage_state": str(SESSION),
            "viewport": {"width": 1280, "height": 900},
        }

        browser = await p.chromium.launch(
            headless=headless,
            args=["--no-sandbox"],
        )
        ctx = await browser.new_context(**ctx_args)
        page = await ctx.new_page()

        # ── 1. Abre Instagram
        print("\n  Abrindo Instagram...")
        await page.goto("https://www.instagram.com/", wait_until="domcontentloaded", timeout=25000)
        await page.wait_for_timeout(3000)

        # Verifica se esta logado
        if "login" in page.url:
            await browser.close()
            raise RuntimeError("Sessao expirada. Rode com --login para fazer novo login.")

        # ── 2. Clica no botao Criar (+)
        print("  Clicando em Criar novo post...")
        # Tenta varios seletores para o botao de criar post
        botao_criar = None
        for selector in [
            "svg[aria-label='New post']",
            "svg[aria-label='Novo post']",
            "[aria-label='New post']",
            "[aria-label='Novo post']",
            "a[href='/create/style/']",
            "span:has-text('Create')",
        ]:
            try:
                el = await page.query_selector(selector)
                if el:
                    botao_criar = el
                    break
            except Exception:
                pass

        if not botao_criar:
            # Tenta pelo SVG do icone de mais
            botao_criar = await page.query_selector("svg[aria-label*='reate'], svg[aria-label*='ost']")

        if not botao_criar:
            await browser.close()
            raise RuntimeError("Botao 'Criar post' nao encontrado. Layout do Instagram pode ter mudado.")

        await botao_criar.click()
        await page.wait_for_timeout(2000)

        # ── 3. Upload dos arquivos
        print("  Fazendo upload dos slides...")
        # O Instagram usa um input file oculto
        file_input = await page.query_selector("input[type='file']")
        if not file_input:
            # Tenta clicar em "Selecionar do computador"
            for txt in ["Select from computer", "Selecionar do computador", "Select From Computer"]:
                try:
                    btn = await page.get_by_text(txt).first
                    if btn:
                        await btn.click()
                        await page.wait_for_timeout(1000)
                        break
                except Exception:
                    pass
            file_input = await page.query_selector("input[type='file']")

        if not file_input:
            await browser.close()
            raise RuntimeError("Input de arquivo nao encontrado.")

        await file_input.set_input_files(slides)
        await page.wait_for_timeout(3000)

        # ── 4. Navega para a etapa de legenda (clica Next/Avancar ate chegar)
        print("  Avancando pelo fluxo de publicacao...")
        for tentativa in range(4):
            # Clica em Next / Avancar
            avancou = False
            for txt in ["Next", "Próximo", "Proximo", "Avançar", "Avancar"]:
                try:
                    btn = page.get_by_role("button", name=txt)
                    if await btn.count() > 0:
                        await btn.first.click()
                        await page.wait_for_timeout(2000)
                        avancou = True
                        break
                except Exception:
                    pass
            if not avancou:
                break

        # ── 5. Escreve a legenda
        print("  Escrevendo legenda...")
        caption_field = await page.query_selector(
            "div[role='textbox'][aria-label*='caption'], "
            "div[role='textbox'][aria-label*='legenda'], "
            "textarea[aria-label*='caption'], "
            "div[contenteditable='true']"
        )
        if caption_field:
            await caption_field.click()
            await page.wait_for_timeout(500)
            await caption_field.type(legenda, delay=8)
            await page.wait_for_timeout(1000)
        else:
            print("  AVISO: Campo de legenda nao encontrado. Publicando sem legenda.")

        # ── 6. Publica
        print("  Publicando...")
        publicado = False
        for txt in ["Share", "Compartilhar", "Publicar", "Post"]:
            try:
                btn = page.get_by_role("button", name=txt)
                if await btn.count() > 0:
                    await btn.first.click()
                    await page.wait_for_timeout(5000)
                    publicado = True
                    print(f"  Post publicado com sucesso!")
                    break
            except Exception:
                pass

        if not publicado:
            print("  AVISO: Botao 'Publicar' nao encontrado. Verifique manualmente.")

        # Salva screenshot para confirmar
        shot_path = BASE / "ultimo_post_confirmacao.png"
        await page.screenshot(path=str(shot_path))
        print(f"  Screenshot salvo: {shot_path.name}")

        await browser.close()

# ─── Main ────────────────────────────────────────────────────────────────────

async def main():
    args = sys.argv[1:]
    forcar_login = "--login" in args
    pasta_arg = None
    if "--pasta" in args:
        idx = args.index("--pasta")
        if idx + 1 < len(args):
            pasta_arg = Path(args[idx + 1])

    # Determina pasta dos cards
    pasta = pasta_arg or pasta_mais_recente()
    print(f"Pasta de cards: {pasta.name}")
    slides = listar_slides(pasta)

    # Login se necessario
    async with async_playwright() as p:
        if forcar_login or not SESSION.exists():
            await fazer_login(p)
        else:
            print(f"Sessao existente: {SESSION.name}")

    # Posta
    try:
        await postar(slides, LEGENDA, headless=True)
    except RuntimeError as e:
        print(f"\nErro: {e}")
        if "expirada" in str(e):
            print("Rodando login manual...")
            async with async_playwright() as p:
                await fazer_login(p)
            await postar(slides, LEGENDA, headless=True)

if __name__ == "__main__":
    asyncio.run(main())
