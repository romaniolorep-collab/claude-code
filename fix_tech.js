const fs = require('fs');
let html = fs.readFileSync('C:\\Users\\roman\\code claude\\index.html', 'utf8');

const repairs = [
    ['Â©', '©'],
    ['Â[]', '—'],
    ['Biomecnicos', 'Biomecânicos'],
    ['txeis', 'têxteis'],
    ['txteis', 'têxteis'],
    ['prottipo', 'protótipo'],
    ['peas', 'peças'],
    ['desnecessrias', 'desnecessárias'],
    ['invisvel', 'invisível'],
    ['ngulo', 'ângulo'],
    ['Â ', '— '],
    ['??', '—']
];

repairs.forEach(([bad, good]) => {
    html = html.split(bad).join(good);
});

// Since the restoring of HTML reverted the button, it is likely `<a href="#products" class="btn-sage">`
if (!html.includes('openTechModal(')) {
    html = html.split('href="#products" class="btn-sage"').join('href="#" onclick="openTechModal(event)" class="btn-sage"');
}

const techModalUI = `
  <!-- TECH MODAL -->
  <div id="tech-overlay" class="tech-overlay" onclick="closeTechModal()"></div>
  <div id="tech-modal" class="tech-modal">
    <div class="tech-head">
      <span class="tech-title">Antigravity Lab // Tecnologias Estruturais</span>
      <button class="close-btn" onclick="closeTechModal()">✕</button>
    </div>
    <div class="tech-content">
      <div class="tech-item">
        <h4>AeroKnit™ Framework</h4>
        <p>Malha tátil de ultra-respiração projetada para dissipação térmica imediata. Fios cortados a laser reduzem o peso da peça em 32% garantindo fôlego de maratona.</p>
      </div>
      <div class="tech-item">
        <h4>Zero-Friction Welding</h4>
        <p>A costura analógica foi abolida. Utilizamos fusão sônica de alta frequência para montar nossas peças. Zero saliências. Zero atrito com a pele. Apenas você e o movimento.</p>
      </div>
      <div class="tech-item">
        <h4>Climate-Response Fibers</h4>
        <p>Uma malha que respira como você. Em temperaturas abaixo de 10°C as fibras trancam o microclima. Sob suor e radiação, os micro-poros reagem e se expandem ativamente.</p>
      </div>
    </div>
  </div>
`;

if (!html.includes('tech-modal')) {
    html = html.replace('</body>', techModalUI + '\n</body>');
}

fs.writeFileSync('C:\\Users\\roman\\code claude\\index.html', html, 'utf8');
console.log('Sanitized and Injected Successfully.');
