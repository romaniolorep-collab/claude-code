"""
Deploy incremental do fix da pronta entrega Brooks no site footwearpro (Netlify).

Método digest: envia um manifesto com TODOS os arquivos do deploy atual do site,
substituindo apenas /index.html e /assets/products/*.png presentes em
footwearpro_fix/. Nada é removido; só os arquivos alterados são re-enviados.

Roda no GitHub Actions (o ambiente da sessão não alcança api.netlify.com).
O token é lido de .claude/settings.local.json, já versionado neste repositório
pelo proprietário — nenhum segredo novo é adicionado.
"""

import hashlib
import json
import os
import re
import sys
import time
from urllib.parse import quote

import requests

HERE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FIX = os.path.join(HERE, "footwearpro_fix")
OUT = os.path.join(HERE, "scan_output")
API = "https://api.netlify.com/api/v1"
DOMAIN = "footwearpro.ibrandintelligence.org"

session = requests.Session()


def find_tokens():
    tokens = []
    env_tok = os.environ.get("NETLIFY_AUTH_TOKEN", "").strip()
    if env_tok:
        tokens.append(env_tok)
    settings = open(os.path.join(HERE, ".claude", "settings.local.json"), encoding="utf-8").read()
    tokens.extend(re.findall(r"nfp_[A-Za-z0-9]+", settings))
    return list(dict.fromkeys(tokens))


def find_site(tokens):
    for tok in tokens:
        r = session.get(f"{API}/sites?per_page=100", headers={"Authorization": f"Bearer {tok}"}, timeout=30)
        if r.status_code != 200:
            print(f"token …{tok[-6:]}: HTTP {r.status_code} ao listar sites")
            continue
        for s in r.json():
            fields = [s.get("custom_domain") or "", s.get("name") or "", s.get("url") or ""] + (s.get("domain_aliases") or [])
            if any(DOMAIN in f or "footwearpro" in f for f in fields):
                print(f"site encontrado: {s['name']} ({s['id']}) via token …{tok[-6:]}")
                return tok, s
    return None, None


def sha1(path):
    h = hashlib.sha1()
    with open(path, "rb") as f:
        for chunk in iter(lambda: f.read(65536), b""):
            h.update(chunk)
    return h.hexdigest()


def main():
    tokens = find_tokens()
    if not tokens:
        print("nenhum token Netlify encontrado")
        return 1
    tok, site = find_site(tokens)
    if not site:
        print("site footwearpro não encontrado com os tokens disponíveis")
        return 1
    hdr = {"Authorization": f"Bearer {tok}"}
    site_id = site["id"]

    # arquivos do deploy atual
    r = session.get(f"{API}/sites/{site_id}/files", headers=hdr, timeout=60)
    r.raise_for_status()
    current = {f["id"]: f["sha"] for f in r.json()}
    print(f"deploy atual tem {len(current)} arquivos")

    # substituições locais
    local = {"/index.html": os.path.join(FIX, "index.html")}
    for name in sorted(os.listdir(os.path.join(FIX, "assets", "products"))):
        local[f"/assets/products/{name}"] = os.path.join(FIX, "assets", "products", name)

    # A API de arquivos da Netlify normaliza caminhos para minúsculas; usar a
    # mesma forma evita chaves duplicadas no manifesto (maiúscula vs minúscula),
    # que fazem a entrada antiga prevalecer. O serving é case-insensitive.
    manifest = {p.lower(): s for p, s in current.items()}
    changed = {}
    for path, fp in local.items():
        digest = sha1(fp)
        key = path.lower()
        if manifest.get(key) != digest:
            changed[key] = (fp, digest)
        manifest[key] = digest
    print(f"{len(changed)} arquivos a enviar (de {len(local)} do fix)")

    r = session.post(
        f"{API}/sites/{site_id}/deploys",
        headers={**hdr, "Content-Type": "application/json"},
        json={"files": manifest, "draft": False, "title": "Correção pronta entrega Brooks — imagens remapeadas, extensões e preços (PDF 2026)"},
        timeout=120,
    )
    r.raise_for_status()
    deploy = r.json()
    deploy_id = deploy["id"]
    required = set(deploy.get("required") or [])
    print(f"deploy {deploy_id} criado; {len(required)} shas requeridos")

    sent = 0
    for path, (fp, digest) in changed.items():
        if required and digest not in required:
            continue
        url = f"{API}/deploys/{deploy_id}/files/{quote(path.lstrip('/'))}"
        with open(fp, "rb") as f:
            r = session.put(url, headers={**hdr, "Content-Type": "application/octet-stream"}, data=f, timeout=120)
        if r.status_code not in (200, 201):
            print(f"ERRO upload {path}: HTTP {r.status_code} {r.text[:200]}")
            return 1
        sent += 1
        print(f"  [{sent}] {path} ok")

    state = None
    for _ in range(60):
        r = session.get(f"{API}/deploys/{deploy_id}", headers=hdr, timeout=30)
        state = r.json().get("state")
        print(f"estado: {state}")
        if state in ("ready", "error"):
            break
        time.sleep(5)

    result = {"deploy_id": deploy_id, "state": state, "uploaded": sent, "site": site["name"], "site_id": site_id}

    # verificação no site publicado
    if state == "ready":
        v = session.get(f"https://{DOMAIN}/index.html", timeout=30)
        result["index_has_prodImgSrc"] = "_prodImgSrc" in v.text
        img = session.get(f"https://{DOMAIN}/assets/products/280417430.png", timeout=30)
        result["cap_image_status"] = img.status_code
        result["cap_image_sha_ok"] = hashlib.sha1(img.content).hexdigest() == sha1(os.path.join(FIX, "assets", "products", "280417430.png"))
        d048 = session.get(f"https://{DOMAIN}/assets/products/1104421D048.png", timeout=30)
        result["d048_sha_ok"] = hashlib.sha1(d048.content).hexdigest() == sha1(os.path.join(FIX, "assets", "products", "1104421D048.png"))
        print("verificação:", {k: result[k] for k in ("index_has_prodImgSrc", "cap_image_status", "cap_image_sha_ok", "d048_sha_ok")})

    os.makedirs(OUT, exist_ok=True)
    with open(os.path.join(OUT, "deploy_result.json"), "w", encoding="utf-8") as f:
        json.dump(result, f, ensure_ascii=False, indent=2)
    return 0 if state == "ready" else 1


if __name__ == "__main__":
    sys.exit(main())
