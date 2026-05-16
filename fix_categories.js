const fs = require('fs');

let css = fs.readFileSync('C:\\Users\\roman\\code claude\\style.css', 'utf8');

// The best way is to append it, but we can also inject it nicely.
const hoverCss = `
/* -- CAT VISUAL ZOOM HOVER EFFECT -- */
.cat-visual {
  transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}
.cat-card:hover .cat-visual {
  transform: scale(1.05);
}
.cat-overlay {
  transition: background 0.4s ease;
}
.cat-card:hover .cat-overlay {
  background: linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.1) 60%, transparent 100%);
}
`;

fs.appendFileSync('C:\\Users\\roman\\code claude\\style.css', hoverCss, 'utf8');

let html = fs.readFileSync('C:\\Users\\roman\\code claude\\index.html', 'utf8');
const newTs = Date.now();
html = html.replace(/style\.css\?v=\d+/g, `style.css?v=${newTs}`);
fs.writeFileSync('C:\\Users\\roman\\code claude\\index.html', html, 'utf8');

console.log('Hover effects injected and cache-busted!');
