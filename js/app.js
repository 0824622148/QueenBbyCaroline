/* Queen B by Caroline's — front-end demo logic (no backend; state persists in localStorage) */
(function () {
  'use strict';
  const D = window.QB;
  const IMG = 'assets/img/';
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const money = n => 'R' + n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  const arrow = (size = 16, sw = 1.8) => `<svg viewBox="0 0 24 24" width="${size}" height="${size}" class="i" style="stroke-width:${sw}"><path d="M5 12h14"/><path d="m13 6 6 6-6 6"/></svg>`;
  const heartSvg = s => `<svg viewBox="0 0 24 24" width="${s}" height="${s}"><path d="M19 14c1.5-1.5 3-3.2 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.8 0-3 .5-4.5 2-1.5-1.5-2.7-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4 3 5.5l7 7Z"/></svg>`;
  const placeholder = label => `<div class="qb-placeholder" role="img" aria-label="${esc(label)}"><b>QB</b><small>${esc(label.toUpperCase())}</small></div>`;

  /* ---------- Persistence ---------- */
  const store = {
    get(k, fallback) { try { const v = localStorage.getItem('qb.' + k); return v ? JSON.parse(v) : fallback; } catch (e) { return fallback; } },
    set(k, v) { try { localStorage.setItem('qb.' + k, JSON.stringify(v)); } catch (e) { /* storage unavailable: keep in memory */ } }
  };

  /* ---------- Dates ---------- */
  const startOfDay = d => new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const iso = d => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  const fromIso = s => { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d); };
  const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const DOW = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const today = startOfDay(new Date());

  /* Demo availability: a couple of slots per day look "taken", deterministic per date */
  function takenSlots(dateIso) {
    let h = 0; for (const c of dateIso) h = (h * 31 + c.charCodeAt(0)) >>> 0;
    return [D.times[h % D.times.length], D.times[(h >> 3) % D.times.length]];
  }
  function slotDisabled(dateIso, t) {
    if (takenSlots(dateIso).includes(t)) return true;
    if (dateIso === iso(today)) { const [hh, mm] = t.split(':').map(Number); const now = new Date(); return hh * 60 + mm <= now.getHours() * 60 + now.getMinutes() + 30; }
    return false;
  }
  function firstOpenDate() {
    const d = new Date(today);
    for (let i = 0; i < 30; i++) { const s = iso(d); if (D.times.some(t => !slotDisabled(s, t))) return s; d.setDate(d.getDate() + 1); }
    return iso(today);
  }

  /* ---------- State ---------- */
  const firstDate = firstOpenDate();
  const S = {
    cart: store.get('cart', {}),           // { productId: qty }
    wish: store.get('wish', {}),           // { productId: true }
    filter: 'All', q: '',
    pid: 'shampoo', qty: 1, thumb: 0,
    look: 'All',
    bk: { step: 1, cat: 'Hair', svc: 0, staff: 'any', date: firstDate, time: null, name: '', phone: '', email: '', notes: '', confirmed: null, errors: {} },
    calMonth: fromIso(firstDate)
  };
  S.calMonth.setDate(1);
  // drop cart entries for products that no longer exist
  Object.keys(S.cart).forEach(id => { if (!D.products[id] || S.cart[id] < 1) delete S.cart[id]; });

  /* ---------- Toast ---------- */
  let toastTimer;
  function say(msg) {
    const t = $('#toast'); $('#toastMsg').textContent = msg; t.hidden = false;
    t.style.animation = 'none'; void t.offsetWidth; t.style.animation = '';
    clearTimeout(toastTimer); toastTimer = setTimeout(() => { t.hidden = true; }, 2400);
  }

  function go(id) {
    const el = document.getElementById(id); if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - ($('.site-header').offsetHeight - 4);
    window.scrollTo({ top, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  }

  /* ---------- Header & navigation ---------- */
  function renderNav() {
    $('#mainNav').innerHTML = D.nav.map(([l, h]) => `<a href="${h}" data-sec="${h.slice(1)}">${l}</a>`).join('');
    $('#mobileMenu').innerHTML = D.nav.map(([l, h]) => `<a class="m-link" href="${h}">${l}</a>`).join('') + '<a href="#booking" class="btn btn-ink">Book Now</a>';
    const icons = {
      Home: 'M3 10 12 3l9 7v10a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z',
      Shop: 'M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4ZM3 6h18M16 10a4 4 0 0 1-8 0',
      Book: 'M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2ZM16 2v4M8 2v4M3 10h18',
      Contact: 'M12 13a5 5 0 1 0 0-10 5 5 0 0 0 0 10ZM20 21a8 8 0 0 0-16 0'
    };
    const href = { Home: 'home', Shop: 'shop', Book: 'booking', Contact: 'contact' };
    $('#tabbar').innerHTML = Object.keys(icons).map(k =>
      `<a class="tab" href="#${href[k]}" data-sec="${href[k]}"><svg viewBox="0 0 24 24" width="22" height="22" class="i" style="stroke-width:1.5"><path d="${icons[k]}"/></svg><span>${k}</span></a>`).join('');
  }

  function setMenu(open) {
    $('#mobileMenu').hidden = !open;
    $('#menuBtn').setAttribute('aria-expanded', String(open));
    $('#menuBtn').setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  }

  function trackSections() {
    const ids = ['home', 'about', 'services', 'booking', 'shop', 'product', 'lookbook', 'team', 'contact'];
    const alias = { product: 'shop', team: 'about', booking: 'booking' };
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        const id = alias[e.target.id] || e.target.id;
        $$('[data-sec]').forEach(a => {
          const on = a.dataset.sec === id;
          a.classList.toggle('active', on); a.classList.toggle('on', on);
          if (on) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current');
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    ids.forEach(id => { const el = document.getElementById(id); if (el) io.observe(el); });
  }

  /* ---------- Static lists ---------- */
  function renderStatic() {
    $('#stories').innerHTML = D.stories.map(([label, img, pos, href]) =>
      `<a class="story" href="${href}"><span class="story-ring"><img src="${IMG + img}" alt="" style="object-position:${pos}" loading="lazy"></span><span>${esc(label)}</span></a>`).join('');

    $('#svcTrack').innerHTML = D.services.map(s => `
      <a class="svc-card" href="#booking" data-cat="${esc(s.name)}">
        <div class="svc-media">${s.img ? `<img src="${IMG + s.img}" alt="${esc(s.name)}" style="object-position:${s.pos}" loading="lazy">` : placeholder(s.name)}</div>
        <div class="svc-body"><div><div class="svc-name">${esc(s.name)}</div><div class="svc-lines">${esc(s.line1)}<br>${esc(s.line2)}</div></div><span class="arrow-dot">${arrow()}</span></div>
      </a>`).join('');

    $('#features').innerHTML = D.features.map((f, i) => `<div class="feature"><span class="num">0${i + 1}</span><span>${esc(f)}</span></div>`).join('');

    $('#benefits').innerHTML = D.benefits.map(([label, d]) => `<div class="benefit"><span><svg viewBox="0 0 24 24" width="22" height="22" class="i"><path d="${d}"/></svg></span>${esc(label)}</div>`).join('');

    $('#teamGrid').innerHTML = D.staff.filter(x => x.img).map(x => `
      <div class="member"><div class="member-img"><img src="${IMG + x.img}" alt="${esc(x.team || x.name)}" style="object-position:50% ${x.y}" loading="lazy"></div>
      <div><div class="nm">${esc(x.team || x.name)}</div><div class="rl">${esc(x.teamRole || x.role)}</div></div></div>`).join('');
  }

  /* ---------- Booking ---------- */
  const STEP_NAMES = ['Service', 'Staff', 'Date & Time', 'Details', 'Confirm'];
  const curService = () => { const l = D.categories[S.bk.cat].list; return l[Math.min(S.bk.svc, l.length - 1)]; };
  const priceLabel = s => (s.fromPrice ? 'from ' : '') + money(s.price).replace('.00', '');
  const durLabel = s => s.dur ? `${s.dur} min` : '';
  const whenLabel = () => {
    if (!S.bk.date) return '—';
    const d = fromIso(S.bk.date);
    return `${DOW[d.getDay()]} ${d.getDate()} ${MONTHS[d.getMonth()].slice(0, 3)}${S.bk.time ? ', ' + S.bk.time : ''}`;
  };

  function renderSteps() {
    const st = S.bk.step, done = !!S.bk.confirmed;
    $('#steps').innerHTML = `<li class="bar" aria-hidden="true" style="width:${(done ? 4 : st - 1) / 4 * 80}%"></li>` + STEP_NAMES.map((label, i) => {
      const n = i + 1, cls = done || n < st ? 'done' : n === st ? 'on' : '';
      return `<li class="step ${cls}"><button data-step="${n}" ${n > st || done ? 'disabled' : ''} ${n === st && !done ? 'aria-current="step"' : ''}><span class="dot">${done || n < st ? '✓' : n}</span><span>${label}</span></button></li>`;
    }).join('');
  }

  function renderCats() {
    $('#catBlock').hidden = S.bk.step !== 1 || !!S.bk.confirmed;
    $('#catGrid').innerHTML = Object.entries(D.categories).map(([name, c]) => `
      <button class="cat" data-cat="${esc(name)}" aria-pressed="${S.bk.cat === name}">
        <div class="cat-media">${c.img ? `<img src="${IMG + c.img}" alt="" style="object-position:${c.pos}" loading="lazy">` : placeholder(name)}</div>
        <div class="cat-body"><div><div class="cat-name">${esc(name)}</div><div class="cat-from">From ${money(c.from).replace('.00', '')}</div></div><span class="arrow-dot sm">${arrow(14, 2)}</span></div>
      </button>`).join('');
  }

  function field(id, label, type, value, placeholder, extra = '') {
    const err = S.bk.errors[id];
    return `<label class="field ${err ? 'invalid' : ''}">${label}<input id="bk-${id}" name="${id}" type="${type}" value="${esc(value)}" placeholder="${placeholder}" ${extra} ${err ? `aria-invalid="true" aria-describedby="bk-${id}-err"` : ''}>${err ? `<span class="err" id="bk-${id}-err">${err}</span>` : ''}</label>`;
  }

  function renderStepPanel() {
    const b = S.bk, s = curService(), staff = D.staff.find(x => x.id === b.staff);
    let html = '';
    if (b.confirmed) {
      html = `<div class="confirmed">
        <span class="check"><svg viewBox="0 0 24 24" width="26" height="26" class="i" style="stroke-width:2"><path d="M20 6 9 17l-5-5"/></svg></span>
        <h3>You’re booked, <span class="script">Queen.</span></h3>
        <div class="ref">BOOKING REF ${esc(b.confirmed.ref)}</div>
        <p>We’ve sent a confirmation to ${esc(b.confirmed.phone)}. See you at 277 Columbine Avenue, Mondeor.</p>
        <a href="#shop" class="link-underline">While you wait, shop Queen B Hair Care →</a>
        <button class="btn btn-outline btn-sm" data-action="book-again">Book another appointment</button>
      </div>`;
    } else if (b.step === 1) {
      const list = D.categories[b.cat].list;
      html = `<div class="card-title">Choose a Service</div><div class="svc-list" role="group" aria-label="${esc(b.cat)} services">` +
        list.map((x, i) => `<button class="svc-opt" data-svc="${i}" aria-pressed="${i === Math.min(b.svc, list.length - 1)}"><span>${esc(x.name)}</span><b>${priceLabel(x)}</b><small>${durLabel(x)}</small></button>`).join('') + '</div>';
    } else if (b.step === 2) {
      html = `<div class="card-title">Choose your Stylist</div><div class="staff-grid" role="group" aria-label="Stylists">` +
        D.staff.map(x => `<button class="staff-opt" data-staff="${x.id}" aria-pressed="${b.staff === x.id}">
          ${x.img ? `<img src="${IMG + x.img}" alt="" style="object-position:50% ${x.y}">` : '<span class="qb-avatar">QB</span>'}
          <span class="nm">${esc(x.name)}</span><span class="rl">${esc(x.role)}</span></button>`).join('') + '</div>';
    } else if (b.step === 3) {
      html = `<div class="card-title">Your selection</div><div class="kv">
        <div><span>Service</span><span>${esc(s.name)}</span></div>
        <div><span>Stylist</span><span>${esc(staff.name)}</span></div>
        <div><span>Duration</span><span>${s.dur ? s.dur + ' min' : 'Confirmed in salon'}</span></div></div>
        <p class="note">Pick the day and time that suits you. We’ll send a reminder the day before.</p>
        ${b.errors.time ? `<p class="note" style="color:#B3261E;margin-top:10px">${b.errors.time}</p>` : ''}`;
    } else if (b.step === 4) {
      html = `<div class="card-title">Your Details</div><form class="form" id="bkForm" novalidate>
        ${field('name', 'Full name', 'text', b.name, 'Your name', 'autocomplete="name" required')}
        ${field('phone', 'Phone', 'tel', b.phone, '071 000 0000', 'autocomplete="tel" inputmode="tel" required')}
        ${field('email', 'Email (optional)', 'email', b.email, 'you@email.com', 'autocomplete="email"')}
        <label class="field">Notes for your stylist (optional)<textarea id="bk-notes" name="notes" placeholder="Hair length, inspiration, allergies…">${esc(b.notes)}</textarea></label>
      </form>`;
    } else {
      html = `<div class="card-title" style="margin-bottom:6px">Review &amp; Confirm</div>
        <p class="note" style="margin:0 0 18px">Please check your appointment details.</p>
        <div class="kv">
          <div><span>Name</span><span>${esc(b.name || '—')}</span></div>
          <div><span>Phone</span><span>${esc(b.phone || '—')}</span></div>
          <div><span>Email</span><span>${esc(b.email || '—')}</span></div>
          ${b.notes ? `<div><span>Notes</span><span>${esc(b.notes)}</span></div>` : ''}
        </div>
        <p class="note">Payment is made in salon. You can cancel or reschedule up to 24 hours before.</p>`;
    }
    $('#stepPanel').innerHTML = html;
  }

  function renderCalendar() {
    const show = !S.bk.confirmed && (S.bk.step === 1 || S.bk.step === 3);
    $('#calPanel').hidden = !show;
    if (!show) return;
    const m = S.calMonth, y = m.getFullYear(), mo = m.getMonth();
    const lead = (new Date(y, mo, 1).getDay() + 6) % 7; // Monday first
    const nDays = new Date(y, mo + 1, 0).getDate();
    const atStart = y === today.getFullYear() && mo === today.getMonth();
    const limit = new Date(today.getFullYear(), today.getMonth() + 3, 1);
    const atEnd = new Date(y, mo + 1, 1) >= limit;
    let days = '';
    for (let i = 0; i < lead; i++) days += '<span class="day blank" aria-hidden="true"></span>';
    for (let d = 1; d <= nDays; d++) {
      const date = new Date(y, mo, d), s = iso(date), past = date < today;
      const full = !past && D.times.every(t => slotDisabled(s, t));
      days += `<button class="day ${s === iso(today) ? 'today' : ''}" data-date="${s}" ${past || full ? 'disabled' : ''} aria-pressed="${s === S.bk.date}" aria-label="${DOW[date.getDay()]} ${d} ${MONTHS[mo]}${full ? ', fully booked' : ''}">${d}</button>`;
    }
    const times = S.bk.date
      ? D.times.map(t => { const off = slotDisabled(S.bk.date, t); return `<button class="time" data-time="${t}" ${off ? 'disabled aria-label="' + t + ' unavailable"' : ''} aria-pressed="${t === S.bk.time}">${t}</button>`; }).join('')
      : '<span class="closed-msg">Choose a date to see available times.</span>';
    $('#calPanel').innerHTML = `<div class="card-title" style="margin-bottom:14px">Select Date &amp; Time</div>
      <div class="cal-head"><button class="cal-nav" data-cal="-1" ${atStart ? 'disabled' : ''} aria-label="Previous month"><svg viewBox="0 0 24 24" width="16" height="16" class="i" style="stroke-width:1.8"><path d="m15 18-6-6 6-6"/></svg></button>
      <strong aria-live="polite">${MONTHS[mo]} ${y}</strong>
      <button class="cal-nav" data-cal="1" ${atEnd ? 'disabled' : ''} aria-label="Next month"><svg viewBox="0 0 24 24" width="16" height="16" class="i" style="stroke-width:1.8"><path d="m9 18 6-6-6-6"/></svg></button></div>
      <div class="dow" aria-hidden="true"><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span></div>
      <div class="days">${days}</div>
      <div class="times" role="group" aria-label="Available times">${times}</div>`;
  }

  function renderSummary() {
    const b = S.bk, show = !!b.confirmed || b.step === 2 || b.step >= 4;
    $('#summary').hidden = !show;
    if (!show) return;
    const s = curService(), staff = D.staff.find(x => x.id === b.staff);
    $('#summary').innerHTML = `<div class="card-title">Your Appointment</div>
      <div class="row"><span>Service</span><span>${esc(s.name)}</span></div>
      <div class="row"><span>Stylist</span><span>${esc(staff.name)}</span></div>
      <div class="row"><span>When</span><span>${whenLabel()}</span></div>
      <div class="row"><span>Total</span><span style="font-weight:700">${priceLabel(s)}</span></div>`;
  }

  function renderBookingNav() {
    const b = S.bk;
    $('#bkBack').hidden = b.step === 1 || !!b.confirmed;
    $('#bkNext').hidden = !!b.confirmed;
    $('#bkNext').textContent = b.step === 5 ? 'Confirm Booking' : 'Continue';
  }

  function renderBooking() { renderSteps(); renderCats(); renderStepPanel(); renderCalendar(); renderSummary(); renderBookingNav(); }

  function validateDetails() {
    const b = S.bk, e = {};
    if (b.name.trim().length < 2) e.name = 'Please enter your name.';
    const digits = b.phone.replace(/[\s()-]/g, '');
    if (!/^(0\d{9}|\+27\d{9}|27\d{9})$/.test(digits)) e.phone = 'Please enter a valid SA number, e.g. 071 000 0000.';
    if (b.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(b.email.trim())) e.email = 'Please check your email address.';
    b.errors = e;
    return Object.keys(e).length === 0;
  }

  function bookingNext() {
    const b = S.bk;
    b.errors = {};
    if (b.step === 3 && (!b.date || !b.time || slotDisabled(b.date, b.time))) {
      b.errors.time = 'Please choose an available date and time.'; renderBooking(); return;
    }
    if (b.step === 4 && !validateDetails()) {
      renderBooking();
      const first = $('#bkForm [aria-invalid="true"]'); if (first) first.focus();
      return;
    }
    if (b.step < 5) {
      b.step++;
    } else {
      const s = curService(), staff = D.staff.find(x => x.id === b.staff);
      const ref = 'QB-' + Date.now().toString(36).slice(-6).toUpperCase();
      const booking = { ref, category: b.cat, service: s.name, price: priceLabel(s), stylist: staff.name, date: b.date, time: b.time, name: b.name.trim(), phone: b.phone.trim(), email: b.email.trim(), notes: b.notes.trim(), createdAt: new Date().toISOString() };
      const all = store.get('bookings', []); all.push(booking); store.set('bookings', all);
      b.confirmed = booking;
      say('Appointment confirmed');
    }
    renderBooking();
    go('booking');
  }

  function resetBooking(cat) {
    const date = firstOpenDate();
    S.bk = { step: 1, cat: cat || 'Hair', svc: 0, staff: 'any', date, time: null, name: S.bk.name, phone: S.bk.phone, email: S.bk.email, notes: '', confirmed: null, errors: {} };
    S.calMonth = fromIso(date); S.calMonth.setDate(1);
    renderBooking();
  }

  function bindBooking() {
    $('#bookingCard').addEventListener('click', e => {
      const t = e.target.closest('button'); if (!t) return;
      const b = S.bk;
      if (t.dataset.step) { b.step = +t.dataset.step; b.errors = {}; }
      else if (t.dataset.cat) { b.cat = t.dataset.cat; b.svc = 0; }
      else if (t.dataset.svc) b.svc = +t.dataset.svc;
      else if (t.dataset.staff) b.staff = t.dataset.staff;
      else if (t.dataset.date) { b.date = t.dataset.date; if (b.time && slotDisabled(b.date, b.time)) b.time = null; b.errors = {}; }
      else if (t.dataset.time) { b.time = t.dataset.time; b.errors = {}; }
      else if (t.dataset.cal) { S.calMonth = new Date(S.calMonth.getFullYear(), S.calMonth.getMonth() + +t.dataset.cal, 1); renderCalendar(); return; }
      else if (t.dataset.action === 'book-again') { resetBooking(); go('booking'); return; }
      else if (t.id === 'bkBack') { b.step = Math.max(1, b.step - 1); b.errors = {}; }
      else if (t.id === 'bkNext') { bookingNext(); return; }
      else return;
      renderBooking();
    });
    $('#bookingCard').addEventListener('input', e => {
      const n = e.target.name; if (!n || !(n in S.bk)) return;
      S.bk[n] = e.target.value;
      if (S.bk.errors[n]) { delete S.bk.errors[n]; const f = e.target.closest('.field'); f.classList.remove('invalid'); e.target.removeAttribute('aria-invalid'); const er = f.querySelector('.err'); if (er) er.remove(); }
    });
    $('#bookingCard').addEventListener('submit', e => { e.preventDefault(); bookingNext(); });
    // service cards preselect the category
    $('#svcTrack').addEventListener('click', e => {
      const a = e.target.closest('[data-cat]'); if (!a) return;
      e.preventDefault();
      S.bk.confirmed = null; S.bk.step = 1; S.bk.cat = a.dataset.cat; S.bk.svc = 0;
      renderBooking(); go('booking');
    });
    $('#svcPrev').addEventListener('click', () => $('#svcTrack').scrollBy({ left: -320, behavior: 'smooth' }));
    $('#svcNext').addEventListener('click', () => $('#svcTrack').scrollBy({ left: 320, behavior: 'smooth' }));
  }

  /* ---------- Shop ---------- */
  function renderFilters() {
    $('#shopFilters').innerHTML = D.shopFilters.map(f => `<button class="chip" data-filter="${esc(f)}" aria-pressed="${S.filter === f}">${esc(f)}</button>`).join('');
  }

  function renderProducts() {
    const q = S.q.trim().toLowerCase();
    const list = Object.entries(D.products).filter(([, p]) => (S.filter === 'All' || p.cat === S.filter) && (!q || (p.name + ' ' + p.desc + ' ' + p.cat).toLowerCase().includes(q)));
    $('#productGrid').innerHTML = list.map(([id, p]) => `
      <article class="p-card">
        <div class="p-media">
          <a href="#product" data-open="${id}" aria-label="View ${esc(p.name)}"><img src="${IMG + p.img}" alt="${esc(p.name)}" loading="lazy"></a>
          <button class="heart" data-wish="${id}" aria-pressed="${!!S.wish[id]}" aria-label="${S.wish[id] ? 'Remove from' : 'Add to'} wishlist: ${esc(p.name)}">${heartSvg(17)}</button>
        </div>
        <div class="p-info">
          <a href="#product" data-open="${id}"><span class="p-name">${esc(p.name)}</span><span class="p-size">${esc(p.size)}</span><span class="p-price">${money(p.price)}</span></a>
          <button class="add-btn" data-add="${id}" aria-label="Add ${esc(p.name)} to cart"><svg viewBox="0 0 24 24" width="17" height="17" class="i"><path d="M5 12h14M12 5v14"/></svg></button>
        </div>
      </article>`).join('');
    const empty = list.length === 0;
    $('#shopEmpty').hidden = !empty;
    if (empty) $('#shopEmpty').textContent = (S.filter === 'Tools' || S.filter === 'Kits') && !q ? `${S.filter} are coming soon to Shop Queen B.` : 'No products match your search.';
  }

  function thumbsFor(p) {
    return [
      p.lg ? { img: p.lg, cover: false } : { img: p.img, cover: false },
      { img: 'products-hero.jpg', cover: true, pos: '25% 50%' },
      { img: 'products-hero.jpg', cover: true, pos: '62% 50%' }
    ];
  }

  function renderDetail() {
    const p = D.products[S.pid], th = thumbsFor(p), m = th[S.thumb] || th[0];
    $('#thumbs').innerHTML = th.map((t, i) => `<button class="thumb" data-thumb="${i}" aria-pressed="${i === S.thumb}" aria-label="Image ${i + 1}"><img src="${IMG + t.img}" alt="" style="object-fit:${t.cover ? 'cover' : 'contain'};object-position:${t.pos || '50% 50%'}" loading="lazy"></button>`).join('');
    const img = $('#mainImg');
    img.src = IMG + m.img; img.alt = p.name;
    img.className = m.cover ? 'cover' : '';
    img.style.objectPosition = m.pos || '50% 50%';
    $('#dName').textContent = p.name;
    $('#dSize').textContent = p.size;
    $('#dRating').textContent = p.rating;
    $('#dDesc').textContent = p.desc;
    $('#dPrice').textContent = money(p.price);
    $('#qty').textContent = S.qty;
    const w = $('#detailWish'); w.setAttribute('aria-pressed', String(!!S.wish[S.pid])); w.setAttribute('aria-label', (S.wish[S.pid] ? 'Remove from' : 'Add to') + ' wishlist');
  }

  function toggleWish(id) {
    S.wish[id] = !S.wish[id]; if (!S.wish[id]) delete S.wish[id];
    store.set('wish', S.wish);
    say(S.wish[id] ? 'Saved to your wishlist' : 'Removed from wishlist');
    renderProducts(); renderDetail();
  }

  function bindShop() {
    $('#shopFilters').addEventListener('click', e => { const b = e.target.closest('[data-filter]'); if (!b) return; S.filter = b.dataset.filter; renderFilters(); renderProducts(); });
    $('#shopSearch').addEventListener('input', e => { S.q = e.target.value; renderProducts(); });
    $('#productGrid').addEventListener('click', e => {
      const open = e.target.closest('[data-open]'), wish = e.target.closest('[data-wish]'), add = e.target.closest('[data-add]');
      if (wish) toggleWish(wish.dataset.wish);
      else if (add) addToCart(add.dataset.add, 1);
      else if (open) { e.preventDefault(); S.pid = open.dataset.open; S.qty = 1; S.thumb = 0; renderDetail(); go('product'); }
    });
    $('#thumbs').addEventListener('click', e => { const b = e.target.closest('[data-thumb]'); if (!b) return; S.thumb = +b.dataset.thumb; renderDetail(); });
    $('#detailWish').addEventListener('click', () => toggleWish(S.pid));
    $('#qtyDown').addEventListener('click', () => { S.qty = Math.max(1, S.qty - 1); $('#qty').textContent = S.qty; });
    $('#qtyUp').addEventListener('click', () => { S.qty = Math.min(20, S.qty + 1); $('#qty').textContent = S.qty; });
    $('#addDetail').addEventListener('click', () => addToCart(S.pid, S.qty));
  }

  /* ---------- Cart ---------- */
  const cartCount = () => Object.values(S.cart).reduce((a, b) => a + b, 0);
  const cartSubtotal = () => Object.entries(S.cart).reduce((sum, [id, q]) => sum + D.products[id].price * q, 0);
  const deliveryFee = (method, sub) => method === 'collect' || sub >= D.delivery.freeOver || sub === 0 ? 0 : D.delivery.fee;

  function saveCart() { store.set('cart', S.cart); renderBadges(); renderCart(); }

  function addToCart(id, qty) {
    S.cart[id] = Math.min(20, (S.cart[id] || 0) + qty);
    saveCart();
    const p = D.products[id];
    say(`${qty > 1 ? qty + ' × ' : ''}${p.name} added to cart`);
    $$('[data-cart-count]').forEach(b => { b.classList.remove('bump'); void b.offsetWidth; b.classList.add('bump'); });
  }

  function renderBadges() {
    const n = cartCount();
    $$('[data-cart-count]').forEach(b => { b.textContent = n; b.hidden = n === 0; });
    $$('[data-action="cart"]').forEach(b => b.setAttribute('aria-label', `Open cart, ${n} item${n === 1 ? '' : 's'}`));
  }

  function renderCart() {
    const ids = Object.keys(S.cart);
    if (!ids.length) {
      $('#cartBody').innerHTML = `<div class="cart-empty"><span class="script">Your cart is empty</span><p style="margin:0">Treat your hair to something from the Queen B range.</p><button class="btn btn-ink" data-action="shop-now">Shop the Collection</button></div>`;
      $('#cartFoot').innerHTML = '';
      return;
    }
    $('#cartBody').innerHTML = ids.map(id => {
      const p = D.products[id], q = S.cart[id];
      return `<div class="line-item">
        <img src="${IMG + p.img}" alt="">
        <div><div class="li-name">${esc(p.name)}</div><div class="li-size">${esc(p.size)} · ${money(p.price)}</div>
          <div class="qty sm" role="group" aria-label="Quantity for ${esc(p.name)}">
            <button data-dec="${id}" aria-label="Decrease"><svg viewBox="0 0 24 24" width="14" height="14" class="i" style="stroke-width:1.8"><path d="M5 12h14"/></svg></button>
            <span>${q}</span>
            <button data-inc="${id}" aria-label="Increase"><svg viewBox="0 0 24 24" width="14" height="14" class="i" style="stroke-width:1.8"><path d="M5 12h14M12 5v14"/></svg></button>
          </div></div>
        <div class="li-right"><span>${money(p.price * q)}</span><button class="remove" data-remove="${id}">Remove</button></div>
      </div>`;
    }).join('');
    const sub = cartSubtotal(), left = D.delivery.freeOver - sub;
    $('#cartFoot').innerHTML = `<div class="totals">
        <div><span>Subtotal</span><span>${money(sub)}</span></div>
        <div class="muted"><span>${left > 0 ? `Add ${money(left)} for free delivery` : 'You qualify for free delivery'}</span><span></span></div>
      </div>
      <button class="btn btn-ink btn-lg" data-action="checkout">Checkout · ${money(sub)}</button>
      <button class="link-underline" data-action="continue" style="align-self:center">Continue shopping</button>`;
  }

  /* ---------- Dialog helpers (overlay, Esc, focus trap) ---------- */
  let lastFocus = null, openDialog = null;
  function trapKeys(e) {
    if (!openDialog) return;
    if (e.key === 'Escape') { closeDialogs(); return; }
    if (e.key !== 'Tab') return;
    const f = $$('button:not([disabled]), a[href], input, select, textarea', openDialog).filter(el => el.offsetParent !== null);
    if (!f.length) return;
    const first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }
  function showDialog(el) {
    if (!openDialog) lastFocus = document.activeElement;
    if (openDialog && openDialog !== el) openDialog.hidden = true;
    openDialog = el; el.hidden = false;
    $('#overlay').hidden = el.id !== 'cartDrawer';
    document.body.style.overflow = 'hidden';
    const f = el.querySelector('input, button:not([data-close]), [data-close]'); if (f) f.focus();
  }
  function closeDialogs() {
    $('#cartDrawer').hidden = true; $('#checkout').hidden = true; $('#overlay').hidden = true;
    document.body.style.overflow = '';
    openDialog = null;
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }
  const openCart = () => { renderCart(); showDialog($('#cartDrawer')); };

  function bindCart() {
    document.addEventListener('keydown', trapKeys);
    $('#overlay').addEventListener('click', closeDialogs);
    $('#cartDrawer').addEventListener('click', e => {
      const t = e.target.closest('button'); if (!t) return;
      if (t.hasAttribute('data-close') || t.dataset.action === 'continue') closeDialogs();
      else if (t.dataset.action === 'shop-now') { closeDialogs(); go('shop'); }
      else if (t.dataset.action === 'checkout') openCheckout();
      else if (t.dataset.inc) { S.cart[t.dataset.inc] = Math.min(20, S.cart[t.dataset.inc] + 1); saveCart(); }
      else if (t.dataset.dec) { const id = t.dataset.dec; S.cart[id]--; if (S.cart[id] < 1) delete S.cart[id]; saveCart(); }
      else if (t.dataset.remove) { const p = D.products[t.dataset.remove]; delete S.cart[t.dataset.remove]; saveCart(); say(p.name + ' removed'); }
    });
  }

  /* ---------- Checkout ---------- */
  const CO = { name: '', phone: '', email: '', method: 'collect', address: '', suburb: '', postal: '', errors: {} };

  function coField(id, label, type, ph, extra = '') {
    const err = CO.errors[id];
    return `<label class="field ${err ? 'invalid' : ''}">${label}<input name="${id}" type="${type}" value="${esc(CO[id])}" placeholder="${ph}" ${extra} ${err ? 'aria-invalid="true"' : ''}>${err ? `<span class="err">${err}</span>` : ''}</label>`;
  }

  function renderCheckout(done) {
    const card = $('#coCard');
    if (done) {
      card.innerHTML = `<div class="confirmed" style="padding:12px 0">
        <span class="check"><svg viewBox="0 0 24 24" width="26" height="26" class="i" style="stroke-width:2"><path d="M20 6 9 17l-5-5"/></svg></span>
        <h3>Thank you, <span class="script">Queen.</span></h3>
        <div class="ref">ORDER ${esc(done.ref)} · ${money(done.total)}</div>
        <p>${done.method === 'collect' ? 'We’ll WhatsApp you when your order is ready to collect at 277 Columbine Avenue, Mondeor.' : `Your order will be delivered to ${esc(done.address)} within 2–4 working days.`} A confirmation has been sent to ${esc(done.phone)}.</p>
        <p class="demo-note">Demo only: no payment was taken and no order was sent.</p>
        <div style="display:flex;gap:10px;flex-wrap:wrap"><button class="btn btn-ink" data-close>Done</button><a href="#booking" class="btn btn-outline" data-close>Book an appointment</a></div>
      </div>`;
      return;
    }
    const sub = cartSubtotal(), fee = deliveryFee(CO.method, sub), total = sub + fee;
    card.innerHTML = `<div class="modal-head"><div class="titles"><div class="eyebrow">CHECKOUT</div><h2 id="coTitle">Almost yours, <span class="script">Queen.</span></h2></div>
        <button class="icon-btn round" data-close aria-label="Close checkout"><svg viewBox="0 0 24 24" width="20" height="20" class="i"><path d="M6 6l12 12M18 6 6 18"/></svg></button></div>
      <div class="co-grid">
        <form class="form" id="coForm" novalidate>
          ${coField('name', 'Full name', 'text', 'Your name', 'autocomplete="name"')}
          <div class="form-row">${coField('phone', 'Phone', 'tel', '071 000 0000', 'autocomplete="tel" inputmode="tel"')}${coField('email', 'Email', 'email', 'you@email.com', 'autocomplete="email"')}</div>
          <div class="field">How would you like to receive it?
            <div class="seg" role="radiogroup">
              <label><input type="radio" name="method" value="collect" ${CO.method === 'collect' ? 'checked' : ''}> Collect in salon <small style="margin-left:auto;color:var(--text-3)">Free</small></label>
              <label><input type="radio" name="method" value="deliver" ${CO.method === 'deliver' ? 'checked' : ''}> Delivery <small style="margin-left:auto;color:var(--text-3)">${sub >= D.delivery.freeOver ? 'Free' : money(D.delivery.fee).replace('.00', '')}</small></label>
            </div>
          </div>
          ${CO.method === 'deliver' ? `${coField('address', 'Street address', 'text', '12 Example Street', 'autocomplete="street-address"')}
            <div class="form-row">${coField('suburb', 'Suburb / City', 'text', 'Mondeor, Johannesburg', 'autocomplete="address-level2"')}${coField('postal', 'Postal code', 'text', '2091', 'autocomplete="postal-code" inputmode="numeric"')}</div>` : ''}
        </form>
        <div class="panel" style="background:var(--blush-2);border-color:transparent">
          <div class="card-title">Order summary</div>
          <div class="co-items">${Object.entries(S.cart).map(([id, q]) => { const p = D.products[id]; return `<div class="co-item"><img src="${IMG + p.img}" alt=""><span>${esc(p.name)} <span style="color:var(--text-3)">× ${q}</span></span><span>${money(p.price * q)}</span></div>`; }).join('')}</div>
          <div class="totals" style="border-top:1px solid var(--line);padding-top:14px">
            <div><span>Subtotal</span><span>${money(sub)}</span></div>
            <div><span>${CO.method === 'collect' ? 'Collection' : 'Delivery'}</span><span>${fee ? money(fee) : 'Free'}</span></div>
            <div class="grand"><span>Total</span><span>${money(total)}</span></div>
          </div>
          <button class="btn btn-ink btn-lg" style="width:100%;margin-top:18px" data-action="place">Place order (demo) · ${money(total)}</button>
          <p class="demo-note" style="margin-top:12px">This is a demo store. Payments (e.g. PayFast, Yoco or card) will be connected when the site goes live.</p>
        </div>
      </div>`;
  }

  function openCheckout() {
    if (!cartCount()) return;
    CO.errors = {};
    renderCheckout();
    showDialog($('#checkout'));
  }

  function placeOrder() {
    const e = {};
    if (CO.name.trim().length < 2) e.name = 'Please enter your name.';
    if (!/^(0\d{9}|\+27\d{9}|27\d{9})$/.test(CO.phone.replace(/[\s()-]/g, ''))) e.phone = 'Enter a valid SA number.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(CO.email.trim())) e.email = 'Enter a valid email.';
    if (CO.method === 'deliver') {
      if (CO.address.trim().length < 4) e.address = 'Please enter your street address.';
      if (CO.suburb.trim().length < 2) e.suburb = 'Please enter your suburb.';
      if (!/^\d{4}$/.test(CO.postal.trim())) e.postal = '4-digit postal code.';
    }
    CO.errors = e;
    if (Object.keys(e).length) {
      renderCheckout();
      const f = $('#coForm [aria-invalid="true"]'); if (f) f.focus();
      return;
    }
    const sub = cartSubtotal(), fee = deliveryFee(CO.method, sub);
    const order = {
      ref: 'QB' + Date.now().toString().slice(-7), items: { ...S.cart }, subtotal: sub, delivery: fee, total: sub + fee,
      method: CO.method, name: CO.name.trim(), phone: CO.phone.trim(), email: CO.email.trim(),
      address: CO.method === 'deliver' ? `${CO.address.trim()}, ${CO.suburb.trim()}, ${CO.postal.trim()}` : '', createdAt: new Date().toISOString()
    };
    const orders = store.get('orders', []); orders.push(order); store.set('orders', orders);
    S.cart = {}; saveCart();
    renderCheckout(order);
    const btn = $('#coCard [data-close]'); if (btn) btn.focus();
    say('Order placed');
  }

  function bindCheckout() {
    const m = $('#checkout');
    m.addEventListener('click', e => {
      if (e.target === m) { closeDialogs(); return; }
      const t = e.target.closest('button, a'); if (!t) return;
      if (t.hasAttribute('data-close')) { closeDialogs(); if (t.getAttribute('href') === '#booking') { e.preventDefault(); go('booking'); } }
      else if (t.dataset.action === 'place') placeOrder();
    });
    m.addEventListener('input', e => {
      const n = e.target.name; if (!n || !(n in CO)) return;
      CO[n] = e.target.value;
      if (n === 'method') { renderCheckout(); $(`#coForm input[value="${CO.method}"]`).focus(); return; }
      if (CO.errors[n]) { delete CO.errors[n]; const f = e.target.closest('.field'); f.classList.remove('invalid'); e.target.removeAttribute('aria-invalid'); const er = f.querySelector('.err'); if (er) er.remove(); }
    });
    m.addEventListener('submit', e => { e.preventDefault(); placeOrder(); });
  }

  /* ---------- Lookbook ---------- */
  function renderLook() {
    $('#lookTabs').innerHTML = D.lookTabs.map(t => `<button class="chip" data-look="${t}" aria-pressed="${S.look === t}">${t}</button>`).join('');
    $('#lookGrid').innerHTML = D.looks.filter(l => S.look === 'All' || l[2] === S.look).map(([img, label, , pos]) =>
      `<figure class="look"><img src="${IMG + img}" alt="${esc(label)}" style="object-position:${pos}" loading="lazy"><figcaption>${esc(label)}</figcaption></figure>`).join('');
  }

  /* ---------- Global bindings ---------- */
  function bindGlobal() {
    $('#menuBtn').addEventListener('click', () => setMenu($('#mobileMenu').hidden));
    $('#mobileMenu').addEventListener('click', e => { if (e.target.closest('a')) setMenu(false); });
    document.addEventListener('click', e => {
      const a = e.target.closest('[data-action="cart"]'); if (a) { e.preventDefault(); setMenu(false); openCart(); return; }
      const s = e.target.closest('[data-action="search"]');
      if (s) { e.preventDefault(); setMenu(false); go('shop'); setTimeout(() => $('#shopSearch').focus({ preventScroll: true }), 450); }
    });
    $('#lookTabs').addEventListener('click', e => { const b = e.target.closest('[data-look]'); if (!b) return; S.look = b.dataset.look; renderLook(); });
    // keep the mobile tab bar badge in sync with the header one
    const shopTab = $('#tabbar .tab[data-sec="shop"]');
    if (shopTab) shopTab.insertAdjacentHTML('beforeend', '<span class="badge" data-cart-count hidden>0</span>');
    $('#year').textContent = new Date().getFullYear();
  }

  /* ---------- Init ---------- */
  renderNav();
  renderStatic();
  renderBooking();
  renderFilters();
  renderProducts();
  renderDetail();
  renderLook();
  bindGlobal();
  bindBooking();
  bindShop();
  bindCart();
  bindCheckout();
  renderBadges();
  renderCart();
  trackSections();
})();
