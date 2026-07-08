# Auditoria do catálogo Brooks PE — footwearpro

**Data:** 08/07/2026 · **Escopo:** dados embutidos publicados + todo o código que consome o catálogo Brooks (init, modal, importação XLSX, grades, pedido, imagens, zoom, sugestão).

## Dados publicados: ÍNTEGROS ✅

Verificação completa contra a planilha 22.06.2026: 50 preços ✓, 50 totais ✓, curvas por numeração ✓, `g[]`↔grades sem órfãs ✓, categorias coerentes com o prefixo da ref ✓ (única exceção documentada: 2ª entrada da `1104671D182`, feminina por decisão da planilha), labels MASC/FEM coerentes com os tamanhos ✓, imagens 74/74 no servidor ✓.

11 achados **cosméticos** herdados do texto da planilha (sem impacto funcional — a busca tokeniza por espaço): nomes "GLYCERIN MAX  2" (espaço duplo) e cores com espaço irregular ("BLACK/IPANEMA/ MINT", "SMOKE/STORMY/ ORANGE", "COCONUT/ GREEN GECKO/ PINK CLAY" etc.).

## Bugs de código encontrados

### 1. [ALTO] Colisão de IDs no modal com a ref duplicada `1104671D182`
`renderBrooksCatalog` deriva o identificador do card (`sid`) apenas da referência. Como o catálogo agora tem — corretamente — duas entradas com a mesma ref (masc 49 pares / fem 85 pares), os dois cards compartilham `sid`:
- `_brkPkUpd` e `_brkConfirm` selecionam inputs por `[data-brkref=sid]` → **somam e capturam quantidades dos dois cards juntos**; clicar "Adicionar" em um card arrasta o que foi digitado no outro para a mesma linha do pedido (com a grade do card clicado, podendo ultrapassar o estoque daquela grade).
- IDs duplicados (`brkcard-`, `brkimgc-`, `bpk-*`, `bpk-tot-*`): o contador e a **imagem do segundo card nunca atualizam**.
- O mesmo padrão (`drpimg-<sid>`) afeta o dropdown de sugestão.

**Correção:** incluir o índice do produto no `sid` (ex.: `ref + '_' + i`) em `renderBrooksCatalog` (cards e loop de imagens) e no dropdown de sugestão.

### 2. [ALTO] Importador XLSX colapsa a ref duplicada
`_brooksImportXLSX` → `mkGKey` gera a **mesma chave de grade** para as duas linhas da `1104671D182`; a segunda sobrescreve a primeira. Resultado de qualquer importação da planilha atual: a curva masculina (49 pares) desaparece e as duas entradas do catálogo apontam para a grade feminina (85 pares, contada 2×). *Foi exatamente esse mecanismo que gerou o dado corrompido que existia no site.*

**Correção:** ao detectar `gkey` repetida, sufixar (ex.: `bpe_4671D182F`) — mesmo esquema usado no builtin — e classificar a 2ª ocorrência pela curva (fem).

### 3. [ALTO] Importador XLSX perde as grades dos acessórios
A aba "Dispo Atual Acessórios" é importada **sem grade** (ignora as colunas P/M/G/GG): os cards de acessório ficam com "0 unid.", sem inputs de tamanho vinculados, e o botão **"+ Adicionar" fica inoperante** ("Selecione ao menos 1 par"). Ou seja: após qualquer importação via UI, acessórios não podem ser adicionados ao pedido.

**Correção:** gerar grade `bacc_<ref>` com `{P,M,G,GG}` a partir das colunas 7–10 da aba.

### 4. [MÉDIO] Importador silencioso em linhas inválidas
Linhas com preço quebrado (`#REF!` — presente na planilha 08.06) são puladas sem aviso; a variável `errors` é declarada mas nunca alimentada, então a mensagem "(N linhas ignoradas)" é código morto. A validação de cabeçalho calcula `hdrIdx` e não o utiliza.

### 5. [BAIXO] TDZ no `_initBrooksPE`
`Object.assign(GRADES, GRADES_BROOKS_PE)` executa antes de `const GRADES` ser declarado → `ReferenceError` engolido pelo `try/catch`. Hoje sem efeito prático (o `const GRADES` posterior já espalha o merge), mas qualquer código adicionado após essa linha no init nunca executará quando houver import válido.

### 6. [BAIXO] `restoreBrooksBuiltin` não re-renderiza o modal aberto
Restaurar o padrão com o catálogo aberto mantém a listagem antiga na tela até fechar/reabrir.

### 7. [BAIXO] Robustez do parser
Range fixo de colunas de numeração (6–24): uma numeração extra na planilha futura seria ignorada em silêncio. Código morto: `if (false) return; // load all`.

## Pontos positivos verificados
Guards de isolamento Brooks×Reebok consistentes em todos os fluxos; gate de versão de importação funcionando; prefixos de grade (`bpe_`/`bacc_`) sem colisão entre marcas; preços formatados pt-BR corretamente; clamps de estoque nos inputs; fluxo `addFromCatalogPE` correto para as duas entradas D182 (gradeKeys distintos).
