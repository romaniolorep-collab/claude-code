"""
Verifica quais imagens de produto existem no site footwearpro.

Para cada referência (do catálogo embutido do site e do PDF Brooks Pronta
Entrega), testa assets/products/<ref>.jpg e .png e grava o resultado em
scan_output/product_images_report.json. Também baixa as imagens existentes
para scan_output/products/ para inspeção visual.

Roda no GitHub Actions (domínio bloqueado no ambiente da sessão).
"""

import json
import os
import sys

import requests

BASE = "https://footwearpro.ibrandintelligence.org/assets/products/"
OUT = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "scan_output")
IMG_OUT = os.path.join(OUT, "products")
os.makedirs(IMG_OUT, exist_ok=True)

# Referências do catálogo embutido no site (74) — extraídas de _CATALOG_BROOKS_PE_BUILTIN
SITE_REFS = [
    "1000491D681", "1104401D314", "1104401D403", "1104421D048", "1104421D090",
    "1104421D112", "1104421D414", "1104451D063", "1104451D078", "1104451D135",
    "1104451D175", "1104451D415", "1104451D821", "1104461D002", "1104461D063",
    "1104461D135", "1104471D303", "1104541D033", "1104541D055", "1104541D184",
    "1104571D722", "1104641D162", "1104651D179", "1104671D164", "1104671D182",
    "1104671D670", "1104791D091", "1104791D811", "1105201D163", "1204291B031",
    "1204311B070", "1204311B080", "1204311B090", "1204311B412", "1204311B443",
    "1204341B088", "1204341B090", "1204341B137", "1204341B897", "1204351B088",
    "1204351B137", "1204361B115", "1204361B118", "1204361B447", "1204431B053",
    "1204431B064", "1204431B184", "1204461B711", "1204531B102", "1204551B659",
    "1204571B151", "1204681B048", "1204681B110", "1205091B163",
    "280417033", "280417430", "280493001", "280493100", "280493938",
    "280495006", "280495189", "280495462", "280529100", "280529604",
    "280529754", "280530066", "280530412", "280530615", "280531001",
    "280531100", "280538006", "280538189", "280542006", "280542189",
]

# Referências do PDF BROOKS PRONTA ENTREGA 2026 (fonte de verdade)
PDF_REFS = [
    "1000491D681", "1104401D314", "1104401D403", "1104421D048", "1104421D090",
    "1104421D112", "1104451D063", "1104451D078", "1104451D135", "1104451D175",
    "1104451D415", "1104451D821", "1104461D002", "1104461D063", "1104461D135",
    "1104541D033", "1104541D055", "1104541D184", "1104571D722", "1104641D162",
    "1104651D179", "1104671D164", "1104671D182", "1104671D670", "1104791D091",
    "1104791D811", "1105201D163", "1204291B031", "1204311B070", "1204311B080",
    "1204311B090", "1204311B412", "1204311B443", "1204341B088", "1204341B090",
    "1204341B137", "1204341B897", "1204351B088", "1204351B137", "1204431B053",
    "1204431B064", "1204431B184", "1204461B711", "1204531B102", "1204551B659",
    "1204571B151", "1204681B048", "1204681B110", "1205091B163",
]

UA = {"User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36"}
session = requests.Session()
session.headers.update(UA)


def check(ref: str):
    result = {}
    for ext in ("jpg", "png", "webp"):
        url = f"{BASE}{ref}.{ext}"
        try:
            r = session.get(url, timeout=30)
            ct = r.headers.get("Content-Type", "")
            ok = r.status_code == 200 and ct.startswith("image/")
            result[ext] = {"status": r.status_code, "content_type": ct, "bytes": len(r.content), "ok": ok}
            if ok:
                with open(os.path.join(IMG_OUT, f"{ref}.{ext}"), "wb") as f:
                    f.write(r.content)
        except Exception as e:
            result[ext] = {"status": 0, "content_type": f"erro: {e}", "bytes": 0, "ok": False}
    return result


def main():
    all_refs = sorted(set(SITE_REFS) | set(PDF_REFS))
    report = {}
    for ref in all_refs:
        res = check(ref)
        exists = any(v["ok"] for v in res.values())
        report[ref] = {
            "in_site_catalog": ref in SITE_REFS,
            "in_pdf": ref in PDF_REFS,
            "image_exists": exists,
            "checks": res,
        }
        print(f"{'OK ' if exists else '404'} {ref} (site={ref in SITE_REFS}, pdf={ref in PDF_REFS})")

    with open(os.path.join(OUT, "product_images_report.json"), "w", encoding="utf-8") as f:
        json.dump(report, f, ensure_ascii=False, indent=2, sort_keys=True)

    missing_site = [r for r, v in report.items() if v["in_site_catalog"] and not v["image_exists"]]
    print(f"\n{len(missing_site)} refs do site SEM imagem:")
    for r in missing_site:
        print(f"  {r}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
