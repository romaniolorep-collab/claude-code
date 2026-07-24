// Popula dados de GESTAO de exemplo no banco Footwear Pro (footwearpro.db):
// lojas, pedidos deste mes e do anterior (por marca/loja) e o funil de leads.
// Serve para os endpoints de analise devolverem numeros reais e comparaveis.
// Roda local, sobre o catalogo ja importado — nao toca o site no ar.
//
// Uso (a partir de forca-vendas/backend):
//   node scripts/import_footwearpro.mjs        # 1o: catalogo
//   node scripts/seed_gestao.mjs               # 2o: dados de gestao
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
process.env.DB_PATH = process.argv[2] || join(__dirname, '..', 'footwearpro.db');
const { db, migrate } = await import('../src/db.js');
migrate();

const tenant = db.prepare('SELECT id FROM tenants LIMIT 1').get()?.id;
const rep = db.prepare("SELECT id FROM users WHERE tenant_id=? AND role='rep' LIMIT 1").get(tenant)?.id
  || db.prepare('SELECT id FROM users WHERE tenant_id=? LIMIT 1').get(tenant).id;
const table = db.prepare('SELECT id FROM price_tables WHERE tenant_id=? LIMIT 1').get(tenant).id;

// limpa amostra de gestao (mantem catalogo/produtos/grade/usuarios)
db.pragma('foreign_keys = OFF');
db.exec('DELETE FROM order_items'); // sem coluna tenant_id
for (const t of ['orders', 'leads', 'goals', 'customers']) db.prepare(`DELETE FROM ${t} WHERE tenant_id=?`).run(tenant);
db.pragma('foreign_keys = ON');

// --- lojas ---
const stores = [
  ['Loja Central', 'Londrina'],
  ['Esporte & Cia', 'Maringá'],
  ['Passo Certo', 'Curitiba'],
  ['RunHouse', 'Cascavel'],
  ['Vitrine Sport', 'Foz do Iguaçu'],
];
const insC = db.prepare(
  'INSERT INTO customers (tenant_id, rep_id, name, city, credit_limit, price_table_id) VALUES (?,?,?,?,?,?)'
);
const storeId = stores.map(([n, c]) => insC.run(tenant, rep, n, c, 50000, table).lastInsertRowid);

// --- produtos por marca (para montar os pedidos) ---
const byBrand = {};
for (const b of ['Brooks', 'Reebok', 'Kipling']) {
  byBrand[b] = db.prepare(
    'SELECT id, base_price FROM products WHERE tenant_id=? AND brand=? ORDER BY stock DESC LIMIT 12'
  ).all(tenant, b);
}

const now = new Date();
const iso = (d) => d.toISOString().slice(0, 19).replace('T', ' ');
const CUR = iso(now);
const PREV = iso(new Date(now.getFullYear(), now.getMonth() - 1, 15, 12));

const insO = db.prepare(
  'INSERT INTO orders (tenant_id, client_uuid, customer_id, rep_id, status, total, created_at) VALUES (?,?,?,?,?,?,?)'
);
const insI = db.prepare(
  'INSERT INTO order_items (order_id, product_id, sku, name, qty, unit_price, line_total) VALUES (?,?,?,?,?,?,?)'
);
let uid = 0;
// specs: [ [marca, qtdProdutos, paresPorProduto], ... ]  -> cria 1 pedido
function order(customerId, when, specs) {
  let total = 0;
  const items = [];
  for (const [brand, nprod, pares] of specs) {
    const pool = byBrand[brand] || [];
    for (let i = 0; i < nprod && i < pool.length; i++) {
      const p = pool[i];
      const lt = Math.round(p.base_price * pares * 100) / 100;
      total += lt;
      items.push([p.id, pares, p.base_price, lt]);
    }
  }
  const oid = insO.run(tenant, `seed-${++uid}`, customerId, rep, 'sent', Math.round(total * 100) / 100, when).lastInsertRowid;
  for (const [pid, q, up, lt] of items) {
    const pr = db.prepare('SELECT sku, name FROM products WHERE id=?').get(pid);
    insI.run(oid, pid, pr.sku, pr.name, q, up, lt);
  }
  return total;
}

// Distribuicao pensada: Brooks lider; RunHouse e Vitrine caem vs mes anterior.
const plan = [
  // loja 0 Central — cresce
  [0, PREV, [['Brooks', 3, 4], ['Reebok', 2, 3]]],
  [0, CUR,  [['Brooks', 4, 5], ['Reebok', 2, 3]]],
  // loja 1 Esporte&Cia — cresce
  [1, PREV, [['Brooks', 2, 3], ['Kipling', 2, 4]]],
  [1, CUR,  [['Brooks', 3, 4], ['Kipling', 2, 5]]],
  // loja 2 Passo Certo — estável
  [2, PREV, [['Brooks', 3, 3]]],
  [2, CUR,  [['Brooks', 3, 3]]],
  // loja 3 RunHouse — CAI
  [3, PREV, [['Reebok', 4, 4], ['Brooks', 1, 2]]],
  [3, CUR,  [['Reebok', 2, 2]]],
  // loja 4 Vitrine Sport — CAI
  [4, PREV, [['Reebok', 3, 3], ['Kipling', 1, 2]]],
  [4, CUR,  [['Reebok', 1, 2]]],
];
for (const [s, when, specs] of plan) order(storeId[s], when, specs);

// --- meta do mes ---
const period = now.toISOString().slice(0, 7);
db.prepare('INSERT INTO goals (tenant_id, rep_id, period, target_amount, commission_pct) VALUES (?,?,?,?,?)')
  .run(tenant, rep, period, 600000, 7);

// --- funil de leads ---
const insL = db.prepare(
  "INSERT INTO leads (tenant_id, store_name, city, brand, stage, value_est, updated_at) VALUES (?,?,?,?,?,?,?)"
);
const funnel = [
  ['lead', 12], ['contato', 7], ['primeira_compra', 4], ['ativo', 3],
];
let li = 0;
for (const [stage, n] of funnel) {
  for (let i = 0; i < n; i++) {
    const upd = stage === 'ativo' ? CUR : PREV;
    insL.run(tenant, `Prospect ${++li}`, ['Londrina', 'Maringá', 'Curitiba', 'Cascavel'][li % 4],
      ['Brooks', 'Reebok', 'HOKA'][li % 3], stage, 3000 + (li * 250), upd);
  }
}

const rev = db.prepare("SELECT COALESCE(SUM(total),0) v FROM orders WHERE tenant_id=? AND strftime('%Y-%m',created_at)=?").get(tenant, period).v;
console.log(`Gestão populada: ${plan.length} pedidos, ${stores.length} lojas, ${funnel.reduce((s, [, n]) => s + n, 0)} leads`);
console.log(`Faturamento do mês (${period}): R$ ${rev.toFixed(2)} · meta R$ 600.000`);
