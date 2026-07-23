#!/usr/bin/env python3
"""
Extrator do catalogo embutido no Footwear Pro (footwearpro_fix/index.html).

Etapa 1 da integracao (RISCO ZERO): le o index.html publicado e extrai o
catalogo que hoje esta "chumbado" no HTML para uma fonte de verdade limpa
(JSON). Nao toca o site no ar — so leitura.

Uso:
    python3 extract_catalog.py <caminho/para/index.html> [saida.json]

Formato dos dados embutidos descoberto no HTML:
    produto = {"r":ref, "n":nome, "p":preco, "cat":categoria, "g":[grades], "c":cor}
    grade   = {"l":label, "s":[tamanhos], "q":{tamanho: quantidade}}
"""
import re
import json
import sys


def match_obj(s: str, start: int):
    """Casa o objeto {...} balanceado a partir de s[start]=='{'."""
    depth = 0
    i = start
    instr = False
    esc = False
    while i < len(s):
        ch = s[i]
        if esc:
            esc = False
        elif ch == '\\':
            esc = True
        elif ch == '"':
            instr = not instr
        elif not instr:
            if ch == '{':
                depth += 1
            elif ch == '}':
                depth -= 1
                if depth == 0:
                    return s[start:i + 1], i + 1
        i += 1
    return None, start


def infer_brand(p: dict) -> str:
    gs = p.get('g') or []
    if any(str(g).startswith('bpe_') for g in gs):
        return 'Brooks'
    n = (p.get('n') or '').upper()
    if any(k in n for k in ['BÚZIOS', 'CAMARGUE', 'CLARA', 'BOLSA', 'KIPLING']):
        return 'Kipling'
    return 'Reebok'


def extract(html: str) -> dict:
    # produtos
    prods = {}
    for m in re.finditer(r'\{"r":"', html):
        obj, _ = match_obj(html, m.start())
        if not obj:
            continue
        try:
            d = json.loads(obj)
        except json.JSONDecodeError:
            continue
        if 'r' in d and 'n' in d:
            prods[d['r']] = d

    # grades (curvas de tamanho com quantidade)
    grades = {}
    for m in re.finditer(r'"(bpe_[A-Za-z0-9]+)":\{', html):
        brace = html.index('{', m.end() - 1)
        obj, _ = match_obj(html, brace)
        try:
            grades[m.group(1)] = json.loads(obj)
        except json.JSONDecodeError:
            continue

    products = []
    for ref, p in prods.items():
        sizes = {}
        for gc in (p.get('g') or []):
            g = grades.get(gc)
            if g and isinstance(g.get('q'), dict):
                for size, q in g['q'].items():
                    sizes[size] = sizes.get(size, 0) + q
        products.append({
            'ref': ref,
            'name': p.get('n'),
            'price': p.get('p'),
            'category': p.get('cat'),
            'colorway': p.get('c'),
            'brand': infer_brand(p),
            'grade_codes': p.get('g') or [],
            'sizes': sizes,
        })

    products.sort(key=lambda x: (x['brand'], x['name'] or '', x['ref']))
    return {'products': products, 'grades': grades}


def main():
    if len(sys.argv) < 2:
        print(__doc__)
        sys.exit(1)
    html = open(sys.argv[1], encoding='utf-8', errors='replace').read()
    out = sys.argv[2] if len(sys.argv) > 2 else 'catalogo_canonico.json'
    catalog = extract(html)
    json.dump(catalog, open(out, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)

    by_brand = {}
    pairs = 0
    for p in catalog['products']:
        by_brand[p['brand']] = by_brand.get(p['brand'], 0) + 1
        pairs += sum(p['sizes'].values())
    print(f"Produtos : {len(catalog['products'])}")
    print(f"Grades   : {len(catalog['grades'])}")
    print("Marcas   : " + ", ".join(f"{k}={v}" for k, v in sorted(by_brand.items())))
    print(f"Pares em pronta entrega (grade Brooks): {pairs}")
    print(f"Saida    : {out}")


if __name__ == '__main__':
    main()
