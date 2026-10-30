/* MB Program Élite — landing interactions
   scroll reveal · sticky nav · marquee · side drawers · pricing selector */
(function () {
  'use strict';
  var d = document, root = d.documentElement;
  root.classList.remove('no-js');

  /* ---- Elemental: la R ha una coda larga che il browser non crena (Figma sì).
     Avvolgiamo ogni R dei titoli in .kr per stringerla come nel file Figma ---- */
  function kernR(scope) {
    var w = d.createTreeWalker(scope || d.body, NodeFilter.SHOW_TEXT, null), nodes = [], n, seen = new Map();
    var isElemental = function (el) {
      if (!seen.has(el)) seen.set(el, /^\s*"?Elemental/i.test(getComputedStyle(el).fontFamily) && !/^(SCRIPT|STYLE|TEXTAREA|OPTION)$/.test(el.tagName));
      return seen.get(el);
    };
    while ((n = w.nextNode())) {
      if (n.parentNode.classList.contains('kr') || !isElemental(n.parentNode)) continue;
      /* Elemental non ha accenti: come sul sito di riferimento le accentate vanno in maiuscolo (è → È, ò → Ò) */
      var up = n.nodeValue.replace(/[\u00e0-\u00fe]/g, function (c) { return c.toUpperCase(); });
      if (up !== n.nodeValue) n.nodeValue = up;
      if (/r/i.test(n.nodeValue)) nodes.push(n);
    }
    nodes.forEach(function (t) {
      var f = d.createDocumentFragment();
      t.nodeValue.split(/([rR])/).forEach(function (s) {
        if (!s) return;
        if (/^[rR]$/.test(s)) { var k = d.createElement('span'); k.className = 'kr'; k.textContent = s; f.appendChild(k); }
        else f.appendChild(d.createTextNode(s));
      });
      t.parentNode.replaceChild(f, t);
    });
  }
  kernR();

  /* tipografia italiana: le parole di 1–2 lettere (e, a, è, di, il, la, si…) restano attaccate alla successiva,
     così nessuna lettera resta isolata a fine riga */
  d.querySelectorAll('p, li, blockquote, h1, h2, h3, summary').forEach(function (el) {
    var tw = d.createTreeWalker(el, NodeFilter.SHOW_TEXT, null), n;
    while ((n = tw.nextNode())) {
      if (n.parentNode.closest('script,style,.kr')) continue;
      var bind = function (s) { return s.replace(/(^|[\s(«“"])([A-Za-zÀ-ÿ]{1,2})[ \t\n]+(?=\S)/g, function (m, pre, w) { return pre + w + '\u00A0'; }); };
      var v = bind(bind(n.nodeValue)); // due passate: copre anche parole corte consecutive ("è la", "e il")
      if (v !== n.nodeValue) n.nodeValue = v;
    }
  });

  /* ---- scroll reveal (fluid fades while the user scrolls down) ---- */
  var revealEls = d.querySelectorAll('.reveal, .pairs');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.14, rootMargin: '0px 0px -6% 0px' });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('in'); });
  }

  /* ---- marquees: 8 copies, so -50% loops seamlessly even on very wide screens ---- */
  d.querySelectorAll('.marquee-track').forEach(function (t) {
    var html = t.innerHTML, out = '';
    for (var i = 0; i < 8; i++) out += html;
    t.innerHTML = out;
  });

  /* ---- header: left drawer menu ---- */
  var tg=d.querySelector('.nav-toggle'),menu=d.getElementById('menu'),scrim=d.querySelector('.scrim');
  function setMenu(o){menu.classList.toggle('open',o);scrim.classList.toggle('open',o);menu.setAttribute('aria-hidden',o?'false':'true');tg.setAttribute('aria-expanded',o?'true':'false');root.classList.toggle('menu-open',o);if(o){var x=menu.querySelector('.drawer-x');x&&x.focus();}else if(d.activeElement&&menu.contains(d.activeElement)){tg.focus();}}
  function closeNav(){setMenu(false);}
  tg.addEventListener('click',function(){setMenu(!menu.classList.contains('open'));});
  d.addEventListener('click',function(e){if(e.target.closest('[data-menu-close]')||(menu.classList.contains('open')&&e.target.closest('#menu a')))setMenu(false);});
  d.addEventListener('keydown',function(e){if(e.key==='Escape'&&menu.classList.contains('open'))setMenu(false);});

  var links = Array.prototype.slice.call(d.querySelectorAll('.nav a[href^="#"]'));
  var map = links.map(function (a) { return d.querySelector(a.getAttribute('href')); });
  function spy() {
    var y = window.scrollY + 120, cur = -1;
    map.forEach(function (s, i) { if (s && s.offsetTop <= y) cur = i; });
    links.forEach(function (a, i) { a.classList.toggle('is-active', i === cur); });
  }
  window.addEventListener('scroll', spy, { passive: true }); spy();

  /* ---- side drawers (native <dialog>, slide in from the right) ---- */
  function openModal(id) {
    var m = d.getElementById(id); if (!m) return;
    m.classList.remove('is-closing');
    if (typeof m.showModal === 'function') m.showModal(); else m.setAttribute('open', '');
    var box = m.querySelector('.modal-box'); if (box) box.scrollTop = 0;
    root.classList.add('modal-open');
  }
  function closeModal(m) {
    if (!m || !m.open || m.classList.contains('is-closing')) return;
    var rm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (rm) { m.close(); return; }
    m.classList.add('is-closing');
    m.addEventListener('animationend', function done(ev) {
      if (ev.target !== m) return;
      m.removeEventListener('animationend', done);
      m.classList.remove('is-closing'); m.close();
    });
  }
  d.addEventListener('click', function (e) {
    var op = e.target.closest('[data-open]');
    if (op) { e.preventDefault(); closeNav(); openModal(op.getAttribute('data-open')); return; }
    var cl = e.target.closest('[data-close]');
    if (cl) { closeModal(cl.closest('dialog')); return; }
    if (e.target.tagName === 'DIALOG') closeModal(e.target); // click on the blurred area
  });
  d.querySelectorAll('dialog').forEach(function (m) {
    m.addEventListener('cancel', function (e) { e.preventDefault(); closeModal(m); });
    m.addEventListener('close', function () {
      if (!d.querySelector('dialog[open]')) root.classList.remove('modal-open');
    });
  });

  /* ---- pricing selector ---- */
  var plans = d.querySelectorAll('.plan');
  var elName = d.getElementById('chosen-name'), elOld = d.getElementById('chosen-old'),
      elPrice = d.getElementById('chosen-price'), elMonth = d.getElementById('chosen-month');
  function eur(n) { return n.toLocaleString('it-IT', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + '€'; }
  function choose(btn) {
    plans.forEach(function (p) { var on = p === btn; p.classList.toggle('is-on', on); p.setAttribute('aria-checked', on); });
    var m = +btn.dataset.months, price = +btn.dataset.price, old = +btn.dataset.old;
    elName.textContent = 'MB Program Élite — ' + m + (m === 1 ? ' Mese' : ' Mesi');
    kernR(elName);
    elOld.textContent = eur(old); elPrice.textContent = eur(price);
    elMonth.textContent = 'Pari a ' + eur(price / m) + ' al mese';
  }
  plans.forEach(function (p) { p.addEventListener('click', function () { choose(p); }); });

  /* ---- testimonianze: puntini del carosello su mobile ---- */
  var track = d.querySelector('.t-track'), dots = d.querySelectorAll('.t-dots i');
  if (track && dots.length) {
    track.addEventListener('scroll', function () {
      var cards = track.children, best = 0, bd = 1e9, c = track.scrollLeft + track.clientWidth / 2;
      for (var i = 0; i < cards.length; i++) { var m = Math.abs(cards[i].offsetLeft + cards[i].offsetWidth / 2 - c); if (m < bd) { bd = m; best = i; } }
      dots.forEach(function (o, i) { o.classList.toggle('on', i === best); });
    }, { passive: true });
  }

  /* ---- app: interfaccia reale (dashboard) dentro il telefono, sempre in movimento ---- */
  var live = d.querySelector('.phone-live');
  if (live) {
    var scr = live.parentNode;
    var fit = function () { scr.style.setProperty('--ps', (scr.clientWidth / 390).toFixed(4)); };
    fit(); window.addEventListener('resize', fit, { passive: true });
    var start = function () {
      if (live.src) return;
      live.src = live.getAttribute('data-src');
      live.addEventListener('load', function () {
        var w = live.contentWindow, t0 = null;
        try { w.document.documentElement.style.scrollBehavior = 'auto'; } catch (e) { return; }
        /* nel telefono solo l'interfaccia reale: niente barra DEMO, link "← Sito", benvenuto, barra di scorrimento */
        var css = w.document.createElement('style');
        css.textContent = '.demo,.d-site,dialog{display:none!important}html{scrollbar-width:none}::-webkit-scrollbar{width:0;height:0;display:none}';
        w.document.head.appendChild(css);
        (function step(ts) {
          if (t0 === null) t0 = ts;
          var doc = w.document.documentElement, max = Math.max(0, doc.scrollHeight - w.innerHeight);
          var p = ((ts - t0) / 26000) % 1, e = p < .5 ? p * 2 : 2 - p * 2; // giù e su, lento
          w.scrollTo(0, max * (0.5 - Math.cos(e * Math.PI) / 2));
          w.requestAnimationFrame(step);
        })(performance.now());
      });
    };
    if ('IntersectionObserver' in window) {
      var lo = new IntersectionObserver(function (es) { if (es[0].isIntersecting) { start(); lo.disconnect(); } }, { rootMargin: '400px' });
      lo.observe(scr);
    } else start();
  }
})();
