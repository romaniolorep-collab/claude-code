"""
Verifica extensões de imagem (.jpg/.png) para as referências dos catálogos
Reebok PE e Kipling PE embutidos no site footwearpro.

O código do site pede assets/products/<ref>.jpg em vários pontos; este script
mede quantas dessas imagens existem como .jpg vs só .png vs nenhuma.
Grava scan_output/other_brands_images_report.json.
"""

import json
import os
import re
import sys

import requests

HERE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(HERE, "scan_output")
BASE = "https://footwearpro.ibrandintelligence.org/assets/products/"

UA = {"User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36"}
session = requests.Session()
session.headers.update(UA)

html = open(os.path.join(OUT, "index.html"), encoding="utf-8").read()


def extract(name):
    i = html.index(name)
    i = html.index("=", i) + 1
    while html[i] not in "[{":
        i += 1
    depth = 0
    start = i
    in_str = False
    esc = False
    for j in range(i, len(html)):
        ch = html[j]
        if in_str:
            if esc:
                esc = False
            elif ch == "\\":
                esc = True
            elif ch == '"':
                in_str = False
            continue
        if ch == '"':
            in_str = True
        elif ch in "[{":
            depth += 1
        elif ch in "]}":
            depth -= 1
            if depth == 0:
                return html[start : j + 1]
    raise ValueError(name)


def head_ok(url):
    try:
        r = session.head(url, timeout=20, allow_redirects=True)
        if r.status_code in (403, 405):
            r = session.get(url, timeout=20, stream=True)
        ct = r.headers.get("Content-Type", "")
        return r.status_code == 200 and ct.startswith("image/")
    except Exception:
        return False


def main():
    catalogs = {
        "reebok": json.loads(extract("_CATALOG_PE_BUILTIN")),
        "kipling": json.loads(extract("_CATALOG_KIPLING_PE_BUILTIN")),
    }
    report = {}
    for brand, cat in catalogs.items():
        refs = sorted({p["r"] for p in cat if p.get("r")})
        stats = {"total": len(refs), "jpg": 0, "png_only": 0, "none": 0, "refs_none": [], "refs_png_only": []}
        for i, ref in enumerate(refs):
            jpg = head_ok(f"{BASE}{ref}.jpg")
            if jpg:
                stats["jpg"] += 1
            else:
                png = head_ok(f"{BASE}{ref}.png")
                if png:
                    stats["png_only"] += 1
                    stats["refs_png_only"].append(ref)
                else:
                    stats["none"] += 1
                    stats["refs_none"].append(ref)
            if (i + 1) % 50 == 0:
                print(f"{brand}: {i+1}/{len(refs)}")
        report[brand] = stats
        print(f"{brand}: {stats['total']} refs — jpg={stats['jpg']} png_only={stats['png_only']} nenhuma={stats['none']}")

    with open(os.path.join(OUT, "other_brands_images_report.json"), "w", encoding="utf-8") as f:
        json.dump(report, f, ensure_ascii=False, indent=2)
    return 0


if __name__ == "__main__":
    sys.exit(main())
