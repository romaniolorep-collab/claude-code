const fs = require('fs');
let html = fs.readFileSync('C:\\Users\\roman\\code claude\\index.html', 'utf8');

// The corrupted string looks like <a href="#products" class="cat-btn">Ver Cole...</a>
// We use a robust regular expression to target it regardless of what corrupted characters are there.
// \s* means matching any spaces, \S* any non-spaces that are corrupted
html = html.replace(/<a href="#products" class="cat-btn">Ver Cole.*?<\/a>/g, '<a href="#products" class="cat-btn">Ver Coleção &rarr;</a>');

fs.writeFileSync('C:\\Users\\roman\\code claude\\index.html', html, 'utf8');
console.log('Replaced category button text.');
