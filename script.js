/* ── NAV scroll ── */
window.addEventListener('scroll', () => {
  const nav = document.getElementById('navbar');
  if (nav) nav.classList.toggle('scrolled', window.scrollY > 20);
});

/* ── Mobile menu ── */
function toggleMenu() {
  const menu = document.getElementById('mob-menu');
  const btn  = document.getElementById('mob-btn');
  const isOpen = menu.classList.toggle('open');
  if (btn) btn.setAttribute('aria-expanded', isOpen);
}
// Fecha o menu ao clicar em qualquer link dentro dele
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('#mob-menu a').forEach(link => {
    link.addEventListener('click', () => {
      document.getElementById('mob-menu').classList.remove('open');
      const btn = document.getElementById('mob-btn');
      if (btn) btn.setAttribute('aria-expanded', 'false');
    });
  });
});

/* ── Cart state ── */
let cart = JSON.parse(localStorage.getItem('antigravity_cart') || '[]');
function saveCart() { localStorage.setItem('antigravity_cart', JSON.stringify(cart)); }
function openCart() {
  document.getElementById('cart-overlay').classList.add('open');
  document.getElementById('cart-sidebar').classList.add('open');
  updateCart();
}
function closeCart() {
  document.getElementById('cart-overlay').classList.remove('open');
  document.getElementById('cart-sidebar').classList.remove('open');
}
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeCart(); });

function addToCart(name, price, btn) {
  const ex = cart.find(i => i.name === name);
  ex ? ex.qty++ : cart.push({ name, price, qty: 1 });
  saveCart(); updateCart();
  showToast('<span class="hi">' + name + '</span> adicionado à sacola');
  if (btn) { const orig = btn.textContent; btn.textContent = '✓'; setTimeout(() => btn.textContent = orig, 1200); }
}

function changeQty(name, d) {
  const item = cart.find(i => i.name === name);
  if (!item) return;
  item.qty += d;
  if (item.qty <= 0) cart = cart.filter(i => i.name !== name);
  saveCart(); updateCart();
}

function updateCart() {
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const count = cart.reduce((s, i) => s + i.qty, 0);
  const badge = document.getElementById('cart-badge');
  if (badge) { badge.textContent = count; badge.style.display = count > 0 ? 'flex' : 'none'; }
  const sbCount = document.getElementById('cart-count-sb');
  if (sbCount) sbCount.textContent = count;
  const body = document.getElementById('cart-body');
  const emptyEl = document.getElementById('cart-empty');
  const ftr = document.getElementById('cart-ftr');
  if (!body) return;
  if (cart.length === 0) {
    body.innerHTML = '';
    if (emptyEl) { body.appendChild(emptyEl); emptyEl.style.display = 'block'; }
    if (ftr) ftr.style.display = 'none';
    return;
  }
  if (ftr) ftr.style.display = 'block';
  const totalVal = document.getElementById('cart-total-val');
  if (totalVal) totalVal.textContent = 'R$ ' + total.toLocaleString('pt-BR');
  body.innerHTML = '';
  cart.forEach(item => {
    let hash = 0; for (let i = 0; i < item.name.length; i++) hash = item.name.charCodeAt(i) + ((hash << 5) - hash);
    const bgClass = ['pv-1','pv-2','pv-3','pv-4','pv-5','pv-6','pv-7','pv-8'][Math.abs(hash) % 8];
    const el = document.createElement('div'); el.className = 'c-item';
    el.innerHTML = '<div class="c-item-vis ' + bgClass + '"><div class="c-item-ps"></div></div>' +
      '<div class="c-item-info">' +
        '<p class="c-item-name">' + item.name + '</p>' +
        '<p class="c-item-var">Tamanho: M · Cor: Padrão</p>' +
        '<p class="c-item-price">R$ ' + (item.price * item.qty).toLocaleString('pt-BR') + '</p>' +
        '<div class="qty-row">' +
          '<button class="qty-btn" onclick="changeQty(\'' + item.name + '\',-1)">−</button>' +
          '<span class="qty-n">' + item.qty + '</span>' +
          '<button class="qty-btn" onclick="changeQty(\'' + item.name + '\',1)">+</button>' +
        '</div>' +
      '</div>';
    body.appendChild(el);
  });
}

let tTimer;
function showToast(msg) {
  let t = document.getElementById('toast');
  if (!t) { t = document.createElement('div'); t.id = 'toast'; t.className = 'toast'; document.body.appendChild(t); }
  t.innerHTML = msg; t.classList.add('show');
  clearTimeout(tTimer); tTimer = setTimeout(() => t.classList.remove('show'), 2800);
}

function handleNL(e) {
  e.preventDefault(); showToast('Obrigado! Fique atento às novidades ✦'); e.target.reset();
}

document.addEventListener('DOMContentLoaded', () => {
    updateCart();
    document.documentElement.style.scrollBehavior = 'smooth';
    
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('revealed');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.05, rootMargin: "0px 0px -40px 0px" });

    document.querySelectorAll('.product-card, .cat-card, .test-card, .about-img-box, .about-body > *, .footer-col, .hi-title, .hi-desc').forEach((el, i) => {
      el.classList.add('reveal-elem');
      if(el.classList.contains('product-card') || el.classList.contains('cat-card') || el.classList.contains('test-card')) {
         el.style.transitionDelay = ((i % 3) * 0.1) + 's';
      }
      io.observe(el);
    });
});

/* ── TECH MODAL LOGIC ── */
function openTechModal(e) {
  if (e) e.preventDefault();
  document.getElementById('tech-overlay').classList.add('open');
  document.getElementById('tech-modal').classList.add('open');
}
function closeTechModal() {
  document.getElementById('tech-overlay').classList.remove('open');
  document.getElementById('tech-modal').classList.remove('open');
}


/* ── PARALLAX ENGINE ── */
let scrollPx = 0;
let isTicking = false;

window.addEventListener('scroll', () => {
  scrollPx = window.scrollY;
  if (!isTicking) {
    window.requestAnimationFrame(() => {
      applyParallax();
      isTicking = false;
    });
    isTicking = true;
  }
});

function applyParallax() {
  // Hero Video parallax (moves down slightly to mimic depth)
  const heroVideo = document.querySelector('.hi-video');
  if (heroVideo && scrollPx < window.innerHeight) {
    const yPos = scrollPx * 0.45;
    heroVideo.style.transform = "translateY(" + yPos + "px)";
  }

  // Category Window Parallax (bg position shifting)
  const catPanels = document.querySelectorAll('.cat-visual');
  catPanels.forEach(panel => {
    const rect = panel.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      const offset = (rect.top - window.innerHeight / 2) * 0.12; 
      panel.style.backgroundPosition = "50% calc(50% + " + offset + "px)";
    }
  });
}
