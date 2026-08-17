(() => {
  const map = query => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
  const route = (...points) => `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(points[0])}&destination=${encodeURIComponent(points.at(-1))}&waypoints=${points.slice(1, -1).map(encodeURIComponent).join('%7C')}&travelmode=driving`;
  const waze = query => `https://waze.com/ul?q=${encodeURIComponent(query)}&navigate=yes`;
  const wx = {
    la: 'https://www.meteoblue.com/en/weather/week/los-angeles_united-states-of-america_5368361',
    sd: 'https://www.meteoblue.com/en/weather/week/san-diego_united-states-of-america_5391811',
    lv: 'https://www.meteoblue.com/en/weather/week/las-vegas_united-states-of-america_5506956',
    jt: 'https://www.meteoblue.com/en/weather/week/twentynine-palms_united-states-of-america_5405613'
  };
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
    heroFact: options.heroFact || 'שומרים על קצב נעים למשפחה ומשאירים מרווח לשינויים.',
    schedule: schedule.map(([time, title, detail, icon]) => ({ time, title, detail, icon })),
    tips,
    navigation: {
      full: navPoints.length > 1 ? route(...navPoints) : map(navPoints[0]),
      legs: navPoints.concat(options.places || []).map(point => {
        const p = typeof point === 'string' ? { label: point } : point;
        return { label: p.label, sub: 'ניווט ליעד', waze: p.waze || waze(p.label), maps: p.maps || map(p.label) };
      })
    },
    weather: options.weather || { label: 'תחזית לסן דייגו', href: wx.sd }
  });

  window.DEFAULT_TRIP = {
    version: 1,
    title: 'Christmas in the US',
    subtitle: 'הטיול של משפחת גנם בארצות הברית · ביקור אצל משפחת רומנו בסן דייגו',
    lastUpdated: '17.8.2026, 20:30',
    dateLabel: '18 בדצמבר 2026 – 4 בינואר 2027',
    startDate: '2026-12-18',
    endDate: '2027-01-04',
    routeLabel: 'לוס אנג׳לס ← סן דייגו ← לאס וגאס',
    travelers: 'משפחת גנם · 2 מבוגרים ו־2 ילדים (גיא 7, רון 5)',
    notes: 'חופשת חורף בארצות הברית: כמה ימים בלוס אנג׳לס, חג המולד בסן דייגו אצל משפחת רומנו, מסע כביש עם פארקים, וסיום בלאס וגאס לשנה החדשה.',
    flights: [
      {
        id: 'outbound', direction: 'הלוך', airline: 'אל על', flightNumber: 'LY 5',
        from: 'תל אביב (TLV)', to: 'לוס אנג׳לס (LAX)', date: 'יום שישי, 18.12',
        depart: '00:45', arrive: '06:00', duration: 'כ־15 שעות ו־15 דקות',
        status: 'מאושר', note: 'טיסה ישירה ארוכה. התייצבות בנתב״ג מבעוד מועד. נחיתה בבוקר בלוס אנג׳לס, ואיסוף רכב Avis מיד אחרי הנחיתה.'
      },
      {
        id: 'lv-lax', direction: 'פנימי', airline: 'אל על', flightNumber: 'LY 4479',
        from: 'לאס וגאס (LAS)', to: 'לוס אנג׳לס (LAX)', date: 'יום שני, 4.1',
        depart: '09:10', arrive: '10:26', duration: 'כ־שעה ו־16 דקות',
        status: 'מאושר', note: 'קטע פנימי קצר מלאס וגאס ללוס אנג׳לס בבוקר יום החזרה, לפני הטיסה הביתה.'
      },
      {
        id: 'return', direction: 'חזור', airline: 'אל על', flightNumber: 'LY 6',
        from: 'לוס אנג׳לס (LAX)', to: 'תל אביב (TLV)', date: 'יום שני, 4.1 – שלישי, 5.1',
        depart: '14:00', arrive: '13:55 (+1)', duration: 'כ־13 שעות ו־55 דקות',
        status: 'מאושר', note: 'טיסה ישירה חזרה. נחיתה בישראל ביום שלישי אחר הצהריים. יש מספיק מרווח בין הנחיתה מוגאס להמראה חזרה.'
      }
    ],
    lodgings: [
      {
        id: 'park-plaza', name: 'Park Plaza Lodge Hotel', nativeName: 'לוס אנג׳לס · 2 לילות',
        dates: '18–20 בדצמבר · 2 לילות', location: 'Los Angeles, CA',
        checkIn: 'שישי 18.12', checkOut: 'ראשון 20.12', status: 'הוזמן',
        note: 'שני הלילות הראשונים בלוס אנג׳לס אחרי הנחיתה. יום התאקלמות רגוע לפני הנסיעה לסן דייגו.',
        maps: map('Park Plaza Lodge Hotel Los Angeles'), waze: waze('Park Plaza Lodge Hotel Los Angeles'),
        website: '', weather: wx.la
      },
      {
        id: 'romano-house', name: 'בית משפחת רומנו', nativeName: 'סן דייגו · אירוח משפחתי',
        dates: '20 בדצמבר – 30 בדצמבר (בערך)', location: 'San Diego, CA',
        checkIn: 'ראשון 20.12', checkOut: 'לפי המסע ללאס וגאס', status: 'אירוח',
        note: 'מתארחים אצל משפחת רומנו בסן דייגו. הבסיס ליציאות יומיות בצורת כוכב באזור סן דייגו. חג המולד עם המשפחה.',
        maps: map('San Diego CA'), waze: waze('San Diego CA'),
        website: '', weather: wx.sd
      },
      {
        id: 'vegas-hotel', name: 'מלון בלאס וגאס', nativeName: 'לאס וגאס · 3–4 לילות',
        dates: '31 בדצמבר – 4 בינואר (בערך)', location: 'Las Vegas Strip, NV',
        checkIn: 'לתכנון', checkOut: 'שני 4.1 · לפני הטיסה', status: 'טרם הוזמן',
        note: 'מלון בלאס וגאס לסיום הטיול, כולל ערב השנה החדשה. עדיין לא הוזמן — לבחור מלון על הסטריפ או בקרבתו.',
        maps: map('Las Vegas Strip hotels'), waze: waze('Las Vegas Strip'),
        website: '', weather: wx.lv
      }
    ],
    fullRoute: {
      title: 'מסלול חוצה מדינות',
      subtitle: 'לוס אנג׳לס, ביקור משפחתי בסן דייגו, ומסע כביש עם פארקים עד לאס וגאס.',
      google: route('Los Angeles International Airport', 'Park Plaza Lodge Hotel Los Angeles', 'San Diego CA', 'Joshua Tree National Park', 'Las Vegas NV', 'Los Angeles International Airport'),
      stops: [
        { name: 'שדה LAX', kind: 'הגעה וחזרה', maps: map('Los Angeles International Airport') },
        { name: 'לוס אנג׳לס', kind: 'לינה ראשונה', maps: map('Los Angeles CA') },
        { name: 'סן דייגו', kind: 'בסיס משפחתי', maps: map('San Diego CA') },
        { name: 'פארקים בדרך', kind: 'מסע כביש', maps: map('Joshua Tree National Park') },
        { name: 'לאס וגאס', kind: 'סיום וראש השנה', maps: map('Las Vegas NV') }
      ]
    },
    days: [
      day(1, '18.12', 'יום שישי, 18 בדצמבר', 'נוחתים בלוס אנג׳לס', 'LAX ← Avis ← Park Plaza Lodge',
        'יום הגעה: נחיתה בבוקר, איסוף רכב, כניסה למלון ויום התאקלמות רגוע אחרי טיסה ארוכה.',
        [['06:00', 'נחיתה ב־LAX', 'מעבר גבולות, איסוף מזוודות והתארגנות.', '🛬'], ['06:30', 'איסוף רכב Avis', 'איסוף הרכב השכור ויציאה מהשדה.', '🚗'], ['09:00', 'ארוחת בוקר והתמקמות', 'כניסה מוקדמת/השארת מזוודות ב־Park Plaza Lodge.', '🥞'], ['16:00', 'יום רגוע', 'מנוחה מהטיסה, קניית מצרכים בסיסיים, שינה מוקדמת.', '😴']],
        ['לא לתכנן אטרקציה גדולה ליום הנחיתה — הפרשי השעות מתישים.', 'לוודא כיסא בטיחות/בוסטר לילדים ברכב השכור.', 'לבדוק תקינות הרכב וצילום מצב לפני יציאה מהשדה.'],
        ['Los Angeles International Airport', 'Park Plaza Lodge Hotel Los Angeles'], { duration: 'יום טיסה והגעה', walking: 'מעט מאוד', weather: { label: 'תחזית ללוס אנג׳לס', href: wx.la } }),

      day(2, '19.12', 'שבת, 19 בדצמבר', 'יום בלוס אנג׳לס', 'לוס אנג׳לס והסביבה',
        'יום מלא ראשון בלוס אנג׳לס. אפשרויות לבחירה לפי כוחות והתאוששות מהטיסה.',
        [['09:30', 'יציאה לפי בחירה', 'בוחרים אטרקציה אחת מרכזית ליום.', '🌴'], ['13:00', 'ארוחת צהריים', 'עצירה נינוחה.', '🍔'], ['16:00', 'המשך חופשי', 'טיילת/קניות/חוף לפי מזג האוויר.', '🛍️']],
        ['אפשרויות: דיסנילנד, יוניברסל סטודיוס, סנטה מוניקה, הוליווד, גריפית׳ אובזרבטורי.', 'לדיסנילנד/יוניברסל כדאי לקנות כרטיסים מראש ולהגיע עם הפתיחה.', 'לבחור לפי מרחק ותנועה — לוס אנג׳לס עמוסה.'],
        ['Park Plaza Lodge Hotel Los Angeles', 'Santa Monica Pier'], { duration: 'יום מלא', walking: 'בינונית', badge: 'דורש החלטה', weather: { label: 'תחזית ללוס אנג׳לס', href: wx.la }, places: ['Disneyland Park Anaheim', 'Universal Studios Hollywood', 'Santa Monica Pier', 'Griffith Observatory'] }),

      day(3, '20.12', 'יום ראשון, 20 בדצמבר', 'עוברים לסן דייגו', 'לוס אנג׳לס ← סן דייגו · משפחת רומנו',
        'צ׳ק־אאוט מהמלון בלוס אנג׳לס ונסיעה דרומה לסן דייגו (כשעתיים) להתארח אצל משפחת רומנו.',
        [['09:00', 'צ׳ק־אאוט ואריזה', 'יציאה מ־Park Plaza Lodge.', '🧳'], ['10:00', 'נסיעה לסן דייגו', 'כשעתיים דרומה בכביש I-5.', '🚗'], ['12:30', 'הגעה למשפחת רומנו', 'התמקמות, מנוחה וזמן משפחתי.', '🏡'], ['17:00', 'ערב רגוע', 'ארוחה משותפת והיכרות עם האזור.', '🍽️']],
        ['לתאם עם משפחת רומנו שעת הגעה משוערת.', 'לתדלק ולעצור לפי הצורך עם הילדים.', 'להביא מתנה קטנה למארחים.'],
        ['Park Plaza Lodge Hotel Los Angeles', 'San Diego CA'], { duration: 'יום מעבר', walking: 'מעט', badge: 'מעבר' }),

      day(4, '21.12', 'יום שני, 21 בדצמבר', 'סן דייגו: גן חיות ובלבואה פארק', 'בסיס סן דייגו',
        'יום קלאסי בסן דייגו: גן החיות המפורסם ופארק בלבואה עם המוזיאונים והגנים.',
        [['09:30', 'San Diego Zoo', 'אחד מגני החיות המובילים בעולם.', '🦁'], ['13:00', 'ארוחה', 'הפסקה בפארק.', '🥪'], ['15:00', 'Balboa Park', 'גנים, מוזיאונים ומרחבים ירוקים.', '🌳']],
        ['גן החיות גדול — נעליים נוחות ותכנון מסלול מראש.', 'כרטיסים מראש חוסכים זמן בכניסה.', 'רעיון לחלופה: Safari Park בצפון סן דייגו.'],
        ['San Diego Zoo', 'Balboa Park San Diego'], { duration: 'יום מלא', walking: 'רבה', places: ['San Diego Zoo Safari Park'] }),

      day(5, '22.12', 'יום שלישי, 22 בדצמבר', 'חופים ולה חויה', 'בסיס סן דייגו',
        'יום חופים רגוע: לה חויה עם כלבי הים, וחוף קורונדו המפורסם.',
        [['10:00', 'La Jolla Cove', 'מפרץ יפהפה עם כלבי ים ואריות ים.', '🦭'], ['13:00', 'ארוחת צהריים', 'מסעדה עם נוף לים.', '🦞'], ['15:30', 'Coronado Beach', 'חוף רחב עם חול זהוב ומלון היסטורי.', '🏖️']],
        ['בדצמבר הים קר — בעיקר טיול חוף ולא רחצה.', 'לה חויה: לשמור מרחק מכלבי הים.', 'חניה בקורונדו מוגבלת — להגיע מוקדם.'],
        ['La Jolla Cove', 'Coronado Beach San Diego'], { duration: 'יום מלא', walking: 'בינונית', tone: 'sea' }),

      day(6, '23.12', 'יום רביעי, 23 בדצמבר', 'Legoland או SeaWorld', 'בסיס סן דייגו',
        'יום פארקים לילדים: Legoland California (מצוין לגילי 5–7) או SeaWorld San Diego.',
        [['09:30', 'הגעה עם הפתיחה', 'מגיעים מוקדם לפני התורים.', '🎢'], ['13:00', 'ארוחה בפארק', 'הפסקה ומנוחה.', '🍟'], ['16:00', 'המשך מתקנים', 'סבב אחרון לפני החזרה.', '🧱']],
        ['Legoland מתאים במיוחד לגיל של גיא ורון.', 'לבדוק מדיניות גובה/גיל למתקנים.', 'כרטיסים מראז חוסכים זמן וכסף.'],
        ['Legoland California Carlsbad', 'SeaWorld San Diego'], { duration: 'יום מלא', walking: 'רבה', badge: 'דורש החלטה', places: ['SeaWorld San Diego'] }),

      day(7, '24.12', 'יום חמישי, 24 בדצמבר', 'ערב חג המולד', 'סן דייגו · משפחת רומנו',
        'ערב חג המולד (Christmas Eve) עם משפחת רומנו. יום משפחתי רגוע ואווירת חג.',
        [['11:00', 'בוקר חופשי', 'זמן משפחתי נינוח.', '☕'], ['14:00', 'הכנות לחג', 'עזרה בהכנות, קניות אחרונות.', '🎄'], ['18:00', 'ערב חג המולד', 'ארוחת ערב חגיגית עם המארחים.', '🕯️']],
        ['הרבה חנויות ומוקדים סוגרים מוקדם ב־24.12.', 'לתאם מראש מתנות קטנות לילדים.', 'לבדוק שעות פתיחה של כל אטרקציה בחג.'],
        ['San Diego CA'], { duration: 'יום משפחתי', walking: 'לבחירה', badge: 'חג', tone: 'gold' }),

      day(8, '25.12', 'יום שישי, 25 בדצמבר', 'חג המולד', 'סן דייגו · משפחת רומנו',
        'חג המולד (Christmas Day). רוב האטרקציות סגורות — יום משפחתי בבית ובסביבה.',
        [['09:00', 'בוקר חג', 'פתיחת מתנות ואווירה משפחתית.', '🎁'], ['13:00', 'ארוחת חג', 'ארוחה משותפת גדולה.', '🍗'], ['16:00', 'טיול קצר', 'הליכה בשכונה או בפארק פתוח.', '🚶']],
        ['רוב העסקים סגורים ב־25.12 — לא לתכנן אטרקציות בתשלום.', 'תחבורה ותנועה קלות מהרגיל.', 'יום טוב למנוחה בין ימי הטיולים.'],
        ['San Diego CA'], { duration: 'יום חג', walking: 'קלה', badge: 'חג', tone: 'clay' }),

      day(9, '26.12', 'שבת, 26 בדצמבר', 'נמל, מוזיאונים ומרכז העיר', 'בסיס סן דייגו',
        'יום עירוני בסן דייגו: אזור הנמל, נושאת המטוסים USS Midway ומרכז העיר (Gaslamp / Seaport).',
        [['10:00', 'USS Midway Museum', 'נושאת מטוסים היסטורית להתרשמות.', '🛩️'], ['13:00', 'Seaport Village', 'ארוחה וטיול ליד המים.', '⚓'], ['16:00', 'מרכז העיר', 'רובע Gaslamp, חנויות וקפה.', '🏙️']],
        ['USS Midway מרתק לילדים ולמבוגרים.', 'חניה במרכז — עדיף חניון מסודר.', 'אפשר לשלב שיט קצר במפרץ.'],
        ['USS Midway Museum', 'Seaport Village San Diego'], { duration: 'יום מלא', walking: 'בינונית' }),

      day(10, '27.12', 'יום ראשון, 27 בדצמבר', 'פוינט לומה, בריכות גאות ולוויתנים', 'בסיס סן דייגו',
        'יום חוף ונוף בפוינט לומה: מצוק קבריו עם בריכות גאות ומגדלור, ובחורף אפשר לצאת לשיט צפייה בלוויתנים אפורים בעונת ההגירה.',
        [['09:30', 'Cabrillo National Monument', 'מגדלור היסטורי, תצפית על המפרץ ובריכות גאות.', '🔭'], ['12:00', 'ארוחת צהריים', 'הפסקה באזור פוינט לומה.', '🌮'], ['14:00', 'שיט צפייה בלוויתנים', 'עונת ההגירה של הלוויתנים האפורים, דצמבר עד אפריל.', '🐋'], ['16:30', 'Sunset Cliffs', 'מצוקים ושקיעה מעל האוקיינוס.', '🌅']],
        ['בריכות הגאות יפות במיוחד בשפל — לבדוק את לוח הגאות מראש.', 'שיט לוויתנים: להזמין מראש ולהתלבש חם, קר ורוחי בים בחורף.', 'ב-Sunset Cliffs להיזהר מקצה המצוק עם הילדים.'],
        ['San Diego CA', 'Cabrillo National Monument San Diego', 'Sunset Cliffs Natural Park'], { duration: 'יום מלא', walking: 'בינונית', tone: 'sea' }),

      day(11, '28.12', 'יום שני, 28 בדצמבר', 'ספארי פארק בצפון המחוז', 'בסיס סן דייגו ← Escondido',
        'יום חיות שונה מגן החיות: San Diego Zoo Safari Park באסקונדידו, עם מרחבי סוואנה, רכבת ספארי ומפגשי חיות. כ־45 דקות צפונה מסן דייגו.',
        [['09:00', 'נסיעה לאסקונדידו', 'כ־45 דקות צפונה.', '🚗'], ['10:00', 'Safari Park', 'אזורי סוואנה עם ג׳ירפות, קרנפים ופילים.', '🦒'], ['13:00', 'ארוחה ומנוחה', 'הפסקת צהריים בפארק.', '🥪'], ['15:00', 'המשך מסלול', 'אזור הילדים, מפגשי חיות ותצפיות.', '🦏']],
        ['הפארק גדול ומרוחק — כדאי יום שלם ונעליים נוחות.', 'לבדוק זמני האכלה ומופעים מראש.', 'רכבת הספארי (Africa Tram) כלולה והיא שיא היום לילדים.'],
        ['San Diego CA', 'San Diego Zoo Safari Park Escondido'], { duration: 'יום מלא', walking: 'רבה' }),

      day(12, '29.12', 'יום שלישי, 29 בדצמבר', 'מיסז׳ן ביץ׳, בלמונט פארק ואולד טאון', 'בסיס סן דייגו',
        'יום כיף אחרון בסן דייגו לפני מסע הכביש: פארק שעשועים על החוף, הרובע ההיסטורי אולד טאון עם טאקו, וסידור הרכב לקראת מחר.',
        [['10:00', 'Belmont Park', 'פארק שעשועים היסטורי על חוף מיסז׳ן ביץ׳, רכבת הרים וארקייד.', '🎢'], ['13:00', 'Old Town San Diego', 'הרובע המקסיקני ההיסטורי, טאקו ומזכרות.', '🌮'], ['16:00', 'זמן חופשי', 'מנוחה קצרה.', '☕'], ['18:00', 'הכנות למסע הכביש', 'אריזה, קניית חטיפים וסידור הרכב לקראת היציאה מחר לוגאס.', '🧳']],
        ['Belmont Park: הכניסה חינם ומשלמים לפי מתקן — מתאים לגילי גיא ורון.', 'אולד טאון נוח להליכה וטעים — ארוחה מקסיקנית אמיתית.', 'לתדלק ולבדוק את הרכב הערב, ולאשר מלון בוגאס לפני היציאה.'],
        ['San Diego CA', 'Belmont Park San Diego', 'Old Town San Diego State Historic Park'], { duration: 'יום מלא', walking: 'בינונית' }),

      day(13, '30.12', 'יום רביעי, 30 בדצמבר', 'מסע כביש: פארק ג׳ושוע טרי', 'סן דייגו ← Joshua Tree ← Twentynine Palms',
        'נפרדים מסן דייגו ויוצאים למסע הכביש לוגאס. עוצרים בפארק הלאומי ג׳ושוע טרי לחצי יום של סלעי ענק וטיולים קצרים, ולנים בטוונטיניין פאלמס ליד הפארק.',
        [['08:00', 'יציאה מסן דייגו', 'מתחילים מוקדם, כ־3 שעות נסיעה לפארק.', '🚗'], ['11:00', 'Joshua Tree', 'סלעי בולדר ענקיים ועצי יוש׳ואה.', '🌵'], ['11:30', 'Hidden Valley', 'מסלול טבעת קצר וקל (כ־1.6 ק״מ), מושלם לילדים.', '🥾'], ['13:00', 'Skull Rock ו־Cholla Garden', 'סלע הגולגולת ושדה קקטוסים מצולם.', '📸'], ['16:30', 'לינה בטוונטיניין פאלמס', 'לילה ליד הפארק לפני המשך לוגאס.', '🏨']],
        ['בדצמבר הימים נעימים אך הלילות קפואים במדבר — שכבות חמות וכובע.', 'אין דלק או אוכל בתוך הפארק — למלא מים ומזון לפני הכניסה.', 'הקליטה הסלולרית חלשה בפארק — להוריד מפה לא־מקוונת מראש.'],
        ['San Diego CA', 'Joshua Tree National Park', 'Twentynine Palms CA'], { duration: 'יום נסיעה וטיול', walking: 'קלה עד בינונית', badge: 'מסע כביש', tone: 'clay', weather: { label: 'תחזית לג׳ושוע טרי', href: wx.jt } }),

      day(14, '31.12', 'יום חמישי, 31 בדצמבר', 'מגיעים ללאס וגאס · ערב השנה החדשה', 'Twentynine Palms ← Calico ← Seven Magic Mountains ← לאס וגאס',
        'משלימים את מסע הכביש לוגאס עם שתי עצירות כיפיות בדרך, ומגיעים ללאס וגאס לערב השנה החדשה על הסטריפ.',
        [['08:30', 'יציאה לכיוון וגאס', 'עולים על כביש I-15 צפונה.', '🚗'], ['10:30', 'Calico Ghost Town', 'עיירת רפאים משוחזרת מימי מכרות הכסף, כיף לילדים.', '🤠'], ['13:30', 'Seven Magic Mountains', 'מיצג עמודי סלע צבעוניים ממש לפני וגאס, עצירת צילום קצרה.', '🎨'], ['15:00', 'כניסה למלון בוגאס', 'צ׳ק־אין והתארגנות.', '🏨'], ['22:00', 'ערב השנה החדשה', 'חגיגות New Year על הסטריפ, זיקוקים בחצות.', '🎆']],
        ['הסטריפ נחסם לתנועה בליל השנה החדשה — לתכנן מיקום וחניה מראש.', 'המונים גדולים מאוד בחצות — לשמור על הילדים קרוב, ואטמי אוזניים לזיקוקים.', 'Seven Magic Mountains חינם וכ־10 דקות מהכביש — עצירה מהירה ומצולמת.', 'גיבוי: Mojave National Preserve עם דיונות Kelso — עצירת מדבר יפה בין ברסטו לוגאס, אם רוצים להחליף את קליקו או להוסיף עצירה.'],
        ['Twentynine Palms CA', 'Calico Ghost Town', 'Seven Magic Mountains', 'Las Vegas Strip'], { duration: 'יום נסיעה וערב חג', walking: 'קלה', badge: 'ראש השנה', tone: 'gold', weather: { label: 'תחזית ללאס וגאס', href: wx.lv } }),

      day(15, '1.1', 'יום שישי, 1 בינואר', 'לאס וגאס: הסטריפ', 'לאס וגאס',
        'היום הראשון של השנה. יום רגוע יחסית: מלונות הנושא, מזרקות ומופעים על הסטריפ.',
        [['11:00', 'בוקר רגוע', 'מנוחה אחרי ליל השנה החדשה.', '☕'], ['13:00', 'סיור מלונות', 'Bellagio, Venetian, Caesars — לובאים ואטרקציות.', '⛲'], ['16:00', 'זמן חופשי', 'בריכה/קניות/מנוחה.', '🛍️'], ['20:00', 'ערב על הסטריפ', 'מזרקות Bellagio ואורות.', '🌃']],
        ['הרבה אטרקציות על הסטריפ בחינם: מזרקות, לובאים מעוצבים.', 'קזינו אינו מתאים לילדים — לתכנן מסלול דרך האזורים המשפחתיים.', 'רעיון לילדים: High Roller, Adventuredome, Shark Reef.'],
        ['Las Vegas Strip', 'Bellagio Fountains'], { duration: 'יום מלא', walking: 'רבה', tone: 'gold', weather: { label: 'תחזית ללאס וגאס', href: wx.lv }, places: ['The Venetian Las Vegas', 'Adventuredome Las Vegas'] }),

      day(16, '2.1', 'שבת, 2 בינואר', 'לאס וגאס או טיול לגרנד קניון', 'לאס וגאס',
        'יום בחירה: יום טיול ארוך לגרנד קניון (או Hoover Dam קרוב יותר), או יום נוסף בוגאס.',
        [['08:00', 'החלטה על היעד', 'גרנד קניון = יום ארוך; Hoover Dam = חצי יום.', '🗺️'], ['12:00', 'תצפית וטיול', 'נופים עוצרי נשימה.', '📸'], ['16:00', 'חזרה לוגאס', 'נסיעה בחזרה למלון.', '🚗']],
        ['גרנד קניון (West Rim) כשעתיים־שלוש מוגאס — יום שלם.', 'Hoover Dam כ־45 דקות מוגאס — חלופה קצרה ומרשימה.', 'להצטייד במים ובגדים חמים — קר בגובה בחורף.'],
        ['Las Vegas NV', 'Grand Canyon West', 'Hoover Dam'], { duration: 'יום מלא', walking: 'בינונית', badge: 'דורש החלטה', tone: 'clay', weather: { label: 'תחזית ללאס וגאס', href: wx.lv } }),

      day(17, '3.1', 'יום ראשון, 3 בינואר', 'לאס וגאס: יום אחרון', 'לאס וגאס',
        'יום אחרון מלא בוגאס: מופע, קניות אאוטלט ואריזה לקראת הטיסה מחר.',
        [['10:00', 'בוקר חופשי', 'בריכה/מנוחה.', '🏊'], ['13:00', 'אאוטלטים', 'קניות ב־Las Vegas North/South Premium Outlets.', '🛍️'], ['18:00', 'מופע ערב', 'מופע מתאים למשפחה על הסטריפ.', '🎭'], ['21:00', 'אריזה', 'הכנה לטיסה המוקדמת.', '🧳']],
        ['מופעים מתאימים למשפחה: Cirque du Soleil, מופעי קסמים.', 'להזמין כרטיסים למופע מראש.', 'לסדר את המזוודות ולתדלק את הרכב הערב — הטיסה מוקדמת.'],
        ['Las Vegas Strip', 'Las Vegas North Premium Outlets'], { duration: 'יום מלא', walking: 'בינונית', tone: 'gold', weather: { label: 'תחזית ללאס וגאס', href: wx.lv } }),

      day(18, '4.1', 'יום שני, 4 בינואר', 'טסים הביתה', 'לאס וגאס ← לוס אנג׳לס ← תל אביב',
        'יום חזרה: החזרת הרכב בוגאס, טיסה פנימית ללוס אנג׳לס, וטיסה ישירה לתל אביב.',
        [['06:00', 'החזרת רכב Avis', 'החזרה בלאס וגאס עד 06:30.', '🚗'], ['07:00', 'התייצבות ל־LY4479', 'בידוק לטיסה הפנימית.', '🛫'], ['09:10', 'טיסה ללוס אנג׳לס', 'LAS ← LAX, כשעה ורבע.', '✈️'], ['14:00', 'טיסת LY6 לתל אביב', 'טיסה ישירה הביתה, נחיתה ב־5.1.', '🛬']],
        ['לוודא את מיקום החזרת הרכב של Avis (לאס וגאס) מראש.', 'מרווח בין הנחיתה ב־LAX (10:26) להמראה (14:00) — לוודא מספיק זמן למעבר.', 'להחזיק דרכונים וכרטיסי טיסה בהישג יד.'],
        ['Harry Reid International Airport Las Vegas', 'Los Angeles International Airport'], { duration: 'יום טיסה', walking: 'מעט', weather: { label: 'תחזית ללאס וגאס', href: wx.lv } })
    ],
    useful: {
      emergency: [
        { label: 'חירום כללי (משטרה/אמבולנס/כיבוי)', value: '911', href: 'tel:911' },
        { label: 'קונסוליית ישראל בלוס אנג׳לס', value: '+1-323-852-5500', href: 'tel:+13238525500' },
        { label: 'ביטוח הראל · מוקד חירום 24ש', value: '+972-3-7547030', href: 'tel:+97237547030' },
        { label: 'הראל · וואטסאפ 24ש', value: '+972-52-7544589', href: 'https://wa.me/972527544589', caption: 'לחיצה לפתיחת וואטסאפ' }
      ],
      carRental: {
        provider: 'Avis', title: 'רכב שכור בארצות הברית',
        status: 'מאושר', pickup: 'שדה LAX · 18.12 · 06:30',
        return: 'לאס וגאס (LAS) · 4.1 · 06:30',
        vehicle: 'רכב משפחתי (לאשר גודל וכיסאות בטיחות)', deposit: 'לפי מדיניות Avis',
        requirements: 'איסוף ב-LAX מיד אחרי הנחיתה והחזרה בלאס וגאס לפני הטיסה הביתה (השכרת One-Way). נדרש רישיון בינלאומי + כרטיס אשראי של הנהג. לוודא בוסטר/כיסא בטיחות לילדים.',
        alertTitle: 'לאשר מיקום החזרה',
        warning: 'ההחזרה ב-4.1 בשעה 06:30 חייבת להיות בלאס וגאס (LAS) כדי להספיק את הטיסה ב-09:10. כדאי לאמת מול Avis שההזמנה היא One-Way LAX→LAS.',
        document: ''
      },
      weather: [
        { name: 'לוס אנג׳לס', dates: '18–20.12', note: 'חורף מתון, לילות קרירים', href: wx.la },
        { name: 'סן דייגו', dates: '20–30.12', note: 'נעים ביום, קריר בערב', href: wx.sd },
        { name: 'לאס וגאס', dates: '31.12–4.1', note: 'קר בחורף, במיוחד בלילה', href: wx.lv }
      ]
    },
    documents: [
      { id: 'doc-flight', title: 'טיסות אל על (LY5 / LY4479 / LY6)', category: 'טיסות', status: 'מאושר', note: 'הלוך LY5 ב־18.12 (TLV→LAX), פנימי LY4479 ב־4.1 (LAS→LAX), חזור LY6 ב־4.1 (LAX→TLV). מסמך המקור כולל שמות ומספר אישור ולכן אינו מפורסם באתר.', href: '' },
      { id: 'doc-parkplaza', title: 'Park Plaza Lodge · לוס אנג׳לס', category: 'לינה', status: 'מאושר', note: '18–20 בדצמבר · 2 לילות בלוס אנג׳לס.', href: '' },
      { id: 'doc-romano', title: 'אירוח בסן דייגו · משפחת רומנו', category: 'לינה', status: 'אירוח', note: 'מתארחים אצל משפחת רומנו בסן דייגו, בערך 20–30 בדצמבר.', href: '' },
      { id: 'doc-vegas', title: 'מלון בלאס וגאס', category: 'לינה', status: 'טרם הוזמן', note: '3–4 לילות לסיום הטיול, כולל ליל השנה החדשה. עדיין לבחור ולהזמין.', href: '' },
      { id: 'doc-car', title: 'רכב שכור · Avis', category: 'תחבורה', status: 'מאושר', note: 'איסוף ב-LAX ב-18.12 והחזרה בלאס וגאס ב-4.1 (One-Way). מספר ההזמנה אינו מפורסם באתר.', href: '' },
      { id: 'doc-insurance', title: 'ביטוח נסיעות · הראל', category: 'מסמכים', status: 'לעדכון', note: 'ביטוח בריאות נסיעות בהראל, משפחת גנם. פרטי הפוליסה לטיול זה לעדכון. מוקד חירום 24ש בהראל.', href: '' }
    ],
    attractions: [
      { id: 'a-disneyland', name: 'Disneyland (אנהיים)', category: 'אטרקציות', desc: 'פארק השעשועים הקלאסי, ליד לוס אנג׳לס.', maps: map('Disneyland Park Anaheim') },
      { id: 'a-universal', name: 'Universal Studios Hollywood', category: 'אטרקציות', desc: 'פארק סרטים ומתקנים בלוס אנג׳לס.', maps: map('Universal Studios Hollywood') },
      { id: 'a-santamonica', name: 'Santa Monica Pier', category: 'אטרקציות', desc: 'מזח עם גלגל ענק וחוף בלוס אנג׳לס.', maps: map('Santa Monica Pier') },
      { id: 'a-griffith', name: 'Griffith Observatory', category: 'אטרקציות', desc: 'מצפה כוכבים עם נוף לשלט הוליווד.', maps: map('Griffith Observatory') },
      { id: 'a-sdzoo', name: 'San Diego Zoo', category: 'אטרקציות', desc: 'מגני החיות המובילים בעולם.', maps: map('San Diego Zoo') },
      { id: 'a-balboa', name: 'Balboa Park', category: 'אטרקציות', desc: 'פארק ענק עם מוזיאונים וגנים בסן דייגו.', maps: map('Balboa Park San Diego') },
      { id: 'a-legoland', name: 'Legoland California', category: 'אטרקציות', desc: 'פארק לילדים בקרלסבד, מצוין לגילי 5–8.', maps: map('Legoland California Carlsbad') },
      { id: 'a-seaworld', name: 'SeaWorld San Diego', category: 'אטרקציות', desc: 'פארק ימי עם מופעים ומתקנים.', maps: map('SeaWorld San Diego') },
      { id: 'a-lajolla', name: 'La Jolla Cove', category: 'אטרקציות', desc: 'מפרץ יפהפה עם כלבי ים ואריות ים.', maps: map('La Jolla Cove') },
      { id: 'a-coronado', name: 'Coronado Beach', category: 'אטרקציות', desc: 'חוף רחב עם מלון היסטורי בסן דייגו.', maps: map('Coronado Beach San Diego') },
      { id: 'a-midway', name: 'USS Midway Museum', category: 'אטרקציות', desc: 'מוזיאון נושאת מטוסים בנמל סן דייגו.', maps: map('USS Midway Museum') },
      { id: 'a-cabrillo', name: 'Cabrillo National Monument', category: 'אטרקציות', desc: 'מגדלור, תצפיות ובריכות גאות בפוינט לומה.', maps: map('Cabrillo National Monument San Diego') },
      { id: 'a-whales', name: 'שיט צפייה בלוויתנים', category: 'אטרקציות', desc: 'הגירת הלוויתנים האפורים מול סן דייגו, דצמבר עד אפריל.', maps: map('San Diego whale watching Embarcadero') },
      { id: 'a-safaripark', name: 'San Diego Zoo Safari Park', category: 'אטרקציות', desc: 'ספארי פתוח באסקונדידו, שונה מגן החיות.', maps: map('San Diego Zoo Safari Park Escondido') },
      { id: 'a-belmont', name: 'Belmont Park (Mission Beach)', category: 'אטרקציות', desc: 'פארק שעשועים היסטורי על החוף, רכבת הרים וארקייד.', maps: map('Belmont Park San Diego') },
      { id: 'a-oldtown', name: 'Old Town San Diego', category: 'אטרקציות', desc: 'הרובע המקסיקני ההיסטורי, אוכל ומזכרות.', maps: map('Old Town San Diego State Historic Park') },
      { id: 'a-joshua', name: 'Joshua Tree National Park', category: 'אטרקציות', desc: 'פארק מדבר עם סלעי ענק ועצי יוש׳ואה, העצירה המרכזית במסע הכביש.', maps: map('Joshua Tree National Park') },
      { id: 'a-calico', name: 'Calico Ghost Town', category: 'אטרקציות', desc: 'עיירת רפאים משוחזרת מימי מכרות הכסף, עצירה על I-15.', maps: map('Calico Ghost Town Yermo') },
      { id: 'a-sevenmagic', name: 'Seven Magic Mountains', category: 'אטרקציות', desc: 'מיצג עמודי סלע צבעוניים ממש לפני לאס וגאס.', maps: map('Seven Magic Mountains Las Vegas') },
      { id: 'a-mojave', name: 'Mojave National Preserve / Kelso Dunes (גיבוי)', category: 'אטרקציות', desc: 'שמורת מדבר עם דיונות חול "שרות", עצירת גיבוי בדרך לוגאס.', maps: map('Kelso Dunes Mojave National Preserve') },
      { id: 'a-strip', name: 'Las Vegas Strip', category: 'אטרקציות', desc: 'שדרת המלונות והאורות של לאס וגאס.', maps: map('Las Vegas Strip') },
      { id: 'a-bellagio', name: 'Bellagio Fountains', category: 'אטרקציות', desc: 'מופע מזרקות מים מול מלון בלאג׳יו.', maps: map('Bellagio Fountains Las Vegas') },
      { id: 'a-grandcanyon', name: 'Grand Canyon (West)', category: 'אטרקציות', desc: 'הקניון הגדול, טיול יום מלאס וגאס.', maps: map('Grand Canyon West') },
      { id: 'a-hoover', name: 'Hoover Dam', category: 'אטרקציות', desc: 'סכר ענק כ־45 דקות מלאס וגאס.', maps: map('Hoover Dam') },
      { id: 'a-outlets', name: 'Las Vegas Premium Outlets', category: 'קניות', desc: 'מרכזי אאוטלט גדולים בלאס וגאס.', maps: map('Las Vegas North Premium Outlets') }
    ],
    mapPoints: [
      { name: 'שדה התעופה LAX', type: 'attraction', coords: [33.9416, -118.4085], maps: map('Los Angeles International Airport') },
      { name: 'Park Plaza Lodge · מלון 18–20.12', type: 'hotel', coords: [34.0555, -118.3620], maps: map('Park Plaza Lodge Hotel Los Angeles') },
      { name: 'Santa Monica Pier', type: 'attraction', coords: [34.0094, -118.4973], maps: map('Santa Monica Pier') },
      { name: 'Disneyland (אנהיים)', type: 'attraction', coords: [33.8121, -117.9190], maps: map('Disneyland Park Anaheim') },
      { name: 'בית משפחת רומנו · סן דייגו', type: 'hotel', coords: [32.7157, -117.1611], maps: map('San Diego CA') },
      { name: 'San Diego Zoo', type: 'attraction', coords: [32.7353, -117.1490], maps: map('San Diego Zoo') },
      { name: 'Balboa Park', type: 'attraction', coords: [32.7341, -117.1446], maps: map('Balboa Park San Diego') },
      { name: 'La Jolla Cove', type: 'attraction', coords: [32.8508, -117.2713], maps: map('La Jolla Cove') },
      { name: 'Coronado Beach', type: 'attraction', coords: [32.6859, -117.1831], maps: map('Coronado Beach San Diego') },
      { name: 'Legoland California', type: 'attraction', coords: [33.1264, -117.3110], maps: map('Legoland California Carlsbad') },
      { name: 'USS Midway Museum', type: 'attraction', coords: [32.7137, -117.1751], maps: map('USS Midway Museum') },
      { name: 'Cabrillo National Monument', type: 'attraction', coords: [32.6722, -117.2416], maps: map('Cabrillo National Monument San Diego') },
      { name: 'San Diego Zoo Safari Park', type: 'attraction', coords: [33.0975, -116.9964], maps: map('San Diego Zoo Safari Park Escondido') },
      { name: 'Belmont Park (Mission Beach)', type: 'attraction', coords: [32.7706, -117.2519], maps: map('Belmont Park San Diego') },
      { name: 'Old Town San Diego', type: 'attraction', coords: [32.7545, -117.1972], maps: map('Old Town San Diego State Historic Park') },
      { name: 'Joshua Tree National Park', type: 'attraction', coords: [33.8734, -115.9010], maps: map('Joshua Tree National Park') },
      { name: 'Calico Ghost Town', type: 'attraction', coords: [34.9486, -116.8644], maps: map('Calico Ghost Town Yermo') },
      { name: 'Kelso Dunes (Mojave) · גיבוי', type: 'attraction', coords: [34.8917, -115.7089], maps: map('Kelso Dunes Mojave National Preserve') },
      { name: 'Seven Magic Mountains', type: 'attraction', coords: [35.8449, -115.2707], maps: map('Seven Magic Mountains Las Vegas') },
      { name: 'לאס וגאס · הסטריפ', type: 'hotel', coords: [36.1147, -115.1728], maps: map('Las Vegas Strip') },
      { name: 'Grand Canyon (West)', type: 'attraction', coords: [36.0104, -113.8110], maps: map('Grand Canyon West') },
      { name: 'Hoover Dam', type: 'attraction', coords: [36.0161, -114.7377], maps: map('Hoover Dam') },
      { name: 'Harry Reid Airport · LAS', type: 'attraction', coords: [36.0840, -115.1537], maps: map('Harry Reid International Airport Las Vegas') }
    ],
    routePath: [
      [33.9416, -118.4085],
      [34.0555, -118.3620],
      [32.7157, -117.1611],
      [33.8734, -115.9010],
      [34.9486, -116.8644],
      [35.8449, -115.2707],
      [36.1147, -115.1728],
      [36.0840, -115.1537]
    ]
  };
})();
