// Testes da analise de gestao: desempenho por marca, tendencia e funil.
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { rmSync } from 'node:fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const TEST_DB = join(__dirname, 'analytics-test.db');
process.env.DB_PATH = TEST_DB;
for (const s of ['', '-wal', '-shm']) rmSync(TEST_DB + s, { force: true });

const { db, migrate } = await import('../src/db.js');
const analytics = await import('../src/analytics.js');

const period = analytics.currentPeriod();
const iso = (d) => d.toISOString().slice(0, 19).replace('T', ' ');
const now = new Date();
const CUR = iso(now);
const PREV = iso(new Date(now.getFullYear(), now.getMonth() - 1, 15, 12));

before(() => {
  migrate();
  const tenant = db.prepare("INSERT INTO tenants (name) VALUES ('T')").run().lastInsertRowid;
  const rep = db.prepare(
    "INSERT INTO users (tenant_id,name,email,password_hash,role) VALUES (?,?,?,?,'rep')"
  ).run(tenant, 'R', 'r@t.com', 'x').lastInsertRowid;
  const cust = db.prepare(
    'INSERT INTO customers (tenant_id, rep_id, name) VALUES (?,?,?)'
  ).run(tenant, rep, 'Loja A').lastInsertRowid;
  const brooks = db.prepare(
    "INSERT INTO products (tenant_id,sku,name,brand,base_price) VALUES (?,?,?,?,?)"
  ).run(tenant, 'B1', 'Brooks X', 'Brooks', 100).lastInsertRowid;
  const reebok = db.prepare(
    "INSERT INTO products (tenant_id,sku,name,brand,base_price) VALUES (?,?,?,?,?)"
  ).run(tenant, 'R1', 'Reebok Y', 'Reebok', 50).lastInsertRowid;

  const mkOrder = (uuid, total, when) => db.prepare(
    'INSERT INTO orders (tenant_id, client_uuid, customer_id, rep_id, status, total, created_at) VALUES (?,?,?,?,?,?,?)'
  ).run(tenant, uuid, cust, rep, 'sent', total, when).lastInsertRowid;
  const mkItem = (oid, pid, sku, name, qty, up) => db.prepare(
    'INSERT INTO order_items (order_id, product_id, sku, name, qty, unit_price, line_total) VALUES (?,?,?,?,?,?,?)'
  ).run(oid, pid, sku, name, qty, up, up * qty);

  // mes atual: Brooks 2x100 = 200 ; Reebok 1x50 = 50  (total 250)
  const o1 = mkOrder('cur', 250, CUR);
  mkItem(o1, brooks, 'B1', 'Brooks X', 2, 100);
  mkItem(o1, reebok, 'R1', 'Reebok Y', 1, 50);
  // mes anterior: Brooks 1x100 = 100
  const o2 = mkOrder('prev', 100, PREV);
  mkItem(o2, brooks, 'B1', 'Brooks X', 1, 100);

  db.prepare('INSERT INTO goals (tenant_id, rep_id, period, target_amount, commission_pct) VALUES (?,?,?,?,?)')
    .run(tenant, rep, period, 1000, 7);

  const mkLead = (stage) => db.prepare(
    'INSERT INTO leads (tenant_id, store_name, stage, updated_at) VALUES (?,?,?,?)'
  ).run(tenant, 'p', stage, stage === 'ativo' ? CUR : PREV);
  for (const s of ['lead', 'lead', 'lead', 'contato', 'contato', 'ativo']) mkLead(s);
});

after(() => {
  db.close();
  for (const s of ['', '-wal', '-shm']) rmSync(TEST_DB + s, { force: true });
});

test('byBrand: faturamento, participação e tendência vs mês anterior', () => {
  const r = analytics.byBrand(1, period);
  const brooks = r.find((x) => x.brand === 'Brooks');
  const reebok = r.find((x) => x.brand === 'Reebok');
  assert.equal(brooks.revenue, 200);
  assert.equal(brooks.share, 80);          // 200 de 250
  assert.equal(brooks.delta_pct, 100);     // 200 vs 100 no mês anterior
  assert.equal(brooks.trend, 'up');
  assert.equal(reebok.revenue, 50);
  assert.equal(reebok.trend, 'novo');      // não vendeu no mês anterior
});

test('funnel: contagem por estágio na ordem certa', () => {
  const f = analytics.funnel(1);
  const byStage = Object.fromEntries(f.map((s) => [s.stage, s.count]));
  assert.equal(byStage.lead, 3);
  assert.equal(byStage.contato, 2);
  assert.equal(byStage.primeira_compra, 0);
  assert.equal(byStage.ativo, 1);
});

test('overview: faturamento, meta e novos lojistas', () => {
  const o = analytics.overview(1, period);
  assert.equal(o.revenue, 250);
  assert.equal(o.goal_target, 1000);
  assert.equal(o.goal_pct, 25);            // 250 de 1000
  assert.equal(o.new_stores, 1);           // 1 lead virou 'ativo' neste mês
});
