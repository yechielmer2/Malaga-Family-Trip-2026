(() => {
  const STORAGE_KEY = 'malaga-family-trip-2026-data-v1';
  const CHECKLIST_KEY = 'malaga-family-trip-2026-checklist-v1';
  const ATTRACTIONS_KEY = 'malaga-family-trip-2026-attractions-v1';
  const ORGANIZER_KEY = 'malaga-family-trip-2026-organizer-v1';
  const DEFAULT_TASKS = [
    { id: 'iphone-backup', label: 'גיבוי אייפון' },
    { id: 'internet-sim', label: 'לעשות סים אינטרנט' },
    { id: 'travel-insurance', label: 'ביטוח נסיעות' },
    { id: 'flight-netflix', label: 'נטפליקס לטיסה', note: 'להוריד תכנים מראש' },
    { id: 'book-nerja-cave', label: 'להזמין מקום למערת נרחה', note: 'מומלץ להזמין מראש', href: 'https://cuevadenerja.es/en/' }
  ];
  const DEFAULT_GEAR = [
    { id: 'cook-containers', category: 'ציוד בישול קל', label: 'קופסאות אוכל ושקיות סגירה' },
    { id: 'cook-cutlery', category: 'ציוד בישול קל', label: 'סכו״ם, צלחות וכוסות רב־פעמיים' },
    { id: 'cook-opener', category: 'ציוד בישול קל', label: 'פותחן, נייר אלומיניום ונייר סופג' },
    { id: 'cook-cleaning', category: 'ציוד בישול קל', label: 'ספוג וסבון כלים קטן' },
    { id: 'clothes-swim', category: 'ביגוד', label: 'בגדי ים ובגדי החלפה' },
    { id: 'clothes-evening', category: 'ביגוד', label: 'בגדים קלים לערב וסווטשירט דק' },
    { id: 'clothes-shoes', category: 'ביגוד', label: 'סנדלים ונעלי הליכה' },
    { id: 'clothes-hats', category: 'ביגוד', label: 'כובעים ומשקפי שמש' },
    { id: 'food-flight', category: 'אוכל', label: 'חטיפים ואוכל לטיסה' },
    { id: 'food-breakfast', category: 'אוכל', label: 'מוצרים בסיסיים לבוקר הראשון' },
    { id: 'food-kids', category: 'אוכל', label: 'נשנושים מוכרים לילדים' },
    { id: 'food-bottles', category: 'אוכל', label: 'בקבוקי מים אישיים' },
    { id: 'sea-sunscreen', category: 'ים ובריכה', label: 'קרם הגנה ואפטר־סאן' },
    { id: 'sea-towels', category: 'ים ובריכה', label: 'מגבות חוף ותיק רטוב' },
    { id: 'tech-chargers', category: 'אלקטרוניקה', label: 'מטענים, כבלים וסוללה ניידת' },
    { id: 'tech-adapter', category: 'אלקטרוניקה', label: 'מפצל חשמל ואוזניות לילדים' }
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

  function loadOrganizer() {
    try {
      const saved = JSON.parse(localStorage.getItem(ORGANIZER_KEY) || 'null');
      if (saved?.tasks && saved?.gear) return saved;
      const legacyDone = loadChecklist();
      return {
        tasks: clone(DEFAULT_TASKS),
        gear: clone(DEFAULT_GEAR),
        taskDone: { ...legacyDone },
        gearDone: {}
      };
    } catch (e) {
      return { tasks: clone(DEFAULT_TASKS), gear: clone(DEFAULT_GEAR), taskDone: {}, gearDone: {} };
    }
  }

  function saveOrganizer(organizer) {
    localStorage.setItem(ORGANIZER_KEY, JSON.stringify(organizer));
  }

  function organizerPage() {
    const organizer = loadOrganizer();
    const tasksDone = organizer.tasks.filter(task => organizer.taskDone[task.id]).length;
    const gearDone = organizer.gear.filter(item => organizer.gearDone[item.id]).length;
    const categories = [...new Set(organizer.gear.map(item => item.category))];
    return appShell(`
      <section class="section" style="margin-top:0">
        <div class="section-head"><div><div class="eyebrow" style="color:var(--brand-2)">מתארגנים ביחד</div><h2>משימות וציוד</h2><p>הסימונים והתוספות נשמרים במכשיר הזה.</p></div></div>
        <div class="organizer-summary"><span>✓ ${tasksDone}/${organizer.tasks.length} משימות</span><span>🎒 ${gearDone}/${organizer.gear.length} פריטי ציוד</span></div>
      </section>

      <section class="section">
        <div class="section-head"><div><h2>משימות פתוחות</h2><p>אפשר להוסיף כל משימה שעולה בהמשך</p></div></div>
        <form id="add-task-form" class="quick-add card">
          <label class="sr-only" for="new-task">משימה חדשה</label>
          <input id="new-task" name="task" required maxlength="100" placeholder="לדוגמה: להזמין מסעדה לערב הראשון">
          <button class="btn btn-dark" type="submit">הוספת משימה</button>
        </form>
        <article class="card organizer-list">
          ${organizer.tasks.map(task => `
            <div class="organizer-row">
              <label class="checklist-item ${organizer.taskDone[task.id] ? 'completed' : ''}">
                <input type="checkbox" data-task-id="${esc(task.id)}" ${organizer.taskDone[task.id] ? 'checked' : ''}>
                <span class="checkmark" aria-hidden="true">✓</span>
                <span class="checklist-copy"><b>${esc(task.label)}</b>${task.note ? `<small>${esc(task.note)}</small>` : ''}</span>
              </label>
              ${task.href ? `<a class="btn btn-soft btn-small" href="${esc(task.href)}" target="_blank" rel="noopener">הזמנה</a>` : ''}
              <button class="icon-btn delete-row" type="button" data-delete-task="${esc(task.id)}" aria-label="מחיקת ${esc(task.label)}">×</button>
            </div>`).join('')}
        </article>
      </section>

      <section class="section">
        <div class="section-head"><div><h2>רשימת ציוד</h2><p>מחולקת לקטגוריות כדי שיהיה קל לארוז</p></div></div>
        <div class="notice">בחדרי Ocean House מופיעים קומקום ומיני־בר, אך לא מטבח מלא. לכן רשימת הבישול מתמקדת בציוד קל בלבד.</div>
        <form id="add-gear-form" class="quick-add card quick-add-gear">
          <label class="sr-only" for="new-gear">פריט ציוד חדש</label>
          <input id="new-gear" name="gear" required maxlength="100" placeholder="פריט ציוד חדש">
          <select name="category" aria-label="קטגוריית ציוד">${categories.map(category => `<option>${esc(category)}</option>`).join('')}<option>אחר</option></select>
          <button class="btn btn-dark" type="submit">הוספה</button>
        </form>
        <div class="gear-grid">
          ${categories.map(category => `
            <article class="card gear-category">
              <div class="mini-label">קטגוריה</div><h3>${esc(category)}</h3>
              <div class="gear-items">
                ${organizer.gear.filter(item => item.category === category).map(item => `
                  <div class="organizer-row compact">
                    <label class="checklist-item ${organizer.gearDone[item.id] ? 'completed' : ''}">
                      <input type="checkbox" data-gear-id="${esc(item.id)}" ${organizer.gearDone[item.id] ? 'checked' : ''}>
                      <span class="checkmark" aria-hidden="true">✓</span>
                      <span class="checklist-copy"><b>${esc(item.label)}</b></span>
                    </label>
                    <button class="icon-btn delete-row" type="button" data-delete-gear="${esc(item.id)}" aria-label="מחיקת ${esc(item.label)}">×</button>
                  </div>`).join('')}
              </div>
            </article>`).join('')}
        </div>
      </section>
    `);
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
              ${a.maps ? `<a class="btn btn-ghost btn-small" href="${esc(a.maps)}" target="_blank" rel="noopener">${esc(a.linkLabel || 'מפה')}</a>` : ''}
            </div>`).join('')}
        </article>
      </section>`).join('');
    return appShell(`
      <section class="section" style="margin-top:0">
        <div class="section-head"><div><div class="eyebrow" style="color:var(--brand-2)">מה עשינו</div><h2>אטרקציות ומקומות</h2><p>סמנו וי על מה שכבר עשיתם בטיול. ${totalDone}/${list.length} הושלמו.</p></div></div>
      </section>
      ${sections}
    `);
  }

  function checklistCard() {
    const organizer = loadOrganizer();
    const done = organizer.tasks.filter(task => organizer.taskDone[task.id]).length;
    return `
      <section class="section">
        <div class="section-head">
          <div><h2>צ׳ק־ליסט לפני הטיסה</h2><p>משימות קטנות שכדאי לסגור בזמן</p></div>
          <button class="text-link" data-go="organizer">לכל המשימות והציוד ←</button>
        </div>
        <article class="card checklist-card">
          ${organizer.tasks.map(task => `
            <label class="checklist-item ${organizer.taskDone[task.id] ? 'completed' : ''}">
              <input type="checkbox" data-task-id="${esc(task.id)}" ${organizer.taskDone[task.id] ? 'checked' : ''}>
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
    return { page: ['home','days','route','lodgings','documents','info','attractions','organizer'].includes(hash) ? hash : 'home' };
  }

  function dateStatus() {
    const now = new Date();
    const start = new Date(state.startDate + 'T00:00:00');
    const end = new Date(state.endDate + 'T23:59:59');
    const days = Math.ceil((start - now) / 86400000);
    if (now < start) return { number: Math.max(0, days), label: days === 1 ? 'יום עד הטיול' : 'ימים עד הטיול' };
    if (now > end) return { number: '✓', label: 'הטיול הסתיים' };
    const dayIndex = Math.floor((now - start) / 86400000) + 1;
    return { number: `יום ${dayIndex}`, label: 'אנחנו בטיול' };
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
    return ({ home:'⌂', days:'☷', route:'⌁', lodgings:'⌂', documents:'▣', info:'ⓘ', attractions:'★', organizer:'✓' })[label] || '•';
  }

  function appShell(content) {
    const route = currentRoute();
    return `
      <div class="app-shell">
        <header class="topbar">
          <button class="brand" data-go="home" aria-label="חזרה למסך הבית" style="border:0;background:none;padding:0;cursor:pointer;text-align:right">
            <span class="brand-mark">☀</span>
            <span><div class="brand-title">${esc(state.title)}</div><div class="brand-sub">${esc(state.dateLabel)}</div></span>
          </button>
          <div class="top-actions">
            <button class="chip-btn" data-action="print" title="הדפסה"><span>⎙</span><span class="desktop-label">הדפסה</span></button>
            <button class="chip-btn edit-only" data-action="open-editor" title="עריכה"><span>✎</span><span class="desktop-label">עריכת התכנון</span></button>
          </div>
        </header>
        <main class="main">${content}</main>
        ${bottomNav(route.page)}
        ${editorOpen ? editorModal() : ''}
      </div>`;
  }

  function bottomNav(active) {
    const items = [
      ['home','הבית'], ['days','ימים'], ['route','מסלול'], ['lodgings','לינות'], ['attractions','אטרקציות'], ['organizer','ציוד'], ['documents','מסמכים'], ['info','מידע']
    ];
    return `<nav class="bottom-nav" aria-label="ניווט ראשי">${items.map(([id,label]) => `
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
            <span class="hero-pill">👨‍👩‍👧‍👦 שתי משפחות</span>
          </div>
          ${state.lastUpdated ? `<div class="hero-updated">עודכן לאחרונה: <bdi dir="ltr">${esc(state.lastUpdated)}</bdi></div>` : ''}
        </div>
        <div class="hero-side">
          <div class="countdown-card">
            <div class="countdown-label">${esc(c.label)}</div>
            <div class="countdown-number">${esc(c.number)}</div>
            <div>${esc(day.date)} · ${esc(day.title)}</div>
            <div class="hero-actions">
              <button class="btn btn-primary" data-go="${esc(day.id)}">פתחו את היום</button>
              <a class="btn btn-light" href="${esc(day.navigation.full)}" target="_blank" rel="noopener">ניווט היום</a>
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
        <div class="section-head"><div><h2>היום שבמרכז</h2><p>כל מה שצריך, בלי לחפש בין הודעות וקבצים</p></div><button class="text-link" data-go="days">לכל הימים ←</button></div>
        <article class="card today-card">
          <div>
            <div class="big-date">${esc(day.date)}</div>
            <h3>${esc(day.title)}</h3>
            <p>${esc(day.summary)}</p>
            <div class="today-actions">
              <button class="btn btn-dark" data-go="${esc(day.id)}">פירוט היום</button>
              <a class="btn btn-soft" target="_blank" rel="noopener" href="${esc(day.navigation.full)}">מסלול מלא במפה</a>
              ${day.weather ? `<a class="btn btn-ghost" target="_blank" rel="noopener" href="${esc(day.weather.href)}">מזג אוויר</a>` : ''}
            </div>
          </div>
          <div class="today-icon">${day.schedule[0]?.icon || '🧭'}</div>
        </article>
      </section>

      <section class="section">
        <div class="section-head"><div><h2>במבט אחד</h2><p>הדברים שנצטרך הכי הרבה בזמן אמת</p></div></div>
        <div class="grid grid-3">
          <article class="card quick-card">
            <div><div class="quick-icon">✈️</div><div class="mini-label">טיסת הלוך</div><div class="quick-value" dir="ltr" style="text-align:right">${esc(state.flights[0].depart)} → ${esc(state.flights[0].arrive)}</div><div class="quick-caption">${esc(state.flights[0].airline)} · ${esc(state.flights[0].date)} · ${esc(state.flights[0].flightNumber)}</div></div>
            <button class="text-link" data-go="info">כל פרטי הטיסות ←</button>
          </article>
          <article class="card quick-card">
            <div><div class="quick-icon">🏨</div><div class="mini-label">המלון הראשון</div><div class="quick-value">${esc(firstHotel.name)}</div><div class="quick-caption">${esc(firstHotel.dates)}</div></div>
            <button class="text-link" data-go="lodgings">לכל הלינות ←</button>
          </article>
          <article class="card quick-card">
            <div><div class="quick-icon">👨‍👩‍👧‍👦</div><div class="mini-label">הרכב הנוסעים</div><div class="quick-value">2 משפחות</div><div class="quick-caption">4 מבוגרים · 4 ילדים · 2 חדרים</div></div>
            <button class="text-link" data-go="lodgings">חלוקת המלונות ←</button>
          </article>
        </div>
      </section>

      ${checklistCard()}

      ${rental?.warning ? `<section class="section"><div class="alert-card"><div class="alert-icon">!</div><div><h3>${esc(rental.alertTitle || 'חשוב לפני הנסיעה')}</h3><p>${esc(rental.warning)}</p><button class="text-link" data-go="info">לפרטים השימושיים ←</button></div></div></section>` : ''}

      <section class="section">
        <div class="section-head"><div><h2>מסלול הטיול</h2><p>בסיס אחד נוח, חופים וטיולי כוכב</p></div><button class="text-link" data-go="route">למפת המסלול ←</button></div>
        ${routePreview()}
      </section>

      <section class="section">
        <div class="section-head"><div><h2>לפני שיוצאים</h2><p>שני דברים שכדאי לזכור</p></div><button class="text-link" data-go="documents">למסמכים ←</button></div>
        <div class="grid grid-2">
          <article class="card"><div class="card-top"><div><div class="mini-label">מעבר מלון · 9.8</div><h3>${esc(secondHotel.name)}</h3></div><span class="status ready">הוזמן</span></div><p>${esc(secondHotel.note)}</p></article>
          <article class="card"><div class="card-top"><div><div class="mini-label">טיסות</div><h3>כבודה וצ׳ק־אין</h3></div><span class="status pending">לבדיקה</span></div><p>יש להתייצב בשדה לפחות 3 שעות לפני כל טיסה ולבדוק מראש את הכבודה הרשומה לכל נוסע.</p></article>
        </div>
      </section>
    `);
  }

  function routePreview() {
    const stops = state.fullRoute.stops;
    const points = [[45,242],[210,112],[390,177],[565,140],[735,180],[880,57]];
    return `<article class="card route-card">
      <div class="route-visual">
        <svg viewBox="0 0 920 290" role="img" aria-label="תרשים טיול הכוכב מטורמולינוס ברחבי קוסטה דל סול">
          <defs><linearGradient id="routeG" x1="0" x2="1"><stop stop-color="#e49b3d"/><stop offset="1" stop-color="#245d55"/></linearGradient></defs>
          <path d="M45 242C155 190 155 82 275 102s102 122 225 92 115-86 218-23 86-69 162-114" fill="none" stroke="rgba(255,255,255,.7)" stroke-width="34" stroke-linecap="round"/>
          <path d="M45 242C155 190 155 82 275 102s102 122 225 92 115-86 218-23 86-69 162-114" fill="none" stroke="url(#routeG)" stroke-width="8" stroke-linecap="round" stroke-dasharray="1 17"/>
          ${points.map(([x,y],i) => { const label = stops[i]?.name || ''; return `<g><circle cx="${x}" cy="${y}" r="18" fill="#fff"/><circle cx="${x}" cy="${y}" r="10" fill="${i===2?'#e7a74d':'#173f3a'}"/><text x="${x}" y="${y-28}" text-anchor="middle" font-size="14" font-weight="800" fill="#17312e">${esc(label)}</text></g>`; }).join('')}
          <path d="M0 285 105 205l65 35 88-94 70 72 120-150 103 143 72-65 80 76 96-125 141 188Z" fill="rgba(23,63,58,.11)"/>
        </svg>
      </div>
      <div class="route-legend">
        <div class="card-top"><div><div class="mini-label">${esc(state.dateLabel)}</div><h3>${esc(state.fullRoute.title)}</h3><p>${esc(state.fullRoute.subtitle)}</p></div><a class="btn btn-dark btn-small" href="${esc(state.fullRoute.google)}" target="_blank" rel="noopener">פתיחה במפה</a></div>
        <div class="route-stops">${stops.map(s => `<div class="route-stop"><b>${esc(s.name)}</b><span>${esc(s.kind)}</span></div>`).join('')}</div>
      </div>
    </article>`;
  }

  function daysPage() {
    return appShell(`
      <section class="section" style="margin-top:0">
        <div class="section-head"><div><div class="eyebrow" style="color:var(--brand-2)">התוכנית המלאה</div><h2>יום אחר יום</h2><p>לוח זמנים, עצירות, ניווט וטיפים לכל יום</p></div></div>
        <div class="day-list">${state.days.map(day => dayCard(day)).join('')}</div>
      </section>
    `);
  }

  function dayCard(day) {
    return `<article class="day-card" tabindex="0" role="button" data-go="${esc(day.id)}">
      <div class="day-num"><div><span>יום</span><strong>${day.number}</strong><span>${esc(day.shortDate)}</span></div></div>
      <div><div class="mini-label">${esc(day.date)}</div><h3>${esc(day.title)}</h3><p>${esc(day.route)}</p></div>
      <div><span class="status ${day.badge.includes('טיוטה') || day.badge.includes('דורש') || day.badge.includes('בדיקה') ? 'pending' : 'ready'}">${esc(day.badge)}</span><div class="day-arrow" style="margin-top:8px">←</div></div>
    </article>`;
  }

  function navLeg(l) {
    const wazeHref = l.waze || l.href || '';
    const mapsHref = l.maps || '';
    return `<div class="nav-link"><span class="nav-logo">📍</span><span><b>${esc(l.label)}</b><small>${esc(l.sub || 'ניווט ליעד')}</small></span><span class="nav-actions">${wazeHref ? `<a class="btn btn-dark btn-small" href="${esc(wazeHref)}" target="_blank" rel="noopener">Waze</a>` : ''}${mapsHref ? `<a class="btn btn-ghost btn-small" href="${esc(mapsHref)}" target="_blank" rel="noopener">מפה</a>` : ''}</span></div>`;
  }

  function dayPage(id) {
    const day = state.days.find(d => d.id === id);
    if (!day) return appShell('<div class="empty">היום המבוקש לא נמצא.</div>');
    return appShell(`
      <section class="day-hero" data-tone="${esc(day.tone)}">
        <button class="back-btn" data-go="days">→ כל הימים</button>
        <div class="day-kicker">יום ${day.number} · ${esc(day.date)}</div>
        <h1>${esc(day.title)}</h1>
        <div class="day-route">${esc(day.route)}</div>
        <div class="day-fact">${esc(day.heroFact)}</div>
      </section>
      <div class="day-meta">
        <div class="meta-card"><span class="mini-label">זמן</span><b>${esc(day.duration)}</b></div>
        <div class="meta-card"><span class="mini-label">הליכה</span><b>${esc(day.walking)}</b></div>
        <div class="meta-card"><span class="mini-label">מצב התכנון</span><b>${esc(day.badge)}</b></div>
      </div>

      <section class="section grid grid-2">
        <article class="card"><div class="card-top"><div><div class="mini-label">התמונה הגדולה</div><h3>מה עושים היום</h3></div><button class="btn btn-ghost btn-small edit-only" data-action="edit-day" data-day="${esc(day.id)}">עריכה</button></div><p style="font-size:17px">${esc(day.summary)}</p></article>
        <article class="card"><div class="mini-label">ניווט</div><h3>פותחים ויוצאים</h3><p>המסלול המלא נפתח בגוגל מפות; כל יעד נפתח גם בנפרד בוויז.</p><a class="btn btn-dark" style="width:100%;margin-top:8px" href="${esc(day.navigation.full)}" target="_blank" rel="noopener">פתיחת המסלול המלא</a>${day.weather ? `<a class="btn btn-soft" style="width:100%;margin-top:8px" href="${esc(day.weather.href)}" target="_blank" rel="noopener">☁ ${esc(day.weather.label)}</a>` : ''}</article>
      </section>

      <section class="section grid grid-2">
        <article class="card">
          <div class="mini-label">לוח זמנים</div><h3>סדר היום</h3>
          <div class="timeline">${day.schedule.map(item => `<div class="timeline-item"><div class="timeline-icon">${esc(item.icon)}</div><div class="timeline-time">${esc(item.time)}</div><div class="timeline-body"><b>${esc(item.title)}</b><p>${esc(item.detail)}</p></div></div>`).join('')}</div>
        </article>
        <div class="grid">
          <article class="card"><div class="mini-label">חשוב לדעת</div><h3>טיפים ליום הזה</h3><ul class="tip-list">${day.tips.map(t => `<li>${esc(t)}</li>`).join('')}</ul></article>
          ${day.navigation.legs.length ? `<article class="card"><div class="mini-label">עצירות</div><h3>ניווט לכל יעד</h3><div class="nav-links" style="margin-top:12px">${day.navigation.legs.map(l => navLeg(l)).join('')}</div></article>` : ''}
        </div>
      </section>
    `);
  }

  function routePage() {
    return appShell(`
      <section class="section" style="margin-top:0"><div class="section-head"><div><div class="eyebrow" style="color:var(--brand-2)">תמונת המסלול</div><h2>מפה וניווט</h2><p>קישור למסלול המלא וקישור נפרד לכל יום</p></div></div>${routePreview()}</section>
      <section class="section"><div class="section-head"><div><h2>מקטעי הנסיעה</h2><p>אפשר לפתוח כל מקטע בנפרד</p></div></div><div class="day-list">${state.days.filter(d => d.navigation?.full).map(d => `<article class="day-card" data-go="${esc(d.id)}"><div class="day-num"><div><span>יום</span><strong>${d.number}</strong><span>${esc(d.shortDate)}</span></div></div><div><h3>${esc(d.route)}</h3><p>${esc(d.duration)}</p></div><a class="btn btn-dark btn-small" href="${esc(d.navigation.full)}" target="_blank" rel="noopener" onclick="event.stopPropagation()">מפה</a></article>`).join('')}</div></section>
      <div class="source-note">הקישורים נפתחים בשירותי ניווט חיצוניים. יש לבדוק בזמן אמת עומסי תנועה, חניה ושינויים בדרך.</div>
    `);
  }

  function lodgingsPage() {
    return appShell(`
      <section class="section" style="margin-top:0"><div class="section-head"><div><div class="eyebrow" style="color:var(--brand-2)">איפה ישנים</div><h2>לינות</h2><p>כתובות, תאריכים, קישורים וניווט ישיר</p></div></div>
        ${state.lodgings.map(l => `<article class="card lodging-card"><div><div class="card-top"><div><div class="mini-label">${esc(l.dates)}</div><h3>${esc(l.name)}</h3><div style="color:var(--muted)">${esc(l.nativeName)}</div></div><span class="status ${l.status === 'הוזמן' ? 'ready' : 'pending'}">${esc(l.status)}</span></div><div class="lodging-address">📍 ${esc(l.location)}</div><div class="info-row"><span>כניסה: <b>${esc(l.checkIn)}</b></span><span>יציאה: <b>${esc(l.checkOut)}</b></span></div><p>${esc(l.note)}</p></div><div class="nav-links"><a class="btn btn-dark btn-small" href="${esc(l.waze)}" target="_blank" rel="noopener">Waze</a><a class="btn btn-ghost btn-small" href="${esc(l.maps)}" target="_blank" rel="noopener">מפה</a>${l.weather ? `<a class="btn btn-soft btn-small" href="${esc(l.weather)}" target="_blank" rel="noopener">מזג אוויר</a>` : ''}${l.website ? `<a class="btn btn-ghost btn-small" href="${esc(l.website)}" target="_blank" rel="noopener">אתר ההזמנה</a>` : ''}</div></article>`).join('')}
      </section>
    `);
  }

  function documentsPage() {
    const iconByCategory = { 'טיסות':'✈️','רכב':'🚗','תחבורה':'🚐','לינה':'🏨','מסמכים':'📄' };
    return appShell(`
      <section class="section" style="margin-top:0">
        <div class="section-head"><div><div class="eyebrow" style="color:var(--brand-2)">הכול במקום אחד</div><h2>מסמכים ואישורים</h2><p>עותקים מצונזרים לפרסום, קישורי הזמנות והמסמכים שעדיין חסרים.</p></div><button class="btn btn-dark btn-small edit-only" data-action="open-editor-docs">הוספת קישור</button></div>
        <div class="notice">המסמכים שהועלו לאתר עברו צנזור של קודי הזמנה ופרטים אישיים. אין להעלות לכאן דרכונים, פוליסה מלאה או מסמך עם פרטים רגישים כל עוד האתר ציבורי.</div>
        <div class="doc-list">${state.documents.map(doc => `<article class="doc-card"><div class="doc-icon">${iconByCategory[doc.category] || '📄'}</div><div><div class="mini-label">${esc(doc.category)}</div><h3>${esc(doc.title)}</h3><p>${esc(doc.note)}</p></div>${doc.href ? `<a class="btn btn-dark btn-small" href="${esc(doc.href)}" target="_blank" rel="noopener">פתיחה</a>` : `<span class="status pending">${esc(doc.status)}</span>`}</article>`).join('')}</div>
      </section>
    `);
  }

  function infoPage() {
    const rental = state.useful.carRental;
    return appShell(`
      <section class="section" style="margin-top:0"><div class="section-head"><div><div class="eyebrow" style="color:var(--brand-2)">פרטים שימושיים</div><h2>טיסות, רכב, מזג אוויר ושבת</h2><p>המידע שחשוב שיהיה זמין במהירות</p></div></div>
        <div class="grid grid-2">
          ${state.flights.map(f => `<article class="card"><div class="card-top"><div><div class="mini-label">טיסת ${esc(f.direction)} · ${esc(f.date)}</div><h3>${esc(f.from)} ← ${esc(f.to)}</h3></div><span class="status ${f.status.includes('מאושר') ? 'ready' : 'pending'}">${esc(f.status)}</span></div><div style="display:flex;align-items:center;gap:13px;margin:18px 0"><div class="quick-value">${esc(f.depart)}</div><div style="flex:1;height:1px;background:var(--line);position:relative"><span style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) scaleX(-1);background:var(--card);padding:0 8px">✈</span></div><div class="quick-value">${esc(f.arrive)}</div></div><div class="info-row"><span>${esc(f.airline)}</span><span>${esc(f.flightNumber)}</span><span>${esc(f.duration)}</span></div><p>${esc(f.note)}</p></article>`).join('')}
        </div>
      </section>

      <section class="section">
        <article class="card rental-card"><div><div class="card-top"><div><div class="mini-label">תחבורה · ${esc(rental.provider)}</div><h3>${esc(rental.title)}</h3></div><span class="status ${rental.status === 'מאושר' ? 'ready' : 'pending'}">${esc(rental.status)}</span></div><div class="grid grid-2" style="margin-top:15px"><div class="soft-box"><div class="mini-label">הגעה</div><b>${esc(rental.pickup)}</b></div><div class="soft-box"><div class="mini-label">חזרה</div><b>${esc(rental.return)}</b></div></div><div class="info-row" style="margin-top:14px"><span><b>${esc(rental.vehicle)}</b></span><span>${esc(rental.deposit)}</span></div><p>${esc(rental.requirements)}</p>${rental.warning ? `<div class="warning-box">${esc(rental.warning)}</div>` : ''}</div>${rental.document ? `<a class="btn btn-dark btn-small" href="${esc(rental.document)}" target="_blank" rel="noopener">פתיחת המסמך</a>` : ''}</article>
      </section>

      <section class="section"><div class="section-head"><div><h2>תחזית לפי מיקום</h2><p>קישורים ישירים ל־Meteoblue</p></div></div><div class="grid grid-2">${state.useful.weather.map(w => `<a class="card weather-card" href="${esc(w.href)}" target="_blank" rel="noopener"><div class="weather-icon">☁️</div><div><div class="mini-label">${esc(w.dates)}</div><h3>${esc(w.name)}</h3><p>${esc(w.note)}</p></div><span>↗</span></a>`).join('')}</div></section>

      <section class="section"><div class="section-head"><div><h2>מספרי חירום</h2></div></div><div class="grid grid-3">${state.useful.emergency.map(e => `<a class="card" href="${esc(e.href)}" style="text-decoration:none"><div class="mini-label">${esc(e.label)}</div><div class="quick-value" style="margin-top:8px"><bdi dir="ltr">${esc(e.value)}</bdi></div><div class="quick-caption">${esc(e.caption || 'לחיצה לחיוג')}</div></a>`).join('')}</div></section>
    `);
  }

  function editorModal() {
    return `<div class="modal-backdrop" data-action="close-editor-backdrop"><section class="modal" role="dialog" aria-modal="true" aria-label="עריכת התכנון" onclick="event.stopPropagation()"><div class="modal-head"><h2>עריכת התכנון</h2><button class="icon-btn" data-action="close-editor">✕</button></div><div class="modal-body"><div class="notice">העריכות נשמרות בדפדפן של המכשיר הזה. כדי להעביר אותן למכשיר אחר או להפוך אותן לגרסה הראשית של האתר, מייצאים קובץ נתונים ומכניסים אותו לפרויקט.</div><div class="editor-tabs"><button class="${editorTab==='day'?'active':''}" data-editor-tab="day">עריכת יום</button><button class="${editorTab==='document'?'active':''}" data-editor-tab="document">מסמכים</button><button class="${editorTab==='data'?'active':''}" data-editor-tab="data">ייבוא וייצוא</button></div>${editorTab === 'day' ? dayEditor() : editorTab === 'document' ? documentEditor() : dataEditor()}</div></section></div>`;
  }

  function dayEditor() {
    const day = state.days.find(d => d.id === editingDayId) || state.days[0];
    return `<form id="day-editor-form"><div class="form-grid"><div class="field full"><label>בחר יום</label><select name="id" id="editor-day-select">${state.days.map(d => `<option value="${esc(d.id)}" ${d.id===day.id?'selected':''}>יום ${d.number} — ${esc(d.title)}</option>`).join('')}</select></div><div class="field full"><label>כותרת</label><input name="title" value="${esc(day.title)}"></div><div class="field"><label>תאריך</label><input name="date" value="${esc(day.date)}"></div><div class="field"><label>מצב התכנון</label><input name="badge" value="${esc(day.badge)}"></div><div class="field full"><label>מסלול</label><input name="route" value="${esc(day.route)}"></div><div class="field"><label>משך</label><input name="duration" value="${esc(day.duration)}"></div><div class="field"><label>הליכה</label><input name="walking" value="${esc(day.walking)}"></div><div class="field full"><label>תקציר</label><textarea name="summary">${esc(day.summary)}</textarea></div><div class="field full"><label>משפט מרכזי</label><input name="heroFact" value="${esc(day.heroFact)}"></div><div class="field full"><label>טיפים — טיפ אחד בכל שורה</label><textarea name="tips">${esc(day.tips.join('\n'))}</textarea></div><div class="field full"><label>לוח זמנים — שעה | כותרת | פירוט | אימוג׳י</label><textarea name="schedule" style="min-height:170px">${esc(day.schedule.map(x => `${x.time} | ${x.title} | ${x.detail} | ${x.icon}`).join('\n'))}</textarea></div><div class="field full"><label>קישור למסלול המלא</label><input name="fullNav" dir="ltr" value="${esc(day.navigation.full)}"></div></div><div class="modal-actions"><button class="btn btn-dark" type="submit">שמירת היום</button><button class="btn btn-ghost" type="button" data-action="close-editor">ביטול</button></div></form>`;
  }

  function documentEditor() {
    return `<form id="document-editor-form"><div class="form-grid"><div class="field full"><label>שם המסמך</label><input name="title" required placeholder="לדוגמה: אישור המלון"></div><div class="field"><label>קטגוריה</label><select name="category"><option>לינה</option><option>טיסות</option><option>תחבורה</option><option>מסמכים</option></select></div><div class="field"><label>מצב</label><input name="status" value="זמין"></div><div class="field full"><label>קישור לקובץ או לעמוד</label><input name="href" dir="ltr" placeholder="/documents/hotel.pdf או https://..."></div><div class="field full"><label>הערה</label><textarea name="note"></textarea></div></div><div class="modal-actions"><button class="btn btn-dark" type="submit">הוספת המסמך</button><button class="btn btn-ghost" type="button" data-action="close-editor">ביטול</button></div></form><div class="section"><div class="mini-label">מסמכים קיימים</div><div class="doc-list" style="margin-top:10px">${state.documents.map(d => `<div class="doc-card"><div class="doc-icon">📄</div><div><h3>${esc(d.title)}</h3><p>${esc(d.href || d.status)}</p></div><button class="btn btn-ghost btn-small" data-action="delete-document" data-doc="${esc(d.id)}">מחיקה</button></div>`).join('')}</div></div>`;
  }

  function dataEditor() {
    return `<div class="form-grid"><div class="field full"><label>כל נתוני האפליקציה</label><textarea id="json-data" class="json-area">${esc(JSON.stringify(state, null, 2))}</textarea></div></div><div class="modal-actions"><button class="btn btn-dark" data-action="import-json">שמירה מהטקסט</button><button class="btn btn-soft" data-action="download-json">הורדת קובץ גיבוי</button><label class="btn btn-ghost" style="cursor:pointer">טעינת קובץ<input id="import-file" type="file" accept="application/json" hidden></label><button class="btn btn-ghost" data-action="reset-data">איפוס לגרסה המקורית</button></div>`;
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
    else if (route.page === 'organizer') html = organizerPage();
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
    app.querySelectorAll('[data-task-id]').forEach(input => input.addEventListener('change', () => {
      const organizer = loadOrganizer();
      organizer.taskDone[input.dataset.taskId] = input.checked;
      saveOrganizer(organizer);
      render();
      showToast(input.checked ? 'המשימה סומנה כהושלמה' : 'המשימה נפתחה מחדש');
    }));
    app.querySelectorAll('[data-gear-id]').forEach(input => input.addEventListener('change', () => {
      const organizer = loadOrganizer();
      organizer.gearDone[input.dataset.gearId] = input.checked;
      saveOrganizer(organizer);
      render();
      showToast(input.checked ? 'הפריט נארז' : 'הפריט הוחזר לרשימה');
    }));
    app.querySelectorAll('[data-delete-task]').forEach(button => button.addEventListener('click', () => {
      const organizer = loadOrganizer();
      organizer.tasks = organizer.tasks.filter(task => task.id !== button.dataset.deleteTask);
      delete organizer.taskDone[button.dataset.deleteTask];
      saveOrganizer(organizer); render(); showToast('המשימה נמחקה');
    }));
    app.querySelectorAll('[data-delete-gear]').forEach(button => button.addEventListener('click', () => {
      const organizer = loadOrganizer();
      organizer.gear = organizer.gear.filter(item => item.id !== button.dataset.deleteGear);
      delete organizer.gearDone[button.dataset.deleteGear];
      saveOrganizer(organizer); render(); showToast('הפריט נמחק');
    }));
    app.querySelectorAll('[data-attraction-id]').forEach(input => input.addEventListener('change', () => {
      const done = loadAttractionsDone();
      done[input.dataset.attractionId] = input.checked;
      localStorage.setItem(ATTRACTIONS_KEY, JSON.stringify(done));
      render();
      showToast(input.checked ? 'סומן כבוצע' : 'הסימון הוסר');
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
      saveState(); editorOpen = false; showToast('היום נשמר'); render();
    });

    const docForm = document.getElementById('document-editor-form');
    if (docForm) docForm.addEventListener('submit', event => {
      event.preventDefault(); const fd = new FormData(docForm);
      state.documents.push({ id: 'doc-' + Date.now(), title: String(fd.get('title')), category: String(fd.get('category')), status: String(fd.get('status')), href: String(fd.get('href')), note: String(fd.get('note')) });
      saveState(); showToast('המסמך נוסף'); render();
    });

    const fileInput = document.getElementById('import-file');
    if (fileInput) fileInput.addEventListener('change', importFile);

    const taskForm = document.getElementById('add-task-form');
    if (taskForm) taskForm.addEventListener('submit', event => {
      event.preventDefault();
      const value = String(new FormData(taskForm).get('task') || '').trim();
      if (!value) return;
      const organizer = loadOrganizer();
      organizer.tasks.push({ id: `task-${Date.now()}`, label: value });
      saveOrganizer(organizer); render(); showToast('המשימה נוספה');
    });

    const gearForm = document.getElementById('add-gear-form');
    if (gearForm) gearForm.addEventListener('submit', event => {
      event.preventDefault();
      const form = new FormData(gearForm);
      const value = String(form.get('gear') || '').trim();
      const category = String(form.get('category') || 'אחר').trim();
      if (!value) return;
      const organizer = loadOrganizer();
      organizer.gear.push({ id: `gear-${Date.now()}`, label: value, category });
      saveOrganizer(organizer); render(); showToast('פריט הציוד נוסף');
    });
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
      if (confirm('למחוק את המסמך מהרשימה?')) { state.documents = state.documents.filter(d => d.id !== el.dataset.doc); saveState(); render(); }
    }
    if (action === 'download-json') downloadJSON();
    if (action === 'import-json') importJSONFromText();
    if (action === 'reset-data') {
      if (confirm('לאפס את כל העריכות המקומיות ולחזור לגרסה המקורית?')) { state = clone(window.DEFAULT_TRIP); saveState(); showToast('הנתונים אופסו'); render(); }
    }
  }

  function downloadJSON() {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'malaga-trip-data.json'; a.click(); URL.revokeObjectURL(url);
  }

  function importJSONFromText() {
    try {
      const next = JSON.parse(document.getElementById('json-data').value);
      if (!Array.isArray(next.days) || !Array.isArray(next.lodgings)) throw new Error('מבנה לא תקין');
      state = next; saveState(); showToast('הנתונים נשמרו'); render();
    } catch (e) { alert('לא ניתן לשמור: קובץ הנתונים אינו תקין.\n' + e.message); }
  }

  function importFile(event) {
    const file = event.target.files[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try { const next = JSON.parse(reader.result); if (!Array.isArray(next.days)) throw new Error('מבנה לא תקין'); state = next; saveState(); showToast('קובץ הגיבוי נטען'); render(); }
      catch (e) { alert('לא ניתן לטעון את הקובץ: ' + e.message); }
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
      navigator.serviceWorker.register('/sw.js?v=12', { updateViaCache: 'none' })
        .then(registration => registration.update())
        .catch(console.warn);
    }
  });
})();
