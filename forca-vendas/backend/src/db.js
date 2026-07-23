// Banco de dados (SQLite via better-sqlite3).
// Em desenvolvimento usamos SQLite para rodar sem precisar de um servidor.
// O schema foi desenhado para ser 1:1 com PostgreSQL em produção
// (basta trocar o driver e ajustar tipos de data).
import Database from 'better-sqlite3';
import bcrypt from 'bcryptjs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DB_PATH = process.env.DB_PATH || join(__dirname, '..', 'data.db');

export const db = new Database(DB_PATH);
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

export function migrate() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS tenants (
      id          INTEGER PRIMARY KEY,
      name        TEXT NOT NULL,
      plan        TEXT NOT NULL DEFAULT 'trial',
      created_at  TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS users (
      id            INTEGER PRIMARY KEY,
      tenant_id     INTEGER NOT NULL REFERENCES tenants(id),
      name          TEXT NOT NULL,
      email         TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      role          TEXT NOT NULL DEFAULT 'rep',   -- rep | manager | admin
      max_discount  REAL NOT NULL DEFAULT 5,       -- alcada de desconto (%)
      created_at    TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS products (
      id          INTEGER PRIMARY KEY,
      tenant_id   INTEGER NOT NULL REFERENCES tenants(id),
      sku         TEXT NOT NULL,
      name        TEXT NOT NULL,
      unit        TEXT NOT NULL DEFAULT 'UN',
      category    TEXT,
      image_url   TEXT,
      base_price  REAL NOT NULL DEFAULT 0,
      stock       INTEGER NOT NULL DEFAULT 0,
      active      INTEGER NOT NULL DEFAULT 1,
      updated_at  TEXT NOT NULL DEFAULT (datetime('now')),
      UNIQUE(tenant_id, sku)
    );

    CREATE TABLE IF NOT EXISTS price_tables (
      id          INTEGER PRIMARY KEY,
      tenant_id   INTEGER NOT NULL REFERENCES tenants(id),
      name        TEXT NOT NULL,
      active      INTEGER NOT NULL DEFAULT 1
    );

    -- Regra de preco por produto, com quebra por quantidade minima.
    CREATE TABLE IF NOT EXISTS price_rules (
      id             INTEGER PRIMARY KEY,
      price_table_id INTEGER NOT NULL REFERENCES price_tables(id),
      product_id     INTEGER NOT NULL REFERENCES products(id),
      min_qty        INTEGER NOT NULL DEFAULT 1,
      price          REAL NOT NULL
    );

    CREATE TABLE IF NOT EXISTS customers (
      id             INTEGER PRIMARY KEY,
      tenant_id      INTEGER NOT NULL REFERENCES tenants(id),
      rep_id         INTEGER REFERENCES users(id),
      name           TEXT NOT NULL,
      doc            TEXT,
      city           TEXT,
      credit_limit   REAL NOT NULL DEFAULT 0,
      price_table_id INTEGER REFERENCES price_tables(id),
      updated_at     TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS orders (
      id           INTEGER PRIMARY KEY,
      tenant_id    INTEGER NOT NULL REFERENCES tenants(id),
      client_uuid  TEXT NOT NULL,                 -- id gerado no dispositivo (idempotencia)
      customer_id  INTEGER NOT NULL REFERENCES customers(id),
      rep_id       INTEGER NOT NULL REFERENCES users(id),
      status       TEXT NOT NULL DEFAULT 'sent',  -- draft | sent | approved | invoiced
      discount_pct REAL NOT NULL DEFAULT 0,
      total        REAL NOT NULL DEFAULT 0,
      note         TEXT,
      created_at   TEXT NOT NULL DEFAULT (datetime('now')),
      synced_at    TEXT NOT NULL DEFAULT (datetime('now')),
      UNIQUE(tenant_id, client_uuid)
    );

    CREATE TABLE IF NOT EXISTS order_items (
      id          INTEGER PRIMARY KEY,
      order_id    INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
      product_id  INTEGER NOT NULL REFERENCES products(id),
      sku         TEXT NOT NULL,
      name        TEXT NOT NULL,
      qty         INTEGER NOT NULL,
      unit_price  REAL NOT NULL,                  -- preco CONGELADO no momento do pedido
      line_total  REAL NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_products_tenant  ON products(tenant_id, updated_at);
    CREATE INDEX IF NOT EXISTS idx_customers_tenant ON customers(tenant_id, updated_at);
    CREATE INDEX IF NOT EXISTS idx_orders_tenant    ON orders(tenant_id, created_at);
  `);
}

export function seed() {
  const count = db.prepare('SELECT COUNT(*) AS n FROM tenants').get().n;
  if (count > 0) {
    console.log('Seed: banco ja possui dados, pulando.');
    return;
  }

  const tenant = db.prepare("INSERT INTO tenants (name, plan) VALUES (?, 'pro')")
    .run('Distribuidora Modelo').lastInsertRowid;

  const hash = bcrypt.hashSync('123456', 8);
  const rep = db.prepare(
    "INSERT INTO users (tenant_id, name, email, password_hash, role, max_discount) VALUES (?,?,?,?,?,?)"
  ).run(tenant, 'Ana Representante', 'ana@modelo.com', hash, 'rep', 8).lastInsertRowid;
  db.prepare(
    "INSERT INTO users (tenant_id, name, email, password_hash, role, max_discount) VALUES (?,?,?,?,?,?)"
  ).run(tenant, 'Gestor Modelo', 'gestor@modelo.com', hash, 'manager', 100);

  const tabela = db.prepare("INSERT INTO price_tables (tenant_id, name) VALUES (?, 'Tabela Padrao')")
    .run(tenant).lastInsertRowid;

  const prods = [
    ['CAM-001', 'Camiseta Dry Fit', 'UN', 'Vestuario', 39.9, 500],
    ['CAM-002', 'Regata Performance', 'UN', 'Vestuario', 34.5, 320],
    ['TEN-010', 'Tenis Runner', 'PAR', 'Calcados', 199.9, 120],
    ['MEI-003', 'Meia Cano Alto', 'PCT', 'Acessorios', 24.9, 800],
    ['BON-004', 'Bone Trucker', 'UN', 'Acessorios', 49.9, 210],
  ];
  const insProd = db.prepare(
    "INSERT INTO products (tenant_id, sku, name, unit, category, base_price, stock) VALUES (?,?,?,?,?,?,?)"
  );
  const insRule = db.prepare(
    "INSERT INTO price_rules (price_table_id, product_id, min_qty, price) VALUES (?,?,?,?)"
  );
  for (const [sku, name, unit, cat, price, stock] of prods) {
    const pid = insProd.run(tenant, sku, name, unit, cat, price, stock).lastInsertRowid;
    insRule.run(tabela, pid, 1, price);          // preco base
    insRule.run(tabela, pid, 12, +(price * 0.9).toFixed(2)); // quebra: -10% a partir de 12 un
  }

  db.prepare(
    "INSERT INTO customers (tenant_id, rep_id, name, doc, city, credit_limit, price_table_id) VALUES (?,?,?,?,?,?,?)"
  ).run(tenant, rep, 'Loja Central Ltda', '12.345.678/0001-90', 'Londrina', 15000, tabela);
  db.prepare(
    "INSERT INTO customers (tenant_id, rep_id, name, doc, city, credit_limit, price_table_id) VALUES (?,?,?,?,?,?,?)"
  ).run(tenant, rep, 'Esporte & Cia', '98.765.432/0001-10', 'Maringa', 8000, tabela);

  console.log('Seed concluido. Login: ana@modelo.com / 123456');
}

// Execucao direta: `node src/db.js --seed`
if (process.argv[1] && process.argv[1].endsWith('db.js')) {
  migrate();
  if (process.argv.includes('--seed')) seed();
  console.log('Migracao concluida em', DB_PATH);
}
