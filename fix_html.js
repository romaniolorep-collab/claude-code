const fs = require('fs');
let html = fs.readFileSync('C:\\Users\\roman\\code claude\\index.html', 'utf8');

// Charset encoding repair
const repairs = [
    ['Colees', 'Coleções'],
    ['Acessrios', 'Acessórios'],
    ['Acar', 'Açúcar'],
    ['Sachs', 'Sachês'],
    ['Devolues', 'Devoluções'],
    ['Coleo', 'Coleção'],
    ['Ns', 'Nós'],
];

repairs.forEach(([bad, good]) => {
    html = html.split(bad).join(good);
});

// Remove Blog links
html = html.replace(/<a href="[^"]*">Blog<\/a>/g, '');
html = html.replace(/<li><a href="[^"]*">Blog<\/a><\/li>/g, '');

// Convert dead links to products
html = html.split('href="#"').join('href="#products"');
html = html.split('href="colecao.html"').join('href="#products"');

// Specifically connect Categories
html = html.split('<a href="#products">Feminino</a>').join('<a href="#categories">Feminino</a>');
html = html.split('<a href="#products">Masculino</a>').join('<a href="#categories">Masculino</a>');
html = html.split('<a href="#products">Acessórios</a>').join('<a href="#categories">Acessórios</a>');
html = html.split('<li><a href="#products">Feminino</a></li>').join('<li><a href="#categories">Feminino</a></li>');
html = html.split('<li><a href="#products">Masculino</a></li>').join('<li><a href="#categories">Masculino</a></li>');
html = html.split('<li><a href="#products">Acessórios</a></li>').join('<li><a href="#categories">Acessórios</a></li>');

// Contact
html = html.split('<a href="#products" class="btn-nav">Contato</a>').join('<a href="mailto:contato@antigravity.com" class="btn-nav">Contato</a>');
html = html.split('href="#products">Contato</a>').join('href="mailto:contato@antigravity.com">Contato</a>');

// Inject ID categories
if (!html.includes('id="categories"')) {
    html = html.split('<div class="cat-grid"').join('<div id="categories" class="cat-grid"');
}

fs.writeFileSync('C:\\Users\\roman\\code claude\\index.html', html, 'utf8');
console.log("HTML completely sanitized.");
