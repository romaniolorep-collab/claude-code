"""
Varredura do site footwearpro.ibrandintelligence.org.

Baixa a home e páginas internas do mesmo domínio, salva o HTML bruto,
extrai todas as URLs de imagem/asset e verifica o status HTTP de cada uma.
Resultados gravados em scan_output/ (HTML + image_report.json).

Roda dentro do GitHub Actions porque o domínio é inacessível no ambiente
da sessão Claude Code (política de rede).
"""

import json
import os
import re
import sys
from urllib.parse import urljoin, urlparse

import requests

BASE = "https://footwearpro.ibrandintelligence.org/"
OUT = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "scan_output")
os.makedirs(OUT, exist_ok=True)

UA = {"User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36"}

session = requests.Session()
session.headers.update(UA)


def safe_name(url: str) -> str:
    path = urlparse(url).path.strip("/") or "index"
    name = re.sub(r"[^A-Za-z0-9._-]", "_", path)
    return name[:150]


def fetch(url: str):
    try:
        r = session.get(url, timeout=30)
        return r
    except Exception as e:
        print(f"ERRO ao buscar {url}: {e}")
        return None


def check_url(url: str):
    """HEAD com fallback para GET; retorna (status, content_type, bytes)."""
    try:
        r = session.head(url, timeout=20, allow_redirects=True)
        if r.status_code in (403, 405) or "Content-Type" not in r.headers:
            r = session.get(url, timeout=30, stream=True)
            data = next(r.iter_content(8192), b"")
            return r.status_code, r.headers.get("Content-Type", ""), len(data)
        return r.status_code, r.headers.get("Content-Type", ""), int(r.headers.get("Content-Length") or 0)
    except Exception as e:
        return 0, f"erro: {e}", 0


def extract_urls(html: str, base_url: str):
    """Extrai URLs de src/href/srcset/url()/strings JS."""
    urls = set()
    for m in re.finditer(r"""(?:src|href|data-src|poster)\s*=\s*["']([^"'<>\s]+)["']""", html, re.I):
        urls.add(urljoin(base_url, m.group(1)))
    for m in re.finditer(r"""srcset\s*=\s*["']([^"']+)["']""", html, re.I):
        for part in m.group(1).split(","):
            u = part.strip().split(" ")[0]
            if u:
                urls.add(urljoin(base_url, u))
    for m in re.finditer(r"""url\(\s*['"]?([^'")\s]+)['"]?\s*\)""", html, re.I):
        urls.add(urljoin(base_url, m.group(1)))
    # strings http(s) soltas em JS/JSON inline
    for m in re.finditer(r"""["'](https?://[^"'\\\s<>]+)["']""", html):
        urls.add(m.group(1))
    return urls


IMG_EXT = re.compile(r"\.(png|jpe?g|webp|gif|svg|avif)(\?|$)", re.I)
PAGE_EXT = re.compile(r"(/[^.?#]*|\.html?)(\?|#|$)", re.I)


def main():
    report = {"base": BASE, "pages": {}, "images": {}, "other_assets": {}}
    to_visit = [BASE]
    visited = set()
    all_urls = set()

    while to_visit and len(visited) < 30:
        url = to_visit.pop(0)
        if url in visited:
            continue
        visited.add(url)
        r = fetch(url)
        if r is None:
            report["pages"][url] = {"status": 0}
            continue
        ct = r.headers.get("Content-Type", "")
        report["pages"][url] = {"status": r.status_code, "content_type": ct, "bytes": len(r.content)}
        if "html" not in ct and "javascript" not in ct and "json" not in ct and "css" not in ct:
            continue
        fname = safe_name(url)
        if not os.path.splitext(fname)[1]:
            fname += ".html"
        with open(os.path.join(OUT, fname), "wb") as f:
            f.write(r.content)
        found = extract_urls(r.text, url)
        all_urls |= found
        host = urlparse(BASE).netloc
        for u in found:
            p = urlparse(u)
            if p.netloc == host and u not in visited and not IMG_EXT.search(u):
                path = p.path.lower()
                if path.endswith((".js", ".css", ".json", ".html", "/")) or "." not in os.path.basename(path):
                    if len(visited) + len(to_visit) < 30:
                        to_visit.append(u)

    imgs = sorted(u for u in all_urls if IMG_EXT.search(u))
    print(f"{len(imgs)} imagens encontradas; verificando…")
    for u in imgs:
        status, ct, size = check_url(u)
        report["images"][u] = {"status": status, "content_type": ct, "bytes": size}
        print(f"  [{status}] {u}")

    others = sorted(u for u in all_urls - set(imgs) if urlparse(u).scheme in ("http", "https"))
    for u in others:
        if urlparse(u).netloc == urlparse(BASE).netloc and u not in report["pages"]:
            status, ct, size = check_url(u)
            report["other_assets"][u] = {"status": status, "content_type": ct, "bytes": size}

    with open(os.path.join(OUT, "image_report.json"), "w", encoding="utf-8") as f:
        json.dump(report, f, ensure_ascii=False, indent=2, sort_keys=True)

    broken = [u for u, v in report["images"].items() if v["status"] != 200]
    print(f"\nResumo: {len(report['pages'])} páginas, {len(imgs)} imagens, {len(broken)} quebradas")
    for u in broken:
        print(f"  QUEBRADA [{report['images'][u]['status']}] {u}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
