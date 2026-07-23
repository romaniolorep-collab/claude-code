# Força de Vendas — esqueleto (backend + app mobile)

Fundação de um app de força de vendas para **representantes comerciais**, no
espírito do Ativação Tec: catálogo, montagem de pedido **offline**, preço
calculado no servidor e sincronização idempotente.

> Este é um esqueleto para evoluir, não um produto pronto. O foco foi acertar
> os 3 pontos que decidem esse tipo de projeto: **preço correto**,
> **funcionar offline** e **não duplicar pedidos**.

```
forca-vendas/
├── backend/   API Node.js (Fastify + SQLite) — RODA e foi testada
├── mobile/    App Flutter (offline-first) — analisado e testado (3/3)
└── web/       Painel de gestão React (Vite) — RODA contra o backend
```

## Arquitetura em uma frase

O celular é a fonte da verdade enquanto está offline: ele guarda catálogo,
clientes e uma **fila de pedidos** localmente. Quando há conexão, sincroniza —
baixa mudanças (`/sync/pull`) e envia a fila (`/sync/push`). O servidor
**recalcula o preço** de todo pedido (o app nunca dita preço) e usa o
`client_uuid` gerado no dispositivo para garantir **idempotência**.

## 1. Backend

```bash
cd backend
npm install
npm run seed      # cria o banco e popula dados de exemplo
npm start         # sobe em http://localhost:3000
```

Login de teste: **ana@modelo.com / 123456** (representante, alçada de 8%).

Endpoints principais:

| Método | Rota | O que faz |
|---|---|---|
| `POST` | `/auth/login` | Autentica, devolve JWT com `tenant_id` |
| `GET`  | `/sync/pull?since=ISO` | Baixa produtos/clientes/regras alterados |
| `POST` | `/sync/push` | Recebe pedidos offline (idempotente, preço no servidor) |
| `GET`  | `/products` `/customers` `/orders` | Listagens (também servem ao painel web) |

Teste rápido do fluxo (com o servidor no ar):

```bash
TOKEN=$(curl -s -X POST localhost:3000/auth/login \
  -H 'content-type: application/json' \
  -d '{"email":"ana@modelo.com","password":"123456"}' | \
  node -pe 'JSON.parse(require("fs").readFileSync(0)).token')

curl -s -X POST localhost:3000/sync/push \
  -H "authorization: Bearer $TOKEN" -H 'content-type: application/json' \
  -d '{"orders":[{"client_uuid":"teste-1","customer_id":1,"discount_pct":5,
       "items":[{"product_id":1,"qty":12},{"product_id":3,"qty":2}]}]}'
```

> **Dev usa SQLite** para rodar sem servidor de banco. O schema é 1:1 com
> PostgreSQL (recomendado em produção, com Row-Level Security por `tenant_id`).

## 2. App mobile (Flutter)

```bash
cd mobile
flutter pub get
flutter run          # com um emulador/dispositivo conectado
```

No **emulador Android**, `localhost` do seu PC é `10.0.2.2` (já é o padrão).
Para apontar para outro host: `flutter run --dart-define=API_URL=http://SEU_IP:3000`.

Estrutura:

| Arquivo | Papel |
|---|---|
| `lib/api.dart` | Cliente HTTP fino |
| `lib/store.dart` | Persistência local (cache + fila de pedidos) |
| `lib/app_state.dart` | Orquestração offline-first (sync, fila, prévia de preço) |
| `lib/screens/` | Login, catálogo, carrinho, fila de pedidos |

## 3. Painel web de gestão (React)

Para o gestor/fornecedor. Reaproveita os mesmos endpoints do app mobile.

```bash
cd web
npm install
npm run dev          # abre em http://localhost:5173
```

Login de teste: **gestor@modelo.com / 123456** (perfil `manager`).
Aponte para outro backend com `VITE_API_URL=http://SEU_IP:3000 npm run dev`.

Telas: dashboard com KPIs (pedidos, faturamento, representantes), e abas de
Pedidos, Produtos e Clientes — com detalhe do pedido mostrando os preços
congelados. Exige o backend no ar.

## Como isto vira produto (próximos passos)

- **Banco local**: trocar `shared_preferences` por **SQLite (drift/sqflite)** —
  catálogos reais têm milhares de itens.
- **Preço**: cobrir o motor de preços com testes (campanhas, faixas, alçadas).
- **Sync**: deltas por entidade, resolução de conflito e reenvio com backoff.
- **Painel web** (React) reaproveitando os mesmos endpoints.
- **Integração ERP** para o pedido fluir ao faturamento.

Ver o blueprint completo (funcionalidades, stack, roadmap) para o mapa geral.
