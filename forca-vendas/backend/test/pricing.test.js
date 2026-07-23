// Testes do motor de precos — o subsistema mais critico do dominio.
// Usa um banco SQLite temporario e os dados do seed padrao.
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { rmSync } from 'node:fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const TEST_DB = join(__dirname, 'test.db');

// O DB_PATH precisa estar definido ANTES de importar db.js.
process.env.DB_PATH = TEST_DB;
for (const suffix of ['', '-wal', '-shm']) rmSync(TEST_DB + suffix, { force: true });

const { db, migrate, seed } = await import('../src/db.js');
const { resolveUnitPrice, priceOrder } = await import('../src/pricing.js');

let cam, ten, rep, customer;

before(() => {
  migrate();
  seed();
  cam = db.prepare("SELECT id FROM products WHERE sku='CAM-001'").get();
  ten = db.prepare("SELECT id FROM products WHERE sku='TEN-010'").get();
  rep = db.prepare("SELECT * FROM users WHERE email='ana@modelo.com'").get();
  customer = db.prepare('SELECT * FROM customers WHERE price_table_id = 1 LIMIT 1').get();
});

after(() => {
  db.close();
  for (const suffix of ['', '-wal', '-shm']) rmSync(TEST_DB + suffix, { force: true });
});

test('resolveUnitPrice usa preco base abaixo da quebra', () => {
  assert.equal(resolveUnitPrice({ priceTableId: 1, productId: cam.id, qty: 1 }), 39.90);
  assert.equal(resolveUnitPrice({ priceTableId: 1, productId: cam.id, qty: 11 }), 39.90);
});

test('resolveUnitPrice aplica a quebra por quantidade (>= 12)', () => {
  assert.equal(resolveUnitPrice({ priceTableId: 1, productId: cam.id, qty: 12 }), 35.91);
  assert.equal(resolveUnitPrice({ priceTableId: 1, productId: cam.id, qty: 999 }), 35.91);
});

test('priceOrder congela precos e calcula o total com desconto', () => {
  const r = priceOrder({
    tenantId: 1, customer, rep,
    items: [{ product_id: cam.id, qty: 12 }, { product_id: ten.id, qty: 2 }],
    discountPct: 5,
  });
  // 12*35.91 + 2*199.90 = 430.92 + 399.80 = 830.72; -5% = 789.18
  assert.equal(r.items[0].unit_price, 35.91, 'preco da quebra congelado');
  assert.equal(r.items[0].line_total, 430.92);
  assert.equal(r.subtotal, 830.72);
  assert.equal(r.total, 789.18);
});

test('priceOrder rejeita desconto acima da alcada do representante', () => {
  assert.throws(
    () => priceOrder({ tenantId: 1, customer, rep, items: [{ product_id: cam.id, qty: 1 }], discountPct: 20 }),
    /alcada/i,
  );
});

test('priceOrder rejeita produto inexistente', () => {
  assert.throws(
    () => priceOrder({ tenantId: 1, customer, rep, items: [{ product_id: 999999, qty: 1 }] }),
    /inexistente/i,
  );
});
