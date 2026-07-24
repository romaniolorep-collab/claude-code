// Analise de gestao para o representante: desempenho por marca e por loja,
// funil de novos lojistas e comparacao com o periodo anterior.
import { db } from './db.js';

const round = (n) => Math.round(n * 100) / 100;
export const currentPeriod = () => new Date().toISOString().slice(0, 7); // YYYY-MM

export function prevPeriod(period) {
  const [y, m] = period.split('-').map(Number);
  const d = new Date(Date.UTC(y, m - 2, 1)); // m-2 = mes anterior (0-based)
  return d.toISOString().slice(0, 7);
}

function revByBrand(tenantId, period) {
  const rows = db.prepare(`
    SELECT p.brand AS brand, COALESCE(SUM(oi.line_total), 0) AS rev
    FROM order_items oi
    JOIN orders o   ON o.id = oi.order_id
    JOIN products p ON p.id = oi.product_id
    WHERE o.tenant_id = ? AND strftime('%Y-%m', o.created_at) = ?
    GROUP BY p.brand
  `).all(tenantId, period);
  const map = {};
  for (const r of rows) map[r.brand || '—'] = r.rev;
  return map;
}

// Faturamento por marca no periodo, com % de participacao e tendencia vs
// o mes anterior.
export function byBrand(tenantId, period) {
  const cur = revByBrand(tenantId, period);
  const prev = revByBrand(tenantId, prevPeriod(period));
  const total = Object.values(cur).reduce((s, v) => s + v, 0) || 1;
  return Object.entries(cur)
    .map(([brand, rev]) => {
      const p = prev[brand] || 0;
      return {
        brand,
        revenue: round(rev),
        share: round((rev / total) * 100),
        prev: round(p),
        delta_pct: p > 0 ? round(((rev - p) / p) * 100) : null,
        trend: p === 0 ? 'novo' : rev >= p ? 'up' : 'down',
      };
    })
    .sort((a, b) => b.revenue - a.revenue);
}

function revByStore(tenantId, period) {
  const rows = db.prepare(`
    SELECT c.id, c.name, c.city, COALESCE(SUM(o.total), 0) AS rev
    FROM orders o
    JOIN customers c ON c.id = o.customer_id
    WHERE o.tenant_id = ? AND strftime('%Y-%m', o.created_at) = ?
    GROUP BY o.customer_id
  `).all(tenantId, period);
  const map = {};
  for (const r of rows) map[r.id] = r;
  return map;
}

// Faturamento por loja, com tendencia. Sinaliza quem esta comprando menos.
export function byStore(tenantId, period) {
  const cur = revByStore(tenantId, period);
  const prev = revByStore(tenantId, prevPeriod(period));
  return Object.values(cur)
    .map((r) => {
      const p = prev[r.id]?.rev || 0;
      return {
        name: r.name, city: r.city,
        revenue: round(r.rev),
        prev: round(p),
        trend: p === 0 ? 'novo' : r.rev >= p * 1.02 ? 'up' : r.rev <= p * 0.98 ? 'down' : 'flat',
      };
    })
    .sort((a, b) => b.revenue - a.revenue);
}

// Funil de novos lojistas: contagem por estagio, com conversao entre etapas.
export function funnel(tenantId) {
  const order = ['lead', 'contato', 'primeira_compra', 'ativo'];
  const rows = db.prepare(
    "SELECT stage, COUNT(*) n FROM leads WHERE tenant_id = ? AND stage != 'perdido' GROUP BY stage"
  ).all(tenantId);
  const count = {};
  for (const r of rows) count[r.stage] = r.n;
  let prev = null;
  return order.map((stage) => {
    const n = count[stage] || 0;
    const conv = prev && prev > 0 ? round((n / prev) * 100) : null;
    prev = n;
    return { stage, count: n, conversion_pct: conv };
  });
}

// KPIs do topo do painel.
export function overview(tenantId, period) {
  const totals = db.prepare(
    "SELECT COUNT(*) orders, COALESCE(SUM(total),0) rev FROM orders WHERE tenant_id=? AND strftime('%Y-%m',created_at)=?"
  ).get(tenantId, period);
  const prevRev = db.prepare(
    "SELECT COALESCE(SUM(total),0) rev FROM orders WHERE tenant_id=? AND strftime('%Y-%m',created_at)=?"
  ).get(tenantId, prevPeriod(period)).rev;
  const goal = db.prepare(
    'SELECT SUM(target_amount) t, AVG(commission_pct) c FROM goals WHERE tenant_id=? AND period=?'
  ).get(tenantId, period);
  const target = goal?.t || 0;
  const commissionPct = goal?.c || 0;
  const newStores = db.prepare(
    "SELECT COUNT(*) n FROM leads WHERE tenant_id=? AND stage='ativo' AND strftime('%Y-%m',updated_at)=?"
  ).get(tenantId, period).n;
  return {
    period,
    revenue: round(totals.rev),
    orders: totals.orders,
    revenue_prev: round(prevRev),
    revenue_delta_pct: prevRev > 0 ? round(((totals.rev - prevRev) / prevRev) * 100) : null,
    goal_target: round(target),
    goal_pct: target > 0 ? round((totals.rev / target) * 100) : null,
    goal_missing: round(Math.max(0, target - totals.rev)),
    commission: round(totals.rev * commissionPct / 100),
    new_stores: newStores,
  };
}
