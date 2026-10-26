/* MB Program Élite — landing interactions
   scroll reveal · sticky nav · marquee · modals · pricing selector */
(function () {
  'use strict';
  var d = document, root = d.documentElement;
  root.classList.remove('no-js');

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

  /* ---- marquees: duplicate the track for a seamless loop ---- */
  d.querySelectorAll('.marquee-track').forEach(function (t) {
    var html = t.innerHTML;
    t.innerHTML = html + html + html + html;
    // keep -50% translate seamless: 4 copies = 2 full cycles
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

  /* ---- modals (native <dialog>) ---- */
  function openModal(id) {
    var m = d.getElementById(id); if (!m) return;
    if (typeof m.showModal === 'function') m.showModal(); else m.setAttribute('open', '');
    root.classList.add('modal-open');
  }
  d.addEventListener('click', function (e) {
    var op = e.target.closest('[data-open]');
    if (op) { e.preventDefault(); closeNav(); openModal(op.getAttribute('data-open')); return; }
    var cl = e.target.closest('[data-close]');
    if (cl) { cl.closest('dialog').close(); return; }
    if (e.target.tagName === 'DIALOG') e.target.close(); // click on backdrop
  });
  d.querySelectorAll('dialog').forEach(function (m) {
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
    elOld.textContent = eur(old); elPrice.textContent = eur(price);
    elMonth.textContent = 'Pari a ' + eur(price / m) + ' al mese';
  }
  plans.forEach(function (p) { p.addEventListener('click', function () { choose(p); }); });
})();
