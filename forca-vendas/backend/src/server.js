// API do app de forca de vendas.
// Rotas principais: autenticacao, sincronizacao (pull/push) e pedidos.
import Fastify from 'fastify';
import cors from '@fastify/cors';
import { db, migrate, seed } from './db.js';
import { login, authGuard } from './auth.js';
import { priceOrder } from './pricing.js';

migrate();
seed(); // idempotente: so popula se o banco estiver vazio

const app = Fastify({ logger: { transport: undefined } });
await app.register(cors, { origin: true });

app.get('/health', async () => ({ ok: true, ts: new Date().toISOString() }));

// ---- Autenticacao ----
app.post('/auth/login', async (req, reply) => {
  const { email, password } = req.body || {};
  const result = login(email, password);
  if (!result) return reply.code(401).send({ error: 'Credenciais invalidas.' });
  return result;
});

// ---- Rotas protegidas ----
app.register(async (r) => {
  r.addHook('preHandler', authGuard);

  // SYNC PULL: tudo que o app precisa para operar offline.
  // ?since=ISO retorna apenas o que mudou desde a ultima sincronizacao.
  r.get('/sync/pull', async (req) => {
    const tenant = req.user.tenant_id;
    const since = req.query.since || '1970-01-01';
    const products = db.prepare(
      'SELECT * FROM products WHERE tenant_id = ? AND updated_at > ? ORDER BY id'
    ).all(tenant, since);
    const customers = db.prepare(
      'SELECT * FROM customers WHERE tenant_id = ? AND updated_at > ? ORDER BY id'
    ).all(tenant, since);
    const priceRules = db.prepare(`
      SELECT pr.* FROM price_rules pr
      JOIN price_tables pt ON pt.id = pr.price_table_id
      WHERE pt.tenant_id = ?
    `).all(tenant);
    return { server_time: new Date().toISOString(), products, customers, price_rules: priceRules };
  });

  // SYNC PUSH: recebe pedidos criados offline no dispositivo.
  // Idempotente por client_uuid — reenviar o mesmo pedido NAO duplica.
  // O preco e SEMPRE recalculado no servidor (fonte da verdade).
  r.post('/sync/push', async (req, reply) => {
    const tenant = req.user.tenant_id;
    const orders = Array.isArray(req.body?.orders) ? req.body.orders : [];
    const results = [];

    const findOrder = db.prepare(
      'SELECT id, status, total FROM orders WHERE tenant_id = ? AND client_uuid = ?'
    );
    const getCustomer = db.prepare(
      'SELECT * FROM customers WHERE id = ? AND tenant_id = ?'
    );

    const tx = db.transaction((order) => {
      const existing = findOrder.get(tenant, order.client_uuid);
      if (existing) {
        return { client_uuid: order.client_uuid, status: 'duplicate', order_id: existing.id, total: existing.total };
      }
      const customer = getCustomer.get(order.customer_id, tenant);
      if (!customer) {
        return { client_uuid: order.client_uuid, status: 'error', error: 'Cliente inexistente.' };
      }
      const priced = priceOrder({
        tenantId: tenant,
        customer,
        rep: req.user,
        items: order.items || [],
        discountPct: order.discount_pct || 0,
      });
      const orderId = db.prepare(`
        INSERT INTO orders (tenant_id, client_uuid, customer_id, rep_id, status, discount_pct, total, note)
        VALUES (?,?,?,?,?,?,?,?)
      `).run(tenant, order.client_uuid, customer.id, req.user.id, 'sent',
             priced.discountPct, priced.total, order.note || null).lastInsertRowid;
      const insItem = db.prepare(`
        INSERT INTO order_items (order_id, product_id, sku, name, qty, unit_price, line_total)
        VALUES (?,?,?,?,?,?,?)
      `);
      for (const it of priced.items) {
        insItem.run(orderId, it.product_id, it.sku, it.name, it.qty, it.unit_price, it.line_total);
      }
      return { client_uuid: order.client_uuid, status: 'created', order_id: orderId, total: priced.total };
    });

    for (const order of orders) {
      try {
        results.push(tx(order));
      } catch (e) {
        results.push({ client_uuid: order.client_uuid, status: 'error', error: e.message });
      }
    }
    return reply.send({ results });
  });

  // Listagens de apoio (usadas tambem pelo painel web de gestao).
  r.get('/products', async (req) =>
    db.prepare('SELECT * FROM products WHERE tenant_id = ? AND active = 1 ORDER BY name')
      .all(req.user.tenant_id));

  r.get('/customers', async (req) =>
    db.prepare('SELECT * FROM customers WHERE tenant_id = ? ORDER BY name')
      .all(req.user.tenant_id));

  r.get('/orders', async (req) => {
    const rows = db.prepare(`
      SELECT o.id, o.client_uuid, o.status, o.total, o.discount_pct, o.created_at,
             c.name AS customer_name, u.name AS rep_name
      FROM orders o
      JOIN customers c ON c.id = o.customer_id
      JOIN users u ON u.id = o.rep_id
      WHERE o.tenant_id = ?
      ORDER BY o.created_at DESC
      LIMIT 100
    `).all(req.user.tenant_id);
    return rows;
  });

  r.get('/orders/:id', async (req, reply) => {
    const order = db.prepare('SELECT * FROM orders WHERE id = ? AND tenant_id = ?')
      .get(req.params.id, req.user.tenant_id);
    if (!order) return reply.code(404).send({ error: 'Pedido nao encontrado.' });
    order.items = db.prepare('SELECT * FROM order_items WHERE order_id = ?').all(order.id);
    return order;
  });
});

const PORT = process.env.PORT || 3000;
app.listen({ port: PORT, host: '0.0.0.0' })
  .then(() => console.log(`API on http://localhost:${PORT}`))
  .catch((e) => { console.error(e); process.exit(1); });
