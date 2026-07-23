// API do app de forca de vendas.
// Rotas principais: autenticacao, sincronizacao (pull/push) e pedidos.
import Fastify from 'fastify';
import cors from '@fastify/cors';
import { db, migrate, seed } from './db.js';
import { login, authGuard } from './auth.js';
import { priceOrder } from './pricing.js';
import { salesSummary, goalsProgress, currentPeriod } from './reports.js';

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

  // ---- Escrita (apenas gestor/admin) ----
  // Usada pelo painel web. Toda alteracao mexe em updated_at, entao a
  // proxima sincronizacao do app ja baixa a mudanca.
  const requireManager = (req, reply, done) => {
    if (req.user.role !== 'manager' && req.user.role !== 'admin') {
      reply.code(403).send({ error: 'Apenas gestores podem alterar cadastros.' });
      return;
    }
    done();
  };

  r.post('/products', { preHandler: requireManager }, async (req, reply) => {
    const { sku, name, unit, category, base_price, stock } = req.body || {};
    if (!sku || !name) return reply.code(422).send({ error: 'SKU e nome sao obrigatorios.' });
    try {
      const id = db.prepare(`
        INSERT INTO products (tenant_id, sku, name, unit, category, base_price, stock)
        VALUES (?,?,?,?,?,?,?)
      `).run(req.user.tenant_id, sku, name, unit || 'UN', category || null,
             Number(base_price) || 0, Number(stock) || 0).lastInsertRowid;
      return db.prepare('SELECT * FROM products WHERE id = ?').get(id);
    } catch (e) {
      return reply.code(422).send({ error: 'SKU ja existe para este fornecedor.' });
    }
  });

  r.put('/products/:id', { preHandler: requireManager }, async (req, reply) => {
    const cur = db.prepare('SELECT * FROM products WHERE id = ? AND tenant_id = ?')
      .get(req.params.id, req.user.tenant_id);
    if (!cur) return reply.code(404).send({ error: 'Produto nao encontrado.' });
    const b = req.body || {};
    db.prepare(`
      UPDATE products SET name=?, unit=?, category=?, base_price=?, stock=?, active=?,
        updated_at=datetime('now') WHERE id=?
    `).run(b.name ?? cur.name, b.unit ?? cur.unit, b.category ?? cur.category,
           b.base_price ?? cur.base_price, b.stock ?? cur.stock,
           b.active ?? cur.active, cur.id);
    return db.prepare('SELECT * FROM products WHERE id = ?').get(cur.id);
  });

  r.post('/customers', { preHandler: requireManager }, async (req, reply) => {
    const { name, doc, city, credit_limit, price_table_id } = req.body || {};
    if (!name) return reply.code(422).send({ error: 'Nome e obrigatorio.' });
    const table = price_table_id ||
      db.prepare('SELECT id FROM price_tables WHERE tenant_id = ? AND active = 1 LIMIT 1')
        .get(req.user.tenant_id)?.id;
    const id = db.prepare(`
      INSERT INTO customers (tenant_id, name, doc, city, credit_limit, price_table_id)
      VALUES (?,?,?,?,?,?)
    `).run(req.user.tenant_id, name, doc || null, city || null,
           Number(credit_limit) || 0, table).lastInsertRowid;
    return db.prepare('SELECT * FROM customers WHERE id = ?').get(id);
  });

  r.put('/customers/:id', { preHandler: requireManager }, async (req, reply) => {
    const cur = db.prepare('SELECT * FROM customers WHERE id = ? AND tenant_id = ?')
      .get(req.params.id, req.user.tenant_id);
    if (!cur) return reply.code(404).send({ error: 'Cliente nao encontrado.' });
    const b = req.body || {};
    db.prepare(`
      UPDATE customers SET name=?, doc=?, city=?, credit_limit=?,
        updated_at=datetime('now') WHERE id=?
    `).run(b.name ?? cur.name, b.doc ?? cur.doc, b.city ?? cur.city,
           b.credit_limit ?? cur.credit_limit, cur.id);
    return db.prepare('SELECT * FROM customers WHERE id = ?').get(cur.id);
  });

  // ---- Relatorios, metas e comissao (apenas gestor/admin) ----
  r.get('/reports/summary', { preHandler: requireManager }, async (req) =>
    salesSummary(req.user.tenant_id, req.query.period || currentPeriod()));

  r.get('/reports/goals', { preHandler: requireManager }, async (req) =>
    goalsProgress(req.user.tenant_id, req.query.period || currentPeriod()));

  r.post('/goals', { preHandler: requireManager }, async (req, reply) => {
    const { rep_id, period, target_amount, commission_pct } = req.body || {};
    if (!rep_id || !period) return reply.code(422).send({ error: 'rep_id e period sao obrigatorios.' });
    db.prepare(`
      INSERT INTO goals (tenant_id, rep_id, period, target_amount, commission_pct)
      VALUES (?,?,?,?,?)
      ON CONFLICT(tenant_id, rep_id, period)
      DO UPDATE SET target_amount = excluded.target_amount, commission_pct = excluded.commission_pct
    `).run(req.user.tenant_id, rep_id, period, Number(target_amount) || 0, Number(commission_pct) || 0);
    return { ok: true };
  });

  // ---- CRM de campo: visitas ----
  // Representante ve as proprias; gestor ve todas.
  r.get('/visits', async (req) => {
    const isManager = req.user.role === 'manager' || req.user.role === 'admin';
    const sql = `
      SELECT v.*, c.name AS customer_name, c.city, u.name AS rep_name
      FROM visits v
      JOIN customers c ON c.id = v.customer_id
      JOIN users u ON u.id = v.rep_id
      WHERE v.tenant_id = ? ${isManager ? '' : 'AND v.rep_id = ?'}
      ORDER BY v.scheduled_at`;
    return isManager
      ? db.prepare(sql).all(req.user.tenant_id)
      : db.prepare(sql).all(req.user.tenant_id, req.user.id);
  });

  r.post('/visits', async (req, reply) => {
    const { customer_id, scheduled_at, note } = req.body || {};
    if (!customer_id || !scheduled_at) {
      return reply.code(422).send({ error: 'customer_id e scheduled_at sao obrigatorios.' });
    }
    const id = db.prepare(
      'INSERT INTO visits (tenant_id, customer_id, rep_id, scheduled_at, note) VALUES (?,?,?,?,?)'
    ).run(req.user.tenant_id, customer_id, req.user.id, scheduled_at, note || null).lastInsertRowid;
    return db.prepare('SELECT * FROM visits WHERE id = ?').get(id);
  });

  r.put('/visits/:id', async (req, reply) => {
    const cur = db.prepare('SELECT * FROM visits WHERE id = ? AND tenant_id = ?')
      .get(req.params.id, req.user.tenant_id);
    if (!cur) return reply.code(404).send({ error: 'Visita nao encontrada.' });
    const b = req.body || {};
    db.prepare(`
      UPDATE visits SET status=?, note=?, scheduled_at=?, updated_at=datetime('now') WHERE id=?
    `).run(b.status ?? cur.status, b.note ?? cur.note, b.scheduled_at ?? cur.scheduled_at, cur.id);
    return db.prepare('SELECT * FROM visits WHERE id = ?').get(cur.id);
  });

  // Historico do cliente: pedidos + visitas (usado no CRM).
  r.get('/customers/:id/history', async (req, reply) => {
    const c = db.prepare('SELECT * FROM customers WHERE id = ? AND tenant_id = ?')
      .get(req.params.id, req.user.tenant_id);
    if (!c) return reply.code(404).send({ error: 'Cliente nao encontrado.' });
    const orders = db.prepare(
      'SELECT id, status, total, created_at FROM orders WHERE tenant_id = ? AND customer_id = ? ORDER BY created_at DESC LIMIT 20'
    ).all(req.user.tenant_id, c.id);
    const visits = db.prepare(
      'SELECT id, scheduled_at, status, note FROM visits WHERE tenant_id = ? AND customer_id = ? ORDER BY scheduled_at DESC LIMIT 20'
    ).all(req.user.tenant_id, c.id);
    return { customer: c, orders, visits };
  });

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
