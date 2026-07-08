/* Footwear Pro — Service Worker (PWA)
   Estratégia deliberada para NUNCA prender o usuário numa versão velha:
   - Navegação/index: NETWORK-FIRST (online sempre pega o deploy novo; offline cai no cache)
   - Fotos de produto/logos (imutáveis por ref): CACHE-FIRST com preenchimento sob demanda
   - Nunca intercepta Supabase/Resend (POSTs e dados dinâmicos passam direto) */
const VERSION = 'fp-v2-2026-07-03';
const SHELL = ['/', '/manifest.json', '/assets/logo-white.png', '/assets/logo-reebok.png', '/assets/logo-hoka.png', '/assets/logo-brooks.svg', '/assets/logo-kipling.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(SHELL)).catch(() => {}));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  if (e.request.method !== 'GET') return;                 // POSTs (Supabase/Resend) passam direto
  if (url.origin !== location.origin) return;             // terceiros passam direto

  // Navegação e index: network-first (deploy novo vence; offline usa cache)
  if (e.request.mode === 'navigate' || url.pathname === '/' || url.pathname.endsWith('/index.html')) {
    e.respondWith(
      fetch(e.request).then(res => {
        const copy = res.clone();
        caches.open(VERSION).then(c => c.put('/', copy)).catch(() => {});
        return res;
      }).catch(() => caches.match('/'))
    );
    return;
  }

  // Assets de imagem: cache-first (fotos de produto não mudam por ref)
  if (url.pathname.startsWith('/assets/')) {
    e.respondWith(
      caches.match(e.request).then(hit => hit || fetch(e.request).then(res => {
        if (res.ok) { const copy = res.clone(); caches.open(VERSION).then(c => c.put(e.request, copy)).catch(() => {}); }
        return res;
      }))
    );
  }
});
