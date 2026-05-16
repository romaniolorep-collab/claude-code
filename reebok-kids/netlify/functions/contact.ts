import type { Handler } from '@netlify/functions';

const NOTION_TOKEN = process.env.NOTION_TOKEN!;
// Database ID: ATIVIDADES em iBrand HUB
const DATABASE_ID = 'be28b4d8785d415c90479f8227995cda';

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  let body: { name?: string; email?: string; company?: string; message?: string };
  try {
    body = JSON.parse(event.body || '{}');
  } catch {
    return { statusCode: 400, body: 'Invalid JSON' };
  }

  const { name = '', email = '', company = '', message = '' } = body;

  const hoje = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

  const nota = [
    name    && `Nome: ${name}`,
    email   && `E-mail: ${email}`,
    company && `Empresa: ${company}`,
    message && `Mensagem: ${message}`,
  ].filter(Boolean).join('\n');

  const payload = {
    parent: { database_id: DATABASE_ID },
    properties: {
      Atividade: {
        title: [{ text: { content: `Reebok Kids — Contato via site${name ? ` · ${name}` : ''}` } }],
      },
      Tipo: {
        select: { name: 'REEBOK- TRAÇÃO' },
      },
      Data: {
        date: { start: hoje },
      },
      Resultado: {
        select: { name: 'Conversou' },
      },
      Nota: {
        rich_text: [{ text: { content: nota } }],
      },
    },
  };

  const res = await fetch('https://api.notion.com/v1/pages', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${NOTION_TOKEN}`,
      'Content-Type': 'application/json',
      'Notion-Version': '2022-06-28',
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const err = await res.text();
    console.error('Notion API error:', err);
    return { statusCode: 500, body: 'Erro ao gravar no Notion' };
  }

  return {
    statusCode: 200,
    headers: { 'Access-Control-Allow-Origin': '*' },
    body: JSON.stringify({ ok: true }),
  };
};
