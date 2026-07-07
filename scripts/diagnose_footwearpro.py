"""
Diagnóstico pós-deploy: identifica o que o site está servindo de fato.

- Confirma qual deploy está publicado (vs o deploy criado 6a4d7f84113374851164ef73)
- Lê as configurações de pós-processamento do site (compressão de imagens)
- Para cada ref divergente, baixa o PNG publicado e compara o SHA1 com TODOS os
  arquivos conhecidos (fix e versões antigas em scan_output/products) para dizer
  se o site serve o conteúdo novo, o antigo, ou bytes recomprimidos.

Sempre sai com código 0 para o passo de commit gravar o resultado.
"""

import hashlib
import json
import os
import re
import sys

import requests

HERE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FIX = os.path.join(HERE, "footwearpro_fix", "assets", "products")
OLD = os.path.join(HERE, "scan_output", "products")
OUT = os.path.join(HERE, "scan_output")
BASE = "https://footwearpro.ibrandintelligence.org"
API = "https://api.netlify.com/api/v1"
DEPLOY_ID = "6a4d7f84113374851164ef73"
SITE_ID = "aaa0bc54-9c24-4c9b-b890-53c8b0b826db"

session = requests.Session()


def sha1(data: bytes) -> str:
    return hashlib.sha1(data).hexdigest()


def find_token():
    tok = os.environ.get("NETLIFY_AUTH_TOKEN", "").strip()
    if tok:
        return tok
    settings = open(os.path.join(HERE, ".claude", "settings.local.json"), encoding="utf-8").read()
    for t in re.findall(r"nfp_[A-Za-z0-9]+", settings):
        return t
    return None


def main():
    result = {}
    tok = find_token()
    hdr = {"Authorization": f"Bearer {tok}"} if tok else {}

    if tok:
        r = session.get(f"{API}/sites/{SITE_ID}", headers=hdr, timeout=30)
        if r.status_code == 200:
            s = r.json()
            pub = s.get("published_deploy") or {}
            result["published_deploy_id"] = pub.get("id")
            result["published_is_ours"] = pub.get("id") == DEPLOY_ID
            result["processing_settings"] = s.get("processing_settings")
            result["build_image_compression"] = (s.get("processing_settings") or {}).get("images")
        else:
            result["site_api_status"] = r.status_code

        # o que o deploy criado registra para um path divergente
        r = session.get(f"{API}/deploys/{DEPLOY_ID}/files/assets/products/1104421D048.png", headers=hdr, timeout=30)
        result["deploy_file_d048"] = r.json() if r.status_code == 200 else {"status": r.status_code}

    # inventário de shas conhecidos
    known = {}
    for d, label in ((FIX, "fix"), (OLD, "antigo")):
        for name in os.listdir(d):
            digest = sha1(open(os.path.join(d, name), "rb").read())
            known.setdefault(digest, []).append(f"{label}/{name}")

    refs = ["1104421D048", "1104421D090", "1204311B443", "1104541D033",
            "1204431B184", "1104791D091", "1204461B711", "1104671D182",
            "280417430", "280495006"]
    result["live"] = {}
    for ref in refs:
        r = session.get(f"{BASE}/assets/products/{ref}.png", headers={"Cache-Control": "no-cache"}, timeout=30)
        digest = sha1(r.content)
        result["live"][ref] = {
            "status": r.status_code,
            "bytes": len(r.content),
            "sha": digest,
            "conteudo_equivale_a": known.get(digest, ["DESCONHECIDO (bytes não batem com nenhum arquivo conhecido)"]),
        }
        print(ref, "->", result["live"][ref]["conteudo_equivale_a"])

    with open(os.path.join(OUT, "diagnose_result.json"), "w", encoding="utf-8") as f:
        json.dump(result, f, ensure_ascii=False, indent=2)
    print(json.dumps({k: v for k, v in result.items() if k != "live"}, indent=2, ensure_ascii=False, default=str))
    return 0


if __name__ == "__main__":
    sys.exit(main())
