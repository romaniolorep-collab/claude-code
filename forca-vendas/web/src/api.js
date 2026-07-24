// Cliente da API do painel de gestao. Reaproveita exatamente os mesmos
// endpoints do app mobile — o backend nao sabe (nem precisa saber) quem chama.
const BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';

function authHeaders() {
  const token = localStorage.getItem('token');
  return token ? { authorization: `Bearer ${token}` } : {};
}

async function req(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: {
      'content-type': 'application/json',
      ...authHeaders(),
      ...(options.headers || {}),
    },
  });
  if (res.status === 401) {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    throw new Error('Sessao expirada.');
  }
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Erro ${res.status}`);
  }
  return res.json();
}

export const api = {
  async login(email, password) {
    const data = await req('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    return data.user;
  },
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
  currentUser() {
    const s = localStorage.getItem('user');
    return s ? JSON.parse(s) : null;
  },
  orders: () => req('/orders'),
  order: (id) => req(`/orders/${id}`),
  products: () => req('/products'),
  customers: () => req('/customers'),
  createProduct: (body) => req('/products', { method: 'POST', body: JSON.stringify(body) }),
  updateProduct: (id, body) => req(`/products/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  createCustomer: (body) => req('/customers', { method: 'POST', body: JSON.stringify(body) }),
  updateCustomer: (id, body) => req(`/customers/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  reportSummary: (period) => req(`/reports/summary${period ? `?period=${period}` : ''}`),
  reportGoals: (period) => req(`/reports/goals${period ? `?period=${period}` : ''}`),
  visits: () => req('/visits'),
};
