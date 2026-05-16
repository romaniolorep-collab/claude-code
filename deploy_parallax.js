const fs = require('fs');

let js = fs.readFileSync('C:\\Users\\roman\\code claude\\script.js', 'utf8');

if (!js.includes('applyParallax')) {
    const parallaxJS = `

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
`;
    js += parallaxJS;
    fs.writeFileSync('C:\\Users\\roman\\code claude\\script.js', js, 'utf8');
}

let css = fs.readFileSync('C:\\Users\\roman\\code claude\\style.css', 'utf8');
if (!css.includes('will-change: background-position')) {
    const cssInject = `

/* -- PARALLAX HARDWARE ACCELERATION -- */
.hi-video {
  will-change: transform;
}
.cat-visual {
  will-change: background-position, transform;
}
`;
    fs.appendFileSync('C:\\Users\\roman\\code claude\\style.css', cssInject, 'utf8');
}

// CACHE BUSTER
let html = fs.readFileSync('C:\\Users\\roman\\code claude\\index.html', 'utf8');
const stamp = Date.now();
html = html.replace(/style\.css\?v=\d+/g, "style.css?v=" + stamp);
html = html.replace(/script\.js\?v=\d+/g, "script.js?v=" + stamp);
fs.writeFileSync('C:\\Users\\roman\\code claude\\index.html', html, 'utf8');

console.log("Parallax Engine Deployed with Hardware Acceleration & Cache Busting.");
