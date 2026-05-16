const fs = require('fs');

const js = `
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
`;

fs.appendFileSync('C:\\Users\\roman\\code claude\\script.js', js, 'utf8');
console.log('JS Appended.');
