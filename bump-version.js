#!/usr/bin/env node
/* Cache-busting (versione Node di bump-version.py): aggiunge ?v=<hash del contenuto>
   a ogni riferimento locale css/js/img/font in tutti i .html e .css.
   Eseguire dopo OGNI modifica:  node bump-version.js */
const fs = require('fs'), path = require('path'), crypto = require('crypto');
const root = __dirname, skip = new Set(['.git', '_fig', 'node_modules', '.claude']);
const pat = /((?:href|src|srcset|poster)=["']|url\(["']?)([^"'()\s?#]+\.(?:css|js|png|jpe?g|webp|svg|gif|ttf|woff2?|ico))(?:\?v=[0-9a-f]+)?(["')\s])/gi;
const cache = {};
const hash = f => cache[f] || (cache[f] = crypto.createHash('md5').update(fs.readFileSync(f)).digest('hex').slice(0, 8));
const walk = d => fs.readdirSync(d, { withFileTypes: true }).flatMap(e => skip.has(e.name) ? [] : e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]);
let n = 0;
for (const p of walk(root).filter(f => /\.(html|css)$/.test(f))) {
  const s = fs.readFileSync(p, 'utf8');
  const t = s.replace(pat, (m, pre, u, post) => {
    if (/^(?:[a-z]+:)?\/\/|^data:|^mailto:/i.test(u)) return m;
    const f = u.startsWith('/') ? path.join(root, u) : path.resolve(path.dirname(p), u);
    return fs.existsSync(f) && fs.statSync(f).isFile() ? `${pre}${u}?v=${hash(f)}${post}` : m;
  });
  if (t !== s) { fs.writeFileSync(p, t); n++; }
}
console.log(`versioned references updated in ${n} file(s)`);
