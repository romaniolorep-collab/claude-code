#!/usr/bin/env python3
"""Baixa imagens de produto Brooks (vista lateral) por Style ID.

Roda no GitHub Actions (rede aberta). Para cada SKU tenta as fontes em ordem:
- shopify: endpoint publico /products/<handle>.json (imagem original, alta resolucao)
- og:     pagina HTML -> meta og:image (para brooksrunning.com, forca ?sw=2000)

Gera images/brooks/<StyleID>__<cor>.<ext> e images/brooks/REPORT.md.
Nunca falha o job: erros por SKU vao para o relatorio.
"""

import io
import json
import re
import sys
import time
from pathlib import Path

import requests
from PIL import Image

OUT = Path("images/brooks")
UA = (
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
    "(KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36"
)
HEADERS = {
    "User-Agent": UA,
    "Accept": "text/html,application/xhtml+xml,application/json;q=0.9,image/avif,image/webp,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.9",
}

# fmt: off
CATALOG = [
    # --- Ghost 17 ---
    {"id": "1104421D048", "model": "Ghost 17", "color": "Oyster Mushroom-Orange-Ebony", "sources": [
        ("shopify", "https://www.holabirdsports.com/products/brooks-ghost-17-mens-oyster-musheroom-orange-ebony"),
        ("shopify", "https://coastalrunco.com/products/mens-brooks-ghost-17-oyster-mushroom-orange-ebony"),
        ("shopify", "https://islandtrends.com/products/brooks-mens-ghost-17-shoes-oyster-mushroom-orange-ebony-1104421d048"),
    ]},
    {"id": "1104421D090", "model": "Ghost 17", "color": "Black-Grey-White", "sources": [
        ("shopify", "https://www.holabirdsports.com/products/brooks-ghost-17-mens-black-grey-white"),
    ]},
    {"id": "1104421D112", "model": "Ghost 17", "color": "White-Pink Clay-Gecko", "sources": [
        ("shopify", "https://www.holabirdsports.com/products/brooks-ghost-17-mens-white-pink-clay-gecko"),
    ]},
    {"id": "1204311B070", "model": "Ghost 17", "color": "Oyster-Apricot-Pink", "sources": [
        ("shopify", "https://www.holabirdsports.com/products/brooks-ghost-17-womens-oyster-apricot-pink"),
    ]},
    {"id": "1204311B080", "model": "Ghost 17", "color": "Black-Purple-Coral", "sources": [
        ("shopify", "https://www.holabirdsports.com/products/brooks-ghost-17-womens-black-purple-coral"),
    ]},
    {"id": "1204311B090", "model": "Ghost 17", "color": "Black-Grey-White", "sources": [
        ("shopify", "https://www.holabirdsports.com/products/brooks-ghost-17-womens-black-grey-white"),
    ]},
    {"id": "1204311B412", "model": "Ghost 17", "color": "Burgundy-Pink-Green", "sources": [
        ("shopify", "https://athleticannex.com/products/w-ghost-17-burgundy-pink-green"),
    ]},
    {"id": "1204311B443", "model": "Ghost 17", "color": "Blue Heron-White-Orange", "sources": [
        ("shopify", "https://www.holabirdsports.com/products/brooks-ghost-17-womens-blue-heron-white-orange"),
    ]},
    # --- Adrenaline GTS 25 ---
    {"id": "1104541D033", "model": "Adrenaline GTS 25", "color": "Oyster-Green Gecko-Blue", "sources": [
        ("og", "https://www.brooksrunning.com/en_us/mens/shoes/road-running-shoes/adrenaline-gts-25/1104541D033.085.html"),
    ]},
    {"id": "1104541D055", "model": "Adrenaline GTS 25", "color": "Black-Ipanema-Mint", "sources": [
        ("shopify", "https://www.holabirdsports.com/products/brooks-adrenaline-gts-25-mens-black-ipanema-mint"),
    ]},
    {"id": "1104541D184", "model": "Adrenaline GTS 25", "color": "Silver Anniversary", "sources": [
        ("shopify", "https://www.holabirdsports.com/products/brooks-adrenaline-gts-25-mens-silver-anniversary-edition"),
    ]},
    {"id": "1204431B053", "model": "Adrenaline GTS 25", "color": "Oyster-Pink-Green", "sources": [
        ("shopify", "https://thesportsedit.com/products/brooks-adrenaline-gts-25-oyster-pink-green-120443-053"),
    ]},
    {"id": "1204431B064", "model": "Adrenaline GTS 25", "color": "Black-Cyber Pink-Iced Aqua", "sources": [
        ("shopify", "https://www.holabirdsports.com/products/brooks-adrenaline-gts-25-womens-black-cyber-pink-iced-aqua"),
        ("shopify", "https://tcrunningco.com/products/womens-adrenaline-gts-25-064-black-cyber-pink-iced-aqua"),
    ]},
    {"id": "1204431B184", "model": "Adrenaline GTS 25", "color": "Silver Anniversary", "sources": [
        ("shopify", "https://www.holabirdsports.com/products/brooks-adrenaline-gts-25-womens-silver-anniversary-edition"),
        ("shopify", "https://runpacers.com/products/womens-brooks-adrenaline-gts-25-silver-anniversary-edition"),
    ]},
    # --- Glycerin 22 ---
    {"id": "1104451D063", "model": "Glycerin 22", "color": "Black-Atomizer-Blazing Orange", "sources": [
        ("shopify", "https://thesportsedit.com/products/brooks-glycerin-22-black-atomizer-blazing-orange-1104451d063"),
        ("og", "https://sportano.com/p/764141/men-s-running-shoes-brooks-glycerin-22-black-atomizer-blazing-orange"),
    ]},
    {"id": "1104451D078", "model": "Glycerin 22", "color": "Primer Gray-Ebony-Bluewash", "sources": [
        ("og", "https://www.brooksrunning.com/en_us/mens/shoes/road-running-shoes/glycerin-22/1104451D078.125.html"),
    ]},
    {"id": "1104451D135", "model": "Glycerin 22", "color": "White-Grey-Black", "sources": [
        ("og", "https://www.brooksrunning.com/en_us/mens/shoes/road-running-shoes/glycerin-22/1104451D135.140.html"),
    ]},
    {"id": "1104451D175", "model": "Glycerin 22", "color": "Bright White-Winter Sky-Black", "sources": [
        ("shopify", "https://www.holabirdsports.com/products/brooks-glycerin-22-mens-bright-white-winter-sky-black"),
    ]},
    {"id": "1104451D415", "model": "Glycerin 22", "color": "Smoke-Stormy-Orange", "sources": [
        ("shopify", "https://us.thesportsedit.com/products/brooks-glycerin-22-smoke-stormy-orange-1104451d415"),
        ("og", "https://www.brooksrunning.com.tr/p-glycerin-22-erkek-gri-kosu-ayakkabisi-1104451d415"),
    ]},
    {"id": "1104451D821", "model": "Glycerin 22", "color": "Orange-Nightlife-White", "sources": [
        ("shopify", "https://www.holabirdsports.com/products/brooks-glycerin-22-mens-orange-nightlife-white"),
    ]},
    {"id": "1204341B088", "model": "Glycerin 22", "color": "Black-Blue Heron-Orange", "sources": [
        ("shopify", "https://restart.brooksrunning.com/products/glycerin-22_120434_088_1b"),
        ("shopify", "https://therunhouse.com/products/120434440-088"),
    ]},
    {"id": "1204341B090", "model": "Glycerin 22", "color": "Black-Grey-White", "sources": [
        ("og", "https://www.brooksrunning.com/en_gb/glycerin-22/1204341B090.100.html"),
    ]},
    {"id": "1204341B137", "model": "Glycerin 22", "color": "White-Blue Heron-Apricot", "sources": [
        ("shopify", "https://www.holabirdsports.com/products/brooks-glycerin-22-womens-white-blue-heron-apricot"),
    ]},
    {"id": "1204341B897", "model": "Glycerin 22", "color": "Sherbert-Apricot-Pink", "sources": [
        ("shopify", "https://restart.brooksrunning.com/products/glycerin-22_120434_897_1b"),
    ]},
    # --- Glycerin GTS 22 ---
    {"id": "1104461D002", "model": "Glycerin GTS 22", "color": "Black-Cobalt-Neo Yellow", "sources": [
        ("og", "https://www.brooksrunning.com/en_us/mens/shoes/road-running-shoes/glycerin-gts-22/1104461D002.120.html"),
    ]},
    {"id": "1104461D063", "model": "Glycerin GTS 22", "color": "Black-Atomizer-Blazing Orange", "sources": [
        ("og", "https://www.northernrunner.com/shoes-c133/structured-cushioning-running-shoes-c134/glycerin-gts-22-mens-running-shoes-black-atomizer-blazing-orange-p9711"),
    ]},
    {"id": "1104461D135", "model": "Glycerin GTS 22", "color": "White-Grey-Black (divergencia - ver relatorio)", "sources": [
        ("shopify", "https://shoeshackonline.com/collections/mens-1/products/brooks-mens-glycerin-gts-22-running-shoe-white-grey-black-1104461d135"),
    ]},
    {"id": "1204351B088", "model": "Glycerin GTS 22", "color": "Black-Blue Heron-Orange", "sources": [
        ("shopify", "https://restart.brooksrunning.com/products/glycerin-gts-22_120435_088_1b"),
        ("og", "https://www.northernrunner.com/shoes-c133/structured-cushioning-running-shoes-c134/glycerin-gts-22-womens-running-shoes-black-blue-heron-orange-p9712"),
    ]},
    {"id": "1204351B137", "model": "Glycerin GTS 22", "color": "White-Blue Heron-Apricot", "sources": [
        ("shopify", "https://irunsg.com/products/brooks-women-glycerin-gts22-white-blueheron-apricot-1204351b137"),
    ]},
    # --- Ghost Max 3 ---
    {"id": "1104641D162", "model": "Ghost Max 3", "color": "Bright White-Tea-Black", "sources": [
        ("shopify", "https://www.holabirdsports.com/products/brooks-ghost-max-3-mens-bright-white-tea-black"),
    ]},
    {"id": "1204571B151", "model": "Ghost Max 3", "color": "Coconut-Blue Heron-Orange", "sources": [
        ("shopify", "https://www.holabirdsports.com/products/brooks-ghost-max-3-womens-coconut-blue-heron-orange"),
    ]},
    # --- Glycerin Max 2 ---
    {"id": "1104791D091", "model": "Glycerin Max 2", "color": "Phantom-White-Green Gecko", "sources": [
        ("og", "https://www.brooksrunning.com/en_us/glycerin-max-2/1104791D091.070.html"),
        ("shopify", "https://www.holabirdsports.com/products/brooks-glycerin-max-2-mens-phantom-white-green-gecko"),
    ]},
    {"id": "1104791D811", "model": "Glycerin Max 2", "color": "Orange-Beacon Blue-Nightlife", "sources": [
        ("shopify", "https://www.holabirdsports.com/products/brooks-glycerin-max-2-mens-orange-beacon-blue-nightlife"),
    ]},
    {"id": "1204681B048", "model": "Glycerin Max 2", "color": "Oyster-Argile-Cyber Pink", "sources": [
        ("og", "https://www.brooksrunning.com/en_us/womens/shoes/road-running-shoes/glycerin-max-2/1204681B048.080.html"),
        ("shopify", "https://www.holabirdsports.com/products/brooks-glycerin-max-2-womens-oyster-argyle-cyber-pink"),
    ]},
    {"id": "1204681B110", "model": "Glycerin Max 2", "color": "Coconut-Starfish-White (SKU nao confirmado)", "sources": [
        ("shopify", "https://www.sneakinpeace.com/products/brooks-womens-glycerin-max-2-coconut-starfish-white-running-shoes"),
    ]},
    # --- Hyperion 3 ---
    {"id": "1104651D179", "model": "Hyperion 3", "color": "Bluewash-Green-Black", "sources": [
        ("shopify", "https://www.todarosportstore.it/en/products/running-hyperion-3-uomo-1104651d179-0"),
        ("og", "https://www.cisalfasport.it/it-it/brooks/scarpe-running-hyperion-3-m-S5961718.html"),
        ("og", "https://www.leicesterrunningshop.co.uk/product/mens-brooks-hyperion-3-in-bluewash-green-black/"),
    ]},
    {"id": "1204531B102", "model": "Hyperion 3", "color": "Bluewash-Blazing Bell-Green (NAO CONFIRMADO)", "sources": []},
    # --- Hyperion Max 3 ---
    {"id": "1104671D164", "model": "Hyperion Max 3", "color": "White-Gray Mist-Green", "sources": [
        ("og", "https://www.brooksrunning.com/en_us/mens/shoes/road-running-shoes/hyperion-max-3/1104671D164.100.html"),
        ("shopify", "https://us.thesportsedit.com/products/brooks-hyperion-max-3-164-white-gray-mist-green-1104671d164"),
    ]},
    {"id": "1104671D182", "model": "Hyperion Max 3", "color": "Coconut-Green Gecko-Pink Clay", "sources": [
        ("og", "https://www.brooksrunning.com/en_us/mens/shoes/road-running-shoes/hyperion-max-3/1104671D182.100.html"),
        ("shopify", "https://www.holabirdsports.com/products/brooks-hyperion-max-3-mens-coconut-green-gecko-pink-clay"),
    ]},
    {"id": "1104671D670", "model": "Hyperion Max 3", "color": "Fiery Coral-Black-Atomizer", "sources": [
        ("og", "https://www.brooksrunning.com/en_us/mens/shoes/road-running-shoes/hyperion-max-3/1104671D670.150.html"),
    ]},
    {"id": "1204551B659", "model": "Hyperion Max 3", "color": "Coconut-Fiery Coral-Atomizer", "sources": [
        ("shopify", "https://irunsg.com/products/hyperion-max-3-coconut-fiery-coral-atomizer-1204551b659"),
        ("shopify", "https://www.holabirdsports.com/products/brooks-hyperion-max-3-womens-coconut-fiery-coral-atomizer"),
    ]},
    # --- PYNRS x Hyperion Max 3 ---
    {"id": "1105201D163", "model": "PYNRS x Hyperion Max 3", "color": "Blanc-Acid Lime-Blue", "sources": [
        ("og", "https://www.brooksrunning.com/en_us/mens/shoes/road-running-shoes/pynrs-x-hyperion-max-3/110520.html"),
        ("og", "https://www.endclothing.com/gb/brooks-hyperion-max-3-x-pynrs-sneaker-1105201d163.html"),
    ]},
    {"id": "1205091B163", "model": "PYNRS x Hyperion Max 3", "color": "Blanc-Acid Lime-Blue", "sources": [
        ("og", "https://www.brooksrunning.com/en_us/pynrs-x-hyperion-max-3/1205091B163.105.html"),
    ]},
    # --- Hyperion Elite 5 ---
    {"id": "1000491D681", "model": "Hyperion Elite 5", "color": "Pink Clay-Atomizer Blue", "sources": [
        ("og", "https://www.brooksrunning.com/en_us/featured/unisex-running-shoes/hyperion-elite-5/1000491D681.095.html"),
    ]},
    # --- Caldera 8 ---
    {"id": "1104401D314", "model": "Caldera 8", "color": "Dusty Olive-Lime-Oyster", "sources": [
        ("shopify", "https://www.holabirdsports.com/products/brooks-caldera-8-mens-dusty-olive-lime-oyster"),
    ]},
    {"id": "1104401D403", "model": "Caldera 8", "color": "Regatta-Ebony-Nightlife", "sources": [
        ("shopify", "https://www.run4it.com/products/brooks-mens-caldera-8-running-shoes-regatta-ebony-nightlife"),
        ("og", "https://www.northernrunner.com/shoes-c133/trail-running-shoes-c137/caldera-8-mens-trail-running-shoes-regatta-ebony-nightlife-p10008"),
    ]},
    {"id": "1204291B031", "model": "Caldera 8", "color": "Grey-Black-Lime", "sources": [
        ("shopify", "https://www.run4it.com/products/brooks-womens-caldera-8-running-shoes-grey-black-lime"),
        ("og", "https://sportano.com/p/763979/women-s-running-shoes-brooks-caldera-8-grey-black-lime"),
    ]},
    # --- Cascadia 19 ---
    {"id": "1104571D722", "model": "Cascadia 19", "color": "Sunny Lime-Black-Blue", "sources": [
        ("shopify", "https://www.holabirdsports.com/products/brooks-cascadia-19-mens-sunny-lime-black-blue"),
        ("og", "https://www.zappos.com/p/mens-brooks-cascadia-19-sunny-lime-black-blue/product/10002905/color/1107249"),
    ]},
    {"id": "1204461B711", "model": "Cascadia 19", "color": "Sunny Lime-Black-Magenta", "sources": [
        ("og", "https://www.brooksrunning.com/en_us/womens/shoes/trail-shoes/cascadia-19/120446.html?dwvar_120446_color=711"),
    ]},
]
# fmt: on


