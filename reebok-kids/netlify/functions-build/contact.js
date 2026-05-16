"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// netlify/functions/contact.ts
var contact_exports = {};
__export(contact_exports, {
  handler: () => handler
});
module.exports = __toCommonJS(contact_exports);
var NOTION_TOKEN = process.env.NOTION_TOKEN;
var DATABASE_ID = "be28b4d8785d415c90479f8227995cda";
var handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }
  let body;
  try {
    body = JSON.parse(event.body || "{}");
  } catch {
    return { statusCode: 400, body: "Invalid JSON" };
  }
  const { name = "", email = "", company = "", message = "" } = body;
  const hoje = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
  const nota = [
    name && `Nome: ${name}`,
    email && `E-mail: ${email}`,
    company && `Empresa: ${company}`,
    message && `Mensagem: ${message}`
  ].filter(Boolean).join("\n");
  const payload = {
    parent: { database_id: DATABASE_ID },
    properties: {
      Atividade: {
        title: [{ text: { content: `Reebok Kids \u2014 Contato via site${name ? ` \xB7 ${name}` : ""}` } }]
      },
      Tipo: {
        select: { name: "REEBOK- TRA\xC7\xC3O" }
      },
      Data: {
        date: { start: hoje }
      },
      Resultado: {
        select: { name: "Conversou" }
      },
      Nota: {
        rich_text: [{ text: { content: nota } }]
      }
    }
  };
  const res = await fetch("https://api.notion.com/v1/pages", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${NOTION_TOKEN}`,
      "Content-Type": "application/json",
      "Notion-Version": "2022-06-28"
    },
    body: JSON.stringify(payload)
  });
  if (!res.ok) {
    const err = await res.text();
    console.error("Notion API error:", err);
    return { statusCode: 500, body: "Erro ao gravar no Notion" };
  }
  return {
    statusCode: 200,
    headers: { "Access-Control-Allow-Origin": "*" },
    body: JSON.stringify({ ok: true })
  };
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  handler
});
