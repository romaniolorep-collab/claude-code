// Motor de precos — o subsistema mais critico do dominio.
// Resolve o preco unitario correto de um item, no servidor, para que o
// preco NUNCA dependa do que o app calculou (que pode estar desatualizado).
import { db } from './db.js';

// Melhor preco para (tabela do cliente, produto, quantidade),
// respeitando a quebra por quantidade minima.
export function resolveUnitPrice({ priceTableId, productId, qty }) {
  if (priceTableId) {
    const rule = db.prepare(`
      SELECT price FROM price_rules
      WHERE price_table_id = ? AND product_id = ? AND min_qty <= ?
      ORDER BY min_qty DESC
      LIMIT 1
    `).get(priceTableId, productId, qty);
    if (rule) return rule.price;
  }
  // Fallback: preco base do produto.
  const prod = db.prepare('SELECT base_price FROM products WHERE id = ?').get(productId);
  return prod ? prod.base_price : 0;
}

// Recalcula um pedido inteiro no servidor a partir dos itens crus enviados
// pelo app: [{ product_id, qty }]. Congela unit_price e valida a alcada
// de desconto do representante.
export function priceOrder({ tenantId, customer, rep, items, discountPct = 0 }) {
  const maxDiscount = rep.max_discount ?? 0;
  if (discountPct > maxDiscount) {
    const err = new Error(
      `Desconto de ${discountPct}% acima da alcada do representante (${maxDiscount}%).`
    );
    err.statusCode = 422;
    throw err;
  }

  const getProduct = db.prepare(
    'SELECT id, sku, name FROM products WHERE id = ? AND tenant_id = ? AND active = 1'
  );

  const priced = [];
  let subtotal = 0;
  for (const item of items) {
    const p = getProduct.get(item.product_id, tenantId);
    if (!p) {
      const err = new Error(`Produto ${item.product_id} inexistente ou inativo.`);
      err.statusCode = 422;
      throw err;
    }
    const qty = Math.max(1, Math.floor(item.qty));
    const unit = resolveUnitPrice({
      priceTableId: customer.price_table_id,
      productId: p.id,
      qty,
    });
    const lineTotal = +(unit * qty).toFixed(2);
    subtotal += lineTotal;
    priced.push({
      product_id: p.id, sku: p.sku, name: p.name,
      variant: item.variant ?? null, qty, unit_price: unit, line_total: lineTotal,
    });
  }

  const total = +(subtotal * (1 - discountPct / 100)).toFixed(2);
  return { items: priced, subtotal: +subtotal.toFixed(2), discountPct, total };
}