def get(url, **kw):
    return requests.get(url, headers=HEADERS, timeout=30, **kw)


def from_shopify(page_url):
    url = page_url.rstrip("/")
    candidates = [url + ".json"]
    m = re.match(r"(https://[^/]+)(?:/[a-z]{2}(?:-[a-z]{2})?)?(/products/[^/?#]+)", url)
    if m:
        candidates.append(m.group(1) + m.group(2) + ".json")
    for ju in dict.fromkeys(candidates):
        try:
            r = get(ju)
            if r.status_code != 200:
                continue
            imgs = r.json().get("product", {}).get("images") or []
            if imgs:
                src = imgs[0]["src"].split("?")[0]
                return src, ju
        except Exception:
            continue
    return None, None


def from_og(page_url):
    try:
        r = get(page_url)
        if r.status_code != 200:
            return None, None
        m = re.search(r'property=["\']og:image["\']\s+content=["\']([^"\']+)', r.text) or re.search(
            r'content=["\']([^"\']+)["\']\s+property=["\']og:image["\']', r.text
        )
        if not m:
            return None, None
        img = m.group(1)
        if "brooksrunning.com" in img and "demandware" in img:
            img = re.sub(r"[?&]sw=\d+", "", img)
            img += ("&" if "?" in img else "?") + "sw=2000&q=90"
        return img, page_url
    except Exception:
        return None, None


