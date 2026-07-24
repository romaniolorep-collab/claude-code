// Relatorios de venda, metas e comissao — visao do gestor.
import { db } from './db.js';

const round = (n) => Math.round(n * 100) / 100;
export const currentPeriod = () => new Date().toISOString().slice(0, 7); // YYYY-MM

// Resumo de vendas no periodo (YYYY-MM) ou geral se period=null.
export function salesSummary(tenantId, period) {
  const filter = period ? "AND strftime('%Y-%m', o.created_at) = ?" : '';
  const args = period ? [tenantId, period] : [tenantId];

  const totals = db.prepare(
    `SELECT COUNT(*) AS orders, COALESCE(SUM(total), 0) AS revenue
     FROM orders o WHERE o.tenant_id = ? ${filter}`
  ).get(...args);

  const byRep = db.prepare(
    `SELECT u.name AS rep, COUNT(*) AS orders, COALESCE(SUM(o.total), 0) AS revenue
     FROM orders o JOIN users u ON u.id = o.rep_id
     WHERE o.tenant_id = ? ${filter}
     GROUP BY o.rep_id ORDER BY revenue DESC`
  ).all(...args);

  const byProduct = db.prepare(
    `SELECT oi.name, oi.sku, SUM(oi.qty) AS qty, COALESCE(SUM(oi.line_total), 0) AS revenue
     FROM order_items oi JOIN orders o ON o.id = oi.order_id
     WHERE o.tenant_id = ? ${filter}
     GROUP BY oi.sku ORDER BY revenue DESC LIMIT 10`
  ).all(...args);

  return {
    period: period || 'all',
    totals: { orders: totals.orders, revenue: round(totals.revenue) },
    by_rep: byRep.map((r) => ({ ...r, revenue: round(r.revenue) })),
    by_product: byProduct.map((r) => ({ ...r, revenue: round(r.revenue) })),
  };
}

// Progresso das metas e comissao apurada no periodo.
export function goalsProgress(tenantId, period) {
  const p = period || currentPeriod();
  const goals = db.prepare(
    `SELECT g.*, u.name AS rep_name FROM goals g
     JOIN users u ON u.id = g.rep_id
     WHERE g.tenant_id = ? AND g.period = ?`
  ).all(tenantId, p);

  return goals.map((g) => {
    const achieved = db.prepare(
      `SELECT COALESCE(SUM(total), 0) AS v FROM orders
       WHERE tenant_id = ? AND rep_id = ? AND strftime('%Y-%m', created_at) = ?`
    ).get(tenantId, g.rep_id, p).v;
    return {
      rep_id: g.rep_id,
      rep_name: g.rep_name,
      period: g.period,
      target_amount: round(g.target_amount),
      achieved: round(achieved),
      progress_pct: g.target_amount > 0 ? round((achieved / g.target_amount) * 100) : 0,
      commission_pct: g.commission_pct,
      commission: round(achieved * g.commission_pct / 100),
    };
  });
}
