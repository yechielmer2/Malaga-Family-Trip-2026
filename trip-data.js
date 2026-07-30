(() => {
  const map = query => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
  const route = (...points) => `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(points[0])}&destination=${encodeURIComponent(points.at(-1))}&waypoints=${points.slice(1, -1).map(encodeURIComponent).join('%7C')}&travelmode=driving`;
  const waze = query => `https://waze.com/ul?q=${encodeURIComponent(query)}&navigate=yes`;
  const day = (number, shortDate, date, title, routeText, summary, schedule, tips, navPoints, options = {}) => ({
    id: `day-${number}`,
    number,
    shortDate,
    date,
    title,
    route: routeText,
    badge: options.badge || 'תכנון מוכן',
    tone: options.tone || ['sea', 'forest', 'gold', 'clay'][number % 4],
    duration: options.duration || 'יום רגוע',
    walking: options.walking || 'הליכה קלה',
    summary,
    heroFact: options.heroFact || 'שומרים על קצב נעים לשתי המשפחות ומשאירים מרווח לשינויים.',
    schedule: schedule.map(([time, title, detail, icon]) => ({ time, title, detail, icon })),
    tips,
    navigation: {
      full: navPoints.length > 1 ? route(...navPoints) : map(navPoints[0]),
      legs: navPoints.concat(options.places || []).map(point => {
        const p = typeof point === 'string' ? { label: point } : point;
        return { label: p.label, sub: 'ניווט ליעד', waze: p.waze || waze(p.label), maps: p.maps || map(p.label) };
      })
    },
    weather: { label: 'תחזית לטורמולינוס', href: 'https://www.meteoblue.com/en/weather/week/torremolinos_spain_2510281' }
  });

  window.DEFAULT_TRIP = {
    version: 1,
    title: 'מלאגה 2026',
    subtitle: 'הטיול המסורתי של משפחות גנם ושגב',
    lastUpdated: '30.7.2026, 10:52',
    dateLabel: '4–14 באוגוסט 2026',
    startDate: '2026-08-04',
    endDate: '2026-08-14',
    routeLabel: 'מלאגה ← טורמולינוס ← קוסטה דל סול',
    travelers: '2 משפחות · 4 מבוגרים ו־4 ילדים',
    notes: 'חופשה משפחתית לשמונה: ים, אטרקציות, עיירות לבנות והרבה זמן יחד.',
    flights: [
      {
        id: 'outbound', direction: 'הלוך', airline: 'ארקיע', flightNumber: 'IZ 261',
        from: 'תל אביב (TLV) · טרמינל 3', to: 'מלאגה (AGP)', date: 'יום שלישי, 4.8',
        depart: '12:35', arrive: '17:30', duration: 'כ־5 שעות ו־55 דקות',
        status: 'מאושר', note: 'התייצבות בנתב״ג לפחות 3 שעות מראש. לפי הכרטיס, הכבודה משתנה בין הנוסעים — לבדוק לכל אחד בנפרד לפני האריזה.'
      },
      {
        id: 'return', direction: 'חזור', airline: 'ארקיע', flightNumber: 'IZ 262',
        from: 'מלאגה (AGP)', to: 'תל אביב (TLV)', date: 'יום שישי, 14.8',
        depart: '20:10', arrive: '01:10 (+1)', duration: 'כ־4 שעות',
        status: 'מאושר', note: 'להגיע לנמל התעופה מלאגה עד 17:10. הנחיתה בישראל בלילה שבין שישי לשבת — יש לוודא התאמה לצורכי המשפחות.'
      }
    ],
    lodgings: [
      {
        id: 'ocean-house', name: 'Ocean House Costa del Sol by Grupotel', nativeName: 'Suite (Family) · 2 rooms',
        dates: '4–9 באוגוסט · 5 לילות', location: 'Calle de Salvador Allende 45, Torremolinos, Málaga 29620',
        checkIn: 'שלישי 4.8 · מ־15:00', checkOut: 'ראשון 9.8 · עד 12:00', status: 'הוזמן',
        note: 'שתי סוויטות משפחתיות ללא עישון, אחת לכל משפחה. ההזמנה היא ל־4 מבוגרים ו־4 ילדים. ביטול חינם לפי האישור עד 2.8 בשעה 15:00 מקומית.',
        maps: map('Ocean House Costa del Sol by Grupotel'), waze: waze('Ocean House Costa del Sol by Grupotel'),
        website: 'https://www.grupotel.com/en/hotel/malaga/torremolinos/ocean-house-costa-del-sol/', weather: 'https://www.meteoblue.com/en/weather/week/torremolinos_spain_2510281'
      },
      {
        id: 'occidental', name: 'Occidental Torremolinos Playa', nativeName: 'Family Room (2A–2C) · 2 rooms',
        dates: '9–14 באוגוסט · 5 לילות', location: 'Paseo Marítimo 101, Torremolinos, Málaga 29620',
        checkIn: 'ראשון 9.8 · מ־14:00', checkOut: 'שישי 14.8 · עד 12:00', status: 'הוזמן',
        note: 'שני חדרי משפחה ללא עישון, כל חדר ל־2 מבוגרים ו־2 ילדים. ההזמנה אינה ניתנת להחזר. ביום המעבר אפשר להשאיר מזוודות בקבלה אם החדרים עדיין לא מוכנים.',
        maps: map('Occidental Torremolinos Playa'), waze: waze('Occidental Torremolinos Playa'),
        website: 'https://www.barcelo.com/en-us/occidental-torremolinos-playa/', weather: 'https://www.meteoblue.com/en/weather/week/torremolinos_spain_2510281'
      }
    ],
    fullRoute: {
      title: 'טיול כוכב בקוסטה דל סול',
      subtitle: 'שני מלונות בטורמולינוס ויציאות קצרות למלאגה, בנאלמדנה, מיחאס ומרבייה.',
      google: route('Málaga Airport', 'Torremolinos', 'Benalmádena', 'Mijas Pueblo', 'Marbella', 'Málaga Airport'),
      stops: [
        { name: 'שדה מלאגה', kind: 'הגעה וחזרה', maps: map('Málaga Airport') },
        { name: 'טורמולינוס', kind: 'בסיס לינה', maps: map('Torremolinos') },
        { name: 'בנאלמדנה', kind: 'מרינה ואטרקציות', maps: map('Benalmádena') },
        { name: 'מיחאס', kind: 'עיירה לבנה', maps: map('Mijas Pueblo') },
        { name: 'מרבייה', kind: 'עיר עתיקה וחוף', maps: map('Marbella') },
        { name: 'מלאגה', kind: 'עיר, תרבות וקניות', maps: map('Málaga') }
      ]
    },
    days: [
      day(1, '4.8', 'יום שלישי, 4 באוגוסט', 'טסים למלאגה ומתמקמים', 'נתב״ג ← מלאגה ← Ocean House',
        'יום נסיעה בלבד: טיסה, הגעה מסודרת למלון, חלוקת חדרים וארוחת ערב קלה ליד הים.',
        [['09:30', 'נפגשים בנתב״ג', 'שתי המשפחות נפגשות בטרמינל 3 ובודקות כבודה יחד.', '🧳'], ['12:35', 'טיסת IZ 261', 'טיסה ישירה למלאגה.', '✈️'], ['17:30', 'נחיתה במלאגה', 'איסוף מזוודות והתארגנות להסעה.', '🛬'], ['19:30', 'צ׳ק־אין וערב רגוע', 'התמקמות בשתי הסוויטות וטיול קצר בטיילת.', '🏨']],
        ['לשמור בגדי החלפה לילדים בתיק היד.', 'לתאם מראש הסעה שמתאימה ל־8 נוסעים ו־8 מזוודות.', 'לא לתכנן אטרקציה לערב הראשון.'],
        ['Málaga Airport', 'Ocean House Costa del Sol by Grupotel'], { duration: 'יום טיסה', walking: 'מעט מאוד' }),

      day(2, '5.8', 'יום רביעי, 5 באוגוסט', 'יום בריכה, ים ומרינה', 'Ocean House ← Puerto Marina',
        'פתיחה רכה לחופשה: בוקר חופשי במלון, מנוחת צהריים וערב במרינה של בנאלמדנה.',
        [['09:00', 'בוקר חופשי', 'בריכה, חוף וארוחת בוקר בלי שעון.', '🏖️'], ['13:00', 'מנוחה במלון', 'שעות החום בחדרים.', '😴'], ['17:30', 'Puerto Marina', 'טיול בין הסירות, גלידה ב־Gelateria Italiana Da Salvadore וארוחת ערב.', '⛵'], ['21:00', 'חזרה למלון', 'לילה מוקדם אחרי יום הטיסה.', '🌙']],
        ['כובעים, קרם הגנה ומים גם בשעות אחר הצהריים.', 'המרינה נוחה לעגלות ולהליכה משפחתית.', 'אפשר לפצל: מי שעייף נשאר במלון.', 'גלידה איטלקית אמיתית ב־Gelateria Italiana Da Salvadore בפוארטו מרינה, קרוב למלון Ocean House.', 'PARQUELANDIA: פארק שעשועים קיצי על המרינה שנפתח בערב (מ־19:30 עד אחרי חצות) עם מתקנים לילדים, טרמפולינות, רכבות ומכוניות מתנגשות. ערב מושלם לגיא ורון אחרי ארוחת הערב.'],
        ['Ocean House Costa del Sol by Grupotel', 'Puerto Marina Benalmádena'], { duration: 'חצי יום פעיל', walking: 'קלה ומישורית', places: ['Gelateria Italiana Da Salvadore Benalmádena', { label: 'PARQUELANDIA', maps: 'https://share.google/oFOQfzAgfhUCwpHzO' }] }),

      day(3, '6.8', 'יום חמישי, 6 באוגוסט', 'מלאגה העתיקה והנמל', 'טורמולינוס ← מרכז מלאגה ← Muelle Uno',
        'יום עירוני בקצב משפחתי: מרכז היסטורי, תצפית מבחוץ על האלקסבה, נמל וקניות.',
        [['09:00', 'יציאה למלאגה', 'עדיף ברכבת הפרברים כדי לחסוך חניה.', '🚆'], ['10:00', 'העיר העתיקה', 'Calle Larios, הקתדרלה וכיכרות מוצלות.', '🏛️'], ['11:30', 'הפוגת גלידה', 'Lucciano\'s החדשנית או Casa Mira הוותיקה, שתיהן במרכז.', '🍦'], ['13:00', 'ארוחה ומנוחה', 'עצירה ארוכה באזור הנמל.', '🍽️'], ['17:00', 'Muelle Uno', 'טיילת, חנויות וגלידה מול המים.', '🛍️'], ['20:00', 'חזרה לטורמולינוס', 'ערב חופשי במלון.', '🌅']],
        ['באוגוסט חם מאוד — להשאיר מוזיאון כאפשרות ממוזגת.', 'לא לנסות להספיק את כל האתרים ביום אחד.', 'לצלם מראש את תחנת הרכבת לחזרה.', 'שתי גלידריות מומלצות במרכז: Lucciano\'s בסגנון בוטיק (דולסה דה לאצ׳ה ופיסטוק) ו־Casa Mira ההיסטורית עם גלידת טורון.', 'אוכל כשר במלאגה: Gaby\'s Kosher Market & Restaurant, מרכול ומסעדה כשרים.'],
        ['Ocean House Costa del Sol by Grupotel', 'Calle Larios Malaga', 'Muelle Uno Malaga', 'Ocean House Costa del Sol by Grupotel'], { duration: '8–9 שעות', walking: 'בינונית, עם הפסקות', places: ['Lucciano\'s Málaga', 'Casa Mira Málaga', 'Gaby\'s Kosher Market Málaga', { label: 'EVA Málaga (VR)', maps: 'https://share.google/ZIVWrL7kvkXIMVkMO' }] }),

      day(4, '7.8', 'יום שישי, 7 באוגוסט', 'בנאלמדנה בקצב קל', 'טורמולינוס ← Benalmádena Pueblo',
        'בוקר בעיירה בנאלמדנה ותצפיות, אחר הצהריים חזרה מוקדמת למנוחה ולערב משפחתי.',
        [['09:30', 'Benalmádena Pueblo', 'סמטאות לבנות, כיכר ותצפית.', '🤍'], ['12:00', 'סטופה בודהיסטית או פארק', 'בחירה קצרה לפי מצב הרוח והחום.', '🌿'], ['14:00', 'חזרה למלון', 'מנוחה, בריכה והתארגנות.', '🏨'], ['19:00', 'ערב משפחתי', 'ארוחה מתוכננת מראש וטיול קצר.', '🕯️'], ['22:00', 'ערב הבנים: פוקר בקזינו', 'הגברים יוצאים לפוקר בקזינו Torrequebrada בבנאלמדנה.', '🎰']],
        ['לקנות מצרכים ושתייה לפני אחר הצהריים.', 'לתאם מראש מקום לארוחת הערב לשמונה אנשים.', 'להימנע מלוח צפוף ביום שישי.'],
        ['Ocean House Costa del Sol by Grupotel', 'Benalmádena Pueblo', 'Ocean House Costa del Sol by Grupotel'], { duration: 'חצי יום', walking: 'קלה, מעט עליות', places: ['Casino de Juego Torrequebrada'] }),

      day(5, '8.8', 'שבת, 8 באוגוסט', 'שבת של מנוחה ליד הים', 'Ocean House והסביבה הקרובה',
        'יום ללא נסיעות מתוכננות: מנוחה, בריכה, חוף וטיולים רגליים קצרים לפי בחירת המשפחות.',
        [['09:00', 'בוקר רגוע', 'ארוחה משפחתית בלי למהר.', '☕'], ['11:00', 'ים ובריכה', 'כל משפחה בקצב שלה.', '🏊'], ['14:00', 'מנוחת צהריים', 'זמן שקט בחדרים.', '😴'], ['18:00', 'טיילת', 'הליכה קצרה ליד המלון.', '🚶']],
        ['להכין מראש מים, חטיפים וכל מה שנדרש.', 'לקבוע נקודת מפגש ברורה אם מתפצלים.', 'לבדוק לפני הנסיעה את זמני השבת המדויקים.'],
        ['Ocean House Costa del Sol by Grupotel'], { duration: 'יום מנוחה', walking: 'לבחירה', badge: 'יום חופשי' }),

      day(6, '9.8', 'יום ראשון, 9 באוגוסט', 'עוברים מלון ונשארים בחוף', 'Ocean House ← Occidental Torremolinos Playa',
        'מעבר קצר בין המלונות. לא מעמיסים אטרקציה: צ׳ק־אאוט, מזוודות, ארוחת צהריים ובריכה במלון החדש.',
        [['09:00', 'אריזה וארוחת בוקר', 'בודקים את שני החדרים לפני היציאה.', '🧳'], ['11:00', 'צ׳ק־אאוט', 'יציאה לפני 12:00 והעברה למלון הבא.', '🚐'], ['12:00', 'השארת מזוודות', 'אם החדרים אינם מוכנים, משאירים בקבלה.', '🛎️'], ['14:00', 'צ׳ק־אין', 'חלוקת שני חדרי המשפחה והתארגנות.', '🏨'], ['16:00', 'בריכה וחוף', 'שאר היום חופשי.', '🏖️'], ['22:00', 'ערב הבנים: פוקר בקזינו', 'הגברים יוצאים לפוקר בקזינו Torrequebrada בבנאלמדנה.', '🎰']],
        ['לתאם רכב גדול או שתי מוניות מראש.', 'לסמן כל מזוודה בשם המשפחה והחדר.', 'האישור למלון השני אינו ניתן להחזר.'],
        ['Ocean House Costa del Sol by Grupotel', 'Occidental Torremolinos Playa'], { duration: 'יום מעבר קל', walking: 'מעט מאוד', places: ['Casino de Juego Torrequebrada'] }),

      day(7, '10.8', 'יום שני, 10 באוגוסט', 'פארק מים או יום מלון', 'Occidental ← Aqualand Torremolinos',
        'יום בחירה: פארק מים למשפחות שרוצות אקשן, או יום מלא בבריכה ובחוף למי שמעדיף לנוח.',
        [['09:30', 'החלטה לפי מזג האוויר', 'בודקים חום, עומס וכוחות.', '☀️'], ['10:00', 'Aqualand עם הפתיחה', 'מגיעים עם פתיחת הפארק כדי לתפוס מגלשות לפני התורים.', '🛝'], ['13:30', 'הפסקה מוצלת', 'אוכל, מים ומנוחה.', '🥤'], ['17:00', 'חזרה למלון', 'מקלחות וערב חופשי.', '🏨']],
        ['לרכוש כרטיסים מראש רק אחרי בדיקת מדיניות גובה וגיל.', 'בגדי ים, נעלי מים והגנה חזקה מהשמש.', 'האפשרות החלופית היא יום מלון מלא.', 'Zero Latency Miramar: חוויית מציאות מדומה (VR) משותפת בקניון Miramar, אופציה טובה לערב או ליום חם לגיא ורון.', 'יום שני הוא מהפחות עמוסים בפארק; מגיעים עם הפתיחה (בערך 10:00), כי אחרי הצהריים מגיעים אוטובוסי תיירים והתורים מתארכים. שווה לשקול fast pass למגלשות הגדולות.'],
        ['Occidental Torremolinos Playa', 'Aqualand Torremolinos', 'Occidental Torremolinos Playa'], { duration: 'יום מלא', walking: 'בינונית', badge: 'דורש החלטה', places: ['Zero Latency Miramar Fuengirola'] }),

      day(8, '11.8', 'יום שלישי, 11 באוגוסט', 'מיחאס — העיירה הלבנה', 'טורמולינוס ← Mijas Pueblo',
        'אחד המקומות היפים באנדלוסיה: כפר לבן על ההר, סמטאות, עציצים כחולים, קרמיקה, שוקולד ובתי קפה. חצי יום מומלץ, וחזרה לפני שיא החום.',
        [['08:30', 'יציאה מוקדמת', 'נוסעים לפני העומס והחום.', '🚐'], ['09:15', 'Mijas Pueblo', 'תצפית, סמטאות לבנות וכיכר מרכזית.', '🤍'], ['12:00', 'ארוחת צהריים', 'עצירה נינוחה לפני החזרה.', '🍽️'], ['14:00', 'חזרה למלון', 'בריכה, חוף ומנוחה.', '🏖️'], ['22:00', 'ערב הבנים: פוקר בקזינו', 'הגברים יוצאים לפוקר בקזינו Torrequebrada בבנאלמדנה.', '🎰']],
        ['יש עליות ואבנים — נעליים נוחות.', 'לקבוע נקודת מפגש אם הילדים מתפזרים בין החנויות.', 'לא להשאיר ציוד גלוי ברכב.', 'ב־Club Hípico El Ranchito משלבים מופע רכיבה מרשים עם ריקודי פלמנקו.'],
        ['Occidental Torremolinos Playa', 'Mijas Pueblo', 'Occidental Torremolinos Playa'], { duration: '5–6 שעות', walking: 'בינונית ועליות', places: ['Club Hipico El Ranchito Mijas', 'Casino de Juego Torrequebrada'] }),

      day(9, '12.8', 'יום רביעי, 12 באוגוסט', 'מרבייה ופוארטו באנוס', 'טורמולינוס ← Marbella Old Town ← Puerto Banús',
        'יום טיול מערבה: העיר העתיקה של מרבייה בבוקר, מנוחה ארוכה וערב מוקדם בפוארטו באנוס.',
        [['08:30', 'יציאה למרבייה', 'מגיעים לפני שיא העומס.', '🚐'], ['09:30', 'העיר העתיקה', 'Plaza de los Naranjos וסמטאות מוצלות.', '🍊'], ['12:30', 'ארוחה ומנוחה', 'הפסקה ארוכה במקום ממוזג.', '🍽️'], ['16:30', 'Puerto Banús', 'מרינה, טיילת וגלידה.', '🛥️'], ['19:00', 'חזרה למלון', 'נסיעה לפני ערב מאוחר.', '🌅']],
        ['לבדוק חניון מראש ולא להיכנס עם הרכב לסמטאות.', 'אפשר לוותר על פוארטו באנוס אם הילדים עייפים.', 'להצטייד במים לנסיעה.'],
        ['Occidental Torremolinos Playa', 'Marbella Old Town', 'Puerto Banus', 'Occidental Torremolinos Playa'], { duration: 'יום מלא', walking: 'בינונית' }),

      day(10, '13.8', 'יום חמישי, 13 באוגוסט', 'יום אחרון חופשי', 'Occidental והחוף',
        'יום גמיש לסגירת מעגל: בריכה, חוף, שעתיים־שלוש של קניות בפרימארק ובחנויות, ואריזה מסודרת לפני הטיסה.',
        [['09:00', 'בוקר חופשי', 'כל משפחה בוחרת ים או בריכה.', '🏖️'], ['13:00', 'מנוחה', 'שעות חום בחדרים.', '😴'], ['16:00', 'קניות בפרימארק ובעיר', 'שעתיים־שלוש בפרימארק ובחנויות סמוכות: בגדים, מזכרות ונשנושים.', '🛍️'], ['20:00', 'ארוחת סיום', 'ערב משותף ואריזה סופית.', '🎉']],
        ['לשקול את המזוודות לפני השינה.', 'להכין בגדי טיסה ותיקי יד בנפרד.', 'לאשר את ההסעה לשדה למחר.', 'בפרימארק כדאי להקצות שעתיים־שלוש; משתלם לבגדי ילדים, בגדי ים ומזכרות, אז כדאי להשאיר מקום במזוודה.'],
        ['Occidental Torremolinos Playa'], { duration: 'יום חופשי', walking: 'לבחירה', badge: 'גמיש', places: ['Primark Málaga'] }),

      day(11, '14.8', 'יום שישי, 14 באוגוסט', 'נפרדים מקוסטה דל סול', 'Occidental ← נמל התעופה מלאגה ← תל אביב',
        'בוקר רגוע, צ׳ק־אאוט עד 12:00, שמירת מזוודות ויציאה מוקדמת לשדה לטיסת הערב.',
        [['08:30', 'ארוחת בוקר ואריזה', 'בדיקה אחרונה בשני החדרים.', '🧳'], ['11:30', 'צ׳ק־אאוט', 'משאירים מזוודות בקבלה.', '🛎️'], ['12:00', 'צהריים רגועים', 'נשארים קרוב למלון ולא מסתכנים בעיכוב.', '🍽️'], ['16:15', 'יציאה לשדה', 'מרווח לנסיעה, החזרת רכב אם יהיה ובידוק.', '🚐'], ['17:10', 'התייצבות בשדה', 'לפחות 3 שעות לפני הטיסה.', '🛫'], ['20:10', 'טיסת IZ 262', 'טיסה ישירה לתל אביב.', '✈️']],
        ['לבקש מראש late checkout רק אם הוא מאושר בכתב.', 'להחזיק דרכונים וכרטיסי טיסה אצל מבוגר אחד מכל משפחה.', 'לבדוק את מועד הנחיתה הלילי בישראל.'],
        ['Occidental Torremolinos Playa', 'Málaga Airport'], { duration: 'יום טיסה', walking: 'מעט מאוד' })
    ],
    useful: {
      emergency: [
        { label: 'מוקד חירום אירופי', value: '112', href: 'tel:112' },
        { label: 'משטרה לאומית', value: '091', href: 'tel:091' },
        { label: 'משטרה מקומית', value: '092', href: 'tel:092' },
        { label: 'ביטוח הראל · מוקד חירום 24ש', value: '+972-3-7547030', href: 'tel:+97237547030' },
        { label: 'הראל · וואטסאפ 24ש', value: '+972-52-7544589', href: 'https://wa.me/972527544589', caption: 'לחיצה לפתיחת וואטסאפ' }
      ],
      carRental: {
        provider: 'Uber', title: 'תחבורה בקוסטה דל סול',
        status: 'מאושר', pickup: 'נמל התעופה מלאגה → טורמולינוס · 4.8',
        return: 'טורמולינוס → נמל התעופה מלאגה · 14.8',
        vehicle: 'Uber לפי הצורך', deposit: 'ללא הזמנה מראש',
        requirements: 'נוסעים ב-Uber לכל הנסיעות, כולל ההגעה מהשדה והחזרה אליו. כשנוסעים כל השמונה עם המזוודות מזמינים Uber גדול (Van או XL).',
        alertTitle: '',
        warning: '',
        document: ''
      },
      weather: [
        { name: 'טורמולינוס', dates: '4–14.8', note: 'חוף, עומס חום ורוח', href: 'https://www.meteoblue.com/en/weather/week/torremolinos_spain_2510281' },
        { name: 'מלאגה', dates: '6.8', note: 'יום עירוני', href: 'https://www.meteoblue.com/en/weather/week/m%c3%a1laga_spain_2514256' },
        { name: 'מרבייה', dates: '12.8', note: 'טיול החוף המערבי', href: 'https://www.meteoblue.com/en/weather/week/marbella_spain_2514169' },
        { name: 'מיחאס', dates: '11.8', note: 'עיירה הררית', href: 'https://www.meteoblue.com/en/weather/week/mijas_spain_2514287' }
      ]
    },
    documents: [
      { id: 'doc-flight', title: 'פרטי טיסות ארקיע', category: 'טיסות', status: 'מאושר', note: 'IZ261 ב־4.8 ו־IZ262 ב־14.8. מסמך המקור כולל שמות ומספרי כרטיס ולכן אינו מפורסם באתר.', href: '' },
      { id: 'doc-ocean', title: 'Ocean House Costa del Sol', category: 'לינה', status: 'מאושר', note: '4–9 באוגוסט · 2 סוויטות משפחתיות · 4 מבוגרים ו־4 ילדים.', href: '' },
      { id: 'doc-occidental', title: 'Occidental Torremolinos Playa', category: 'לינה', status: 'מאושר', note: '9–14 באוגוסט · 2 חדרי משפחה · ההזמנה אינה ניתנת להחזר.', href: '' },
      { id: 'doc-transfer', title: 'תחבורה · Uber', category: 'תחבורה', status: 'מאושר', note: 'התחבורה בקוסטה דל סול על בסיס Uber, כולל הסעה מהשדה וחזרה. אין צורך בהזמנת הסעות מראש.', href: '' },
      { id: 'doc-insurance', title: 'ביטוח נסיעות · הראל', category: 'מסמכים', status: 'מאושר', note: 'ביטוח בריאות נסיעות בהראל, משפחת גנם. פוליסה · 4 ספרות אחרונות: 8026. פקס +972-3-7348168.', href: '' },
      { id: 'doc-tuktapas', title: 'Tuk & Tapas · סיור טוק־טוק', category: 'פעילות', status: 'רעיון', note: 'סיור טוק־טוק עם טעימות טאפאס באזור.', href: 'https://tukandtapas.com/' },
      { id: 'doc-qqbikes', title: 'QQ Bikes · השכרת אופניים', category: 'פעילות', status: 'רעיון', note: 'השכרת אופניים בקוסטה דל סול.', href: 'https://www.qqbikes.com/en/' }
    ]
  };
})();
