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
        <button className={`tab ${tab === 'products' ? 'active' : ''}`} onClick={() => setTab('products')}>Produtos</button>
        <button className={`tab ${tab === 'customers' ? 'active' : ''}`} onClick={() => setTab('customers')}>Clientes</button>
      </nav>
      <main className="content">
        {tab === 'orders' && <OrdersView />}
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
                      <td>{it.name}<div className="muted">{it.sku}</div></td>
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
          <thead><tr><th>SKU</th><th>Produto</th><th>Categoria</th><th className="num">Preço base</th><th className="num">Estoque</th></tr></thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="row-link" onClick={() => setEditing(p)}>
                <td className="muted">{p.sku}</td>
                <td>{p.name}</td>
                <td className="muted">{p.category || '—'}</td>
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
