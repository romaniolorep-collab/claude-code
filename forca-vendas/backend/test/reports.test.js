// Testes de relatorios, metas e comissao.
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { rmSync } from 'node:fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const TEST_DB = join(__dirname, 'reports-test.db');
process.env.DB_PATH = TEST_DB;
for (const s of ['', '-wal', '-shm']) rmSync(TEST_DB + s, { force: true });

const { db, migrate, seed } = await import('../src/db.js');
const { salesSummary, goalsProgress, currentPeriod } = await import('../src/reports.js');

let rep, customer;

before(() => {
  migrate();
  seed();
  rep = db.prepare("SELECT * FROM users WHERE email='ana@modelo.com'").get();
  customer = db.prepare('SELECT * FROM customers WHERE price_table_id = 1 LIMIT 1').get();

  // Cria um pedido de R$ 1.000 no mes corrente para exercitar os relatorios.
  const orderId = db.prepare(`
    INSERT INTO orders (tenant_id, client_uuid, customer_id, rep_id, status, total)
    VALUES (?,?,?,?,?,?)
  `).run(1, 'rep-test-1', customer.id, rep.id, 'sent', 1000).lastInsertRowid;
  db.prepare(`
    INSERT INTO order_items (order_id, product_id, sku, name, qty, unit_price, line_total)
    VALUES (?,?,?,?,?,?,?)
  `).run(orderId, 1, 'CAM-001', 'Camiseta Dry Fit', 10, 100, 1000);
});

after(() => {
  db.close();
  for (const s of ['', '-wal', '-shm']) rmSync(TEST_DB + s, { force: true });
});

test('salesSummary soma faturamento e agrupa por representante e produto', () => {
  const r = salesSummary(1, currentPeriod());
  assert.equal(r.totals.orders, 1);
  assert.equal(r.totals.revenue, 1000);
  assert.equal(r.by_rep[0].rep, 'Ana Representante');
  assert.equal(r.by_rep[0].revenue, 1000);
  assert.equal(r.by_product[0].sku, 'CAM-001');
  assert.equal(r.by_product[0].qty, 10);
});

test('goalsProgress calcula progresso e comissao (meta 5000, 3%)', () => {
  const goals = goalsProgress(1, currentPeriod());
  const g = goals.find((x) => x.rep_id === rep.id);
  assert.ok(g, 'meta da representante existe');
  assert.equal(g.target_amount, 5000);
  assert.equal(g.achieved, 1000);
  assert.equal(g.progress_pct, 20);      // 1000 / 5000
  assert.equal(g.commission, 30);        // 1000 * 3%
});