def download(img_url, dest_stem):
    r = get(img_url)
    r.raise_for_status()
    data = r.content
    im = Image.open(io.BytesIO(data))
    ext = (im.format or "JPEG").lower().replace("jpeg", "jpg")
    path = dest_stem.with_suffix("." + ext)
    path.write_bytes(data)
    return path, im.size


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    rows, ok = [], 0
    for item in CATALOG:
        sid, color = item["id"], item["color"]
        print(f"== {sid} {item['model']} ({color})", flush=True)
        result = None
        for kind, src_url in item["sources"]:
            img, origin = (from_shopify if kind == "shopify" else from_og)(src_url)
            if not img:
                print(f"   falhou ({kind}): {src_url}")
                continue
            try:
                slug = re.sub(r"[^A-Za-z0-9]+", "-", color).strip("-")[:40]
                path, (w, h) = download(img, OUT / f"{sid}__{slug}")
                note = "" if w >= 1500 else f"abaixo de 1500px ({w}px)"
                result = (str(path.name), f"{w}x{h}", origin, note)
                print(f"   OK: {path.name} {w}x{h} <- {img}")
                break
            except Exception as e:
                print(f"   download falhou: {e}")
        if result:
            ok += 1
            rows.append((sid, item["model"], color, "OK", *result))
        else:
            reason = "sem fonte confirmada" if not item["sources"] else "todas as fontes falharam"
            rows.append((sid, item["model"], color, "FALHOU", "-", "-", "-", reason))
        time.sleep(1)

    lines = [
        "# Brooks — Relatório de download de imagens",
        "",
        f"**{ok} / {len(CATALOG)} SKUs baixados**",
        "",
        "| Style ID | Modelo | Cor | Status | Arquivo | Dimensões | Fonte | Obs |",
        "|---|---|---|---|---|---|---|---|",
    ]
    for r in rows:
        lines.append("| " + " | ".join(str(c) for c in r) + " |")
    (OUT / "REPORT.md").write_text("\n".join(lines) + "\n")
    print(f"\n{ok}/{len(CATALOG)} baixados; relatório em {OUT}/REPORT.md")


if __name__ == "__main__":
    sys.exit(main())
