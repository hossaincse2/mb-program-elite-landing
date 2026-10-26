(function () {
  'use strict';
  var d = document, root = d.documentElement; root.classList.remove('no-js');
  var $ = function (s, c) { return (c || d).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || d).querySelectorAll(s)); };
  function store(k, v) { try { if (v === undefined) return localStorage.getItem(k); if (v === null) localStorage.removeItem(k); else localStorage.setItem(k, v); } catch (e) {} return null; }

  /* ---------- dati: 8 macro-blocchi Chakra ---------- */
  var BLOCKS = [
    { n: 1, name: 'Radice', sub: 'Tecnica · Basi · Metodologia', from: 1, to: 4, c: '#d9453f' },
    { n: 2, name: 'Sacrale', sub: 'Percezione · Immaginazione', from: 5, to: 10, c: '#e8873a' },
    { n: 3, name: 'Plesso Solare', sub: 'Consapevolezza · Mindset', from: 11, to: 19, c: '#e6c43e' },
    { n: 4, name: 'Cuore', sub: 'Energia e Chakra · Un Viaggio dentro il Corpo', from: 20, to: 26, c: '#4fae6a' },
    { n: 5, name: 'Gola', sub: 'Respira · Una Danza tra Movimento e Respiro', from: 27, to: 29, c: '#4cc3d9' },
    { n: 6, name: 'Terzo Occhio', sub: 'Intenzione · Connetti Corpo-Mente-Cuore', from: 30, to: 33, c: '#6b7be0' },
    { n: 7, name: 'Corona', sub: 'Respirazione · Total Posture · Allineamento · Connessione', from: 34, to: 37, c: '#8a5bd6' },
    { n: 8, name: 'Pura Vida', sub: 'La libertà dell\'essenza', from: 38, to: 45, c: 'linear-gradient(135deg,#d9453f,#e6c43e,#4fae6a,#6b7be0)' }
  ];
  var month = +(store('mb_demo_month') || 1);
  var LOCK = '<svg viewBox="0 0 24 24"><rect x="5" y="11" width="14" height="9" rx="1.5"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>';

  function state(b) {
    if (month > 45) return 'open';
    if (month >= b.from && month <= b.to) return 'active';
    return month > b.to ? 'past' : 'future';
  }

  function renderChakra() {
    var g = $('#chakra-grid'); g.innerHTML = '';
    BLOCKS.forEach(function (b) {
      var st = state(b), locked = (st === 'past' || st === 'future');
      var el = d.createElement('button'); el.type = 'button';
      el.className = 'ck ' + (st === 'active' ? 'active' : locked ? 'locked' : 'open');
      el.setAttribute('data-block', b.n);
      var status = st === 'active' ? 'In corso' : st === 'past' ? 'Il passato è trasmutato' : st === 'future' ? 'Si aprirà a breve' : 'Sbloccato per sempre';
      el.innerHTML =
        '<span class="ck-ph" aria-hidden="true">' + (locked ? '<span class="ck-lock">' + LOCK + '</span>' : '') + '<img src="img/ck-' + b.n + '.png" alt="" width="104" height="104"></span>' +
        '<span class="ck-t"><i style="--c:' + b.c + ';background:' + b.c + '"></i>' + b.name + '</span>' +
        '<span class="ck-s">' + (b.sub || '&nbsp;') + '</span>' +
        '<span class="ck-m">Mesi ' + b.from + '–' + b.to + '</span>' +
        '<span class="ck-st">' + status + '</span>';
      el.setAttribute('aria-label', b.name + ', mesi ' + b.from + ' a ' + b.to + ', ' + status);
      el.addEventListener('click', function () {
        if (st === 'past') return msg('Il passato è trasmutato', 'Hai attraversato questo portale energetico. Onora ciò che è stato e porta con te ciò che hai integrato.');
        if (st === 'future') return msg('Onora il tuo tempo', 'Questo portale energetico si aprirà quando avrai ultimato la mensilità in corso.');
        openBlock(b);
      });
      g.appendChild(el);
    });
  }

  /* ---------- interno del blocco: solo il mese spettante ---------- */
  var curBlock = BLOCKS[0];
  function openBlock(b) {
    curBlock = b;
    $('#blk-eyebrow').textContent = 'Mesi ' + b.from + '–' + b.to;
    $('#blk-title').textContent = b.name.toUpperCase();
    $('#blk-sub').textContent = b.sub || '';
    var g = $('#month-grid'); g.innerHTML = '';
    for (var m = b.from; m <= b.to; m++) {
      var isOpen = month > 45 || m === month;
      var el = d.createElement('button'); el.type = 'button';
      el.className = 'mo ' + (isOpen ? 'on' : 'off');
      el.innerHTML = '<span class="ck-m">' + b.name + ' · Mese ' + m + '</span><h3>' + (b.sub || 'Percorso del mese') + '</h3>' +
        (isOpen ? '<span class="go">Entra nel mese <span aria-hidden="true">→</span></span>' : '<span class="lk">' + LOCK + '</span><span class="go">' + (m < month ? 'Il passato è trasmutato' : 'Si sbloccherà al giorno 31') + '</span>');
      (function (mm, open) {
        el.addEventListener('click', function () {
          if (open) { $('#les-title').textContent = b.sub || 'Percorso del mese'; $('#les-sub').textContent = b.name.toUpperCase() + ' · MESE ' + mm; go('lezione'); }
          else msg(mm < month ? 'Il passato è trasmutato' : 'Onora il tuo tempo', mm < month ? 'Questo mese si è chiuso alle tue spalle per non frammentare la tua energia.' : 'Questo mese si sbloccherà automaticamente al giorno 31 della mensilità in corso.');
        });
      })(m, isOpen);
      g.appendChild(el);
    }
    go('blocco');
  }

  /* ---------- navigazione tra viste ---------- */
  var navMap = { home: 'home', blocco: 'home', lezione: 'home', attivita: 'attivita', diario: 'diario', blog: 'blog' };
  function go(v) {
    $$('.view').forEach(function (s) { s.classList.toggle('is-on', s.id === 'v-' + v); });
    $$('.d-nav button').forEach(function (b) { b.classList.toggle('on', b.getAttribute('data-go') === navMap[v]); });
    $('#side-toggle').hidden = (v !== 'lezione');
    $('#side').classList.remove('open');
    window.scrollTo(0, 0);
    if (v === 'blocco') { /* nulla */ }
  }
  d.addEventListener('click', function (e) {
    var g = e.target.closest('[data-go]');
    if (g) { e.preventDefault(); var v = g.getAttribute('data-go'); if (v === 'blocco') go('blocco'); else go(v); return; }
    var o = e.target.closest('[data-open]');
    if (o) { var m = d.getElementById(o.getAttribute('data-open')); if (m) m.showModal(); return; }
    if (e.target.closest('[data-close]')) { var dl = e.target.closest('dialog'); if (dl) dl.close(); return; }
    if (e.target.tagName === 'DIALOG' && e.target.id !== 'm-welcome') e.target.close();
  });
  $('#side-toggle').addEventListener('click', function () { $('#side').classList.toggle('open'); });
  $('#side-close').addEventListener('click', function () { $('#side').classList.remove('open'); });

  /* ---------- messaggio (blocchi) ---------- */
  function msg(t, p) { $('#msg-t').textContent = t; $('#msg-p').textContent = p; var m = $('#m-msg'); if (!m.open) m.showModal(); }

  /* ---------- Spazio Sacro: 3 modali ---------- */
  var SACRO = {
    percorsi: { t: 'I PERCORSI ALCHEMICI', items: ['Percorso introduttivo', 'Attivazioni Energetiche', 'Meditazioni guidate'] },
    geometrie: { t: 'GEOMETRIE DEL CORPO', items: ['Pratica Yoga · base', 'Pratica Yoga · intermedia', 'Pratica Yoga · avanzata'] },
    sound: { t: 'SOUND HEALING VIBRAZIONALE', items: ['Frequenze di calma profonda', 'Sound Healing notturno', 'Ascolto in background'] }
  };
  $$('[data-sacro]').forEach(function (b) {
    b.addEventListener('click', function () {
      var s = SACRO[b.getAttribute('data-sacro')];
      $('#sc-t').textContent = s.t;
      $('#sc-acc').innerHTML = s.items.map(function (t, i) {
        return '<details' + (i === 0 ? ' open' : '') + '><summary>' + t + '</summary><div class="acc-in"><p>Qui restano invariati i testi, i video e gli accordion già formattati da Marica.</p><a class="go" href="#" data-go="lezione">+ ACCEDI AL PERCORSO</a></div></details>';
      }).join('');
      $('#m-sacro').showModal();
    });
  });
  $('#sc-acc').addEventListener('click', function (e) {
    var a = e.target.closest('a.go'); if (!a) return; e.preventDefault();
    $('#m-sacro').close(); $('#les-title').textContent = $('#sc-t').textContent; $('#les-sub').textContent = 'IL TUO SPAZIO SACRO'; go('lezione');
  });

  /* ---------- calendario ---------- */
  var MONTHS = ['Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno', 'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'];
  var LET = ['L', 'M', 'M', 'G', 'V', 'S', 'D'];
  var today = new Date(); today.setHours(0, 0, 0, 0);
  var mon = mondayOf(today);
  function mondayOf(dt) { var x = new Date(dt); var k = (x.getDay() + 6) % 7; x.setDate(x.getDate() - k); x.setHours(0, 0, 0, 0); return x; }
  function renderCal() {
    $('#cal-month').textContent = MONTHS[mon.getMonth()] + ' ' + mon.getFullYear();
    var h = '';
    for (var i = 0; i < 7; i++) {
      var dt = new Date(mon); dt.setDate(mon.getDate() + i);
      var cls = dt.getTime() === today.getTime() ? 'today' : dt < today ? 'past' : '';
      if (dt.getMonth() !== mon.getMonth()) cls += ' dim';
      h += '<div class="cd ' + cls + '"><span>' + LET[i] + '</span><span class="n">' + dt.getDate() + '</span><i></i></div>';
    }
    $('#cal-days').innerHTML = h;
  }
  $('#cal-prev').addEventListener('click', function () { mon.setDate(mon.getDate() - 7); renderCal(); });
  $('#cal-next').addEventListener('click', function () { mon.setDate(mon.getDate() + 7); renderCal(); });
  $('#cal-today').addEventListener('click', function () { mon = mondayOf(today); renderCal(); });
  $('#cal-set').addEventListener('click', function () { $('#m-cal').showModal(); });
  $$('[data-seg]').forEach(function (s) { s.addEventListener('click', function (e) { var b = e.target.closest('button'); if (!b) return; $$('button', s).forEach(function (x) { x.classList.toggle('on', x === b); }); }); });
  $$('.days').forEach(function (s) { s.addEventListener('click', function (e) { var b = e.target.closest('button'); if (b) b.classList.toggle('on'); }); });

  /* ---------- lezione ---------- */
  var TUT = [['Esercizio 1: Vacuum', 5], ['Esercizio 2: Articolazioni + Respirazione', 6], ['Esercizio 3: Ponte da terra training 1 e 2', 6], ['Esercizio 4: Squat', 6], ['Esercizio 5: Stacco', 4], ['Esercizio 6: Affondi posteriori alternati / Kick back alternativa', 10], ['Esercizio 7: Rematore singolo', 4], ['Esercizio 8: Bicipiti / tricipiti', 3], ['Esercizio 9: Alzate sopra la testa (Spalle)', 4]];
  $('#tut-list').innerHTML = TUT.map(function (t) { return '<li><a href="#"><span>' + t[0] + '</span><em>' + t[1] + ' min</em></a></li>'; }).join('');
  $$('.seg button').forEach(function (b) { b.addEventListener('click', function () { $$('.seg button').forEach(function (x) { var on = x === b; x.classList.toggle('on', on); x.setAttribute('aria-selected', on); }); }); });
  $('#btn-done').addEventListener('click', function () { var b = this; var on = b.classList.toggle('is-done'); $('span', b).textContent = on ? 'Completato ✓' : 'Segna come completato'; });

  /* ---------- benvenuto: una sola volta ---------- */
  var W = $('#m-welcome');
  W.addEventListener('cancel', function (e) { e.preventDefault(); }); // non si chiude con Esc
  $('#w-go').addEventListener('click', function () { store('mb_welcome_done', '1'); W.close(); });
  function maybeWelcome(force) { if (force || !store('mb_welcome_done')) setTimeout(function () { if (!W.open) W.showModal(); }, force ? 0 : 1000); }

  /* ---------- demo ---------- */
  var sel = $('#demo-month'); sel.value = String(month);
  if (sel.value !== String(month)) { var o = d.createElement('option'); o.value = month; o.textContent = month; sel.appendChild(o); sel.value = String(month); }
  sel.addEventListener('change', function () { month = +sel.value; store('mb_demo_month', String(month)); renderChakra(); go('home'); });
  $('#demo-welcome').addEventListener('click', function () { store('mb_welcome_done', null); maybeWelcome(true); });

  renderCal(); renderChakra(); maybeWelcome(false);
})();
