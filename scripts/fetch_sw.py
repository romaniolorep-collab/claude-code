"""Baixa o service worker publicado do footwearpro para análise de cache."""

import os
import sys

import requests

HERE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(HERE, "scan_output")


def main():
    r = requests.get("https://footwearpro.ibrandintelligence.org/sw.js", timeout=30)
    print("status:", r.status_code, "| content-type:", r.headers.get("Content-Type"), "| bytes:", len(r.content))
    if r.status_code == 200:
        with open(os.path.join(OUT, "sw.js"), "wb") as f:
            f.write(r.content)
        print(r.text[:3000])
    return 0


if __name__ == "__main__":
    sys.exit(main())
