(() => {
  'use strict';
  const $ = (s) => document.querySelector(s);
  const CATEGORIES = ['All', ...new Set(EVENTS.map(e => e.category))];
  const THEME = { Tech: ['#4f46e5', '#06b6d4'], Music: ['#db2777', '#f59e0b'], Workshop: ['#059669', '#84cc16'],
                  Sports: ['#ea580c', '#facc15'], Art: ['#7c3aed', '#f472b6'], Business: ['#0f766e', '#38bdf8'] };
  const ICON = { Tech: '💻', Music: '🎵', Workshop: '🛠️', Sports: '🏃', Art: '🎨', Business: '📈' };
  const state = { query: '', category: 'All' };

  /* Generated cover art (SVG data URI) so no external images can break. */
  function cover(e) {
    const [a, b] = THEME[e.category];
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 360"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient></defs><rect width="640" height="360" fill="url(#g)"/><circle cx="${100 + e.id * 45}" cy="70" r="120" fill="#fff" opacity=".12"/><circle cx="${560 - e.id * 30}" cy="330" r="150" fill="#000" opacity=".12"/><text x="320" y="215" font-size="110" text-anchor="middle">${ICON[e.category]}</text></svg>`;
    return 'data:image/svg+xml,' + encodeURIComponent(svg);
  }
  const fmtDate = (iso) => new Intl.DateTimeFormat('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(iso + 'T00:00'));
  const byDate = (a, b) => a.date.localeCompare(b.date);

  function card(e) {
    return `<article class="card">
      <img src="${cover(e)}" alt="${e.category} event artwork for ${e.name}" loading="lazy" width="640" height="360">
      <div class="card-body">
        <span class="tag">${e.category}</span>
        <h3>${e.name}</h3>
        <p class="info">📅 ${fmtDate(e.date)}</p>
        <p class="info">📍 ${e.venue}</p>
        <p class="short">${e.short}</p>
        <button class="btn btn-sm" data-id="${e.id}">View details</button>
      </div></article>`;
  }

  function renderChips() {
    $('#chips').innerHTML = CATEGORIES.map(c =>
      `<button class="chip" aria-pressed="${c === state.category}" data-cat="${c}">${c}</button>`).join('');
  }

  function renderEvents() {
    const q = state.query.trim().toLowerCase();
    const list = EVENTS.filter(e => (state.category === 'All' || e.category === state.category) && e.name.toLowerCase().includes(q)).sort(byDate);
    $('#eventGrid').innerHTML = list.map(card).join('');
    $('#empty').hidden = list.length > 0;
    $('#count').textContent = list.length ? `Showing ${list.length} event${list.length > 1 ? 's' : ''}` : '';
  }

  /* Details dialog */
  let current = null;
  function openDetail(id) {
    const e = EVENTS.find(x => x.id === id); if (!e) return;
    current = e;
    $('#dImg').src = cover(e); $('#dImg').alt = `${e.category} event artwork for ${e.name}`;
    $('#dCat').textContent = e.category; $('#d-title').textContent = e.name; $('#dDesc').textContent = e.description;
    $('#dMeta').innerHTML = `<li>📅 ${fmtDate(e.date)}</li><li>🕒 ${e.time}</li><li>📍 ${e.venue}</li><li>🏷️ ${e.category}</li>`;
    $('#detail').showModal();
  }

  /* Registration */
  const rules = {
    name: (v) => /^[A-Za-z][A-Za-z .'-]{1,49}$/.test(v) ? '' : 'Enter your full name (letters only, at least 2 characters).',
    email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v) ? '' : 'Enter a valid email address, e.g. name@example.com.',
    phone: (v) => /^(?:\+?91)?[6-9]\d{9}$/.test(v.replace(/[\s-]/g, '')) ? '' : 'Enter a valid 10-digit mobile number.',
    eventSel: (v) => EVENTS.some(e => String(e.id) === v) ? '' : 'Please select an event.'
  };
  function check(field) {
    const input = $('#' + field), msg = rules[field](input.value.trim());
    $('#' + field + '-err').textContent = msg;
    input.setAttribute('aria-invalid', msg ? 'true' : 'false');
    input.setAttribute('aria-describedby', field + '-err');
    return !msg;
  }
  function selectEvent(id) { $('#eventSel').value = String(id); $('#success').hidden = true; }

  function init() {
    $('#featuredGrid').innerHTML = EVENTS.filter(e => e.featured).sort(byDate).map(card).join('');
    renderChips(); renderEvents();
    $('#eventSel').innerHTML = '<option value="">Choose an event…</option>' +
      [...EVENTS].sort(byDate).map(e => `<option value="${e.id}">${e.name} (${fmtDate(e.date)})</option>`).join('');

    document.addEventListener('click', (ev) => {
      const b = ev.target.closest('button[data-id]'); if (b) openDetail(+b.dataset.id);
    });
    $('#search').addEventListener('input', (ev) => { state.query = ev.target.value; renderEvents(); });
    $('#chips').addEventListener('click', (ev) => {
      const c = ev.target.closest('.chip'); if (!c) return;
      state.category = c.dataset.cat; renderChips(); renderEvents();
    });
    $('#reset').addEventListener('click', () => { state.query = ''; state.category = 'All'; $('#search').value = ''; renderChips(); renderEvents(); });

    $('#dClose').addEventListener('click', () => $('#detail').close());
    $('#detail').addEventListener('click', (ev) => { if (ev.target.id === 'detail') $('#detail').close(); });
    $('#dReg').addEventListener('click', () => {
      selectEvent(current.id); $('#detail').close();
      $('#register').scrollIntoView({ behavior: 'smooth' }); setTimeout(() => $('#name').focus({ preventScroll: true }), 500);
    });

    Object.keys(rules).forEach(f => $('#' + f).addEventListener('blur', () => check(f)));
    $('#regForm').addEventListener('submit', (ev) => {
      ev.preventDefault();
      const results = Object.keys(rules).map(check);
      if (results.includes(false)) { document.querySelector('[aria-invalid="true"]').focus(); return; }
      const e = EVENTS.find(x => String(x.id) === $('#eventSel').value);
      const box = $('#success');
      box.innerHTML = `<h3>🎉 You're registered, ${$('#name').value.trim().split(' ')[0]}!</h3><p>Your registration for <strong>${e.name}</strong> on ${fmtDate(e.date)} at ${e.venue} is confirmed. A confirmation would be sent to ${$('#email').value.trim()}.</p>`;
      box.hidden = false; box.focus(); ev.target.reset();
      Object.keys(rules).forEach(f => { $('#' + f + '-err').textContent = ''; $('#' + f).removeAttribute('aria-invalid'); });
    });

    /* Mobile nav */
    const burger = $('#burger'), menu = $('#menu');
    burger.addEventListener('click', () => { const o = menu.classList.toggle('open'); burger.setAttribute('aria-expanded', o); });
    menu.addEventListener('click', (ev) => { if (ev.target.tagName === 'A') { menu.classList.remove('open'); burger.setAttribute('aria-expanded', false); } });
  }
  init();
})();
