import { useEffect, useState } from 'react';
import { api } from './api.js';

const brl = (n) => `R$ ${Number(n).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export default function App() {
  const [user, setUser] = useState(api.currentUser());
  if (!user) return <Login onLogin={setUser} />;
  return <Dashboard user={user} onLogout={() => { api.logout(); setUser(null); }} />;
}

function Brand() {
  return (
    <div className="brand">
      <div className="mark">FV</div>
      <div>
        <h1>Força de Vendas</h1>
        <span>Gestão</span>
      </div>
    </div>
  );
}

function Login({ onLogin }) {
  const [email, setEmail] = useState('gestor@modelo.com');
  const [password, setPassword] = useState('123456');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function submit(e) {
    e.preventDefault();
    setLoading(true); setError(null);
    try {
      onLogin(await api.login(email, password));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-wrap">
      <form className="login-card" onSubmit={submit}>
        <Brand />
        <label>E-mail</label>
        <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" />
        <label>Senha</label>
        <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" />
        {error && <div className="err">{error}</div>}
        <button className="btn" disabled={loading}>{loading ? 'Entrando…' : 'Entrar'}</button>
        <div className="hint">Demo: gestor@modelo.com / 123456</div>
      </form>
    </div>
  );
}

function Dashboard({ user, onLogout }) {
  const [tab, setTab] = useState('orders');
  return (
    <div className="shell">
      <header className="topbar">
        <Brand />
        <div className="spacer" />
        <span className="who"><b>{user.name}</b> · {user.role}</span>
        <button className="link-btn" onClick={onLogout}>Sair</button>
      </header>
      <nav className="tabs">
        <button className={`tab ${tab === 'orders' ? 'active' : ''}`} onClick={() => setTab('orders')}>Pedidos</button>
        <button className={`tab ${tab === 'reports' ? 'active' : ''}`} onClick={() => setTab('reports')}>Relatórios</button>
        <button className={`tab ${tab === 'visits' ? 'active' : ''}`} onClick={() => setTab('visits')}>Visitas</button>
        <button className={`tab ${tab === 'products' ? 'active' : ''}`} onClick={() => setTab('products')}>Produtos</button>
        <button className={`tab ${tab === 'customers' ? 'active' : ''}`} onClick={() => setTab('customers')}>Clientes</button>
      </nav>
      <main className="content">
        {tab === 'orders' && <OrdersView />}
        {tab === 'reports' && <ReportsView />}
        {tab === 'visits' && <VisitsView />}
        {tab === 'products' && <ProductsView />}
        {tab === 'customers' && <CustomersView />}
      </main>
    </div>
  );
}

function useAsync(fn, deps = []) {
  const [state, setState] = useState({ loading: true, data: null, error: null });
  useEffect(() => {
    let alive = true;
    fn().then((data) => alive && setState({ loading: false, data, error: null }))
        .catch((error) => alive && setState({ loading: false, data: null, error: error.message }));
    return () => { alive = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
  return state;
}

function OrdersView() {
  const { loading, data: orders, error } = useAsync(() => api.orders());
  const [selected, setSelected] = useState(null);

  if (loading) return <div className="loading">Carregando pedidos…</div>;
  if (error) return <div className="loading">{error}</div>;

  const revenue = orders.reduce((s, o) => s + o.total, 0);
  const reps = new Set(orders.map((o) => o.rep_name)).size;

  return (
    <>
      <div className="kpis">
        <div className="kpi"><div className="k-label">Pedidos</div><div className="k-value">{orders.length}</div></div>
        <div className="kpi"><div className="k-label">Faturamento</div><div className="k-value accent">{brl(revenue)}</div></div>
        <div className="kpi"><div className="k-label">Representantes ativos</div><div className="k-value">{reps}</div></div>
      </div>
      <div className="panel">
        <div className="panel-head">Pedidos recentes</div>
        <div className="table-scroll">
          <table>
            <thead>
              <tr><th>#</th><th>Cliente</th><th>Representante</th><th>Status</th><th className="num">Desc.</th><th className="num">Total</th></tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id} className="row-link" onClick={() => setSelected(o.id)}>
                  <td className="muted">{o.id}</td>
                  <td>{o.customer_name}</td>
                  <td className="muted">{o.rep_name}</td>
                  <td><span className={`pill ${o.status}`}>{o.status}</span></td>
                  <td className="num">{o.discount_pct}%</td>
                  <td className="num">{brl(o.total)}</td>
                </tr>
              ))}
              {orders.length === 0 && <tr><td colSpan="6" className="loading">Nenhum pedido ainda.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
      {selected && <OrderModal id={selected} onClose={() => setSelected(null)} />}
    </>
  );
}

function OrderModal({ id, onClose }) {
  const { loading, data: order, error } = useAsync(() => api.order(id), [id]);
  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <h2>Pedido #{id}</h2>
          <button className="link-btn" onClick={onClose}>Fechar</button>
        </div>
        <div className="modal-body">
          {loading && <div className="loading">Carregando…</div>}
          {error && <div className="loading">{error}</div>}
          {order && (
            <>
              <table>
                <thead><tr><th>Item</th><th className="num">Qtd</th><th className="num">Unit.</th><th className="num">Total</th></tr></thead>
                <tbody>
                  {order.items.map((it) => (
                    <tr key={it.id}>
                      <td>{it.name}{it.variant ? <span className="pill draft" style={{ marginLeft: 8 }}>tam {it.variant}</span> : null}<div className="muted">{it.sku}</div></td>
                      <td className="num">{it.qty}</td>
                      <td className="num">{brl(it.unit_price)}</td>
                      <td className="num">{brl(it.line_total)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="total-row"><span>Total ({order.discount_pct}% desc.)</span><span>{brl(order.total)}</span></div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function Bar({ value, max, label, right }) {
  const pct = max > 0 ? Math.min(100, (value / max) * 100) : 0;
  return (
    <div className="bar-row">
      <div className="bar-label">{label}</div>
      <div className="bar-track"><div className="bar-fill" style={{ width: `${pct}%` }} /></div>
      <div className="bar-right">{right}</div>
    </div>
  );
}

function ReportsView() {
  const { loading, data, error } = useAsync(() => Promise.all([api.reportSummary(), api.reportGoals()]));
  if (loading) return <div className="loading">Carregando relatórios…</div>;
  if (error) return <div className="loading">{error}</div>;
  const [summary, goals] = data;
  const maxRep = Math.max(1, ...summary.by_rep.map((r) => r.revenue));
  const maxProd = Math.max(1, ...summary.by_product.map((p) => p.revenue));

  return (
    <>
      <div className="kpis">
        <div className="kpi"><div className="k-label">Faturamento ({summary.period})</div><div className="k-value accent">{brl(summary.totals.revenue)}</div></div>
        <div className="kpi"><div className="k-label">Pedidos</div><div className="k-value">{summary.totals.orders}</div></div>
        <div className="kpi"><div className="k-label">Comissão total</div><div className="k-value">{brl(goals.reduce((s, g) => s + g.commission, 0))}</div></div>
      </div>

      <div className="panel" style={{ marginBottom: 18 }}>
        <div className="panel-head"><span>Metas e comissão · {summary.period}</span></div>
        <div style={{ padding: '14px 18px' }}>
          {goals.length === 0 && <div className="muted">Nenhuma meta definida para o período.</div>}
          {goals.map((g) => (
            <div key={g.rep_id} className="goal">
              <div className="goal-top">
                <b>{g.rep_name}</b>
                <span className="muted">{brl(g.achieved)} / {brl(g.target_amount)} · <span className="pill sent">comissão {brl(g.commission)}</span></span>
              </div>
              <div className="bar-track"><div className="bar-fill" style={{ width: `${Math.min(100, g.progress_pct)}%` }} /></div>
              <div className="sub">{g.progress_pct}% da meta · comissão {g.commission_pct}%</div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid-2">
        <div className="panel">
          <div className="panel-head"><span>Vendas por representante</span></div>
          <div style={{ padding: '14px 18px' }}>
            {summary.by_rep.map((r) => <Bar key={r.rep} label={r.rep} value={r.revenue} max={maxRep} right={brl(r.revenue)} />)}
          </div>
        </div>
        <div className="panel">
          <div className="panel-head"><span>Top produtos</span></div>
          <div style={{ padding: '14px 18px' }}>
            {summary.by_product.map((p) => <Bar key={p.sku} label={p.name} value={p.revenue} max={maxProd} right={brl(p.revenue)} />)}
          </div>
        </div>
      </div>
    </>
  );
}

function VisitsView() {
  const { loading, data: visits, error } = useAsync(() => api.visits());
  if (loading) return <div className="loading">Carregando visitas…</div>;
  if (error) return <div className="loading">{error}</div>;
  const fmt = (s) => new Date(s).toLocaleDateString('pt-BR');
  const statusPill = { planned: 'draft', done: 'sent', canceled: 'draft' };
  const statusLabel = { planned: 'planejada', done: 'realizada', canceled: 'cancelada' };
  return (
    <div className="panel">
      <div className="panel-head"><span>Agenda de visitas · {visits.length}</span></div>
      <div className="tscroll">
        <table>
          <thead><tr><th>Data</th><th>Cliente</th><th>Cidade</th><th>Representante</th><th>Status</th><th>Observação</th></tr></thead>
          <tbody>
            {visits.map((v) => (
              <tr key={v.id}>
                <td>{fmt(v.scheduled_at)}</td>
                <td>{v.customer_name}</td>
                <td className="muted">{v.city || '—'}</td>
                <td className="muted">{v.rep_name}</td>
                <td><span className={`pill ${statusPill[v.status]}`}>{statusLabel[v.status]}</span></td>
                <td className="muted">{v.note || '—'}</td>
              </tr>
            ))}
            {visits.length === 0 && <tr><td colSpan="6" className="loading">Nenhuma visita agendada.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ProductsView() {
  const [reload, setReload] = useState(0);
  const { loading, data: products, error } = useAsync(() => api.products(), [reload]);
  const [editing, setEditing] = useState(null); // null | 'new' | product
  if (loading) return <div className="loading">Carregando produtos…</div>;
  if (error) return <div className="loading">{error}</div>;
  return (
    <div className="panel">
      <div className="panel-head">
        <span>Catálogo · {products.length} produtos</span>
        <button className="btn-add" onClick={() => setEditing('new')}>+ Novo produto</button>
      </div>
      <div className="table-scroll">
        <table>
          <thead><tr><th>SKU</th><th>Produto</th><th>Categoria</th><th>Grade</th><th className="num">Preço base</th><th className="num">Estoque</th></tr></thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="row-link" onClick={() => setEditing(p)}>
                <td className="muted">{p.sku}</td>
                <td>{p.name}</td>
                <td className="muted">{p.category || '—'}</td>
                <td className="muted">{p.variants && p.variants.length ? p.variants.map((v) => v.label).join(' · ') : '—'}</td>
                <td className="num">{brl(p.base_price)}</td>
                <td className="num">{p.stock} {p.unit}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {editing && (
        <ProductForm
          item={editing === 'new' ? null : editing}
          onClose={() => setEditing(null)}
          onSaved={() => { setEditing(null); setReload((x) => x + 1); }}
        />
      )}
    </div>
  );
}

function ProductForm({ item, onClose, onSaved }) {
  const [f, setF] = useState({
    sku: item?.sku || '', name: item?.name || '', unit: item?.unit || 'UN',
    category: item?.category || '', base_price: item?.base_price ?? '', stock: item?.stock ?? '',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  async function save() {
    setSaving(true); setError(null);
    try {
      const body = { ...f, base_price: Number(f.base_price) || 0, stock: Number(f.stock) || 0 };
      if (item) await api.updateProduct(item.id, body);
      else await api.createProduct(body);
      onSaved();
    } catch (e) { setError(e.message); setSaving(false); }
  }

  return (
    <FormModal title={item ? `Editar ${item.sku}` : 'Novo produto'} onClose={onClose}>
      <div className="form-grid">
        <div className="field-full">
          <label>SKU</label>
          <input value={f.sku} onChange={set('sku')} disabled={!!item} placeholder="CAM-001" />
        </div>
        <div className="field-full">
          <label>Nome</label>
          <input value={f.name} onChange={set('name')} />
        </div>
        <div><label>Unidade</label><input value={f.unit} onChange={set('unit')} /></div>
        <div><label>Categoria</label><input value={f.category} onChange={set('category')} /></div>
        <div><label>Preço base (R$)</label><input type="number" step="0.01" value={f.base_price} onChange={set('base_price')} /></div>
        <div><label>Estoque</label><input type="number" value={f.stock} onChange={set('stock')} /></div>
      </div>
      {error && <div className="err">{error}</div>}
      <div className="form-actions">
        <button className="btn-ghost" onClick={onClose}>Cancelar</button>
        <button className="btn-primary" onClick={save} disabled={saving}>{saving ? 'Salvando…' : 'Salvar'}</button>
      </div>
    </FormModal>
  );
}

function CustomersView() {
  const [reload, setReload] = useState(0);
  const { loading, data: customers, error } = useAsync(() => api.customers(), [reload]);
  const [editing, setEditing] = useState(null);
  if (loading) return <div className="loading">Carregando clientes…</div>;
  if (error) return <div className="loading">{error}</div>;
  return (
    <div className="panel">
      <div className="panel-head">
        <span>Carteira · {customers.length} clientes</span>
        <button className="btn-add" onClick={() => setEditing('new')}>+ Novo cliente</button>
      </div>
      <div className="table-scroll">
        <table>
          <thead><tr><th>Cliente</th><th>Cidade</th><th className="num">Limite de crédito</th></tr></thead>
          <tbody>
            {customers.map((c) => (
              <tr key={c.id} className="row-link" onClick={() => setEditing(c)}>
                <td>{c.name}<div className="muted">{c.doc || ''}</div></td>
                <td className="muted">{c.city || '—'}</td>
                <td className="num">{brl(c.credit_limit)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {editing && (
        <CustomerForm
          item={editing === 'new' ? null : editing}
          onClose={() => setEditing(null)}
          onSaved={() => { setEditing(null); setReload((x) => x + 1); }}
        />
      )}
    </div>
  );
}

function CustomerForm({ item, onClose, onSaved }) {
  const [f, setF] = useState({
    name: item?.name || '', doc: item?.doc || '', city: item?.city || '',
    credit_limit: item?.credit_limit ?? '',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  async function save() {
    setSaving(true); setError(null);
    try {
      const body = { ...f, credit_limit: Number(f.credit_limit) || 0 };
      if (item) await api.updateCustomer(item.id, body);
      else await api.createCustomer(body);
      onSaved();
    } catch (e) { setError(e.message); setSaving(false); }
  }

  return (
    <FormModal title={item ? `Editar ${item.name}` : 'Novo cliente'} onClose={onClose}>
      <div className="form-grid">
        <div className="field-full"><label>Nome / Razão social</label><input value={f.name} onChange={set('name')} /></div>
        <div><label>CNPJ / CPF</label><input value={f.doc} onChange={set('doc')} /></div>
        <div><label>Cidade</label><input value={f.city} onChange={set('city')} /></div>
        <div className="field-full"><label>Limite de crédito (R$)</label><input type="number" step="0.01" value={f.credit_limit} onChange={set('credit_limit')} /></div>
      </div>
      {error && <div className="err">{error}</div>}
      <div className="form-actions">
        <button className="btn-ghost" onClick={onClose}>Cancelar</button>
        <button className="btn-primary" onClick={save} disabled={saving}>{saving ? 'Salvando…' : 'Salvar'}</button>
      </div>
    </FormModal>
  );
}

function FormModal({ title, children, onClose }) {
  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <h2>{title}</h2>
          <button className="link-btn" onClick={onClose}>Fechar</button>
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
}
