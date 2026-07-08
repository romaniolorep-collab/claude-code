"""
Verificação pós-deploy do site footwearpro: confere HTML publicado e amostra
de imagens contra footwearpro_fix/ (SHA1). Grava scan_output/verify_result.json.
Roda no GitHub Actions.
"""

import hashlib
import json
import os
import sys

import requests

HERE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FIX = os.path.join(HERE, "footwearpro_fix")
OUT = os.path.join(HERE, "scan_output")
BASE = "https://footwearpro.ibrandintelligence.org"

AMOSTRA = [
    "1104421D048", "1104421D090", "1204311B443", "1104541D033",
    "1204431B184", "1104791D091", "1204461B711", "280417430",
    "280495006", "1104671D182",
]

session = requests.Session()
session.headers.update({"Cache-Control": "no-cache", "Pragma": "no-cache"})


def sha1(data: bytes) -> str:
    return hashlib.sha1(data).hexdigest()


def main():
    result = {"imagens": {}}
    r = session.get(f"{BASE}/index.html", timeout=30)
    html = r.text
    result["index_status"] = r.status_code
    result["index_has_prodImgSrc"] = "_prodImgSrc" in html
    result["index_ghost_849"] = '"r":"1104421D048","n":"GHOST 17","p":849.9' in html
    result["index_sem_jpg_hardcoded"] = "assets/products/${p.r}.jpg" not in html
    result["index_planilha_2206"] = "planilha 22.06.2026" in html
    result["index_sem_d414"] = "1104421D414" not in html
    result["index_d182_fem"] = "bpe_4671D182F" in html
    result["index_gate_importacao"] = "1782097200000" in html
    result["index_sid_unico"] = "+ '_' + _pi" in html and "+ '_' + _mi" in html
    result["index_import_dedup"] = "while (newGrades[gkey]) gkey += 'F'" in html
    result["index_import_acc_grades"] = "const accGkey = 'bacc_' + sidStr" in html
    result["index_ui_grades"] = "preencha a grade na tela do pedido" in html and "width:52px;height:42px" in html
    result["index_ui_imagens"] = html.count("width:112px;height:112px") >= 15 and "width:104px;height:104px" in html
    result["index_ui_dark_cliente"] = 'html[data-theme="dark"] .bg-\\[\\#f0fdf4\\]' in html
    result["index_ui_dark_busca"] = 'html[data-theme="dark"] .gs-item .gt{color:#e7ecf5}' in html
    result["index_ui_dark_grades"] = 'html[data-theme="dark"] [style*="color:#374151"]' in html
    sw = session.get(f"{BASE}/sw.js", timeout=30)
    result["sw_v3"] = sw.status_code == 200 and "fp-v3-2026-07-08" in sw.text

    ok = True
    for ref in AMOSTRA:
        local = os.path.join(FIX, "assets", "products", f"{ref}.png")
        expected = sha1(open(local, "rb").read())
        r = session.get(f"{BASE}/assets/products/{ref}.png?v=verify", timeout=30)
        got = sha1(r.content) if r.status_code == 200 else None
        match = got == expected
        ok = ok and match
        result["imagens"][ref] = {"status": r.status_code, "sha_ok": match}
        print(f"{'OK ' if match else 'DIF'} {ref} [{r.status_code}]")

    result["tudo_ok"] = (ok and result["index_has_prodImgSrc"] and result["index_ghost_849"]
                         and result["index_planilha_2206"] and result["index_sem_d414"]
                         and result["index_d182_fem"] and result["index_gate_importacao"]
                         and result["index_sid_unico"] and result["index_import_dedup"]
                         and result["index_import_acc_grades"] and result["index_ui_grades"]
                         and result["index_ui_imagens"] and result["index_ui_dark_cliente"]
                         and result["index_ui_dark_busca"] and result["index_ui_dark_grades"]
                         and result["sw_v3"])
    print(json.dumps(result, indent=2, ensure_ascii=False))
    with open(os.path.join(OUT, "verify_result.json"), "w", encoding="utf-8") as f:
        json.dump(result, f, ensure_ascii=False, indent=2)
    return 0 if result["tudo_ok"] else 1


if __name__ == "__main__":
    sys.exit(main())
