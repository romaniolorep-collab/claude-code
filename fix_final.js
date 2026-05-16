const fs = require('fs');
let html = fs.readFileSync('C:\\Users\\roman\\code claude\\index.html', 'utf8');

// The quotes block:
html = html.replace(/<div class="cg-quote">[\s\S]+?<\/div>/, `<div class="cg-quote">
        <p>"O equipamento atinge sua utilidade máxima quando desaparece durante o uso."</p>
        <p class="author">— ENG. DEPT.</p>
      </div>`);

// The copyright block:
html = html.replace(/<p>[^\w<]*2026 Antigravity\. Todos os direitos reservados\.[^<]*<\/p>/, '<p>© 2026 Antigravity. Todos os direitos reservados.</p>');

// Inlining the modal JS into the button!
html = html.replace(/href="#" onclick="openTechModal\(event\)" class="btn-sage"/i, 
    `href="#" onclick="event.preventDefault(); document.getElementById('tech-overlay').classList.add('open'); document.getElementById('tech-modal').classList.add('open');" class="btn-sage"`
);

// Inlining the close function into the modal!
html = html.replace(/onclick="closeTechModal\(\)"/g, "onclick=\"document.getElementById('tech-overlay').classList.remove('open'); document.getElementById('tech-modal').classList.remove('open');\"");

// Fix any mangled chars in the modal if they exist
html = html.replace('Malha ttil', 'Malha tátil');
html = html.replace('AeroKnitT Framework', 'AeroKnit™ Framework');
html = html.replace(/ultra-respirao/g, 'ultra-respiração');
html = html.replace(/dissipao/g, 'dissipação');
html = html.replace(/trmica/g, 'térmica');
html = html.replace(/pea/g, 'peça');
html = html.replace(/flego/g, 'fôlego');
html = html.replace(/analgica/g, 'analógica');
html = html.replace(/fuso/g, 'fusão');
html = html.replace(/snica/g, 'sônica');
html = html.replace(/frequncia/g, 'frequência');
html = html.replace(/salincias/g, 'saliências');
html = html.replace(/voc/g, 'você');
html = html.replace(/10C/g, '10°C');
html = html.replace(/radiao/g, 'radiação');


fs.writeFileSync('C:\\Users\\roman\\code claude\\index.html', html, 'utf8');
console.log('Fixed quotes, copyright, and made JS bulletproof.');
