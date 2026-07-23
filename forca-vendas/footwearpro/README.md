# Integração Footwear Pro → fonte de verdade

Etapa 1 da integração do **Footwear Pro** (`footwearpro.ibrandintelligence.org`)
com o backend de força de vendas. **Risco zero: nada aqui toca o site no ar.**

## O problema que isto resolve

O Footwear Pro hoje é um único `index.html` (~685 KB) com o **catálogo, preços
e imagens embutidos no código**. Essa arquitetura é a causa raiz dos erros
apontados no relatório de auditoria (`scan_output/`): `.jpg` × `.png` em 6
pontos, 12 SKUs com preço divergente, catálogo do site fora de sincronia com
o PDF. São **bugs de dado sem fonte de verdade** — não de tela.

## O que esta etapa faz

`extract_catalog.py` lê o `index.html` publicado e extrai o catálogo embutido
para um **JSON canônico** (`catalogo_canonico.json`) — o primeiro passo para o
dado passar a viver num único lugar (banco), em vez de espalhado no HTML.

```bash
# a partir do index.html da branch de auditoria
git show origin/claude/footwear-pro-errors-scan-00dlbd:footwearpro_fix/index.html > /tmp/fp.html
python3 extract_catalog.py /tmp/fp.html catalogo_canonico.json
```

## O que foi extraído (snapshot)

- **550 produtos** · **50 curvas de grade** (pronta entrega Brooks)
- Marcas: **Reebok 483 · Brooks 49 · Kipling 18**
- **3.280 pares** Brooks em pronta entrega, com **estoque por numeração**

Formato de cada produto:

```json
{
  "ref": "1104541D033", "name": "ADRENALINE GTS 25", "price": 1299.9,
  "category": "calcado-masc", "colorway": "OYSTER/GREEN GECKO/BLUE",
  "brand": "Brooks", "grade_codes": ["bpe_4541D033"],
  "sizes": { "39": 7, "40": 17, "41": 16, "42": 16, "43": 5, "45": 1 }
}
```

## Próximas etapas (só avançam com sua aprovação)

2. **Carregar** o JSON canônico no banco do backend (produtos + grade + preço).
3. **Servir** o catálogo via API (`/products`, `/sync/pull`).
4. **Preview** em URL separada consumindo a API — você testa sem tocar produção.
5. **Cutover** mantendo o dado embutido como *fallback* (a API melhora, nunca
   é ponto único de falha).

Ver `forca-vendas/README.md` para o sistema de força de vendas que serve de base.
