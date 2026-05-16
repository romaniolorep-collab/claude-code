const fs = require('fs');

const css = `
/* ── TECH MODAL GLASSMORPHISM ── */
.tech-overlay {
  position: fixed;
  top: 0; left: 0; width: 100vw; height: 100vh;
  background: rgba(20, 20, 18, 0.4);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  z-index: 10000;
  opacity: 0; pointer-events: none;
  transition: opacity 0.4s ease;
}
.tech-overlay.open {
  opacity: 1; pointer-events: all;
}

.tech-modal {
  position: fixed;
  top: 50%; left: 50%;
  transform: translate(-50%, -46%);
  width: 90%; max-width: 600px;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(40px);
  -webkit-backdrop-filter: blur(40px);
  box-shadow: 0 40px 100px rgba(0,0,0,0.15), inset 0 0 0 1px rgba(255,255,255,0.6);
  border-radius: 20px;
  z-index: 10001;
  opacity: 0; pointer-events: none;
  transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
  padding: 40px;
  display: flex; flex-direction: column; gap: 32px;
}
.tech-modal.open {
  opacity: 1; pointer-events: all;
  transform: translate(-50%, -50%);
}
.tech-head {
  display: flex; justify-content: space-between; align-items: center;
  border-bottom: 1.5px solid rgba(0,0,0,0.06);
  padding-bottom: 20px;
}
.tech-title {
  font-family: 'DM Sans', sans-serif;
  font-size: 0.85rem; font-weight: 600; letter-spacing: 1px;
  text-transform: uppercase; color: var(--stone);
}
.close-btn {
  background: none; border: none; font-size: 1.2rem; cursor: pointer; color: var(--stone);
  transition: transform 0.3s;
}
.close-btn:hover { transform: rotate(90deg); }
.tech-content {
  display: flex; flex-direction: column; gap: 24px;
}
.tech-item h4 {
  font-family: 'Cormorant Garamond', serif; font-size: 1.6rem;
  font-weight: 500; margin-bottom: 8px; color: var(--almost-black);
}
.tech-item p {
  font-size: 0.95rem; line-height: 1.5; color: var(--stone);
}

@media (max-width: 600px) {
  .tech-modal {
    width: 100%; height: 100vh;
    top: 0; left: 0; transform: translate(0, 4%);
    border-radius: 0; padding: 32px 24px;
    justify-content: center;
  }
  .tech-modal.open {
    transform: translate(0, 0);
  }
}
`;

fs.appendFileSync('C:\\Users\\roman\\code claude\\style.css', css, 'utf8');
console.log('CSS Appended.');
