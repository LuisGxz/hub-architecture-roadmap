/* ============================================================
   Hub roadmap - estado local, repeticion espaciada y utilidades
   Todo vive en localStorage del navegador. No sale de tu maquina.
   ============================================================ */
(function () {
  'use strict';

  var K = {
    start: 'hub.start',
    prog: 'hub.progress',
    rep: 'hub.repaso',
    log: 'hub.log'
  };

  var DEFAULT_START = '2026-09-14'; // lunes de la semana 1

  // Modulos de la via A (arquitectura) y fases de la via B (devops).
  var MODULES = [
    { id: 'm1', via: 'a', n: 'M1', t: 'Identidad y tenencia' },
    { id: 'm2', via: 'a', n: 'M2', t: 'Modelo del catálogo' },
    { id: 'm3', via: 'a', n: 'M3', t: 'Búsqueda y reviews' },
    { id: 'm4', via: 'a', n: 'M4', t: 'Azure y estimación' },
    { id: 'm5', via: 'a', n: 'M5', t: 'Fase 0 y estándares' },
    { id: 'm6', via: 'a', n: 'M6', t: 'Seguridad aplicada' },
    { id: 'm7', via: 'a', n: 'M7', t: 'Performance de datos' },
    { id: 'm8', via: 'a', n: 'M8', t: 'Patrones cloud' },
    { id: 'm9', via: 'a', n: 'M9', t: 'Observabilidad' },
    { id: 'm10', via: 'a', n: 'M10', t: 'Documentar la arquitectura' },
    { id: 'f0', via: 'b', n: 'F0', t: 'El flujo y el vocabulario' },
    { id: 'f1', via: 'b', n: 'F1', t: 'Tu primer build pipeline' },
    { id: 'f2', via: 'b', n: 'F2', t: 'Variables, secrets y config' },
    { id: 'f3', via: 'b', n: 'F3', t: 'Environments y aprobaciones' },
    { id: 'f4', via: 'b', n: 'F4', t: 'Montar staging' },
    { id: 'f5', via: 'b', n: 'F5', t: 'Calidad y branch policies' }
  ];

  // Tarjetas de repaso. El orden es el de la columna "Ya lo tienes".
  var CARDS = [
    { id: 'r1', t: 'OOP, SOLID y TDD' },
    { id: 'r2', t: '.NET, TypeScript y Angular' },
    { id: 'r3', t: 'REST, SQL y ACID' },
    { id: 'r4', t: 'Auth strategies e IAM' },
    { id: 'r5', t: 'API gateway, colas y event bus' },
    { id: 'r6', t: 'Capas y cliente-servidor' },
    { id: 'r7', t: 'Git, CI/CD, Scrum y Azure DevOps' },
    { id: 'r8', t: 'HTTP y HTTPS' }
  ];

  // Que toca cada semana. Las seis primeras llevan las dos vias en paralelo.
  var WEEKPLAN = {
    1: { a: 'm1', b: 'f0' },
    2: { a: 'm2', b: 'f1' },
    3: { a: 'm3', b: 'f2' },
    4: { a: 'm4', b: 'f3' },
    5: { a: 'm5', b: 'f4' },
    6: { a: 'm5', b: 'f5' },
    9: { a: 'm6' }, 13: { a: 'm7' }, 17: { a: 'm8' }, 21: { a: 'm9' }, 25: { a: 'm10' }
  };

  function planFor(week) {
    var keys = Object.keys(WEEKPLAN).map(Number).sort(function (x, y) { return x - y; });
    var found = null;
    keys.forEach(function (k) { if (k <= week) found = k; });
    return found ? WEEKPLAN[found] : null;
  }

  // Escalera de repeticion espaciada, en dias.
  var LADDER = [1, 3, 7, 21, 60];

  /* ---------- almacenamiento ---------- */
  function read(key, fallback) {
    try {
      var raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (e) { return fallback; }
  }
  function write(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) { /* modo privado */ }
  }

  /* ---------- fechas ---------- */
  function today() {
    var d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
  }
  function iso(d) {
    var m = String(d.getMonth() + 1).padStart(2, '0');
    var day = String(d.getDate()).padStart(2, '0');
    return d.getFullYear() + '-' + m + '-' + day;
  }
  function parse(s) {
    var p = String(s || '').split('-');
    return new Date(Number(p[0]), Number(p[1]) - 1, Number(p[2]));
  }
  function addDays(d, n) {
    var c = new Date(d.getTime());
    c.setDate(c.getDate() + n);
    return c;
  }
  function daysBetween(a, b) {
    return Math.round((b.getTime() - a.getTime()) / 86400000);
  }
  function fmt(d) {
    var meses = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
    return d.getDate() + ' ' + meses[d.getMonth()];
  }
  function startDate() {
    return parse(read(K.start, DEFAULT_START));
  }
  function currentWeek() {
    var d = daysBetween(startDate(), today());
    if (d < 0) return 0;            // todavia no arranca
    return Math.floor(d / 7) + 1;   // semana 1, 2, 3...
  }

  /* ---------- progreso de modulos ---------- */
  function getProg() { return read(K.prog, {}); }
  function setState(id, state) {
    var p = getProg();
    if (state === 'todo') { delete p[id]; } else { p[id] = state; }
    write(K.prog, p);
    paintStates();
    paintHeaderPct();
    paintToday();
  }
  function progressPct() {
    var p = getProg(), done = 0;
    MODULES.forEach(function (m) { if (p[m.id] === 'done') done++; });
    return { done: done, total: MODULES.length, pct: Math.round((done / MODULES.length) * 100) };
  }

  function injectStates() {
    var arts = document.querySelectorAll('article.module[id]');
    Array.prototype.forEach.call(arts, function (art) {
      var id = art.id;
      if (!MODULES.some(function (m) { return m.id === id; })) return;
      if (art.querySelector('.state')) return;
      var body = art.querySelector('.module-body') || art;
      var wrap = document.createElement('div');
      wrap.className = 'state';
      wrap.setAttribute('data-state-for', id);
      wrap.innerHTML =
        '<span class="lbl">ESTADO</span>' +
        '<button type="button" data-set="todo">Pendiente</button>' +
        '<button type="button" data-set="doing">En curso</button>' +
        '<button type="button" data-set="done">Artefacto entregado</button>';
      body.appendChild(wrap);
    });
  }

  function paintStates() {
    var p = getProg();
    Array.prototype.forEach.call(document.querySelectorAll('.state[data-state-for]'), function (w) {
      var id = w.getAttribute('data-state-for');
      var st = p[id] || 'todo';
      Array.prototype.forEach.call(w.querySelectorAll('button[data-set]'), function (b) {
        b.setAttribute('aria-pressed', String(b.getAttribute('data-set') === st));
      });
      var art = document.getElementById(id);
      if (art) {
        art.classList.toggle('done', st === 'done');
        art.classList.toggle('doing', st === 'doing');
      }
    });
  }

  function paintHeaderPct() {
    var el = document.querySelector('.sitebar .pct');
    if (!el) return;
    var pr = progressPct();
    var due = dueCards().length;
    el.textContent = pr.done + '/' + pr.total + ' módulos' + (due ? '  ·  ' + due + ' de repaso' : '');
  }

  /* ---------- repeticion espaciada ---------- */
  function getRep() { return read(K.rep, {}); }

  function cardState(id) {
    var r = getRep()[id];
    if (!r) return { lvl: -1, last: null, next: null, status: 'nunca' };
    var next = r.next ? parse(r.next) : null;
    var due = !next || next <= today();
    return {
      lvl: r.lvl,
      last: r.last ? parse(r.last) : null,
      next: next,
      status: r.lvl >= LADDER.length - 1 ? 'dominado' : (due ? 'toca' : 'al dia')
    };
  }

  function dueCards() {
    return CARDS.filter(function (c) {
      var s = cardState(c.id);
      return s.status === 'nunca' || s.status === 'toca';
    });
  }

  // result: 'ok' sube un escalon, 'flojo' baja a 1 dia, 'dominado' salta al final.
  function gradeCard(id, result) {
    var rep = getRep();
    var cur = rep[id] ? rep[id].lvl : -1;
    var lvl;
    if (result === 'dominado') lvl = LADDER.length - 1;
    else if (result === 'flojo') lvl = 0;
    else lvl = Math.min(cur + 1, LADDER.length - 1);
    var t = today();
    rep[id] = { lvl: lvl, last: iso(t), next: iso(addDays(t, LADDER[lvl])) };
    write(K.rep, rep);
    paintRepaso();
    paintHeaderPct();
    paintToday();
  }

  function resetCard(id) {
    var rep = getRep();
    delete rep[id];
    write(K.rep, rep);
    paintRepaso();
    paintHeaderPct();
    paintToday();
  }

  function paintRepaso() {
    Array.prototype.forEach.call(document.querySelectorAll('.rcard[id]'), function (card) {
      var s = cardState(card.id);
      var box = card.querySelector('.r-status');
      if (box) {
        if (s.status === 'nunca') {
          box.innerHTML = '<b>Sin diagnosticar</b>Contesta las 5 preguntas';
        } else if (s.status === 'dominado') {
          box.innerHTML = '<b>Dominado</b>Vuelve el ' + fmt(s.next);
        } else if (s.status === 'toca') {
          box.innerHTML = '<b>Toca repasar</b>Último: ' + fmt(s.last);
        } else {
          box.innerHTML = '<b>Al día</b>Vuelve el ' + fmt(s.next);
        }
      }
      card.classList.toggle('mastered', s.status === 'dominado');
      card.classList.toggle('duenow', s.status === 'toca' || s.status === 'nunca');
    });

    var panel = document.getElementById('due');
    if (panel) {
      var due = dueCards();
      if (!due.length) {
        panel.className = 'due empty';
        panel.innerHTML = '<h3>Nada que repasar hoy</h3><p>Las ocho tarjetas están al día. Vuelve cuando el panel te llame; repasar lo que ya sabes es tiempo robado a lo que no.</p>';
      } else {
        panel.className = 'due';
        panel.innerHTML = '<h3>Hoy toca repasar: ' + due.length + (due.length === 1 ? ' tarjeta' : ' tarjetas') + '</h3>' +
          '<p>Veinte minutos, no más. Contesta las preguntas de diagnóstico en voz alta antes de mirar nada.</p><ul>' +
          due.map(function (c) { return '<li><a href="#' + c.id + '">' + c.t + '</a></li>'; }).join('') +
          '</ul>';
      }
    }
  }

  /* ---------- panel "que hago hoy" ---------- */
  function paintToday() {
    var el = document.getElementById('today');
    if (!el) return;
    var w = currentWeek();
    var p = getProg();
    var due = dueCards().length;
    var start = startDate();

    var titulo, texto, acciones = [];

    if (w === 0) {
      titulo = 'El plan arranca el ' + fmt(start);
      texto = 'Faltan ' + daysBetween(today(), start) + ' días. Lo único útil de aquí a entonces: crear el repo <code>hub-lab</code> vacío y la organización personal en dev.azure.com. Cinco minutos, y la semana 1 empieza sin fricción.';
      acciones.push(['repaso.html', 'Diagnosticar el repaso', 'ghost']);
    } else {
      var byId = function (id) {
        var hit = null;
        MODULES.forEach(function (m) { if (m.id === id) hit = m; });
        return hit;
      };
      var pend = MODULES.filter(function (m) { return p[m.id] !== 'done'; });
      var doing = MODULES.filter(function (m) { return p[m.id] === 'doing'; });
      // Prioridad: lo que toca esta semana segun el calendario; si ya esta
      // hecho, lo que este en curso; y si no, el primer pendiente.
      var plan = planFor(w) || {};
      var focus = null;
      [plan.a, plan.b].forEach(function (id) {
        if (!focus && id && p[id] !== 'done') focus = byId(id);
      });
      focus = focus || doing[0] || pend[0];
      if (!focus) {
        titulo = 'Terminaste las dos vías';
        texto = 'Diez módulos y seis fases con artefacto entregado. Lo que sigue está en las etapas post-V1 de la vía de arquitectura.';
      } else if (due > 0) {
        titulo = 'Repaso primero: ' + due + (due === 1 ? ' tarjeta' : ' tarjetas') + ' vencidas';
        texto = 'Veinte minutos de repaso y después sigues con <b>' + focus.n + ' · ' + focus.t + '</b>. El repaso vencido se acumula y deja de servir.';
        acciones.push(['repaso.html', 'Ir al repaso', '']);
        acciones.push([(focus.via === 'a' ? 'arquitectura.html' : 'devops.html') + '#' + focus.id, 'Seguir con ' + focus.n, 'ghost']);
      } else {
        titulo = focus.n + ' · ' + focus.t;
        texto = 'Semana ' + w + '. ' + (doing.length ? 'Lo tienes marcado en curso: cierra el artefacto antes del domingo.' : 'Sin empezar. Abre el módulo y arranca por el bloque de estudio.');
        acciones.push([(focus.via === 'a' ? 'arquitectura.html' : 'devops.html') + '#' + focus.id, 'Abrir ' + focus.n, '']);
      }
    }

    el.querySelector('.t-body').innerHTML =
      '<h3>' + titulo + '</h3><p>' + texto + '</p>' +
      '<div class="t-actions">' + acciones.map(function (a) {
        return '<a class="btn ' + a[2] + '" href="' + a[0] + '">' + a[1] + '</a>';
      }).join('') + '</div>';

    var dateEl = el.querySelector('.date');
    if (dateEl) {
      var d = today();
      dateEl.textContent = (w === 0 ? 'sin arrancar' : 'semana ' + w) + '  ·  ' + fmt(d);
    }

    var bar = document.getElementById('pbar');
    if (bar) {
      var pr = progressPct();
      bar.querySelector('i').style.width = pr.pct + '%';
      var lbl = document.getElementById('pbar-label');
      if (lbl) lbl.textContent = pr.done + ' de ' + pr.total + ' módulos con artefacto entregado  ·  ' + pr.pct + '%';
    }

    var vias = document.querySelectorAll('.via [data-via-count]');
    Array.prototype.forEach.call(vias, function (node) {
      var via = node.getAttribute('data-via-count');
      if (via === 'r') {
        var dom = CARDS.filter(function (c) { return cardState(c.id).status === 'dominado'; }).length;
        node.textContent = dom + ' de ' + CARDS.length + ' tarjetas dominadas';
      } else {
        var list = MODULES.filter(function (m) { return m.via === via; });
        var d = list.filter(function (m) { return getProg()[m.id] === 'done'; }).length;
        node.textContent = d + ' de ' + list.length + ' con artefacto';
      }
    });
  }

  /* ---------- linea de tiempo y fechas de semana ---------- */
  function paintTimeline() {
    var t = document.getElementById('timeline');
    if (t) {
      var w = currentWeek();
      Array.prototype.forEach.call(t.querySelectorAll('tr[data-week]'), function (tr) {
        tr.classList.toggle('now', Number(tr.getAttribute('data-week')) === w);
      });
    }
    // "Sem 3 · 28 sep" en la tabla de calendario
    Array.prototype.forEach.call(document.querySelectorAll('[data-weekdate]'), function (el) {
      var n = Number(el.getAttribute('data-weekdate'));
      el.textContent = 'Sem ' + n + ' · ' + fmt(addDays(startDate(), (n - 1) * 7));
    });
    // "Semana 1 · 14 al 20 sep" en la cabecera de cada modulo
    Array.prototype.forEach.call(document.querySelectorAll('[data-weekrange]'), function (el) {
      var n = Number(el.getAttribute('data-weekrange'));
      var ini = addDays(startDate(), (n - 1) * 7);
      el.textContent = 'Semana ' + n + ' · ' + fmt(ini) + ' al ' + fmt(addDays(ini, 6));
    });
  }

  /* ---------- movil: tablas apiladas ---------- */
  // En pantallas estrechas cada fila se dibuja como tarjeta y cada celda
  // necesita su propia etiqueta, que es la cabecera de su columna.
  function labelTables() {
    Array.prototype.forEach.call(document.querySelectorAll('table'), function (table) {
      var heads = table.querySelectorAll('thead th');
      if (!heads.length) return;
      var labels = Array.prototype.map.call(heads, function (th) { return th.textContent.trim(); });
      Array.prototype.forEach.call(table.querySelectorAll('tbody tr'), function (tr) {
        Array.prototype.forEach.call(tr.children, function (td, i) {
          if (td.hasAttribute('data-l')) return;
          var span = Number(td.getAttribute('colspan') || 1);
          td.setAttribute('data-l', span > 1 ? '' : (labels[i] || ''));
        });
      });
    });
  }

  /* ---------- movil: indice plegable ---------- */
  // El indice ocupa hasta 885px en movil. Se convierte en un <details>
  // cerrado por debajo de 900px y siempre abierto por encima.
  function collapsibleToc() {
    var toc = document.querySelector('nav.toc');
    if (!toc || toc.getAttribute('data-collapsible')) return;
    var list = toc.querySelector('ol');
    if (!list) return;
    var det = document.createElement('details');
    det.className = 'toc-d';
    var sum = document.createElement('summary');
    sum.textContent = 'Contenido';
    det.appendChild(sum);
    det.appendChild(list);
    toc.innerHTML = '';
    toc.appendChild(det);
    toc.setAttribute('data-collapsible', '1');

    var wide = window.matchMedia('(min-width: 641px)');
    var sync = function () { det.open = wide.matches; };
    sync();
    if (wide.addEventListener) wide.addEventListener('change', sync);
    else if (wide.addListener) wide.addListener(sync);
  }

  /* ---------- pestanas ---------- */
  function initTabs() {
    Array.prototype.forEach.call(document.querySelectorAll('.tabs'), function (tabs) {
      var btns = tabs.querySelectorAll('button[data-tab]');
      Array.prototype.forEach.call(btns, function (btn) {
        btn.addEventListener('click', function () {
          var target = btn.getAttribute('data-tab');
          Array.prototype.forEach.call(btns, function (b) {
            b.setAttribute('aria-selected', String(b === btn));
          });
          var scope = tabs.parentNode;
          Array.prototype.forEach.call(scope.querySelectorAll('.tabpane'), function (p) {
            p.hidden = p.getAttribute('data-pane') !== target;
          });
        });
      });
    });
  }

  /* ---------- copiar prompts ---------- */
  function initCopy() {
    document.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-copy]');
      if (!btn) return;
      var pre = btn.closest('.prompt').querySelector('pre');
      var text = pre ? pre.innerText : '';
      var done = function () {
        var old = btn.textContent;
        btn.textContent = 'Copiado';
        btn.classList.add('ok');
        setTimeout(function () { btn.textContent = old; btn.classList.remove('ok'); }, 1400);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done, function () { });
      } else {
        var ta = document.createElement('textarea');
        ta.value = text; document.body.appendChild(ta); ta.select();
        try { document.execCommand('copy'); done(); } catch (err) { }
        document.body.removeChild(ta);
      }
    });
  }

  /* ---------- bitacora ---------- */
  function initBitacora() {
    var form = document.getElementById('bitacora');
    if (!form) return;
    var out = document.getElementById('bitacora-out');
    var build = function () {
      var v = function (name) {
        var el = form.querySelector('[name="' + name + '"]');
        return el ? el.value.trim() : '';
      };
      var w = currentWeek();
      var md = '# Bitácora — semana ' + (w || 0) + ' (' + iso(today()) + ')\n\n' +
        '**Módulo:** ' + (v('modulo') || '-') + '\n\n' +
        '## Artefacto entregado\n' + (v('artefacto') || '-') + '\n\n' +
        '## Lo que no entendí\n' + (v('dudas') || '-') + '\n\n' +
        '## Lo que la IA hizo por mí y debería saber hacer solo\n' + (v('ia') || '-') + '\n\n' +
        '## Decisión tomada esta semana\n' + (v('decision') || '-') + '\n\n' +
        '## Siguiente acción concreta\n' + (v('next') || '-') + '\n';
      out.value = md;
    };
    Array.prototype.forEach.call(form.querySelectorAll('input,textarea,select'), function (el) {
      el.addEventListener('input', build);
    });
    build();
    var copyBtn = document.getElementById('bitacora-copy');
    if (copyBtn) {
      copyBtn.addEventListener('click', function () {
        out.select();
        try { document.execCommand('copy'); } catch (e) { }
        if (navigator.clipboard) { navigator.clipboard.writeText(out.value); }
        copyBtn.textContent = 'Copiado';
        setTimeout(function () { copyBtn.textContent = 'Copiar Markdown'; }, 1400);
      });
    }
  }

  /* ---------- control de fecha de inicio y export ---------- */
  function initToolbar() {
    var input = document.getElementById('startdate');
    if (input) {
      input.value = read(K.start, DEFAULT_START);
      input.addEventListener('change', function () {
        if (!input.value) return;
        write(K.start, input.value);
        paintToday();
        paintTimeline();
      });
    }
    var thisWeek = document.getElementById('start-now');
    if (thisWeek) {
      thisWeek.addEventListener('click', function () {
        var t = today();
        var monday = addDays(t, -((t.getDay() + 6) % 7));
        write(K.start, iso(monday));
        if (input) input.value = iso(monday);
        paintToday();
        paintTimeline();
      });
    }
    var exp = document.getElementById('export');
    if (exp) {
      exp.addEventListener('click', function () {
        var data = {
          start: read(K.start, DEFAULT_START),
          progress: getProg(),
          repaso: getRep(),
          exported: iso(today())
        };
        var ta = document.getElementById('export-out');
        if (ta) { ta.hidden = false; ta.value = JSON.stringify(data, null, 2); ta.select(); }
      });
    }
    var imp = document.getElementById('import');
    if (imp) {
      imp.addEventListener('click', function () {
        var ta = document.getElementById('export-out');
        if (!ta || !ta.value.trim()) { ta.hidden = false; ta.placeholder = 'Pega aquí el JSON exportado y vuelve a pulsar Importar.'; return; }
        try {
          var d = JSON.parse(ta.value);
          if (d.start) write(K.start, d.start);
          if (d.progress) write(K.prog, d.progress);
          if (d.repaso) write(K.rep, d.repaso);
          location.reload();
        } catch (e) { ta.value = 'JSON inválido: ' + e.message; }
      });
    }
  }

  /* ---------- delegacion de eventos ---------- */
  function initDelegation() {
    document.addEventListener('click', function (e) {
      var st = e.target.closest('.state button[data-set]');
      if (st) {
        var wrap = st.closest('.state');
        setState(wrap.getAttribute('data-state-for'), st.getAttribute('data-set'));
        return;
      }
      var g = e.target.closest('[data-grade]');
      if (g) {
        var card = g.closest('.rcard');
        gradeCard(card.id, g.getAttribute('data-grade'));
        return;
      }
      var r = e.target.closest('[data-reset-card]');
      if (r) {
        resetCard(r.closest('.rcard').id);
      }
    });
  }

  /* ---------- arranque ---------- */
  document.addEventListener('DOMContentLoaded', function () {
    injectStates();
    labelTables();
    collapsibleToc();
    initDelegation();
    initTabs();
    initCopy();
    initBitacora();
    initToolbar();
    paintStates();
    paintRepaso();
    paintToday();
    paintTimeline();
    paintHeaderPct();
  });
})();
