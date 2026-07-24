// =====================================================================
// enriquecer_contatos.mjs — recupera CONTATO das lojas a partir do CNPJ
// ---------------------------------------------------------------------
// Percorre a tabela `clientes` do Supabase, consulta o CNPJ na base
// pública da Receita (via BrasilAPI) e preenche telefone, e-mail,
// endereço e CEP nas lojas onde esses campos estão VAZIOS.
//
// SEGURO POR PADRÃO:
//   • roda em modo SIMULAÇÃO (não grava nada) — mostra o que faria.
//   • só grava de verdade com a flag  --apply
//   • NUNCA sobrescreve dado existente — só preenche campo vazio.
//
// PRÉ-REQUISITOS:
//   npm i @supabase/supabase-js
//   Node 18+ (tem fetch nativo)
//
// COMO RODAR (no SEU ambiente, onde a internet alcança a Receita):
//   export SUPABASE_URL="https://lyhvueueaaepvjrsuljr.supabase.co"
//   export SUPABASE_SERVICE_KEY="...service_role..."   # Supabase → Settings → API
//   node enriquecer_contatos.mjs            # simula (recomendado 1o)
//   node enriquecer_contatos.mjs --apply    # grava os campos vazios
//
// OBS honesta: o telefone da Receita é um PONTO DE PARTIDA — pode ser
// fixo, do contador ou antigo. Confirme os números das lojas de maior
// valor antes de disparar WhatsApp. A rotina marca cada telefone
// recuperado para você revisar.
// =====================================================================
import { createClient } from '@supabase/supabase-js';

const APPLY = process.argv.includes('--apply');
const URL = process.env.SUPABASE_URL;
const KEY = process.env.SUPABASE_SERVICE_KEY;
if (!URL || !KEY) {
  console.error('Defina SUPABASE_URL e SUPABASE_SERVICE_KEY nas variáveis de ambiente.');
  process.exit(1);
}
const db = createClient(URL, KEY, { auth: { persistSession: false } });

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const digits = (s) => (s || '').replace(/\D/g, '');

// Consulta 1 CNPJ na BrasilAPI (com 1 retry em caso de limite 429).
async function lookup(cnpj, tent = 0) {
  const res = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${cnpj}`);
  if (res.status === 429 && tent < 2) { await sleep(3000); return lookup(cnpj, tent + 1); }
  if (!res.ok) return null; // 404 = CNPJ não encontrado
  const j = await res.json();
  return {
    tel: digits(j.ddd_telefone_1) || digits(j.ddd_telefone_2) || '',
    email: (j.email || '').trim().toLowerCase(),
    cidade: j.municipio || '',
    uf: j.uf || '',
    endereco: [j.descricao_tipo_de_logradouro, j.logradouro, j.numero, j.bairro]
      .filter(Boolean).join(' ').trim(),
    cep: digits(j.cep),
  };
}

// 1) puxa todas as lojas e separa as que têm algum contato faltando
const { data: todas, error } = await db
  .from('clientes')
  .select('id, razao, cnpj, tel, email, endereco, cep, cidade');
if (error) { console.error('Erro ao ler clientes:', error.message); process.exit(1); }

const vazio = (v) => !(v || '').toString().trim() || v === '—';
const alvo = todas.filter((c) => vazio(c.tel) || vazio(c.email));

console.log(`${todas.length} lojas na base · ${alvo.length} com contato faltando`);
console.log(`Modo: ${APPLY ? '🟢 GRAVAÇÃO (--apply)' : '🟡 SIMULAÇÃO (use --apply para gravar)'}\n`);

let okTel = 0, okMail = 0, okEnd = 0, semCnpj = 0, naoAchou = 0, i = 0;

for (const c of alvo) {
  i++;
  const cnpj = digits(c.cnpj);
  if (cnpj.length !== 14) { semCnpj++; continue; } // ex.: CNPJ malformado (Taysa)

  let info = null;
  try { info = await lookup(cnpj); } catch { /* falha de rede — segue */ }
  await sleep(400); // respeita o limite da API pública
  if (!info) { naoAchou++; continue; }

  const patch = {};
  if (vazio(c.tel) && info.tel) { patch.tel = info.tel; okTel++; }
  if (vazio(c.email) && info.email) { patch.email = info.email; okMail++; }
  if (vazio(c.endereco) && info.endereco) { patch.endereco = info.endereco; okEnd++; }
  if (vazio(c.cep) && info.cep) { patch.cep = info.cep; }
  if (Object.keys(patch).length === 0) continue;

  console.log(
    `[${i}/${alvo.length}] ${c.razao.slice(0, 34).padEnd(34)} ` +
    `${patch.tel ? '📞 ' + patch.tel : '        '} ${patch.email ? '✉ ' + patch.email : ''}`
  );

  if (APPLY) {
    const { error: e2 } = await db.from('clientes')
      .update({ ...patch, updated_at: new Date().toISOString() })
      .eq('id', c.id);
    if (e2) console.error('   ⚠ erro ao gravar:', e2.message);
  }
}

console.log(`\n─── Resumo ───────────────────────────────`);
console.log(`Telefones recuperados : ${okTel}`);
console.log(`E-mails recuperados   : ${okMail}`);
console.log(`Endereços preenchidos : ${okEnd}`);
console.log(`CNPJ inválido (pulado): ${semCnpj}`);
console.log(`Não achados na Receita: ${naoAchou}`);
console.log(APPLY
  ? '\n✓ Gravado no Supabase (apenas campos que estavam vazios).'
  : '\n🟡 Nada foi gravado. Rode com  --apply  para preencher de verdade.');
