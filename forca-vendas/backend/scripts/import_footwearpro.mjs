// Importa o catalogo canonico do Footwear Pro para o banco do backend,
// provando que o nosso sistema pode ser a FONTE DE VERDADE do catalogo.
// Roda localmente num banco proprio (footwearpro.db) — nao toca o site no ar.
//
// Uso (a partir de forca-vendas/backend):
//   node scripts/import_footwearpro.mjs [caminho_json] [caminho_db]
import bcrypt from 'bcryptjs';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const jsonPath = process.argv[2] || join(__dirname, '..', '..', 'footwearpro', 'catalogo_canonico.json');
process.env.DB_PATH = process.argv[3] || join(__dirname, '..', 'footwearpro.db');

const { db, migrate } = await import('../src/db.js');
migrate();

// Import idempotente: limpa e recria (FK off durante a limpeza).
db.pragma('foreign_keys = OFF');
for (const t of ['order_items', 'orders', 'variants', 'price_rules', 'visits',
                 'goals', 'customers', 'products', 'price_tables', 'users', 'tenants']) {
  db.exec(`DELETE FROM ${t}`);
}
db.pragma('foreign_keys = ON');

const cat = JSON.parse(readFileSync(jsonPath, 'utf8'));

const tenant = db.prepare("INSERT INTO tenants (name, plan) VALUES ('Footwear Pro', 'pro')").run().lastInsertRowid;
const hash = bcrypt.hashSync('123456', 8);
db.prepare(
  'INSERT INTO users (tenant_id, name, email, password_hash, role, max_discount) VALUES (?,?,?,?,?,?)'
).run(tenant, 'Gestor Footwear', 'gestor@footwearpro.com', hash, 'manager', 100);
const rep = db.prepare(
  'INSERT INTO users (tenant_id, name, email, password_hash, role, max_discount) VALUES (?,?,?,?,?,?)'
).run(tenant, 'Rep Footwear', 'rep@footwearpro.com', hash, 'rep', 8).lastInsertRowid;

const table = db.prepare("INSERT INTO price_tables (tenant_id, name) VALUES (?, 'Pronta Entrega 2026')")
  .run(tenant).lastInsertRowid;

// Um cliente de exemplo para o app/portal poder montar pedido.
db.prepare(
  'INSERT INTO customers (tenant_id, rep_id, name, doc, city, credit_limit, price_table_id) VALUES (?,?,?,?,?,?,?)'
).run(tenant, rep, 'Loja Parceira Demo', '00.000.000/0001-00', 'Curitiba', 50000, table);

const insP = db.prepare(
  'INSERT INTO products (tenant_id, sku, name, unit, category, brand, image_url, base_price, stock) VALUES (?,?,?,?,?,?,?,?,?)'
);
const insRule = db.prepare('INSERT INTO price_rules (price_table_id, product_id, min_qty, price) VALUES (?,?,?,?)');
const insVar = db.prepare('INSERT INTO variants (tenant_id, product_id, label, stock) VALUES (?,?,?,?)');

let nprod = 0, nvar = 0;
const run = db.transaction(() => {
  for (const p of cat.products) {
    const cat0 = p.category || '';
    const unit = cat0.startsWith('calcado') ? 'PAR' : 'UN';
    const name = p.colorway ? `${p.name} · ${p.colorway}` : p.name;
    const img = p.brand === 'Brooks'
      ? `assets/products/${p.ref}.png`
      : `assets/products/${p.ref}.jpg`;
    const sizes = p.sizes || {};
    const stock = Object.values(sizes).reduce((s, q) => s + q, 0);
    const pid = insP.run(tenant, p.ref, name, unit, cat0, p.brand, img, p.price || 0, stock).lastInsertRowid;
    insRule.run(table, pid, 1, p.price || 0);
    for (const [size, q] of Object.entries(sizes)) { insVar.run(tenant, pid, size, q); nvar++; }
    nprod++;
  }
});
run();

const byBrand = db.prepare('SELECT brand, COUNT(*) n FROM products WHERE tenant_id=? GROUP BY brand')
  .all(tenant);
console.log(`Importados: ${nprod} produtos, ${nvar} variantes de grade`);
console.log('Por marca:', byBrand.map((b) => `${b.brand}=${b.n}`).join(', '));
console.log('Login: gestor@footwearpro.com / 123456  |  DB:', process.env.DB_PATH);
