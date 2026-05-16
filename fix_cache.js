const fs = require('fs');
let html = fs.readFileSync('C:\\Users\\roman\\code claude\\index.html', 'utf8');

const ts = Date.now();
html = html.replace('href="style.css"', `href="style.css?v=${ts}"`);
html = html.replace('src="script.js"', `src="script.js?v=${ts}"`);

// Let's also restore the button to correctly trigger openTechModal(event) and not the raw snippet,
// because raw snippet spanning multiple lines in HTML might cause issues in some parsing engines.
html = html.replace(
    /href="#" onclick="event\.preventDefault\(\); document\.getElementById\('tech-overlay'\)\.classList\.add\('open'\);\s*document\.getElementById\('tech-modal'\)\.classList\.add\('open'\);"/i, 
    'href="#" onclick="openTechModal(event)"'
);

fs.writeFileSync('C:\\Users\\roman\\code claude\\index.html', html, 'utf8');
console.log('Cache busters deployed and button simplified!');
