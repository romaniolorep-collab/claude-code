# Varredura — footwearpro.ibrandintelligence.org · Pronta Entrega Brooks

**Data:** 07/07/2026 · **Fonte de verdade:** `BROOKS__PRONTA_ENTREGA.pdf` (Catálogo Técnico Pronta Entrega 2026 — 12 modelos, 50 SKUs de calçados, 20 acessórios)

**Como foi feita:** o ambiente da sessão não alcança o domínio do site (política de rede), então a varredura rodou via GitHub Actions deste repositório: download do site publicado, teste HTTP de todas as imagens de produto (Brooks, Reebok e Kipling), extração dos catálogos embutidos no `index.html` e comparação SKU a SKU com o PDF, incluindo comparação visual das fotos.

---

## 1. Causa raiz dos erros de imagem: extensão `.jpg` vs `.png`

**Todas as 73 imagens Brooks no servidor são `.png`** (`assets/products/<ref>.png`). **Não existe nenhum `.jpg` Brooks.** Reebok (419 imagens) e Kipling (60) estão em `.jpg`.

O código do site pede `.jpg` fixo em **6 pontos** — por isso as imagens Brooks somem nessas telas (o `onerror` esconde o `<img>`), enquanto Reebok/Kipling funcionam:

| Local no código (offset no index.html publicado) | Tela afetada |
|---|---|
| `src="assets/products/${p.r}.jpg"` (~387545) | Linhas do modal Catálogo Pronta Entrega (thumb 64×64 com zoom) |
| `'assets/products/' + ref + '.jpg'` (~444076) | Preview/thumbnail de item ("Reebok / outras") |
| `` `assets/products/${p.r}.jpg` `` (~449454) | Card de sugestão de produto |
| `cat-zoom-img ... + '.jpg'` (~509879) | **Zoom da foto no catálogo** |
| `thumbSrc = ... ${ref}.jpg` (~558147) | Tabela de conferência do pedido |
| `thumbUrl = ${baseURL}/assets/products/${ref}.jpg` (~567588) | Exportação/impressão (PDF do pedido) |

O único caminho correto é `_applyBrkImg` (tenta `.png` e cai para placeholder Canvas) — usado nos cards principais Brooks.

**Correção aplicada em `footwearpro_fix/index.html`:** helper `_prodImgSrc(ref)` — refs 100% numéricas (Brooks) → `.png`; refs com letras (Reebok/Kipling) → `.jpg` — substituindo os 6 pontos acima.

## 2. Imagens ausentes no servidor (404 real)

| Ref | Produto | Situação |
|---|---|---|
| `280417430` | Boné Heritage Run Unissex — Abyss Blue/Ivory | Sem `.png` nem `.jpg` no servidor — consequência do deslocamento do item 4: a foto real estava salva como `280417033.png`. Recuperada em `footwearpro_fix/assets/products/280417430.png`. |
| `RN0158NWTS48` | Reebok PE | Sem imagem no servidor |
| `RN0158NWTS4A4` | Reebok PE | Sem imagem no servidor |

## 3. Erros de referência (catálogo Brooks do site × PDF)

O site tem **54 SKUs de calçados Brooks; o PDF tem 50** (49 refs únicas — ver item 3.2).

### 3.1 Produtos no site que NÃO constam no PDF Pronta Entrega (5)

| Ref | Modelo | Cor | Pares no site |
|---|---|---|---|
| `1104421D414` | GHOST 17 | PEACOAT/LIME/BLUE | 7 |
| `1104471D303` | GLYCERIN MAX | LIME/NAVY PEONY/WHITE | 8 |
| `1204361B115` | GLYCERIN MAX | COCONUT/ALLOY/ROSE | 27 |
| `1204361B118` | GLYCERIN MAX | WHITE/BLACK/DIVA PINK | 8 |
| `1204361B447` | GLYCERIN MAX | BLUE HERON/DIVA PINK/WHITE | 10 |

O modelo **GLYCERIN MAX (1ª geração) inteiro não existe no PDF** — o catálogo 2026 só tem o Glycerin Max 2. Confirmar se esses 5 SKUs ainda são pronta entrega; se não, remover do site.

