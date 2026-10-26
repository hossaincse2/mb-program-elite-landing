#!/usr/bin/env python3
"""Cache-busting: appends ?v=<content-hash> to every local css/js/img/font reference
in all .html and .css files. Run again after ANY change:  python3 bump-version.py
The hash only changes when the file itself changes, so unchanged files stay cached
and changed files are fetched fresh — no hard refresh needed."""
import re, hashlib, pathlib
root = pathlib.Path(__file__).parent
EXT = r'(?:css|js|png|jpe?g|webp|svg|gif|ttf|woff2?|ico)'
pat = re.compile(r'''(?P<pre>(?:href|src|srcset|poster)=["']|url\(["']?)(?P<u>[^"'()\s?#]+\.''' + EXT + r''')(?:\?v=[0-9a-f]+)?(?P<post>["')\s])''', re.I)
cache = {}
def h(p):
    if p not in cache: cache[p] = hashlib.md5(p.read_bytes()).hexdigest()[:8]
    return cache[p]
def fix(m, base):
    u = m['u']
    if re.match(r'^(?:[a-z]+:)?//|^data:|^mailto:', u, re.I): return m.group(0)
    f = (root / u.lstrip('/')) if u.startswith('/') else (base / u)
    try: f = f.resolve()
    except Exception: return m.group(0)
    if not f.is_file(): return m.group(0)
    return f"{m['pre']}{u}?v={h(f)}{m['post']}"
n = 0
for p in list(root.rglob('*.html')) + list(root.rglob('*.css')):
    s = p.read_text(encoding='utf-8')
    t = pat.sub(lambda m: fix(m, p.parent), s)
    if t != s: p.write_text(t, encoding='utf-8'); n += 1
print(f'versioned references updated in {n} file(s)')
