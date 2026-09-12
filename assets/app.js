/* ============================================================
   Hub roadmap - estado local, progreso del temario y utilidades
   Todo vive en localStorage del navegador. No sale de tu maquina.
   ============================================================ */
(function () {
  'use strict';

  var K = {
    start: 'hub.start',
    prog: 'hub.progress',
    bases: 'hub.bases',
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

  // Temario de bases. El orden es el del estudio: cada bloque se apoya en el
  // anterior, asi que la "siguiente" leccion es siempre la primera sin cerrar.
  var LESSONS = [
    { id: 'l1', b: 'b1', n: 'L1', t: 'Clase, objeto, estado y encapsulamiento' },
    { id: 'l2', b: 'b1', n: 'L2', t: 'Referencias, valores, null e igualdad' },
    { id: 'l3', b: 'b1', n: 'L3', t: 'Métodos, firmas y contratos' },
    { id: 'l4', b: 'b1', n: 'L4', t: 'Herencia y polimorfismo' },
    { id: 'l5', b: 'b1', n: 'L5', t: 'Composición' },
    { id: 'l6', b: 'b2', n: 'L6', t: 'Qué es una interfaz, exactamente' },
    { id: 'l7', b: 'b2', n: 'L7', t: 'Interfaz contra clase abstracta' },
    { id: 'l8', b: 'b2', n: 'L8', t: 'Para qué sirven de verdad' },
    { id: 'l9', b: 'b2', n: 'L9', t: 'Interfaces en TypeScript' },
    { id: 'l10', b: 'b3', n: 'L10', t: 'SRP, cohesión y acoplamiento' },
    { id: 'l11', b: 'b3', n: 'L11', t: 'OCP y LSP' },
    { id: 'l12', b: 'b3', n: 'L12', t: 'ISP y DIP' },
    { id: 'l13', b: 'b3', n: 'L13', t: 'Patrones que sí vas a usar' },
    { id: 'l14', b: 'b4', n: 'L14', t: 'Genéricos, colecciones y LINQ' },
    { id: 'l15', b: 'b4', n: 'L15', t: 'async, await y concurrencia' },
    { id: 'l16', b: 'b4', n: 'L16', t: 'Ciclos de vida y contenedor' },
    { id: 'l17', b: 'b5', n: 'L17', t: 'Modelo relacional y normalización' },
    { id: 'l18', b: 'b5', n: 'L18', t: 'Transacciones, ACID y concurrencia' },
    { id: 'l19', b: 'b5', n: 'L19', t: 'EF Core: tracking, N+1' },
    { id: 'l20', b: 'b6', n: 'L20', t: 'HTTP y diseño de APIs REST' },
    { id: 'l21', b: 'b6', n: 'L21', t: 'TLS, CORS, cookies y tokens' },
    { id: 'l22', b: 'b6', n: 'L22', t: 'OAuth2, OIDC, JWT y autorización' },
    { id: 'l23', b: 'b7', n: 'L23', t: 'Capas y reglas de dependencia' },
    { id: 'l24', b: 'b7', n: 'L24', t: 'Monolito modular contra microservicios' },
    { id: 'l25', b: 'b7', n: 'L25', t: 'Mensajería asíncrona' },
    { id: 'l26', b: 'b8', n: 'L26', t: 'Pruebas, dobles y TDD' },
    { id: 'l27', b: 'b8', n: 'L27', t: 'Git y entrega continua' }
  ];

  var BLOQUES = [
    { id: 'b1', n: 'Bloque 1', t: 'Objetos' },
    { id: 'b2', n: 'Bloque 2', t: 'Interfaces' },
    { id: 'b3', n: 'Bloque 3', t: 'SOLID y diseño' },
    { id: 'b4', n: 'Bloque 4', t: 'Lenguaje y plataforma' },
    { id: 'b5', n: 'Bloque 5', t: 'Datos' },
    { id: 'b6', n: 'Bloque 6', t: 'Red e identidad' },
    { id: 'b7', n: 'Bloque 7', t: 'Arquitectura' },
    { id: 'b8', n: 'Bloque 8', t: 'Oficio' }
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

  /**
   * Pinta el contador de la barra superior: modulos con artefacto entregado y
   * lecciones de bases cerradas. Se llama tras cada cambio de estado, asi que
   * no hace consultas al DOM mas alla del propio contador.
   */
  function paintHeaderPct() {
    var el = document.querySelector('.sitebar .pct');
    if (!el) return;
    var pr = progressPct();
    var bs = basesStats();
    el.textContent = pr.done + '/' + pr.total + ' módulos  ·  ' + bs.done + '/' + bs.total + ' bases';
  }

  /* ---------- temario de bases ---------- */
  function getBases() { return read(K.bases, {}); }

  /**
   * Estado de una leccion del temario. Solo hay tres y no dependen de fechas:
   * el temario se estudia en orden, no por vencimiento.
   * @param {string} id identificador de la leccion, por ejemplo 'l6'.
   * @returns {string} 'pendiente', 'estudiando' o 'explicado'.
   */
  function lessonState(id) {
    return getBases()[id] || 'pendiente';
  }

  /**
   * Guarda el estado de una leccion y repinta todo lo que depende de el.
   * @param {string} id identificador de la leccion.
   * @param {string} state 'pendiente', 'estudiando' o 'explicado'.
   */
  function setLesson(id, state) {
    var b = getBases();
    if (state === 'pendiente') { delete b[id]; } else { b[id] = state; }
    write(K.bases, b);
    paintBases();
    paintHeaderPct();
    paintToday();
  }

  /**
   * Cuenta las lecciones cerradas sobre el total. Sirve al contador de la barra,
   * a la barra de progreso de la portada y a la tarjeta de la via.
   * @returns {{done:number,total:number,pct:number}}
   */
  function basesStats() {
    var done = 0;
    LESSONS.forEach(function (l) { if (lessonState(l.id) === 'explicado') done++; });
    return { done: done, total: LESSONS.length, pct: Math.round((done / LESSONS.length) * 100) };
  }

  /**
   * Devuelve la primera leccion sin cerrar. Como el temario es progresivo, esa
   * es siempre la que toca: no hay cola de vencidas ni seleccion por fecha.
   * Prioriza la que ya este en curso para no abrir dos frentes a la vez.
   * @returns {object|null} la leccion, o null si el temario esta completo.
   */
  function nextLesson() {
    var curso = null, pend = null;
    LESSONS.forEach(function (l) {
      var st = lessonState(l.id);
      if (!curso && st === 'estudiando') curso = l;
      if (!pend && st === 'pendiente') pend = l;
    });
    return curso || pend;
  }

  /**
   * Cuenta las lecciones cerradas de un bloque concreto.
   * @param {string} bid identificador del bloque, por ejemplo 'b2'.
   * @returns {{done:number,total:number}}
   */
  function blockStats(bid) {
    var list = LESSONS.filter(function (l) { return l.b === bid; });
    var done = list.filter(function (l) { return lessonState(l.id) === 'explicado'; }).length;
    return { done: done, total: list.length };
  }

  /**
   * Inyecta los tres botones de estado al final de cada leccion del temario.
   * Se hace desde JavaScript para que el HTML de bases.html se mantenga legible
   * y para que anadir una leccion sea solo anadir su articulo y su entrada en
   * LESSONS.
   */
  function injectLessonStates() {
    Array.prototype.forEach.call(document.querySelectorAll('article.lesson[id]'), function (art) {
      var id = art.id;
      if (!LESSONS.some(function (l) { return l.id === id; })) return;
      if (art.querySelector('.state')) return;
      var body = art.querySelector('.l-body') || art;
      var wrap = document.createElement('div');
      wrap.className = 'state';
      wrap.setAttribute('data-lesson-for', id);
      wrap.innerHTML =
        '<span class="lbl">ESTADO</span>' +
        '<button type="button" data-lset="pendiente">Pendiente</button>' +
        '<button type="button" data-lset="estudiando">Estudiando</button>' +
        '<button type="button" data-lset="explicado">Lo puedo explicar sin mirar</button>';
      body.appendChild(wrap);
    });
  }

  /**
   * Repinta la pagina de bases: el estado de cada leccion, el resumen de cada
   * bloque y el panel superior con la leccion que toca. Es idempotente, asi que
   * se puede llamar en cada cambio sin acumular nodos.
   */
  function paintBases() {
    Array.prototype.forEach.call(document.querySelectorAll('article.lesson[id]'), function (art) {
      var st = lessonState(art.id);
      var box = art.querySelector('.l-status');
      if (box) {
        if (st === 'explicado') {
          box.innerHTML = '<b>Lo puedo explicar</b>Cerrada';
        } else if (st === 'estudiando') {
          box.innerHTML = '<b>Estudiando</b>Falta pasar la prueba';
        } else {
          box.innerHTML = '<b>Pendiente</b>Sin abrir';
        }
      }
      art.classList.toggle('closed', st === 'explicado');
      art.classList.toggle('open', st === 'estudiando');
    });

    Array.prototype.forEach.call(document.querySelectorAll('.state[data-lesson-for]'), function (w) {
      var st = lessonState(w.getAttribute('data-lesson-for'));
      Array.prototype.forEach.call(w.querySelectorAll('button[data-lset]'), function (b) {
        b.setAttribute('aria-pressed', String(b.getAttribute('data-lset') === st));
      });
    });

    var panel = document.getElementById('siguiente');
    if (panel) {
      var next = nextLesson();
      if (!next) {
        panel.className = 'due empty';
        panel.innerHTML = '<h3>Temario completo</h3><p>Las veintisiete lecciones están cerradas. ' +
          'Lo que queda es el <a href="#control">control final</a>: dos veces con un mes de diferencia, ' +
          'y las bases dejan de ocupar tiempo del plan.</p>';
      } else {
        var bs = basesStats();
        var bl = blockStats(next.b);
        var bn = null;
        BLOQUES.forEach(function (b) { if (b.id === next.b) bn = b; });
        panel.className = 'due';
        panel.innerHTML = '<h3>Te toca la ' + next.n + ' · ' + next.t + '</h3>' +
          '<p>' + (bn ? bn.n + ' · ' + bn.t + ': ' + bl.done + ' de ' + bl.total + ' lecciones cerradas. ' : '') +
          bs.done + ' de ' + bs.total + ' en total. Una sesión de 45 minutos: pega el ' +
          '<a href="#arranque">prompt de arranque</a> si abres conversación nueva, y después el de la lección.</p>' +
          '<ul><li><a href="#' + next.id + '">Ir a la ' + next.n + '</a></li></ul>';
      }
    }
  }

  /* ---------- panel "que hago hoy" ---------- */
  /**
   * Pinta el panel del dia de la portada: el modulo que toca esta semana y, en
   * paralelo, la leccion de bases que sigue. Las bases ya no vencen ni
   * interrumpen: acompanan al modulo como segunda accion, porque el temario se
   * estudia en orden y no por fecha.
   */
  function paintToday() {
    var el = document.getElementById('today');
    if (!el) return;
    var w = currentWeek();
    var p = getProg();
    var lec = nextLesson();
    var start = startDate();

    var titulo, texto, acciones = [];

    if (w === 0) {
      titulo = 'El plan arranca el ' + fmt(start);
      texto = 'Faltan ' + daysBetween(today(), start) + ' días. Lo único útil de aquí a entonces: crear el repo <code>hub-lab</code> vacío y la organización personal en dev.azure.com. Cinco minutos, y la semana 1 empieza sin fricción.';
      acciones.push(['bases.html#l1', 'Empezar por las bases', 'ghost']);
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
      var enBases = lec ? ' En paralelo, la <b>' + lec.n + ' · ' + lec.t + '</b> de bases: 45 minutos, dos veces por semana.' : '';
      if (!focus) {
        titulo = 'Terminaste las dos vías';
        texto = 'Diez módulos y seis fases con artefacto entregado. Lo que sigue está en las etapas post-V1 de la vía de arquitectura.' +
          (lec ? ' Y el temario de bases sigue abierto por la <b>' + lec.n + '</b>.' : '');
        if (lec) acciones.push(['bases.html#' + lec.id, 'Seguir con ' + lec.n, '']);
      } else {
        titulo = focus.n + ' · ' + focus.t;
        texto = 'Semana ' + w + '. ' + (doing.length ? 'Lo tienes marcado en curso: cierra el artefacto antes del domingo.' : 'Sin empezar. Abre el módulo y arranca por el bloque de estudio.') + enBases;
        acciones.push([(focus.via === 'a' ? 'arquitectura.html' : 'devops.html') + '#' + focus.id, 'Abrir ' + focus.n, '']);
        if (lec) acciones.push(['bases.html#' + lec.id, 'Bases · ' + lec.n, 'ghost']);
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
        var bs = basesStats();
        node.textContent = bs.done + ' de ' + bs.total + ' lecciones cerradas';
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

  /* ---------- movil: "que hago hoy" primero ---------- */
  // En el telefono el panel del dia es lo unico que se abre a diario, asi
  // que sube por encima de la portada; en escritorio vuelve a su sitio.
  function mobileTodayFirst() {
    var sec = document.getElementById('hoy');
    var hero = document.querySelector('header.hero');
    if (!sec || !hero) return;

    var mark = document.getElementById('hoy-anchor');
    if (!mark) {
      mark = document.createElement('div');
      mark.id = 'hoy-anchor';
      mark.hidden = true;
      sec.parentNode.insertBefore(mark, sec);
      var box = document.createElement('div');
      box.id = 'hoy-mobile';
      box.className = 'shell';
      hero.parentNode.insertBefore(box, hero);
    }
    var holder = document.getElementById('hoy-mobile');

    var narrow = window.matchMedia('(max-width: 640px)');
    var sync = function () {
      if (narrow.matches) {
        if (sec.parentNode !== holder) holder.appendChild(sec);
      } else if (sec.parentNode === holder) {
        mark.parentNode.insertBefore(sec, mark.nextSibling);
      }
    };
    sync();
    if (narrow.addEventListener) narrow.addEventListener('change', sync);
    else if (narrow.addListener) narrow.addListener(sync);
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

    var wide = window.matchMedia('(min-width: 901px)');
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
          bases: getBases(),
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
          if (d.bases) write(K.bases, d.bases);
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
      var ls = e.target.closest('.state button[data-lset]');
      if (ls) {
        var box = ls.closest('.state');
        setLesson(box.getAttribute('data-lesson-for'), ls.getAttribute('data-lset'));
      }
    });
  }

  /* ---------- arranque ---------- */
  document.addEventListener('DOMContentLoaded', function () {
    injectStates();
    injectLessonStates();
    labelTables();
    collapsibleToc();
    mobileTodayFirst();
    initDelegation();
    initTabs();
    initCopy();
    initBitacora();
    initToolbar();
    paintStates();
    paintBases();
    paintToday();
    paintTimeline();
    paintHeaderPct();
  });
})();