### 3.2 Colorway faltando no site (Hyperion Max 3)

O PDF lista a ref `1104671D182` (Coconut/Green Gecko/Pink Clay) **duas vezes**: uma com grade masculina 38–42 (49 pares) e outra com grade feminina 34–37.5 (85 pares) — o índice conta 5 cores para o modelo. O site tem **uma única entrada** com a curva feminina (85 pares) porém **categorizada como `calcado-masc`**:

- A variante **masculina (49 pares) não existe no site**;
- A variante feminina está com **categoria errada** (e possivelmente com a ref masculina — a ref feminina Brooks deveria seguir o padrão `12xxxxxB182`; o próprio PDF imprime a mesma ref nas duas células, o que também merece conferência com a planilha).

### 3.3 Preços divergentes (12 SKUs) — corrigidos em `footwearpro_fix/index.html`

| Ref | Modelo · Cor | PDF | Site |
|---|---|---|---|
| `1104421D048` | GHOST 17 · Oyster Mushroom/Orange/Ebony | **R$ 849,90** | R$ 999,90 |
| `1104421D090` | GHOST 17 · Black/Grey/White (M) | **R$ 849,90** | R$ 999,90 |
| `1104421D112` | GHOST 17 · White/Pink Clay/Gecko | **R$ 849,90** | R$ 999,90 |
| `1204311B070` | GHOST 17 · Oyster/Apricot/Pink | **R$ 849,90** | R$ 999,90 |
| `1204311B080` | GHOST 17 · Black/Purple/Coral | **R$ 849,90** | R$ 999,90 |
| `1204311B090` | GHOST 17 · Black/Grey/White (F) | **R$ 849,90** | R$ 999,90 |
| `1204311B443` | GHOST 17 · Blue Heron/White/Orange | **R$ 849,90** | R$ 999,90 |
| `1104451D175` | GLYCERIN 22 · Bright White/Winter Sky/Black | **R$ 1.099,90** | R$ 1.399,90 |
| `1204341B090` | GLYCERIN 22 · Black/Grey/White | **R$ 1.099,90** | R$ 1.399,90 |
| `1104461D002` | GLYCERIN GTS 22 · Black/Cobalt/Neo Yellow | **R$ 999,90** | R$ 1.399,90 |
| `1104671D670` | HYPERION MAX 3 · Fiery Coral/Black/Atomizer | **R$ 1.399,90** | R$ 1.799,90 |
| `1204551B659` | HYPERION MAX 3 · Coconut/Fiery Coral/Atomizer | **R$ 1.299,90** | R$ 1.799,90 |

Obs.: `1204311B412` (Burgundy/Pink/Green) está R$ 999,99 no site **e** no PDF — destoa dos R$ 849,90 dos demais Ghost 17; conferir na planilha se é promocional ou erro de digitação no próprio PDF.

### 3.4 Grades com total de pares divergente (17 SKUs)

Totais impressos no PDF (verificados visualmente nos casos extremos) × soma da grade embutida no site:

| Ref | Modelo | PDF | Site | Dif |
|---|---|---|---|---|
| `1204311B443` | GHOST 17 | 77 | 105 | **+28** |
| `1104791D091` | GLYCERIN MAX 2 | 94 | 63 | **−31** |
| `1204681B048` | GLYCERIN MAX 2 | 79 | 88 | +9 |
| `1104571D722` | CASCADIA 19 | 50 | 59 | +9 |
| `1205091B163` | PYNRS X HYPERION MAX 3 | 129 | 135 | +6 |
| `1204681B110` | GLYCERIN MAX 2 | 12 | 7 | −5 |
| `1104791D811` | GLYCERIN MAX 2 | 65 | 69 | +4 |
| `1104671D164` | HYPERION MAX 3 | 483 | 486 | +3 |
| `1204431B184` | ADRENALINE GTS 25 | 34 | 36 | +2 |
| `1104401D314` | CALDERA 8 | 67 | 69 | +2 |
| `1204291B031` | CALDERA 8 | 12 | 14 | +2 |
| `1104421D112` | GHOST 17 | 88 | 89 | +1 |
| `1204311B090` | GHOST 17 | 39 | 40 | +1 |
| `1104541D033` | ADRENALINE GTS 25 | 62 | 63 | +1 |
| `1204341B090` | GLYCERIN 22 | 8 | 9 | +1 |
| `1105201D163` | PYNRS X HYPERION MAX 3 | 97 | 98 | +1 |
| `1204461B711` | CASCADIA 19 | 27 | 28 | +1 |

