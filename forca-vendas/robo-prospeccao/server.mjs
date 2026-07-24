// =====================================================================
// Robô de Prospecção — clone (Node puro, sem dependências)
// ---------------------------------------------------------------------
// Acha estabelecimentos (lojas) por TIPO + LOCAL usando o Google Places,
// devolve nome, endereço, telefone, site, nota e horário. Base pro rep
// encher o funil com lojas novas.
//
// COMO RODAR:
//   node server.mjs                              # modo DEMO (dados fictícios)
//   GOOGLE_PLACES_KEY=xxxxx node server.mjs      # modo REAL (Google Places)
//   abre http://localhost:4000
//
// A chave é do Google Cloud → ative "Places API" → crie uma API key.
// (cota grátis ~US$ 200/mês; ver README para custos e termos de uso)
// =====================================================================
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const KEY = process.env.GOOGLE_PLACES_KEY || '';
const PORT = process.env.PORT || 4000;
const DEMO = !KEY;

// ---- "carteira" do rep (no real, viria dos clientes do Footwear Pro) ----
// Nomes normalizados das lojas que já são suas; usado pra marcar mine=true
// e o robô esconder quem você já atende. No demo, alguns nomes de exemplo.
const MINHAS = ['dyup art. esportivos', 'newpace sports', 'amorim calcados'];
const norm = (s) => (s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
const ehMinha = (nome) => MINHAS.includes(norm(nome));

// ---- dados fictícios (modo demo, sem chave) ----
const MOCK = [
  { cidade: 'Maringá', nome: 'Calçados Passo Firme', endereco: 'Av. Brasil, 1200 - Centro, Maringá - PR', nota: 4.6, avaliacoes: 214, telefone: '(44) 3025-1180', site: 'passofirme.com.br', horario: 'Seg–Sex 09–18 · Sáb 09–13', aberto: true, mine: false, place_id: 'demo1' },
  { cidade: 'Maringá', nome: 'Sport Center Calçados', endereco: 'Av. Colombo, 5000 - Zona 7, Maringá - PR', nota: 4.2, avaliacoes: 98, telefone: '(44) 3226-4477', site: '', horario: 'Seg–Sáb 09–19', aberto: true, mine: false, place_id: 'demo2' },
  { cidade: 'Maringá', nome: 'Loja do Tênis Maringá', endereco: 'R. Néo Alves Martins, 3100 - Centro, Maringá - PR', nota: 4.8, avaliacoes: 402, telefone: '(44) 3222-9010', site: 'lojadotenis.com', horario: 'Seg–Sex 09–18', aberto: false, mine: false, place_id: 'demo3' },
  { cidade: 'Maringá', nome: 'Corrida & Cia', endereco: 'Av. Cerro Azul, 850 - Zona 2, Maringá - PR', nota: 4.1, avaliacoes: 63, telefone: '(44) 99988-2211', site: '', horario: 'Seg–Sáb 10–19', aberto: true, mine: false, place_id: 'demo4' },
  { cidade: 'Maringá', nome: 'Dyup Art. Esportivos', endereco: 'Av. Mandacaru, 1600 - Maringá - PR', nota: 4.3, avaliacoes: 127, telefone: '(44) 3011-5566', site: '', horario: 'Seg–Sáb 09–19', aberto: true, mine: true, place_id: 'demo5' },
  { cidade: 'Cianorte', nome: 'Newpace Sports', endereco: 'Av. Brasil, 800 - Centro, Cianorte - PR', nota: 4.5, avaliacoes: 150, telefone: '(44) 98459-2225', site: '', horario: 'Seg–Sáb 09–19', aberto: true, mine: true, place_id: 'demo6' },
  { cidade: 'Cianorte', nome: 'Amorim Calçados', endereco: 'R. Piquiri, 200 - Cianorte - PR', nota: 4.0, avaliacoes: 55, telefone: '', site: '', horario: 'Seg–Sex 09–18', aberto: true, mine: true, place_id: 'demo7' },
  { cidade: 'Cianorte', nome: 'Cianorte Sport Calçados', endereco: 'Av. América, 1500 - Cianorte - PR', nota: 4.4, avaliacoes: 88, telefone: '(44) 3629-1122', site: '', horario: 'Seg–Sáb 09–19', aberto: true, mine: false, place_id: 'demo8' },
  { cidade: 'Cianorte', nome: 'Tênis & Moda Cianorte', endereco: 'R. Guaporé, 340 - Cianorte - PR', nota: 3.7, avaliacoes: 29, telefone: '', site: '', horario: 'Seg–Sex 09–18', aberto: false, mine: false, place_id: 'demo9' },
];

// ---- Google Places (modo real) ----
// Uma busca por cidade (local pode vir "Maringá, Cianorte, Umuarama").
async function buscarGoogle(tipo, local) {
  const cidades = local.split(',').map((s) => s.trim()).filter(Boolean);
  if (!cidades.length) cidades.push('');
  const lotes = await Promise.all(cidades.map((cid) => buscarCidade(tipo, cid)));
  return lotes.flat();
}

async function buscarCidade(tipo, cidade) {
  const q = encodeURIComponent(`${tipo} em ${cidade}`);
  const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${q}&language=pt-BR&region=br&key=${KEY}`;
  const r = await fetch(url);
  const j = await r.json();
  if (j.status !== 'OK' && j.status !== 'ZERO_RESULTS') {
    throw new Error(j.error_message || j.status);
  }
  return (j.results || []).map((p) => ({
    cidade,
    nome: p.name,
    endereco: p.formatted_address,
    nota: p.rating ?? null,
    avaliacoes: p.user_ratings_total ?? 0,
    aberto: p.opening_hours?.open_now ?? null,
    mine: ehMinha(p.name),
    place_id: p.place_id,
    telefone: '', site: '', horario: '', // vêm em /detalhes (economiza cota)
  }));
}

async function detalhesGoogle(placeId) {
  const fields = 'formatted_phone_number,website,opening_hours,url';
  const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=${fields}&language=pt-BR&key=${KEY}`;
  const r = await fetch(url);
  const j = await r.json();
  const d = j.result || {};
  return {
    telefone: d.formatted_phone_number || '',
    site: (d.website || '').replace(/^https?:\/\//, '').replace(/\/$/, ''),
    horario: (d.opening_hours?.weekday_text || []).join(' · '),
    maps: d.url || '',
  };
}

function json(res, code, data) {
  res.writeHead(code, { 'content-type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(data));
}

const server = createServer(async (req, res) => {
  const u = new URL(req.url, `http://localhost:${PORT}`);
  try {
    if (u.pathname === '/') {
      const html = await readFile(join(__dirname, 'public', 'index.html'), 'utf8');
      res.writeHead(200, { 'content-type': 'text/html; charset=utf-8' });
      return res.end(html.replace('__DEMO__', DEMO ? 'true' : 'false'));
    }
    if (u.pathname === '/api/buscar') {
      const tipo = u.searchParams.get('tipo') || 'lojas de calçado';
      const local = u.searchParams.get('local') || '';
      if (DEMO) return json(res, 200, { demo: true, leads: MOCK });
      const leads = await buscarGoogle(tipo, local);
      return json(res, 200, { demo: false, leads });
    }
    if (u.pathname === '/api/detalhes') {
      const id = u.searchParams.get('place_id');
      if (DEMO) {
        const m = MOCK.find((x) => x.place_id === id) || {};
        return json(res, 200, { telefone: m.telefone, site: m.site, horario: m.horario });
      }
      return json(res, 200, await detalhesGoogle(id));
    }
    res.writeHead(404); res.end('não encontrado');
  } catch (e) {
    json(res, 500, { erro: e.message });
  }
});

server.listen(PORT, () => {
  console.log(`Robô de prospecção em http://localhost:${PORT}  (modo ${DEMO ? 'DEMO — dados fictícios' : 'REAL — Google Places'})`);
});
