const fs = require('fs');
let html = fs.readFileSync('C:\\Users\\roman\\code claude\\index.html', 'utf8');

// Target 1: Tecido
html = html.replace(/<p class="feat-desc">70% de fibras recicladas[^<]+ambiental\.<\/p>/gi, 
'<p class="feat-desc">70% de fibras recicladas com UV50+, compressão graduada e secagem ultrarrápida. Performance sem impacto ambiental.</p>');

// Target 2: Movimento
html = html.replace(/<p class="feat-desc">Cortes desenvolvidos[^<]+ngulo\.<\/p>/gi,
'<p class="feat-desc">Cortes desenvolvidos com especialistas em movimento para garantir mobilidade total em qualquer ângulo.</p>');

// Target 3: Frete
html = html.replace(/<p class="feat-desc">Frete gr[^<]+capitais\.<\/p>/gi,
'<p class="feat-desc">Frete grátis acima de R$299 em todo o Brasil. Envio expresso em até 24h para todas as capitais.</p>');

// Target 4: Devolucao
html = html.replace(/<p class="feat-desc">30 dias para troca ou devolu[^<]+prioridade\.<\/p>/gi,
'<p class="feat-desc">30 dias para troca ou devolução sem burocracia. Sua satisfação é a nossa única prioridade.</p>');

fs.writeFileSync('C:\\Users\\roman\\code claude\\index.html', html, 'utf8');
console.log('Fixed feature descriptions successfully.');