Totais por modelo: PDF = 3.329 pares (bate com o índice do catálogo); site = 3.386 (sem contar os 60 pares dos 5 SKUs fora do catálogo). O PDF mostra só os 5 primeiros tamanhos de cada grade + total, então **as curvas completas por numeração devem ser refeitas a partir da planilha 25.05.26** — não dá para corrigi-las com segurança só com o PDF. Por isso as grades NÃO foram alteradas em `footwearpro_fix/index.html`.

## 4. Comparação visual das fotos (site × PDF): **71 de 73 fotos estão trocadas**

Verificação visual de todos os 73 arquivos de imagem Brooks contra as fotos oficiais do PDF (`scan_output/visual_report.json`): **71 mismatches**. O padrão é sistemático: **cada arquivo `assets/products/<ref>.png` contém a foto do produto SEGUINTE na ordem do catálogo** (deslocamento de −1 no upload). A cadeia atravessa modelos e até os acessórios:

- `1104541D033.png` (Adrenaline Oyster/Green Gecko) mostra o **Black/Ipanema/Mint** (D055);
- `1204311B412.png` (Ghost Burgundy) mostra o **Blue Heron/White/Orange** (B443);
- `1204461B711.png` (Cascadia feminino) mostra **meias pretas** (primeiro acessório);
- `280417033.png` (Boné Heritage Black/White) mostra o **boné Abyss Blue/Ivory** — por isso a ref `280417430` "não tinha" imagem: a foto dela estava salva na ref anterior.

Exceções verificadas: `1204341B088` (Glycerin 22 fem) está com a foto **correta** (o deslocamento pulou esta ref); `1204431B064.png` contém a foto do Ghost `1104421D048`; `1204431B184.png` é uma duplicata da foto do B053 (a foto real do Silver Anniversary feminino não está no servidor).

**Correção pronta:** `footwearpro_fix/assets/products/` contém as **74 imagens já renomeadas para as refs corretas** (mapa em `scan_output/image_remap.json`). Para `1104541D033` e `1204431B184`, cujas fotos reais não existiam no servidor, foram extraídas as fotos oficiais do PDF. Basta subir a pasta substituindo os `.png` atuais.

## 5. O que já está corrigido em `footwearpro_fix/`

1. `index.html` — helper `_prodImgSrc()` nos 6 pontos que pediam `.jpg` (conserta a exibição das imagens Brooks no modal do catálogo, zoom, conferência e exportação) + 12 preços alinhados ao PDF.
2. `assets/products/` — **74 imagens Brooks renomeadas para as refs corretas** (desfaz o deslocamento de −1; mapa em `scan_output/image_remap.json`), incluindo a foto real do boné `280417430` (recuperada do arquivo `280417033.png`) e as fotos do PDF para `1104541D033` e `1204431B184`.

**Deploy:** publicar `footwearpro_fix/index.html` no lugar do `index.html` do site e subir o conteúdo de `footwearpro_fix/assets/products/` substituindo os `.png` atuais. As duas correções são independentes, mas devem ir juntas para consistência. (O deploy Netlify não pôde ser feito desta sessão — o ambiente não alcança o domínio/API.)

## 6. Pendências que exigem decisão/planilha

- Remover (ou confirmar) os 5 SKUs fora do catálogo (item 3.1).
- Repor a variante masculina do Hyperion Max 3 D182 e corrigir categoria/ref da feminina (item 3.2).
- Regerar as 17 grades divergentes a partir da planilha real (item 3.4).
- Subir imagens das 2 refs Reebok sem foto (item 2).
- Obter a foto oficial do Adrenaline GTS 25 Silver Anniversary feminino (`1204431B184`) — o servidor só tinha uma duplicata da foto do B053; usei a foto do PDF como provisória.
- Conferir o preço do `1204311B412` (R$ 999,99 vs R$ 849,90 dos demais Ghost 17).
