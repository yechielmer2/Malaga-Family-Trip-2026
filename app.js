(() => {
  const STORAGE_KEY = 'us-trip-2026-data-v1';
  const CHECKLIST_KEY = 'us-trip-2026-checklist-v1';
  const ATTRACTIONS_KEY = 'us-trip-2026-attractions-v1';
  const PRE_TRIP_TASKS = [
    { id: 'iphone-backup', label: 'iPhone backup' },
    { id: 'internet-sim', label: 'Data SIM / eSIM' },
    { id: 'travel-insurance', label: 'Travel insurance' },
    { id: 'flight-netflix', label: 'Netflix for the flight', note: 'Download shows in advance' }
  ];
  const clone = value => JSON.parse(JSON.stringify(value));
  let state = loadState();
  let editorOpen = false;
  let editorTab = 'day';
  let editingDayId = state.days[0]?.id || '';
  let toastTimer;

  const app = document.getElementById('app');

  function loadState() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) { console.warn('Could not load saved trip', e); }
    return clone(window.DEFAULT_TRIP);
  }

  function saveState() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  function loadChecklist() {
    try {
      return JSON.parse(localStorage.getItem(CHECKLIST_KEY) || '{}');
    } catch (e) {
      return {};
    }
  }

  function loadAttractionsDone() {
    try {
      return JSON.parse(localStorage.getItem(ATTRACTIONS_KEY) || '{}');
    } catch (e) {
      return {};
    }
  }

  function attractionsPage() {
    const done = loadAttractionsDone();
    const list = state.attractions || [];
    const totalDone = list.filter(a => done[a.id]).length;
    const groups = {};
    list.forEach(a => { (groups[a.category] = groups[a.category] || []).push(a); });
    const sections = Object.keys(groups).map(cat => `
      <section class="section">
        <div class="section-head"><div><h2>${esc(cat)}</h2></div></div>
        <article class="card checklist-card">
          ${groups[cat].map(a => `
            <div class="checklist-row">
              <label class="checklist-item ${done[a.id] ? 'completed' : ''}">
                <input type="checkbox" data-attraction-id="${esc(a.id)}" ${done[a.id] ? 'checked' : ''}>
                <span class="checkmark" aria-hidden="true">✓</span>
                <span class="checklist-copy"><b>${esc(a.name)}</b>${a.desc ? `<small>${esc(a.desc)}</small>` : ''}</span>
              </label>
              ${a.maps ? `<a class="btn btn-ghost btn-small" href="${esc(a.maps)}" target="_blank" rel="noopener">${esc(a.linkLabel || 'Map')}</a>` : ''}
            </div>`).join('')}
        </article>
      </section>`).join('');
    return appShell(`
      <section class="section" style="margin-top:0">
        <div class="section-head"><div><div class="eyebrow" style="color:var(--brand-2)">What we did</div><h2>Attractions & places</h2><p>Check off what you have already done on the trip. ${totalDone}/${list.length} done.</p></div></div>
      </section>
      ${sections}
    `);
  }

  function checklistCard() {
    const completed = loadChecklist();
    const done = PRE_TRIP_TASKS.filter(task => completed[task.id]).length;
    return `
      <section class="section">
        <div class="section-head">
          <div><h2>Pre-flight checklist</h2><p>Small things worth closing in time</p></div>
          <span class="checklist-count">${done}/${PRE_TRIP_TASKS.length} done</span>
        </div>
        <article class="card checklist-card">
          ${PRE_TRIP_TASKS.map(task => `
            <label class="checklist-item ${completed[task.id] ? 'completed' : ''}">
              <input type="checkbox" data-checklist-id="${esc(task.id)}" ${completed[task.id] ? 'checked' : ''}>
              <span class="checkmark" aria-hidden="true">✓</span>
              <span class="checklist-copy">
                <b>${esc(task.label)}</b>
                ${task.note ? `<small>${esc(task.note)}</small>` : ''}
              </span>
            </label>`).join('')}
        </article>
      </section>`;
  }

  function esc(value = '') {
    return String(value).replace(/[&<>'"]/g, ch => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', "'":'&#39;', '"':'&quot;' }[ch]));
  }

  function currentRoute() {
    const hash = location.hash.replace(/^#/, '') || 'home';
    if (hash.startsWith('day-')) return { page: 'day', id: hash };
    return { page: ['home','days','route','lodgings','documents','info','attractions'].includes(hash) ? hash : 'home' };
  }

  function dateStatus() {
    const now = new Date();
    const start = new Date(state.startDate + 'T00:00:00');
    const end = new Date(state.endDate + 'T23:59:59');
    const days = Math.ceil((start - now) / 86400000);
    if (now < start) return { number: Math.max(0, days), label: days === 1 ? 'day until the trip' : 'days until the trip' };
    if (now > end) return { number: '✓', label: 'Trip complete' };
    const dayIndex = Math.floor((now - start) / 86400000) + 1;
    return { number: `Day ${dayIndex}`, label: 'We are on the trip' };
  }

  function activeDay() {
    const now = new Date();
    const start = new Date(state.startDate + 'T00:00:00');
    const idx = Math.max(0, Math.min(state.days.length - 1, Math.floor((now - start) / 86400000)));
    return state.days[idx] || state.days[0];
  }

  function go(hash) {
    location.hash = hash;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function icon(label) {
    return ({ home:'⌂', days:'☷', route:'⌁', lodgings:'⌂', documents:'▣', info:'ⓘ', attractions:'★' })[label] || '•';
  }

  function appShell(content) {
    const route = currentRoute();
    return `
      <div class="app-shell">
        <header class="topbar">
          <button class="brand" data-go="home" aria-label="Back to home" style="border:0;background:none;padding:0;cursor:pointer;text-align:left">
            <span class="brand-mark">☀</span>
            <span><div class="brand-title">${esc(state.title)}</div><div class="brand-sub">${esc(state.dateLabel)}</div></span>
          </button>
          <div class="top-actions">
            <button class="chip-btn" data-action="print" title="Print"><span>⎙</span><span class="desktop-label">Print</span></button>
            <button class="chip-btn edit-only" data-action="open-editor" title="Edit"><span>✎</span><span class="desktop-label">Edit plan</span></button>
          </div>
        </header>
        <main class="main">${content}</main>
        ${bottomNav(route.page)}
        ${editorOpen ? editorModal() : ''}
      </div>`;
  }

  function bottomNav(active) {
    const items = [
      ['home','Home'], ['days','Days'], ['route','Route'], ['lodgings','Stays'], ['attractions','Attractions'], ['documents','Documents'], ['info','Info']
    ];
    return `<nav class="bottom-nav" aria-label="Main navigation">${items.map(([id,label]) => `
      <button data-go="${id}" class="${active === id || (active === 'day' && id === 'days') ? 'active' : ''}">
        <span>${icon(id)}</span><span>${label}</span>
      </button>`).join('')}</nav>`;
  }

  function hero() {
    const c = dateStatus();
    const day = activeDay();
    return `<section class="hero">
      <div class="hero-grid">
        <div>
          <div class="eyebrow">${esc(state.subtitle)}</div>
          <h1>${esc(state.title)}</h1>
          <p class="hero-lead">${esc(state.notes)}</p>
          <div class="hero-meta">
            <span class="hero-pill">📅 ${esc(state.dateLabel)}</span>
            <span class="hero-pill">📍 ${esc(state.routeLabel)}</span>
            <span class="hero-pill">👨‍👩‍👧‍👦 Ganam + Romano</span>
          </div>
          ${state.lastUpdated ? `<div class="hero-updated">Last updated: <bdi>${esc(state.lastUpdated)}</bdi></div>` : ''}
        </div>
        <div class="hero-side">
          <div class="countdown-card">
            <div class="countdown-label">${esc(c.label)}</div>
            <div class="countdown-number">${esc(c.number)}</div>
            <div>${esc(day.date)} · ${esc(day.title)}</div>
            <div class="hero-actions">
              <button class="btn btn-primary" data-go="${esc(day.id)}">Open today</button>
              <a class="btn btn-light" href="${esc(day.navigation.full)}" target="_blank" rel="noopener">Today's navigation</a>
            </div>
          </div>
        </div>
      </div>
    </section>`;
  }

  function homePage() {
    const day = activeDay();
    const firstHotel = state.lodgings[0];
    const secondHotel = state.lodgings[1];
    const rental = state.useful.carRental;
    return appShell(`
      ${hero()}
      <section class="section">
        <div class="section-head"><div><h2>Today's focus</h2><p>Everything you need, without digging through messages and files</p></div><button class="text-link" data-go="days">All days →</button></div>
        <article class="card today-card">
          <div>
            <div class="big-date">${esc(day.date)}</div>
            <h3>${esc(day.title)}</h3>
            <p>${esc(day.summary)}</p>
            <div class="today-actions">
              <button class="btn btn-dark" data-go="${esc(day.id)}">Day details</button>
              <a class="btn btn-soft" target="_blank" rel="noopener" href="${esc(day.navigation.full)}">Full route on map</a>
              ${day.weather ? `<a class="btn btn-ghost" target="_blank" rel="noopener" href="${esc(day.weather.href)}">Weather</a>` : ''}
            </div>
          </div>
          <div class="today-icon">${day.schedule[0]?.icon || '🧭'}</div>
        </article>
      </section>

      <section class="section">
        <div class="section-head"><div><h2>At a glance</h2><p>The things we'll need most in real time</p></div></div>
        <div class="grid grid-3">
          <article class="card quick-card">
            <div><div class="quick-icon">✈️</div><div class="mini-label">Outbound flight</div><div class="quick-value">${esc(state.flights[0].depart)} → ${esc(state.flights[0].arrive)}</div><div class="quick-caption">${esc(state.flights[0].airline)} · ${esc(state.flights[0].date)} · ${esc(state.flights[0].flightNumber)}</div></div>
            <button class="text-link" data-go="info">All flight details →</button>
          </article>
          <article class="card quick-card">
            <div><div class="quick-icon">🏨</div><div class="mini-label">First stay</div><div class="quick-value">${esc(firstHotel.name)}</div><div class="quick-caption">${esc(firstHotel.dates)}</div></div>
            <button class="text-link" data-go="lodgings">All stays →</button>
          </article>
          <article class="card quick-card">
            <div><div class="quick-icon">👨‍👩‍👧‍👦</div><div class="mini-label">Who's traveling</div><div class="quick-value">Two families</div><div class="quick-caption">Ganam, plus the Romano family from San Diego on: 4 adults, 5 kids</div></div>
            <button class="text-link" data-go="lodgings">All stays →</button>
          </article>
        </div>
      </section>

      ${checklistCard()}

      ${rental?.warning ? `<section class="section"><div class="alert-card"><div class="alert-icon">!</div><div><h3>${esc(rental.alertTitle || 'Before you drive')}</h3><p>${esc(rental.warning)}</p><button class="text-link" data-go="info">Useful info →</button></div></div></section>` : ''}

      <section class="section">
        <div class="section-head"><div><h2>Trip route</h2><p>Los Angeles, San Diego, a parks road trip and Las Vegas</p></div><button class="text-link" data-go="route">Route map →</button></div>
        ${routePreview()}
      </section>

      <section class="section">
        <div class="section-head"><div><h2>Before you go</h2><p>A couple of things to remember</p></div><button class="text-link" data-go="documents">Documents →</button></div>
        <div class="grid grid-2">
          <article class="card"><div class="card-top"><div><div class="mini-label">San Diego</div><h3>${esc(secondHotel.name)}</h3></div><span class="status ${['Booked','Hosted'].includes(secondHotel.status) ? 'ready' : 'pending'}">${esc(secondHotel.status)}</span></div><p>${esc(secondHotel.note)}</p></article>
          <article class="card"><div class="card-top"><div><div class="mini-label">Flights</div><h3>Baggage & check-in</h3></div><span class="status pending">To check</span></div><p>Arrive at the airport at least 3 hours before each flight and check the baggage allowance for every traveler in advance.</p></article>
        </div>
      </section>
    `);
  }

  function routePreview() {
    const stops = state.fullRoute.stops;
    const points = [[45,242],[210,112],[390,177],[565,140],[735,180],[880,57]];
    return `<article class="card route-card">
      <div class="route-visual">
        <svg viewBox="0 0 920 290" role="img" aria-label="Diagram of the trip route from Los Angeles to Las Vegas">
          <defs><linearGradient id="routeG" x1="0" x2="1"><stop stop-color="#e49b3d"/><stop offset="1" stop-color="#245d55"/></linearGradient></defs>
          <path d="M45 242C155 190 155 82 275 102s102 122 225 92 115-86 218-23 86-69 162-114" fill="none" stroke="rgba(255,255,255,.7)" stroke-width="34" stroke-linecap="round"/>
          <path d="M45 242C155 190 155 82 275 102s102 122 225 92 115-86 218-23 86-69 162-114" fill="none" stroke="url(#routeG)" stroke-width="8" stroke-linecap="round" stroke-dasharray="1 17"/>
          ${points.map(([x,y],i) => { const label = stops[i]?.name || ''; return `<g><circle cx="${x}" cy="${y}" r="18" fill="#fff"/><circle cx="${x}" cy="${y}" r="10" fill="${i===2?'#e7a74d':'#173f3a'}"/><text x="${x}" y="${y-28}" text-anchor="middle" font-size="14" font-weight="800" fill="#17312e">${esc(label)}</text></g>`; }).join('')}
          <path d="M0 285 105 205l65 35 88-94 70 72 120-150 103 143 72-65 80 76 96-125 141 188Z" fill="rgba(23,63,58,.11)"/>
        </svg>
      </div>
      <div class="route-legend">
        <div class="card-top"><div><div class="mini-label">${esc(state.dateLabel)}</div><h3>${esc(state.fullRoute.title)}</h3><p>${esc(state.fullRoute.subtitle)}</p></div><a class="btn btn-dark btn-small" href="${esc(state.fullRoute.google)}" target="_blank" rel="noopener">Open in map</a></div>
        <div class="route-stops">${stops.map(s => `<div class="route-stop"><b>${esc(s.name)}</b><span>${esc(s.kind)}</span></div>`).join('')}</div>
      </div>
    </article>`;
  }

  function daysPage() {
    return appShell(`
      <section class="section" style="margin-top:0">
        <div class="section-head"><div><div class="eyebrow" style="color:var(--brand-2)">The full plan</div><h2>Day by day</h2><p>Schedule, stops, navigation and tips for each day</p></div></div>
        <div class="day-list">${state.days.map(day => dayCard(day)).join('')}</div>
      </section>
    `);
  }

  function dayCard(day) {
    const pending = ['Decision','To plan','Draft','Check'].some(k => day.badge.includes(k));
    return `<article class="day-card" tabindex="0" role="button" data-go="${esc(day.id)}">
      <div class="day-num"><div><span>Day</span><strong>${day.number}</strong><span>${esc(day.shortDate)}</span></div></div>
      <div><div class="mini-label">${esc(day.date)}</div><h3>${esc(day.title)}</h3><p>${esc(day.route)}</p></div>
      <div><span class="status ${pending ? 'pending' : 'ready'}">${esc(day.badge)}</span><div class="day-arrow" style="margin-top:8px">→</div></div>
    </article>`;
  }

  function navLeg(l) {
    const wazeHref = l.waze || l.href || '';
    const mapsHref = l.maps || '';
    return `<div class="nav-link"><span class="nav-logo">📍</span><span><b>${esc(l.label)}</b><small>${esc(l.sub || 'Navigate')}</small></span><span class="nav-actions">${wazeHref ? `<a class="btn btn-dark btn-small" href="${esc(wazeHref)}" target="_blank" rel="noopener">Waze</a>` : ''}${mapsHref ? `<a class="btn btn-ghost btn-small" href="${esc(mapsHref)}" target="_blank" rel="noopener">Map</a>` : ''}</span></div>`;
  }

  function dayPage(id) {
    const day = state.days.find(d => d.id === id);
    if (!day) return appShell('<div class="empty">Day not found.</div>');
    return appShell(`
      <section class="day-hero" data-tone="${esc(day.tone)}">
        <button class="back-btn" data-go="days">← All days</button>
        <div class="day-kicker">Day ${day.number} · ${esc(day.date)}</div>
        <h1>${esc(day.title)}</h1>
        <div class="day-route">${esc(day.route)}</div>
        <div class="day-fact">${esc(day.heroFact)}</div>
      </section>
      <div class="day-meta">
        <div class="meta-card"><span class="mini-label">Duration</span><b>${esc(day.duration)}</b></div>
        <div class="meta-card"><span class="mini-label">Walking</span><b>${esc(day.walking)}</b></div>
        <div class="meta-card"><span class="mini-label">Status</span><b>${esc(day.badge)}</b></div>
      </div>

      <section class="section grid grid-2">
        <article class="card"><div class="card-top"><div><div class="mini-label">The big picture</div><h3>What we do today</h3></div><button class="btn btn-ghost btn-small edit-only" data-action="edit-day" data-day="${esc(day.id)}">Edit</button></div><p style="font-size:17px">${esc(day.summary)}</p></article>
        <article class="card"><div class="mini-label">Navigation</div><h3>Open and go</h3><p>The full route opens in Google Maps; each stop also opens separately in Waze.</p><a class="btn btn-dark" style="width:100%;margin-top:8px" href="${esc(day.navigation.full)}" target="_blank" rel="noopener">Open full route</a>${day.weather ? `<a class="btn btn-soft" style="width:100%;margin-top:8px" href="${esc(day.weather.href)}" target="_blank" rel="noopener">☁ ${esc(day.weather.label)}</a>` : ''}</article>
      </section>

      <section class="section grid grid-2">
        <article class="card">
          <div class="mini-label">Schedule</div><h3>Today's plan</h3>
          <div class="timeline">${day.schedule.map(item => `<div class="timeline-item"><div class="timeline-icon">${esc(item.icon)}</div><div class="timeline-time">${esc(item.time)}</div><div class="timeline-body"><b>${esc(item.title)}</b><p>${esc(item.detail)}</p></div></div>`).join('')}</div>
        </article>
        <div class="grid">
          <article class="card"><div class="mini-label">Good to know</div><h3>Tips for today</h3><ul class="tip-list">${day.tips.map(t => `<li>${esc(t)}</li>`).join('')}</ul></article>
          ${day.navigation.legs.length ? `<article class="card"><div class="mini-label">Stops</div><h3>Navigate to each stop</h3><div class="nav-links" style="margin-top:12px">${day.navigation.legs.map(l => navLeg(l)).join('')}</div></article>` : ''}
        </div>
      </section>
    `);
  }

  function routePage() {
    return appShell(`
      <section class="section" style="margin-top:0">
        <div class="section-head"><div><div class="eyebrow" style="color:var(--brand-2)">Trip map</div><h2>All places on the map</h2><p>Pins by type: stays, food and attractions. Tap a pin to open it in Google Maps.</p></div></div>
        <div id="route-map" class="route-map"></div>
        <div class="map-legend"><span><i style="background:#1d4ed8"></i> Stays</span><span><i style="background:#e07b1a"></i> Food</span><span><i style="background:#188a4e"></i> Attractions</span><span><i style="background:#173f3a;border-radius:2px;width:20px;height:3px"></i> Route</span></div>
      </section>
      <section class="section"><div class="section-head"><div><div class="eyebrow" style="color:var(--brand-2)">Route overview</div><h2>Map & navigation</h2><p>A link to the full route and a separate link for each day</p></div></div>${routePreview()}</section>
      <section class="section"><div class="section-head"><div><h2>Drive segments</h2><p>Open each segment separately</p></div></div><div class="day-list">${state.days.filter(d => d.navigation?.full).map(d => `<article class="day-card" data-go="${esc(d.id)}"><div class="day-num"><div><span>Day</span><strong>${d.number}</strong><span>${esc(d.shortDate)}</span></div></div><div><h3>${esc(d.route)}</h3><p>${esc(d.duration)}</p></div><a class="btn btn-dark btn-small" href="${esc(d.navigation.full)}" target="_blank" rel="noopener" onclick="event.stopPropagation()">Map</a></article>`).join('')}</div></section>
      <div class="source-note">Links open in external navigation apps. Check live traffic, parking and any road changes in real time.</div>
    `);
  }

  function lodgingsPage() {
    return appShell(`
      <section class="section" style="margin-top:0"><div class="section-head"><div><div class="eyebrow" style="color:var(--brand-2)">Where we sleep</div><h2>Stays</h2><p>Addresses, dates, links and direct navigation</p></div></div>
        ${state.lodgings.map(l => `<article class="card lodging-card"><div><div class="card-top"><div><div class="mini-label">${esc(l.dates)}</div><h3>${esc(l.name)}</h3><div style="color:var(--muted)">${esc(l.nativeName)}</div></div><span class="status ${['Booked','Hosted'].includes(l.status) ? 'ready' : 'pending'}">${esc(l.status)}</span></div><div class="lodging-address">📍 ${esc(l.location)}</div><div class="info-row"><span>Check-in: <b>${esc(l.checkIn)}</b></span><span>Check-out: <b>${esc(l.checkOut)}</b></span></div><p>${esc(l.note)}</p></div><div class="nav-links"><a class="btn btn-dark btn-small" href="${esc(l.waze)}" target="_blank" rel="noopener">Waze</a><a class="btn btn-ghost btn-small" href="${esc(l.maps)}" target="_blank" rel="noopener">Map</a>${l.weather ? `<a class="btn btn-soft btn-small" href="${esc(l.weather)}" target="_blank" rel="noopener">Weather</a>` : ''}${l.website ? `<a class="btn btn-ghost btn-small" href="${esc(l.website)}" target="_blank" rel="noopener">Booking site</a>` : ''}</div></article>`).join('')}
      </section>
    `);
  }

  function documentsPage() {
    const iconByCategory = { 'Flights':'✈️','Car':'🚗','Transport':'🚐','Lodging':'🏨','Documents':'📄' };
    return appShell(`
      <section class="section" style="margin-top:0">
        <div class="section-head"><div><div class="eyebrow" style="color:var(--brand-2)">All in one place</div><h2>Documents & confirmations</h2><p>Redacted copies for publishing, booking links, and the documents still missing.</p></div><button class="btn btn-dark btn-small edit-only" data-action="open-editor-docs">Add link</button></div>
        <div class="notice">Documents on the site have had confirmation codes and personal details removed. Do not upload passports, a full insurance policy, or any document with sensitive details while the site is public.</div>
        <div class="doc-list">${state.documents.map(doc => `<article class="doc-card"><div class="doc-icon">${iconByCategory[doc.category] || '📄'}</div><div><div class="mini-label">${esc(doc.category)}</div><h3>${esc(doc.title)}</h3><p>${esc(doc.note)}</p></div>${doc.href ? `<a class="btn btn-dark btn-small" href="${esc(doc.href)}" target="_blank" rel="noopener">Open</a>` : `<span class="status pending">${esc(doc.status)}</span>`}</article>`).join('')}</div>
      </section>
    `);
  }

  function infoPage() {
    const rental = state.useful.carRental;
    return appShell(`
      <section class="section" style="margin-top:0"><div class="section-head"><div><div class="eyebrow" style="color:var(--brand-2)">Useful details</div><h2>Flights, car and weather</h2><p>The info that should be quick to reach</p></div></div>
        <div class="grid grid-2">
          ${state.flights.map(f => `<article class="card"><div class="card-top"><div><div class="mini-label">${esc(f.direction)} flight · ${esc(f.date)}</div><h3>${esc(f.from)} → ${esc(f.to)}</h3></div><span class="status ${f.status.includes('Confirmed') ? 'ready' : 'pending'}">${esc(f.status)}</span></div><div style="display:flex;align-items:center;gap:13px;margin:18px 0"><div class="quick-value">${esc(f.depart)}</div><div style="flex:1;height:1px;background:var(--line);position:relative"><span style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);background:var(--card);padding:0 8px">✈</span></div><div class="quick-value">${esc(f.arrive)}</div></div><div class="info-row"><span>${esc(f.airline)}</span><span>${esc(f.flightNumber)}</span><span>${esc(f.duration)}</span></div><p>${esc(f.note)}</p></article>`).join('')}
        </div>
      </section>

      <section class="section">
        <article class="card rental-card"><div><div class="card-top"><div><div class="mini-label">Transport · ${esc(rental.provider)}</div><h3>${esc(rental.title)}</h3></div><span class="status ${rental.status === 'Confirmed' ? 'ready' : 'pending'}">${esc(rental.status)}</span></div><div class="grid grid-2" style="margin-top:15px"><div class="soft-box"><div class="mini-label">Pick-up</div><b>${esc(rental.pickup)}</b></div><div class="soft-box"><div class="mini-label">Drop-off</div><b>${esc(rental.return)}</b></div></div><div class="info-row" style="margin-top:14px"><span><b>${esc(rental.vehicle)}</b></span><span>${esc(rental.deposit)}</span></div><p>${esc(rental.requirements)}</p>${rental.warning ? `<div class="warning-box">${esc(rental.warning)}</div>` : ''}</div>${rental.document ? `<a class="btn btn-dark btn-small" href="${esc(rental.document)}" target="_blank" rel="noopener">Open document</a>` : ''}</article>
      </section>

      <section class="section"><div class="section-head"><div><h2>Weather by location</h2><p>Direct links to Meteoblue</p></div></div><div class="grid grid-2">${state.useful.weather.map(w => `<a class="card weather-card" href="${esc(w.href)}" target="_blank" rel="noopener"><div class="weather-icon">☁️</div><div><div class="mini-label">${esc(w.dates)}</div><h3>${esc(w.name)}</h3><p>${esc(w.note)}</p></div><span>↗</span></a>`).join('')}</div></section>

      <section class="section"><div class="section-head"><div><h2>Emergency numbers</h2></div></div><div class="grid grid-3">${state.useful.emergency.map(e => `<a class="card" href="${esc(e.href)}" style="text-decoration:none"><div class="mini-label">${esc(e.label)}</div><div class="quick-value" style="margin-top:8px"><bdi>${esc(e.value)}</bdi></div><div class="quick-caption">${esc(e.caption || 'Tap to call')}</div></a>`).join('')}</div></section>
    `);
  }

  function editorModal() {
    return `<div class="modal-backdrop" data-action="close-editor-backdrop"><section class="modal" role="dialog" aria-modal="true" aria-label="Edit plan" onclick="event.stopPropagation()"><div class="modal-head"><h2>Edit plan</h2><button class="icon-btn" data-action="close-editor">✕</button></div><div class="modal-body"><div class="notice">Edits are saved in this device's browser. To move them to another device, or make them the site's main version, export a data file and add it to the project.</div><div class="editor-tabs"><button class="${editorTab==='day'?'active':''}" data-editor-tab="day">Edit day</button><button class="${editorTab==='document'?'active':''}" data-editor-tab="document">Documents</button><button class="${editorTab==='data'?'active':''}" data-editor-tab="data">Import & export</button></div>${editorTab === 'day' ? dayEditor() : editorTab === 'document' ? documentEditor() : dataEditor()}</div></section></div>`;
  }

  function dayEditor() {
    const day = state.days.find(d => d.id === editingDayId) || state.days[0];
    return `<form id="day-editor-form"><div class="form-grid"><div class="field full"><label>Select day</label><select name="id" id="editor-day-select">${state.days.map(d => `<option value="${esc(d.id)}" ${d.id===day.id?'selected':''}>Day ${d.number} — ${esc(d.title)}</option>`).join('')}</select></div><div class="field full"><label>Title</label><input name="title" value="${esc(day.title)}"></div><div class="field"><label>Date</label><input name="date" value="${esc(day.date)}"></div><div class="field"><label>Status</label><input name="badge" value="${esc(day.badge)}"></div><div class="field full"><label>Route</label><input name="route" value="${esc(day.route)}"></div><div class="field"><label>Duration</label><input name="duration" value="${esc(day.duration)}"></div><div class="field"><label>Walking</label><input name="walking" value="${esc(day.walking)}"></div><div class="field full"><label>Summary</label><textarea name="summary">${esc(day.summary)}</textarea></div><div class="field full"><label>Highlight line</label><input name="heroFact" value="${esc(day.heroFact)}"></div><div class="field full"><label>Tips — one per line</label><textarea name="tips">${esc(day.tips.join('\n'))}</textarea></div><div class="field full"><label>Schedule — time | title | detail | emoji</label><textarea name="schedule" style="min-height:170px">${esc(day.schedule.map(x => `${x.time} | ${x.title} | ${x.detail} | ${x.icon}`).join('\n'))}</textarea></div><div class="field full"><label>Full route link</label><input name="fullNav" value="${esc(day.navigation.full)}"></div></div><div class="modal-actions"><button class="btn btn-dark" type="submit">Save day</button><button class="btn btn-ghost" type="button" data-action="close-editor">Cancel</button></div></form>`;
  }

  function documentEditor() {
    return `<form id="document-editor-form"><div class="form-grid"><div class="field full"><label>Document name</label><input name="title" required placeholder="e.g. Hotel confirmation"></div><div class="field"><label>Category</label><select name="category"><option>Lodging</option><option>Flights</option><option>Transport</option><option>Documents</option></select></div><div class="field"><label>Status</label><input name="status" value="Available"></div><div class="field full"><label>Link to a file or page</label><input name="href" placeholder="/documents/hotel.pdf or https://..."></div><div class="field full"><label>Note</label><textarea name="note"></textarea></div></div><div class="modal-actions"><button class="btn btn-dark" type="submit">Add document</button><button class="btn btn-ghost" type="button" data-action="close-editor">Cancel</button></div></form><div class="section"><div class="mini-label">Existing documents</div><div class="doc-list" style="margin-top:10px">${state.documents.map(d => `<div class="doc-card"><div class="doc-icon">📄</div><div><h3>${esc(d.title)}</h3><p>${esc(d.href || d.status)}</p></div><button class="btn btn-ghost btn-small" data-action="delete-document" data-doc="${esc(d.id)}">Delete</button></div>`).join('')}</div></div>`;
  }

  function dataEditor() {
    return `<div class="form-grid"><div class="field full"><label>All app data</label><textarea id="json-data" class="json-area">${esc(JSON.stringify(state, null, 2))}</textarea></div></div><div class="modal-actions"><button class="btn btn-dark" data-action="import-json">Save from text</button><button class="btn btn-soft" data-action="download-json">Download backup</button><label class="btn btn-ghost" style="cursor:pointer">Load file<input id="import-file" type="file" accept="application/json" hidden></label><button class="btn btn-ghost" data-action="reset-data">Reset to original</button></div>`;
  }

  function initRouteMap() {
    const el = document.getElementById('route-map');
    if (!el || !window.L || el.dataset.ready) return;

    el.dataset.ready = '1';
    const colors = { hotel: '#1d4ed8', food: '#e07b1a', attraction: '#188a4e' };
    const bounds = [];
    const map = L.map(el, { scrollWheelZoom: false });
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19, attribution: '© OpenStreetMap' }).addTo(map);
    const path = state.routePath || [];
    if (path.length > 1) L.polyline(path, { color: '#173f3a', weight: 3, opacity: 0.55, dashArray: '6 8' }).addTo(map);
    (state.mapPoints || []).forEach(p => {
      if (!p.coords) return;

      bounds.push(p.coords);
      L.circleMarker(p.coords, { radius: 8, weight: 2, color: '#fff', fillColor: colors[p.type] || colors.attraction, fillOpacity: 1 })
        .addTo(map)
        .bindPopup(`<b>${esc(p.name)}</b><br><a href="${esc(p.maps)}" target="_blank" rel="noopener">Open in Google Maps</a>`);
    });
    if (bounds.length) map.fitBounds(bounds, { padding: [30, 30] });
    setTimeout(() => map.invalidateSize(), 150);
  }

  function render() {
    const route = currentRoute();
    let html;
    if (route.page === 'home') html = homePage();
    else if (route.page === 'days') html = daysPage();
    else if (route.page === 'day') html = dayPage(route.id);
    else if (route.page === 'route') html = routePage();
    else if (route.page === 'lodgings') html = lodgingsPage();
    else if (route.page === 'documents') html = documentsPage();
    else if (route.page === 'attractions') html = attractionsPage();
    else html = infoPage();
    app.innerHTML = html;
    bindEvents();
  }

  function bindEvents() {
    app.querySelectorAll('[data-go]').forEach(el => el.addEventListener('click', event => {
      if (event.target.closest('a')) return;
      go(el.dataset.go);
    }));
    app.querySelectorAll('[data-action]').forEach(el => el.addEventListener('click', handleAction));
    app.querySelectorAll('[data-editor-tab]').forEach(el => el.addEventListener('click', () => { editorTab = el.dataset.editorTab; render(); }));
    app.querySelectorAll('[data-checklist-id]').forEach(input => input.addEventListener('change', () => {
      const completed = loadChecklist();
      completed[input.dataset.checklistId] = input.checked;
      localStorage.setItem(CHECKLIST_KEY, JSON.stringify(completed));
      render();
      showToast(input.checked ? 'Task marked as done' : 'Task reopened');
    }));
    app.querySelectorAll('[data-attraction-id]').forEach(input => input.addEventListener('change', () => {
      const done = loadAttractionsDone();
      done[input.dataset.attractionId] = input.checked;
      localStorage.setItem(ATTRACTIONS_KEY, JSON.stringify(done));
      render();
      showToast(input.checked ? 'Marked as done' : 'Mark removed');
    }));

    const select = document.getElementById('editor-day-select');
    if (select) select.addEventListener('change', () => { editingDayId = select.value; render(); });

    const dayForm = document.getElementById('day-editor-form');
    if (dayForm) dayForm.addEventListener('submit', event => {
      event.preventDefault();
      const fd = new FormData(dayForm);
      const day = state.days.find(d => d.id === fd.get('id'));
      if (!day) return;
      ['title','date','badge','route','duration','walking','summary','heroFact'].forEach(k => day[k] = String(fd.get(k) || '').trim());
      day.tips = String(fd.get('tips') || '').split('\n').map(s => s.trim()).filter(Boolean);
      day.schedule = String(fd.get('schedule') || '').split('\n').map(line => {
        const [time='', title='', detail='', icon='📍'] = line.split('|').map(s => s.trim());
        return { time, title, detail, icon };
      }).filter(x => x.title);
      day.navigation.full = String(fd.get('fullNav') || '').trim();
      saveState(); editorOpen = false; showToast('Day saved'); render();
    });

    const docForm = document.getElementById('document-editor-form');
    if (docForm) docForm.addEventListener('submit', event => {
      event.preventDefault(); const fd = new FormData(docForm);
      state.documents.push({ id: 'doc-' + Date.now(), title: String(fd.get('title')), category: String(fd.get('category')), status: String(fd.get('status')), href: String(fd.get('href')), note: String(fd.get('note')) });
      saveState(); showToast('Document added'); render();
    });

    const fileInput = document.getElementById('import-file');
    if (fileInput) fileInput.addEventListener('change', importFile);

    initRouteMap();
  }

  function handleAction(event) {
    const el = event.currentTarget;
    const action = el.dataset.action;
    if (action === 'print') window.print();
    if (action === 'open-editor') { editorOpen = true; editorTab = 'day'; render(); }
    if (action === 'open-editor-docs') { editorOpen = true; editorTab = 'document'; render(); }
    if (action === 'edit-day') { editingDayId = el.dataset.day; editorOpen = true; editorTab = 'day'; render(); }
    if (action === 'close-editor' || action === 'close-editor-backdrop') { editorOpen = false; render(); }
    if (action === 'delete-document') {
      if (confirm('Delete this document from the list?')) { state.documents = state.documents.filter(d => d.id !== el.dataset.doc); saveState(); render(); }
    }
    if (action === 'download-json') downloadJSON();
    if (action === 'import-json') importJSONFromText();
    if (action === 'reset-data') {
      if (confirm('Reset all local edits and return to the original version?')) { state = clone(window.DEFAULT_TRIP); saveState(); showToast('Data reset'); render(); }
    }
  }

  function downloadJSON() {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'us-trip-data.json'; a.click(); URL.revokeObjectURL(url);
  }

  function importJSONFromText() {
    try {
      const next = JSON.parse(document.getElementById('json-data').value);
      if (!Array.isArray(next.days) || !Array.isArray(next.lodgings)) throw new Error('Invalid structure');
      state = next; saveState(); showToast('Data saved'); render();
    } catch (e) { alert('Could not save: the data file is invalid.\n' + e.message); }
  }

  function importFile(event) {
    const file = event.target.files[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try { const next = JSON.parse(reader.result); if (!Array.isArray(next.days)) throw new Error('Invalid structure'); state = next; saveState(); showToast('Backup file loaded'); render(); }
      catch (e) { alert('Could not load the file: ' + e.message); }
    };
    reader.readAsText(file);
  }

  function showToast(message) {
    clearTimeout(toastTimer);
    const old = document.querySelector('.toast'); if (old) old.remove();
    const el = document.createElement('div'); el.className = 'toast'; el.textContent = message; document.body.appendChild(el);
    toastTimer = setTimeout(() => el.remove(), 2200);
  }

  window.addEventListener('hashchange', render);
  window.addEventListener('DOMContentLoaded', () => {
    if (!location.hash) location.hash = 'home'; else render();
    if ('serviceWorker' in navigator && location.protocol !== 'file:') {
      let refreshing = false;
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (refreshing) return;
        refreshing = true;
        window.location.reload();
      });
      navigator.serviceWorker.register('/sw.js?v=4', { updateViaCache: 'none' })
        .then(registration => registration.update())
        .catch(console.warn);
    }
  });
})();
