# Robô de Prospecção — clone

Clone funcional do robô de prospecção (estilo Ativação Tec): acha **lojas
novas** por tipo + local, com endereço, telefone, site, nota e horário —
e monta a **rota** de visita. É a ferramenta que ataca o gargalo real do
representante: **volume** (mais loja pra vender).

## Melhorias sobre o robô original

- **Não te mostra quem já é seu.** Cruza o resultado com sua carteira e
  esconde (por padrão) as lojas que você já atende — sobra só o que é
  prospecção de verdade. Marque/desmarque em "esconder as que já são minhas".
- **Várias cidades de uma vez.** Busca `Maringá, Cianorte, Umuarama` numa
  tacada e agrupa por cidade — dá pra montar o roteiro da semana inteira.
- **Filtros que importam pro rep:** nota mínima, só abertas agora, e ordenar
  por nota ou por nº de avaliações (loja avaliada = loja com movimento).
- **Resumo direto:** "X novas · Y já suas · Z sem telefone" — você já sabe
  quantos contatos aproveitáveis a busca trouxe.

## Rodar

Node 18+ (não precisa instalar dependência nenhuma).

```bash
# modo DEMO — dados fictícios, pra ver a interface funcionando
node server.mjs

# modo REAL — com dados do Google
GOOGLE_PLACES_KEY=sua_chave node server.mjs
```
Abre em **http://localhost:4000**.

## Como conseguir a chave (Google Places)

1. [console.cloud.google.com](https://console.cloud.google.com) → crie um projeto
2. Ative a **Places API**
3. Crie uma **API key** (e restrinja por API/IP por segurança)

> **Custo (honesto):** o Google dá ~US$ 200/mês de crédito grátis — costuma
> cobrir muita busca. Acima disso: *Text Search* ~US$ 32/mil buscas,
> *Place Details* ~US$ 17/mil. Por isso o clone só chama o Details quando
> você abre **"Detalhes"** de uma loja (economiza cota).

## Termos de uso (importante)

- Use a **API oficial** do Google Places — **não** raspe o Google Maps direto
  (viola os termos e é bloqueado).
- O Google limita guardar/cachear alguns dados por muito tempo. Para uso de
  prospecção (achar e contatar), está dentro do esperado; não monte um banco
  paralelo do Google.

## Alternativas à chave do Google

- **OpenStreetMap / Overpass** — grátis, mas dados mais esparsos (muitas lojas
  sem telefone/horário/avaliação).
- **Foursquare Places** — outra opção com cota grátis.

O `server.mjs` está pronto pro Google; trocar por outra fonte é mexer só na
função `buscarGoogle()`.

## O que ele faz (e o que não faz)

| Faz | Não faz |
|---|---|
| Acha lojas novas por tipo + local | Catálogo / grade / pedido |
| Esconde quem já é seu cliente | Comissão / gestão de venda |
| Traz contato, nota, horário (Google) | (isso é o Footwear Pro) |
| Salva na carteira + monta rota (Maps) | |

**Use solto primeiro.** Se ele te trouxer loja que vira venda, aí sim vale
pensar em integrar com o Footwear Pro (pra não recadastrar a loja duas vezes).
