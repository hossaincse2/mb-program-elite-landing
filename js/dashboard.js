(function () {
  'use strict';
  var d = document, root = d.documentElement; root.classList.remove('no-js');
  var $ = function (s, c) { return (c || d).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || d).querySelectorAll(s)); };
  function store(k, v) { try { if (v === undefined) return localStorage.getItem(k); if (v === null) localStorage.removeItem(k); else localStorage.setItem(k, v); } catch (e) {} return null; }
  var reduced = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- icone (linea sottile, oro satinato) ---------- */
  var SEAL = '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9.5"/><circle cx="12" cy="12" r="6.6" stroke-dasharray="1 1.6"/><circle cx="12" cy="10.6" r="1.6"/><path d="M12 12.2v3.2M12 2.5v1.6M12 19.9v1.6M2.5 12h1.6M19.9 12h1.6"/></svg>';
  var FLY = '<svg class="fly" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 8.5c-1.6-3-5.5-5-7.6-3.8C2.7 5.7 3.6 10 6 11.3c-2.4 1-3 4-1 5.2 2 1.1 5-1 7-4.5 2 3.5 5 5.6 7 4.5 2-1.2 1.4-4.2-1-5.2 2.4-1.3 3.3-5.6 1.6-6.6C17.5 3.5 13.6 5.5 12 8.5z"/><path d="M12 8v10"/></svg>';
  /* simboli alchemici: Fuoco △, Acqua ▽, Aria △ con barra, Terra ▽ con barra */
  var EL = {
    fuoco: ['Fuoco', '<path d="M12 4L20 19H4z"/>'],
    acqua: ['Acqua', '<path d="M4 5h16L12 20z"/>'],
    aria: ['Aria', '<path d="M12 4L20 19H4z"/><path d="M6.9 13.5h10.2"/>'],
    terra: ['Terra', '<path d="M4 5h16L12 20z"/><path d="M6.9 10.5h10.2"/>']
  };
  function els(list) { return '<span class="els">' + (list || []).map(function (k) { return '<svg viewBox="0 0 24 24" role="img" aria-label="' + EL[k][0] + '">' + EL[k][1] + '</svg>'; }).join('') + '</span>'; }

  /* nome di battesimo dal backend (<body data-nome="…">) */
  if (d.body.getAttribute('data-nome')) $('#nome').textContent = d.body.getAttribute('data-nome');

  /* ---------- filtro globale: moduli eliminati dal portale ---------- */
  var HIDE = /reset your mind|modulo consapevolezza|consapevolezza delle emozioni/i;
  function hideRemoved() { $$('li, details, .sacro, .mo, .vid').forEach(function (el) { if (HIDE.test(el.textContent)) el.style.display = 'none'; }); }
  new MutationObserver(hideRemoved).observe(d.body, { childList: true, subtree: true });

  /* ---------- dati: 8 macro-blocchi Chakra (palette chakra minerale, non arcobaleno) ---------- */
  var BLOCKS = [
    { n: 1, name: 'Radice', sub: 'Tecnica · Basi · Metodologia', from: 1, to: 4, c: '#9b4735' },
    { n: 2, name: 'Sacrale', sub: 'Percezione · Immaginazione', from: 5, to: 10, c: '#b8794b' },
    { n: 3, name: 'Plesso Solare', sub: 'Consapevolezza · Mindset', from: 11, to: 19, c: '#c09b4d' },
    { n: 4, name: 'Cuore', sub: 'Energia e Chakra · Un Viaggio dentro il Corpo', from: 20, to: 26, c: '#668077' },
    { n: 5, name: 'Gola', sub: 'Respira · Una Danza tra Movimento e Respiro', from: 27, to: 29, c: '#3e7471' },
    { n: 6, name: 'Terzo Occhio', sub: 'Intenzione · Connetti Corpo-Mente-Cuore', from: 30, to: 33, c: '#4a496d' },
    { n: 7, name: 'Corona', sub: 'Respirazione · Total Posture · Allineamento · Connessione', from: 34, to: 37, c: '#806482' },
    { n: 8, name: 'Pura Vida', sub: 'La libertà dell\'essenza', from: 38, to: 45, c: '#a88a4a' }
  ];
  var TEMPIO = 'Onora il tuo tempio, questo portale energetico si aprirà quando avrai ultimato la tua mensilità in corso.';
  var month = +(store('mb_demo_month') || 1);

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
      el.style.setProperty('--c', b.c);
      el.setAttribute('data-block', b.n);
      var status = st === 'active' ? 'In corso' : st === 'past' ? 'Il passato è trasmutato' : st === 'future' ? 'Si aprirà a breve' : 'Sbloccato per sempre';
      el.innerHTML =
        '<span class="ck-ph" aria-hidden="true">' + (locked ? '<span class="seal">' + SEAL + '</span>' : '') + '<img src="img/ck-' + b.n + '.png" alt="" width="104" height="104"></span>' +
        '<span class="ck-t"><i></i>' + b.name + '</span>' +
        '<span class="ck-s">' + (b.sub || '&nbsp;') + '</span>' +
        '<span class="ck-m">Mesi ' + b.from + '–' + b.to + '</span>' +
        '<span class="ck-st">' + status + '</span>';
      el.setAttribute('aria-label', b.name + ', mesi ' + b.from + ' a ' + b.to + ', ' + status);
      el.addEventListener('click', function () {
        if (locked) return msg('', TEMPIO);
        openBlock(b);
      });
      g.appendChild(el);
    });
  }

  /* ---------- allenamenti completati del mese → baffetto + 3 farfalle ---------- */
  function wk() { return +(store('mb_wk_' + month) || 0); }
  function level(n) { return n >= 12 ? 3 : n >= 10 ? 2 : n >= 8 ? 1 : 0; }
  function setWk(n) {
    var before = level(wk());
    n = Math.max(0, Math.min(12, n)); store('mb_wk_' + month, String(n));
    var after = level(n);
    if (after > before) celebrate(after);
    if (curBlock && $('#v-blocco').classList.contains('is-on')) openBlock(curBlock, true);
    $('#demo-wk').value = String(n);
  }

  /* ---------- interno del blocco: solo il mese spettante ---------- */
  var curBlock = BLOCKS[0];
  function openBlock(b, stay) {
    curBlock = b;
    $('#blk-eyebrow').textContent = 'Mesi ' + b.from + '–' + b.to;
    $('#blk-title').textContent = b.name.toUpperCase();
    $('#blk-sub').textContent = b.sub || '';
    var g = $('#month-grid'); g.innerHTML = '';
    for (var m = b.from; m <= b.to; m++) {
      var isOpen = month > 45 || m === month;
      var el = d.createElement('button'); el.type = 'button';
      var n = isOpen ? wk() : 0, lv = level(n);
      el.className = 'mo ' + (isOpen ? 'on lv' + lv : 'off');
      el.innerHTML = '<span class="ck-m">' + b.name + ' · Mese ' + m + '</span><h3>' + (b.sub || 'Percorso del mese') + '</h3>' +
        (isOpen
          ? '<span class="mo-f"><span class="go">Entra nel mese <span aria-hidden="true">→</span></span><span class="flies" title="' + n + ' allenamenti completati">' + FLY + FLY + FLY + '</span></span><span class="mo-n">' + n + ' / 12 allenamenti</span><span class="bar"><i style="--p:' + Math.round(n / 12 * 100) + '%"></i></span>'
          : '<span class="lk">' + SEAL + '</span><span class="mo-f"><span class="go">' + (m < month ? 'Il passato è trasmutato' : 'Si sbloccherà al giorno 31') + '</span><span class="flies">' + FLY + FLY + FLY + '</span></span><span class="bar"></span>');
      (function (mm, open) {
        el.addEventListener('click', function () {
          if (open) openLesson('M' + mm + ': Training 1', b.name.toUpperCase() + ' · MESE ' + mm, b.sub || 'Percorso del mese');
          else if (mm < month) msg('Il passato è trasmutato', 'Questo mese si è chiuso alle tue spalle per non frammentare la tua energia.');
          else msg('', TEMPIO);
        });
      })(m, isOpen);
      g.appendChild(el);
    }
    if (!stay) go('blocco');
  }

  /* ---------- navigazione tra viste ---------- */
  var navMap = { home: 'home', blocco: 'home', lezione: 'home', attivita: 'attivita', pratica: 'attivita', diario: 'diario', blog: 'blog', articolo: 'blog' };
  function go(v) {
    $$('.view').forEach(function (s) { s.classList.toggle('is-on', s.id === 'v-' + v); });
    $$('.d-nav button').forEach(function (b) { b.classList.toggle('on', b.getAttribute('data-go') === navMap[v]); });
    d.body.setAttribute('data-view', v);
    $('#side-toggle').hidden = (v !== 'lezione');
    $('#side').classList.remove('open');
    window.scrollTo(0, 0);
  }
  d.addEventListener('click', function (e) {
    var g = e.target.closest('[data-go]');
    if (g) { e.preventDefault(); go(g.getAttribute('data-go')); return; }
    var o = e.target.closest('[data-open]');
    if (o) { var m = d.getElementById(o.getAttribute('data-open')); if (m) m.showModal(); return; }
    if (e.target.closest('[data-close]')) { var dl = e.target.closest('dialog'); if (dl) dl.close(); return; }
    if (e.target.tagName === 'DIALOG' && e.target.id !== 'm-welcome') e.target.close();
  });
  $('#side-toggle').addEventListener('click', function () { $('#side').classList.toggle('open'); });
  $('#side-close').addEventListener('click', function () { $('#side').classList.remove('open'); });

  /* ---------- messaggio (portali bloccati) ---------- */
  function msg(t, p) { $('#msg-t').textContent = t; $('#msg-p').textContent = p; $('#msg-ico').innerHTML = SEAL; var m = $('#m-msg'); if (!m.open) m.showModal(); }

  /* ---------- Spazio Sacro: 3 modali ---------- */
  var SENTIERI = ['I', 'II', 'III', 'IV', 'V', 'VI'];
  var SACRO = {
    percorsi: { t: 'I Percorsi Alchemici', img: 'img/dash/pr-percorsi-center.jpg', sub: 'Viaggi di trasmutazione per sciogliere i blocchi profondi e ritrovare la tua Sovranità.',
      teach: [['Incrollabile: Dallo Zero alla Luce', '', 'incrollabile'], ['Alchimia Emotiva', '', 'alchimia'], ['Ricalibrazione del Sistema Nervoso', '', 'ricalibrazione']] },
    geometrie: { t: 'Geometrie del Corpo', img: 'img/dash/pr-geometrie.jpg', sub: 'Sequenze somatiche profonde per risvegliare l’energia vitale e rilasciare lo stress attraverso il movimento sacro.',
      teach: [['Kundalini Yoga', 'con Monica', 'geometrie'], ['Yin Yoga', 'con Greta', 'geometrie'], ['Yoga Nidra', 'con Camila', 'geometrie']],
      acc: 'I 6 Sentieri' },
    sound: { t: 'Sound Healing Vibrazionale', img: 'img/dash/pr-sound.jpg', sub: 'Frequenze sonore per ricalibrare il sistema nervoso, di giorno e durante il sonno.',
      teach: [['Brani Diurni', '7 min – 1 ora', 'sound'], ['Brani Notturni', '6 – 8 ore', 'sound']] }
  };
  $$('[data-sacro]').forEach(function (b) {
    b.addEventListener('click', function () {
      var s = SACRO[b.getAttribute('data-sacro')];
      $('#sc-img').src = s.img;
      $('#sc-t').textContent = s.t;
      $('#sc-sub').textContent = s.sub;
      $('#sc-teach').innerHTML = s.teach.map(function (t) { return '<button type="button" data-pr="' + t[2] + '" data-teacher="' + t[0] + '"><b>' + t[0] + '</b>' + (t[1] ? '<span>' + t[1] + '</span>' : '') + '<i aria-hidden="true">→</i></button>'; }).join('');
      $('#sc-h').textContent = s.acc || '';
      $('#sc-acc').innerHTML = s.acc ? SENTIERI.map(function (n) {
        return '<details><summary><small>' + n + '</small>Sentiero ' + n + '</summary><div class="acc-in"><p>Qui restano invariati i testi e i video del Sentiero già formattati da Marica.</p><a class="go" href="#" data-go="lezione">Entra nel Sentiero <span aria-hidden="true">→</span></a></div></details>';
      }).join('') : '';
      $('#m-sacro').showModal();
      $('#m-sacro .dlg-box').scrollTop = 0;
    });
  });
  $('#sc-teach').addEventListener('click', function (e) {
    var t = e.target.closest('[data-pr]'); if (!t) return;
    $('#m-sacro').close(); openPratica(t.getAttribute('data-pr'), t.getAttribute('data-teacher'), 'home');
  });
  $('#sc-acc').addEventListener('click', function (e) {
    var a = e.target.closest('a.go'); if (!a) return; e.preventDefault(); e.stopPropagation();
    var s = a.closest('details').querySelector('summary').lastChild.textContent;
    $('#m-sacro').close(); openLesson(s, $('#sc-t').textContent.toUpperCase(), s);
  });

  /* ---------- Le Mie Pratiche ---------- */
  var PR = [
    { k: 'movimento', t: 'Movimento', n: 42, img: 'img/dash/pr-movimento.jpg',
      info: ['Supporti Somatici & Pratiche Estemporanee', '<p>Questo spazio non sostituisce il tuo percorso principale, ma è una raccolta di pratiche extra da scegliere liberamente quando ne senti il bisogno. È un archivio di supporti mirati da inserire nella tua settimana in base a come ti senti e a cosa ti chiede il corpo in quel momento.</p><p><b>Quando usarlo:</b></p><p>Scegli lo <b>Stretching</b> nei giorni di recupero o quando senti il corpo rigido e vuoi rilassare i muscoli.</p><p>Scegli i <b>Focus Mirati (ABS/Glutei)</b> se in un determinato giorno hai più energia e vuoi aggiungere un lavoro extra specifico.</p><p>Scegli le <b>Meditazioni in Camminata</b> quando vuoi uscire all’aria aperta, liberare la mente e trasformare una semplice camminata in un momento di presenza.</p>'],
      v: [['GLUTEI/ABS', 'Focus Glutei', 18, 'breve'], ['GLUTEI/ABS', 'Focus ABS', 15, 'breve'], ['STRETCHING', 'Stretching profondo', 22, 'breve'], ['TOTAL BODY', 'Total Body', 35, 'esteso'], ['WALKING', 'Meditazione in Camminata', 30, 'esteso', ['aria', 'terra']]] },
    { k: 'sound', t: 'Sound Healing Vibrazionale', n: 33, img: 'img/dash/pr-sound.jpg',
      info: ['Sound Healing Vibrazionale', '<p>Un’area sacra dedicata alla guarigione cellulare passiva. Attraverso frequenze sonore ad altissimo livello, questo spazio ricalibra il tuo sistema nervoso in modo automatico, semplicemente lasciando scorrere la musica.</p><p><b>Brani Diurni (7 min - 1 ora):</b> Da ascoltare in qualsiasi momento: in macchina, mentre lavori da casa, durante un bagno caldo, al risveglio o con i bambini prima di dormire.</p><p><b>Brani Notturni (6 - 8 ore):</b> Da lasciare in sottofondo durante il sonno a volume quasi inesistente. Il tuo corpo assorbirà la vibrazione lavorando nel profondo della notte.</p>'],
      v: [['DIURNI', 'Frequenza di calma profonda', 7, 'esteso', ['aria']], ['DIURNI', 'Risveglio vibrazionale', 45, 'esteso', ['fuoco']], ['NOTTURNI', 'Rigenerazione notturna', 480, 'esteso', ['acqua']]] },
    { k: 'ricalibrazione', t: 'Ricalibrazione del Sistema Nervoso', s: 'Percorso', n: 18, img: 'img/dash/pr-ricalibrazione.jpg',
      info: ['Ricalibrazione del Sistema Nervoso', '<p>Le paure e i limiti non sono mentali: vivono nella carne e creano un filtro scuro con cui guardi il mondo. Questo percorso ti guida a scendere nel corpo per smantellare questi blocchi somatici, liberare la pace che già ti appartiene e imparare a non reagire più all’esterno.</p><p><b>I Portali di Accesso:</b> Un cammino in 3 fasi che unisce il risveglio dolce dei nervi, il Kundalini Yoga attraverso i 4 Elementi e il rilascio dall’asse sfinteri alla Corona. Include la pratica bonus Il Tocco della Sovrana.</p><p><b>Quando usarlo:</b> Quando senti la mente sovraccarica, quando ti accorgi di reagire d’impulso agli eventi esterni o quando percepisci che vecchi condizionamenti stanno bloccando fisicamente il tuo corpo.</p>'],
      v: [['BODY-FACIAL', 'Risveglio dei nervi', 14, 'esteso', ['acqua']], ['KUNDALINI', 'Breathe Work: Terra', 20, 'esteso', ['terra']], ['KUNDALINI', 'Breathe Work: Fuoco', 20, 'esteso', ['fuoco']], ['BONUS', 'Il Tocco della Sovrana', 16, 'esteso', ['acqua', 'aria']]] },
    { k: 'geometrie', t: 'Geometrie del Corpo', n: 77, img: 'img/dash/pr-geometrie.jpg',
      info: ['Geometrie del Corpo', '<p>Sequenze somatiche profonde che uniscono movimento sacro e meditazione. Attraverso il corpo, andiamo a liberare lo stress accumulato nel sistema nervoso e a sciogliere i blocchi emotivi trattenuti nei muscoli.</p><p><b>I Portali di Accesso:</b> Kundalini Yoga (attivazione energetica), Yin Yoga (rilassamento profondo delle fasce) e Yoga Nidra (rigenerazione mentale).</p><p><b>Quando usarlo:</b> Quando senti il corpo rigido, la mente sovraccarica o hai bisogno di scaricare tensioni profonde e ritrovare il tuo allineamento.</p>'],
      v: [['KUNDALINI YOGA', 'Kundalini Yoga con Monica', 32, 'esteso', ['fuoco']], ['YIN YOGA', 'Yin Yoga con Greta', 45, 'esteso', ['acqua', 'terra']], ['YOGA NIDRA', 'Yoga Nidra con Camila', 28, 'esteso', ['aria']]] },
    { k: 'alchimia', t: 'Alchimia Emotiva', s: 'Percorso', n: 8, img: 'img/dash/pr-alchimia.jpg',
      info: ['Alchimia Emotiva', '<p>Rieduca la tua mente e ricorda chi sei veramente. Questo modulo ti insegna a smettere di identificarti con le tue emozioni e a vederle per ciò che sono realmente: non ostacoli da evitare o giudicare, ma potenti portali energetici da attraversare, sentire e trasmutare.</p><p><b>Il Percorso in 2 Fasi:</b> Prima impariamo a cambiare ottica sulle emozioni attraverso preghiere sacre e meditazioni alchemiche; poi, passiamo all’azione fisica con un profondo lavoro di 4 settimane sul rilascio dell’asse sfinteri-mandibola, liberando l’energia vitale bloccata. Non possiamo liberare ciò che non conosciamo.</p><p><b>Quando usarlo:</b> Quando ti senti sopraffatta da ciò che provi, quando tendi a giudicare o reprimere i tuoi stati d’animo, o quando senti il bisogno di rieducare il tuo approccio interiore per trasformare il piombo emotivo in oro spirituale.</p>'],
      v: [['PREGHIERE', 'Preghiera n.1', 11, 'esteso', ['aria']], ['PREGHIERE', 'Preghiera n.2', 9, 'esteso', ['aria']], ['EMOZIONI , MEDITAZIONI ALCHEMICHE', 'Paura', 21, 'esteso', ['terra', 'fuoco']], ['EMOZIONI , MEDITAZIONI ALCHEMICHE', 'Rabbia', 18, 'esteso', ['fuoco']], ['RILASCIO', 'Asse sfinteri-mandibola · Settimana 1', 25, 'tutorial']] },
    { k: 'incrollabile', t: 'Incrollabile: Dallo Zero alla Luce', s: 'Percorso', n: 96, img: 'img/dash/pr-incrollabile.jpg',
      info: ['Incrollabile: Dallo Zero alla Luce', '<p>Un viaggio di radicale trasmutazione in 3 fasi per elevare la tua frequenza energetica, fisica e spirituale. Attraverso attivazioni alchemiche e pratiche quotidiane integrate, sciogliamo i blocchi profondi del corpo per farti ritrovare la tua totale Sovranità.</p><p><b>Quando usarlo:</b> Quando senti il bisogno impellente di cambiare rotta nella tua vita, superare un periodo di vuoto interiore, eliminare l’ansia del controllo ossessivo o riprendere in mano il tuo potere profondo per rinascere.</p>'],
      v: [['MODULO 1', 'La Purificazione', 24, 'esteso', ['acqua']], ['MODULO 2', 'La Riconnessione', 22, 'esteso', ['terra']], ['MODULO 3', 'L’Integrazione', 26, 'esteso', ['aria']], ['MODULO 4', 'La Manifestazione', 23, 'esteso', ['fuoco']]] }
  ];
  var PRK = {}; PR.forEach(function (p) { PRK[p.k] = p; });
  var COVER = { esteso: 'img/dash/cover-esteso.jpg', breve: 'img/dash/cover-breve.jpg', tutorial: 'img/dash/cover-tutorial.jpg' };

  $('#pr-grid').innerHTML = PR.map(function (p) {
    return '<div class="pr" role="button" tabindex="0" data-pr="' + p.k + '" aria-label="' + p.t + ', ' + p.n + ' Pratiche"><div class="pr-img"><img src="' + p.img + '" alt="" loading="lazy" width="1600" height="900"><span class="pr-n">' + p.n + ' Pratiche</span></div>' +
      '<div class="pr-b"><h3>' + (p.s ? '<small>' + p.s + '</small>' : '') + p.t + '</h3><button type="button" class="pr-i" data-info="' + p.k + '" aria-label="Cos’è ' + p.t + '">♦</button><span class="pr-plus" aria-hidden="true">+</span></div></div>';
  }).join('');
  $('#pr-grid').addEventListener('click', function (e) {
    var i = e.target.closest('[data-info]');
    if (i) { var p = PRK[i.getAttribute('data-info')]; $('#info-t').textContent = p.info[0]; $('#info-b').innerHTML = p.info[1]; $('#m-info').showModal(); return; }
    var c = e.target.closest('[data-pr]'); if (c) openPratica(c.getAttribute('data-pr'));
  });
  $('#pr-grid').addEventListener('keydown', function (e) { if ((e.key === 'Enter' || e.key === ' ') && e.target.matches('.pr')) { e.preventDefault(); openPratica(e.target.getAttribute('data-pr')); } });

  function openPratica(k, teacher, from) {
    var p = PRK[k];
    var bk = $('#pv-back'); bk.setAttribute('data-go', from || 'attivita'); bk.textContent = from === 'home' ? '← Home' : '← Le Mie Pratiche';
    $('#pv-n').textContent = p.n + ' Pratiche';
    $('#pv-t').textContent = p.t;
    var list = p.v;
    if (teacher) { var f = list.filter(function (v) { return v[1].indexOf(teacher) === 0 || v[0].indexOf(teacher.toUpperCase()) === 0; }); if (f.length) list = f; }
    $('#vid-grid').innerHTML = list.map(function (v) {
      var dur = v[2] >= 60 ? Math.round(v[2] / 60) + ' ore' : v[2] + ' min';
      return '<button type="button" class="vid" data-v="' + v[1] + '" data-c="' + v[3] + '"><img src="' + COVER[v[3]] + '" alt="" loading="lazy" width="1600" height="900"' + (v[3] === 'breve' ? ' class="light"' : '') + '><span><span class="db-tag">' + v[0] + '</span><h4>' + v[1] + '</h4><span class="vid-m">' + (v[4] ? els(v[4]) : '') + '<span>' + dur + '</span></span></span></button>';
    }).join('');
    go('pratica');
    if (from) $$('.d-nav button').forEach(function (b) { b.classList.toggle('on', b.getAttribute('data-go') === from); });
  }
  $('#vid-grid').addEventListener('click', function (e) {
    var v = e.target.closest('.vid'); if (!v) return;
    openLesson(v.getAttribute('data-v'), $('#pv-t').textContent.toUpperCase(), v.getAttribute('data-v'), v.getAttribute('data-c'));
  });

  /* ---------- lezione: copertina per categoria + titolo dinamico ---------- */
  function setCover(c) {
    var p = $('#player'); p.setAttribute('data-cover', c); $('video', p).setAttribute('poster', COVER[c]);
    $$('.seg button').forEach(function (x) { var on = x.getAttribute('data-cover') === c; x.classList.toggle('on', on); x.setAttribute('aria-selected', on); });
  }
  function openLesson(title, sub, barTitle, cover) {
    $('#les-title').textContent = barTitle || title; $('#les-sub').textContent = sub;
    $('#les-h').textContent = title; $('#p-title').textContent = title;
    setCover(cover || 'esteso');
    $('#btn-done').classList.remove('is-done'); $('span', $('#btn-done')).textContent = 'Segna come completato';
    go('lezione');
  }
  var TUT = [['Esercizio 1: Vacuum', 5], ['Esercizio 2: Articolazioni + Respirazione', 6], ['Esercizio 3: Ponte da terra training 1 e 2', 6], ['Esercizio 4: Squat', 6], ['Esercizio 5: Stacco', 4], ['Esercizio 6: Affondi posteriori alternati / Kick back alternativa', 10], ['Esercizio 7: Rematore singolo', 4], ['Esercizio 8: Bicipiti / tricipiti', 3], ['Esercizio 9: Alzate sopra la testa (Spalle)', 4]];
  $('#tut-list').innerHTML = TUT.map(function (t) { return '<li><a href="#" data-tut><span>' + t[0] + '</span><em>' + t[1] + ' min</em></a></li>'; }).join('');
  $('#side').addEventListener('click', function (e) {
    var a = e.target.closest('.side-l a'); if (!a) return; e.preventDefault();
    var t = $('span', a).textContent;
    $$('.side-l li').forEach(function (li) { li.classList.toggle('on', li.contains(a)); });
    $('#les-h').textContent = t; $('#p-title').textContent = t;
    setCover(a.hasAttribute('data-tut') ? 'tutorial' : 'esteso');
    $('#side').classList.remove('open');
  });
  $$('.seg button').forEach(function (b) { b.addEventListener('click', function () { setCover(b.getAttribute('data-cover')); }); });
  $('#btn-done').addEventListener('click', function () {
    var on = this.classList.toggle('is-done');
    $('span', this).textContent = on ? 'Completato ✓' : 'Segna come completato';
    setWk(wk() + (on ? 1 : -1));
  });

  /* ---------- celebrazione: scia di polvere d'oro → farfalla di geometria sacra → si dissolve ---------- */
  function butterflyPoints(n) {
    var L = [ // linee della farfalla geometrica (lato destro, poi specchiato) + corpo + cerchio
      [[0, -0.1], [0.72, -0.82], [0.96, -0.34], [0.52, 0.02], [0, 0.02]],
      [[0, 0.06], [0.6, 0.08], [0.7, 0.56], [0.28, 0.72], [0, 0.26]],
      [[0.72, -0.82], [0.52, 0.02], [0.7, 0.56]],
      [[0, -0.34], [0.2, -0.62]]
    ];
    var segs = [];
    L.forEach(function (pl) { for (var i = 0; i < pl.length - 1; i++) { segs.push([pl[i], pl[i + 1]]); segs.push([[-pl[i][0], pl[i][1]], [-pl[i + 1][0], pl[i + 1][1]]]); } });
    segs.push([[0, -0.36], [0, 0.62]]);
    for (var a = 0; a < 48; a++) segs.push([[Math.cos(a / 48 * 6.283) * 1.12, Math.sin(a / 48 * 6.283) * 1.12], [Math.cos((a + 1) / 48 * 6.283) * 1.12, Math.sin((a + 1) / 48 * 6.283) * 1.12]]);
    var len = segs.map(function (s) { return Math.hypot(s[1][0] - s[0][0], s[1][1] - s[0][1]); }), tot = len.reduce(function (x, y) { return x + y; }, 0), pts = [];
    segs.forEach(function (s, i) { var k = Math.max(1, Math.round(n * len[i] / tot)); for (var j = 0; j < k; j++) { var t = Math.random(); pts.push([s[0][0] + (s[1][0] - s[0][0]) * t, s[0][1] + (s[1][1] - s[0][1]) * t]); } });
    return pts;
  }
  function celebrate(lv) {
    if (reduced) return;
    var c = $('#fx-c'), x = c.getContext('2d'), dpr = Math.min(2, window.devicePixelRatio || 1);
    var W = innerWidth, H = innerHeight; c.width = W * dpr; c.height = H * dpr; c.hidden = false; x.setTransform(dpr, 0, 0, dpr, 0, 0);
    var S = Math.min(W, H) * 0.26, cx = W / 2, cy = H / 2;
    var cols = lv === 1 ? ['198,90,110', '123,38,55', '198,161,91'] : lv === 2 ? ['198,161,91', '154,116,60', '228,210,170'] : ['228,210,170', '198,161,91', '242,235,221'];
    var P = butterflyPoints(lv === 3 ? 900 : 650).map(function (p, i) {
      var sy = H * (0.2 + Math.random() * 0.8), sx = -40 - Math.random() * W * 0.5; // la scia entra da sinistra e attraversa lo schermo
      return { sx: sx, sy: sy, tx: cx + p[0] * S, ty: cy + p[1] * S, kx: W * (0.2 + Math.random() * 0.5), ky: H * Math.random(), d: Math.random() * 0.5, r: 0.9 + Math.random() * 1.7, c: cols[i % 3], vx: (Math.random() - 0.5) * 0.6, vy: -Math.random() * 0.5 - 0.1 };
    });
    var t0 = performance.now(), T1 = 2200, T2 = 3100, T3 = 4800;
    function ease(t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }
    (function frame(now) {
      var t = now - t0; x.clearRect(0, 0, W, H);
      x.globalCompositeOperation = 'source-over'; x.fillStyle = 'rgba(0,0,0,' + (0.6 * Math.min(1, t / 400, (T3 - t) / 600)).toFixed(3) + ')'; x.fillRect(0, 0, W, H); // velo scuro
      x.globalCompositeOperation = 'lighter';
      if (t > T1 && t < T3) { var g = x.createRadialGradient(cx, cy, 0, cx, cy, S * 1.6), a = t < T2 ? (t - T1) / (T2 - T1) : 1 - (t - T2) / (T3 - T2); g.addColorStop(0, 'rgba(198,161,91,' + 0.12 * a + ')'); g.addColorStop(1, 'rgba(198,161,91,0)'); x.fillStyle = g; x.fillRect(0, 0, W, H); }
      P.forEach(function (p) {
        var px, py, al;
        if (t < T1) { var k = ease(Math.max(0, Math.min(1, (t / T1 - p.d * 0.4) / (1 - p.d * 0.4)))), u = 1 - k; px = u * u * p.sx + 2 * u * k * p.kx + k * k * p.tx; py = u * u * p.sy + 2 * u * k * p.ky + k * k * p.ty; al = 0.25 + 0.75 * k; }
        else if (t < T2) { px = p.tx; py = p.ty; al = 0.75 + 0.25 * Math.sin(t / 90 + p.d * 20); }
        else { var q = (t - T2) / (T3 - T2); px = p.tx + p.vx * q * 120; py = p.ty + p.vy * q * 120; al = Math.max(0, 1 - q); }
        x.fillStyle = 'rgba(' + p.c + ',' + al.toFixed(3) + ')'; x.beginPath(); x.arc(px, py, p.r, 0, 6.283); x.fill();
      });
      if (t < T3) requestAnimationFrame(frame); else { x.clearRect(0, 0, W, H); c.hidden = true; }
    })(t0);
  }

  /* ---------- pratiche del giorno (Allenamento + Meditazione) → anelli calendario ---------- */
  var core = {};
  try { core = JSON.parse(store('mb_core') || 'null'); } catch (e) { core = null; }
  function key(x) { return x.getFullYear() + '-' + (x.getMonth() + 1) + '-' + x.getDate(); }
  if (!core) { // demo: qualche giorno passato già tracciato
    core = {}; var s0 = new Date(); s0.setHours(0, 0, 0, 0);
    for (var i = 1; i <= 24; i++) { var dd = new Date(s0); dd.setDate(s0.getDate() - i); var r = (dd.getDate() * 7 + dd.getMonth() * 3) % 5; if (r) core[key(dd)] = { w: r > 2 ? 1 : 0, m: r !== 3 ? 1 : 0 }; }
    store('mb_core', JSON.stringify(core));
  }
  function ring(dt) { var c = core[key(dt)]; if (!c || !(c.w || c.m)) return ''; return c.w && c.m ? ' rb' : c.w ? ' rw' : ' rm'; } // rw allenamento · rm meditazione · rb entrambe

  /* ---------- calendario settimanale (home) ---------- */
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
      var cls = (dt.getTime() === today.getTime() ? 'today' : '') + ring(dt);
      if (dt.getMonth() !== mon.getMonth()) cls += ' dim';
      h += '<div class="cd ' + cls + '"><span>' + LET[i] + '</span><span class="n">' + dt.getDate() + '</span></div>';
    }
    $('#cal-days').innerHTML = h;
  }
  $('#cal-prev').addEventListener('click', function () { mon.setDate(mon.getDate() - 7); renderCal(); });
  $('#cal-next').addEventListener('click', function () { mon.setDate(mon.getDate() + 7); renderCal(); });
  $('#cal-today').addEventListener('click', function () { mon = mondayOf(today); renderCal(); });
  $('#cal-set').addEventListener('click', function () { $('#m-cal').showModal(); });
  $$('[data-seg]').forEach(function (s) { s.addEventListener('click', function (e) { var b = e.target.closest('button'); if (!b) return; $$('button', s).forEach(function (x) { x.classList.toggle('on', x === b); }); }); });
  $$('.days').forEach(function (s) { s.addEventListener('click', function (e) { var b = e.target.closest('button'); if (b) b.classList.toggle('on'); }); });

  /* ---------- Blog (lettura interna) ---------- */
  var POSTS = [
    { c: 'corpo-sacro', cn: 'Corpo Sacro', img: 'img/dash/pr-movimento.jpg', t: 'Titolo dell’articolo', ex: 'Breve estratto dell’articolo. I contenuti reali arrivano dal database del blog.' },
    { c: 'alchimia', cn: 'Alchimia', img: 'img/dash/pr-percorsi-center.jpg', t: 'Titolo dell’articolo', ex: 'Breve estratto dell’articolo. I contenuti reali arrivano dal database del blog.' },
    { c: 'coscienza', cn: 'Coscienza', img: 'img/dash/pr-alchimia.jpg', t: 'Titolo dell’articolo', ex: 'Breve estratto dell’articolo. I contenuti reali arrivano dal database del blog.' }
  ];
  $('#blog-grid').innerHTML = POSTS.map(function (p, i) { return '<button type="button" class="post" data-post="' + i + '" data-c="' + p.c + '"><img src="' + p.img + '" alt="" loading="lazy" width="1600" height="900"><div><p class="eyebrow">' + p.cn + '</p><h3>' + p.t + '</h3><p>' + p.ex + '</p></div></button>'; }).join('');
  $('.blog-f').addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b) return; var c = b.getAttribute('data-cat');
    $$('.blog-f button').forEach(function (x) { x.classList.toggle('on', x === b); });
    $$('#blog-grid .post').forEach(function (p) { p.hidden = !!c && p.getAttribute('data-c') !== c; });
  });
  $('#blog-grid').addEventListener('click', function (e) {
    var b = e.target.closest('[data-post]'); if (!b) return; var p = POSTS[+b.getAttribute('data-post')];
    $('#art-cat').textContent = p.cn; $('#art-t').textContent = p.t; $('#art-img').src = p.img;
    $('#art-body').innerHTML = '<p>' + p.ex + '</p><p>Qui viene mostrato l’articolo completo, letto direttamente dentro l’area privata senza uscire dalla piattaforma.</p>';
    go('articolo');
  });

  /* ---------- benvenuto: una sola volta ---------- */
  var W = $('#m-welcome');
  W.addEventListener('cancel', function (e) { e.preventDefault(); }); // non si chiude con Esc
  $('#w-go').addEventListener('click', function () { store('mb_welcome_done', '1'); W.close(); });
  function maybeWelcome(force) { if (force || !store('mb_welcome_done')) setTimeout(function () { if (!W.open) W.showModal(); }, force ? 0 : 1000); }

  /* ---------- demo ---------- */
  var sel = $('#demo-month'); sel.value = String(month);
  if (sel.value !== String(month)) { var o = d.createElement('option'); o.value = month; o.textContent = month; sel.appendChild(o); sel.value = String(month); }
  sel.addEventListener('change', function () { month = +sel.value; store('mb_demo_month', String(month)); $('#demo-wk').value = String(wk()); renderChakra(); go('home'); });
  var wsel = $('#demo-wk'); wsel.value = String(wk());
  if (wsel.value !== String(wk())) { var ow = d.createElement('option'); ow.textContent = wk(); wsel.appendChild(ow); wsel.value = String(wk()); }
  wsel.addEventListener('change', function () { setWk(+wsel.value); });
  $('#demo-welcome').addEventListener('click', function () { store('mb_welcome_done', null); maybeWelcome(true); });

  d.body.setAttribute('data-view', 'home');
  renderCal(); renderChakra(); hideRemoved(); maybeWelcome(false);

  /* ---------- Il Tuo Diario: calendario mensile + anelli + aggiungi pratica ---------- */
  (function () {
    var MESI = MONTHS;
    var GG = ['Domenica', 'Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato'];
    var now = new Date(), cur = new Date(now.getFullYear(), now.getMonth(), 1), selD = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    var items = {};
    try { items = JSON.parse(store('mb_diario') || '{}') || {}; } catch (e) { items = {}; }
    function same(a, b) { return key(a) === key(b); }
    function save() { store('mb_diario', JSON.stringify(items)); }
    function render() {
      $('#mc-title').textContent = MESI[cur.getMonth()] + ' ' + cur.getFullYear();
      var first = (new Date(cur.getFullYear(), cur.getMonth(), 1).getDay() + 6) % 7;
      var n = new Date(cur.getFullYear(), cur.getMonth() + 1, 0).getDate(), h = '';
      for (var i = 0; i < first; i++) h += '<i></i>';
      for (var dd = 1; dd <= n; dd++) {
        var dt = new Date(cur.getFullYear(), cur.getMonth(), dd), k = key(dt);
        var cl = (same(dt, now) ? ' today' : '') + (same(dt, selD) ? ' sel' : '') + (items[k] && items[k].length ? ' has' : '') + ring(dt);
        h += '<button type="button" class="' + cl.trim() + '" data-d="' + dd + '" aria-label="' + dd + ' ' + MESI[cur.getMonth()] + '"><span>' + dd + '</span></button>';
      }
      $('#mc-grid').innerHTML = h;
      day();
    }
    function day() {
      $('#dia-date').textContent = GG[selD.getDay()] + ' ' + selD.getDate() + ' ' + MESI[selD.getMonth()].slice(0, 3) + ' ' + selD.getFullYear();
      var c = core[key(selD)] || {};
      $$('#core button').forEach(function (b) { var on = !!c[b.getAttribute('data-core')]; b.classList.toggle('on', on); b.setAttribute('aria-pressed', on); });
      var arr = items[key(selD)] || [];
      $('#dia-list').innerHTML = arr.map(function (a, i) { return '<li><div><b>' + a.a + '</b><small>' + a.t + '</small></div><button type="button" data-rm="' + i + '">Rimuovi</button></li>'; }).join('');
      $('#dia-empty').hidden = arr.length > 0;
    }
    $('#core').addEventListener('click', function (e) {
      var b = e.target.closest('[data-core]'); if (!b) return;
      var k = key(selD), c = core[k] = core[k] || {}, f = b.getAttribute('data-core');
      c[f] = c[f] ? 0 : 1; store('mb_core', JSON.stringify(core)); render(); renderCal();
    });
    $('#mc-grid').addEventListener('click', function (e) {
      var b = e.target.closest('button'); if (!b) return;
      selD = new Date(cur.getFullYear(), cur.getMonth(), +b.getAttribute('data-d')); render();
    });
    $('#mc-prev').addEventListener('click', function () { cur.setMonth(cur.getMonth() - 1); render(); });
    $('#mc-next').addEventListener('click', function () { cur.setMonth(cur.getMonth() + 1); render(); });
    $('#mc-today').addEventListener('click', function () { cur = new Date(now.getFullYear(), now.getMonth(), 1); selD = new Date(now.getFullYear(), now.getMonth(), now.getDate()); render(); });
    $('#dia-list').addEventListener('click', function (e) {
      var b = e.target.closest('[data-rm]'); if (!b) return;
      var k = key(selD); items[k].splice(+b.getAttribute('data-rm'), 1); save(); render();
    });
    $('#add-form').addEventListener('submit', function (e) {
      e.preventDefault();
      var k = key(selD); (items[k] = items[k] || []).push({ a: $('#add-act').value, t: $('#add-time').value });
      save(); $('#add-form').reset(); $('#m-add').close(); render();
    });
    $('#m-add').addEventListener('close', function () { $('#add-form').reset(); });
    render();
  })();
})();
