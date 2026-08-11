(()=>{
 const KEY = 'frame-parasja-site-v2';
 const isEn = document.documentElement.lang === 'en';

 const memoryStorage = new Map();
 const safeStorage = {
  getItem(key) {
   try {
    const value = window.localStorage.getItem(key);
    return value === null && memoryStorage.has(key) ? memoryStorage.get(key) : value;
   } catch (_) {
    return memoryStorage.has(key) ? memoryStorage.get(key) : null;
   }
  },
  setItem(key, value) {
   const stringValue = String(value);
   try {
    window.localStorage.setItem(key, stringValue);
    memoryStorage.delete(key);
   } catch (_) {
    memoryStorage.set(key, stringValue);
   }
  },
  removeItem(key) {
   try { window.localStorage.removeItem(key); } catch (_) {}
   memoryStorage.delete(key);
  }
 };

 let state = {};
 try {
  state = JSON.parse(safeStorage.getItem(KEY) || '{}') || {};
 } catch (_) {
  state = {};
 }
 state.route = state.route || 'week';
 state.week = state.week || {};
 state.quick = state.quick || {};
 state.end = state.end || {};

 const save = () => safeStorage.setItem(KEY, JSON.stringify(state));
 const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)');
 const scrollBehavior = () => reducedMotion?.matches ? 'auto' : 'smooth';
 const $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)];

 function setView(view, scroll = true) {
  const worksheet = view === 'worksheet';
  $$('.worksheet-view').forEach(el => el.hidden = !worksheet);
  $$('.method-view').forEach(el => el.hidden = worksheet);
  $$('[data-view-button]').forEach(btn => {
   const active = btn.dataset.viewButton === view;
   btn.classList.toggle('active', active);
   btn.setAttribute('aria-pressed', String(active));
  });
  if (scroll) {
   const target = worksheet ? document.querySelector('.worksheet-view') : (document.querySelector('#methode') || document.querySelector('#uitleg'));
   target?.scrollIntoView({ behavior: scrollBehavior(), block: 'start' });
  }
 }

 window.setView = setView;

 $$('[data-view-button]').forEach(btn => btn.addEventListener('click', () => setView(btn.dataset.viewButton)));
 $$('[data-view-link]').forEach(link => link.addEventListener('click', ev => {
  const view = link.dataset.viewLink;
  if (view) {
   setView(view, false);
   setTimeout(() => document.querySelector(link.getAttribute('href'))?.scrollIntoView({ behavior: scrollBehavior(), block: 'start' }), 0);
  }
 }));

 function syncHashView() {
  const methodHashes = ['#uitleg', '#methode', '#voorbeeld', '#bijlagen'];
  const view = methodHashes.includes(location.hash) ? 'method' : 'worksheet';
  setView(view, !!location.hash);
 }

 window.addEventListener('hashchange', syncHashView);
 syncHashView();

 function bind(prefix, bucket) {
  $$(`[data-${prefix}-check]`).forEach(el => {
   const id = el.dataset[`${prefix}Check`];
   el.checked = !!bucket[id]?.done;
   el.addEventListener('change', () => {
    bucket[id] = bucket[id] || {};
    bucket[id].done = el.checked;
    save();
    update();
   });
  });
  $$(`[data-${prefix}-notes]`).forEach(el => {
   const id = el.dataset[`${prefix}Notes`];
   el.value = bucket[id]?.notes || '';
   el.addEventListener('input', () => {
    bucket[id] = bucket[id] || {};
    bucket[id].notes = el.value;
    save();
   });
  });
 }

 bind('work', state.week);
 bind('quick', state.quick);
 $$('[data-end-check]').forEach(el => {
  const id = el.dataset.endCheck;
  el.checked = !!state.end[id];
  el.addEventListener('change', () => {
   state.end[id] = el.checked;
   save();
  });
 });

 function setRoute(route) {
  state.route = route;
  save();
  $('#week-route').hidden = route !== 'week';
  $('#quick-route').hidden = route !== 'quick';
  $('#route-week')?.classList.toggle('active', route === 'week');
  $('#route-quick')?.classList.toggle('active', route === 'quick');
  $('#route-week')?.setAttribute('aria-pressed', String(route === 'week'));
  $('#route-quick')?.setAttribute('aria-pressed', String(route === 'quick'));
  update();
 }

 function update() {
  const bucket = state.route === 'week' ? state.week : state.quick;
  const total = state.route === 'week' ? 16 : 6;
  const done = Object.values(bucket).filter(x => x.done).length;
  const count = $('#progress-count');
  if (count) {
   count.textContent = isEn ? `${done} / ${total} questions` : `${done} / ${total} vragen`;
  }
  const bar = $('#progress-bar');
  if (bar) bar.style.width = `${done / total * 100}%`;
 }

 $('#route-week')?.addEventListener('click', () => setRoute('week'));
 $('#route-quick')?.addEventListener('click', () => setRoute('quick'));
 setRoute(state.route);

 $('#reset-work')?.addEventListener('click', () => {
  const msg = isEn ? 'Clear all checkmarks and notes on this page?' : 'Alle vinkjes en aantekeningen op deze pagina wissen?';
  if (!confirm(msg)) return;
  safeStorage.removeItem(KEY);
  location.reload();
 });

 function esc(s) {
  return (s || '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
 }

 $('#print-work')?.addEventListener('click', () => {
  const route = state.route, total = route === 'week' ? 16 : 6, bucket = route === 'week' ? state.week : state.quick;
  const items = route === 'week' ? $$('#week-route .study-card') : $$('#quick-route .study-card');
  const done = Object.values(bucket).filter(x => x.done).length;
  const rows = items.map((card, i) => {
   const title = card.querySelector('.step-title')?.textContent.trim() || (isEn ? `Part ${i + 1}` : `Onderdeel ${i + 1}`);
   const data = bucket[String(i + 1)] || {};
   return `<div class="print-item"><div><strong>${data.done ? '☑' : '☐'} ${esc(title)}</strong></div>${data.notes ? `<div class="print-note">${esc(data.notes)}</div>` : ''}</div>`;
  }).join('');

  const ps = $('#print-sheet');
  const dateStr = new Intl.DateTimeFormat(isEn ? 'en-GB' : 'nl-NL', { dateStyle: 'long' }).format(new Date());
  const routeName = route === 'week' ? (isEn ? 'one week' : 'een week') : (isEn ? 'forty-five minutes' : 'drie kwartier');
  const headline = isEn ? 'Read the Parashah Yourself — my parashah study' : 'Zelf de parasja lezen — mijn parasjastudie';
  const labelRoute = isEn ? 'route' : 'route';
  const labelQuestions = isEn ? 'questions considered' : 'doorlopen vragen';

  ps.innerHTML = `<h1>${headline}</h1><p>${dateStr} · ${labelRoute}: ${routeName} · ${labelQuestions}: ${done} / ${total}</p>${rows}`;
  document.body.classList.add('frame-printing');
  window.print();
  setTimeout(() => document.body.classList.remove('frame-printing'), 500);
 });

 window.addEventListener('afterprint', () => document.body.classList.remove('frame-printing'));

 // Export Notes to JSON File
 $('#export-work')?.addEventListener('click', () => {
  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(state, null, 2));
  const dlAnchor = document.createElement('a');
  dlAnchor.setAttribute('href', dataStr);
  dlAnchor.setAttribute('download', isEn ? 'parashah-study-backup.json' : 'parasja-studie-backup.json');
  document.body.appendChild(dlAnchor);
  dlAnchor.click();
  dlAnchor.remove();
 });

 // Import Notes from JSON File
 $('#import-work')?.addEventListener('click', () => {
  const fileInput = $('#import-file');
  if (fileInput) fileInput.click();
 });

 $('#import-file')?.addEventListener('change', (e) => {
  const file = e.target.files?.[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (event) => {
   try {
    const imported = JSON.parse(event.target.result);
    if (typeof imported === 'object' && imported !== null) {
     state = { ...state, ...imported };
     save();
     alert(isEn ? 'Study notes imported successfully!' : 'Studie-aantekeningen succesvol geïmporteerd!');
     location.reload();
    } else {
     throw new Error('Invalid format');
    }
   } catch (_) {
    alert(isEn ? 'Failed to import JSON file. Please check the file format.' : 'Kan JSON-bestand niet importeren. Controleer het bestandstype.');
   }
  };
  reader.readAsText(file);
 });

 if (location.hash.startsWith('#stap-')) {
  setRoute('week');
  setTimeout(() => document.querySelector(location.hash)?.scrollIntoView({ behavior: scrollBehavior(), block: 'center' }), 50);
 } else if (location.hash.startsWith('#snel-')) {
  setRoute('quick');
  setTimeout(() => document.querySelector(location.hash)?.scrollIntoView({ behavior: scrollBehavior(), block: 'center' }), 50);
 }
})();
