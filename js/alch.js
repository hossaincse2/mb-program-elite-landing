/* Alchemical display lettering: adds the small diamond to A, O, C, U in .display / .alch headings */
(function () {
  var map = { A: 'a', O: 'o', C: 'c', U: 'u' };
  function wrap(root) {
    var w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null), nodes = [], n;
    while ((n = w.nextNode())) { if (/[AOCUaocu]/.test(n.nodeValue) && !n.parentNode.closest('.g')) nodes.push(n); }
    nodes.forEach(function (t) {
      var f = document.createDocumentFragment();
      t.nodeValue.split(/(\s+)/).forEach(function (part) {
        if (!part) return;
        if (/^\s+$/.test(part)) { f.appendChild(document.createTextNode(part)); return; }
        var w = document.createElement('span'); w.className = 'w';
        part.split('').forEach(function (ch) {
          var k = map[ch.toUpperCase()];
          if (k) { var s = document.createElement('span'); s.className = 'g g-' + k; s.textContent = ch; w.appendChild(s); }
          else w.appendChild(document.createTextNode(ch));
        });
        f.appendChild(w);
      });
      t.parentNode.replaceChild(f, t);
    });
  }
  function run() { document.querySelectorAll('.display, .alch').forEach(function (el) {
    if (getComputedStyle(el).textTransform === 'uppercase' || el.classList.contains('alch')) wrap(el); }); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run); else run();
})();
