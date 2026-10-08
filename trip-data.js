(() => {
  const map = query => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
  const route = (...points) => `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(points[0])}&destination=${encodeURIComponent(points.at(-1))}&waypoints=${points.slice(1, -1).map(encodeURIComponent).join('%7C')}&travelmode=driving`;
  const waze = query => `https://waze.com/ul?q=${encodeURIComponent(query)}&navigate=yes`;
  const wx = {
    la: 'https://www.meteoblue.com/en/weather/week/los-angeles_united-states-of-america_5368361',
    sd: 'https://www.meteoblue.com/en/weather/week/san-diego_united-states-of-america_5391811',
    lv: 'https://www.meteoblue.com/en/weather/week/las-vegas_united-states-of-america_5506956',
    sedona: 'https://www.meteoblue.com/en/weather/week/sedona_united-states-of-america_5313457',
    grca: 'https://www.nps.gov/grca/planyourvisit/weather.htm',
    zion: 'https://www.nps.gov/zion/planyourvisit/weather.htm'
  };
  const day = (number, shortDate, date, title, routeText, summary, schedule, tips, navPoints, options = {}) => ({
    id: `day-${number}`,
    number,
    shortDate,
    date,
    title,
    route: routeText,
    badge: options.badge || 'Planned',
    tone: options.tone || ['sea', 'forest', 'gold', 'clay'][number % 4],
    duration: options.duration || 'Easy day',
    walking: options.walking || 'Light walking',
    summary,
    heroFact: options.heroFact || 'Keeping a relaxed family pace with room for changes.',
    schedule: schedule.map(([time, title, detail, icon]) => ({ time, title, detail, icon })),
    tips,
    navigation: {
      full: navPoints.length > 1 ? route(...navPoints) : map(navPoints[0]),
      legs: navPoints.concat(options.places || []).map(point => {
        const p = typeof point === 'string' ? { label: point } : point;
        return { label: p.label, sub: 'Navigate', waze: p.waze || waze(p.label), maps: p.maps || map(p.label) };
      })
    },
    weather: options.weather || { label: 'Weather', href: wx.lv }
  });

  window.DEFAULT_TRIP = {
    version: 1,
    title: 'Christmas in the US',
    subtitle: 'The Ganam family in the US, visiting the Romano family in San Diego',
    lastUpdated: '08/10/2026, 05:15',
    dateLabel: '18/12/2026 - 04/01/2027',
    startDate: '2026-12-18',
    endDate: '2027-01-04',
    routeLabel: 'Los Angeles > San Diego > Sedona > Grand Canyon > Zion > Las Vegas',
    travelers: 'Ganam family (2 adults, 2 kids). From San Diego onward the Romano family travels with us - two families together, 4 adults and 5 kids, through the road trip and Las Vegas.',
    notes: 'A winter break in the US: Los Angeles, Christmas in San Diego with the Romano family, a national-parks road trip (Sedona, Grand Canyon, Zion), and Las Vegas for New Year.',
    flights: [
      {
        id: 'outbound', direction: 'Outbound', airline: 'EL AL', flightNumber: 'LY 5',
        from: 'Tel Aviv (TLV)', to: 'Los Angeles (LAX)', date: 'Friday, 18/12/2026',
        depart: '00:45', arrive: '06:00', duration: 'About 15h 15m',
        status: 'Confirmed', note: 'Long direct flight. Get to the airport well ahead of time. Morning landing in Los Angeles, then pick up the first rental car right after arrival.'
      },
      {
        id: 'sd-phx', direction: 'Internal', airline: 'To book', flightNumber: 'TBD',
        from: 'San Diego (SAN)', to: 'Phoenix (PHX)', date: 'Sunday, 27/12/2026',
        depart: 'TBD', arrive: 'TBD', duration: 'About 1h 10m',
        status: 'To book', note: 'Short hop to reposition for the road trip. Return the first rental car in San Diego before this flight and pick up a new car in Phoenix. Still to book for 4 adults + 4 paying seats (infant on lap).'
      },
      {
        id: 'lv-lax', direction: 'Internal', airline: 'EL AL', flightNumber: 'LY 4479',
        from: 'Las Vegas (LAS)', to: 'Los Angeles (LAX)', date: 'Monday, 04/01/2027',
        depart: '09:10', arrive: '10:26', duration: 'About 1h 16m',
        status: 'Confirmed', note: 'Short internal hop from Las Vegas to Los Angeles on the morning of the return day, before the flight home.'
      },
      {
        id: 'return', direction: 'Return', airline: 'EL AL', flightNumber: 'LY 6',
        from: 'Los Angeles (LAX)', to: 'Tel Aviv (TLV)', date: 'Monday 04/01 - Tuesday 05/01/2027',
        depart: '14:00', arrive: '13:55 (+1)', duration: 'About 13h 55m',
        status: 'Confirmed', note: 'Direct flight home, landing in Israel Tuesday afternoon. Enough of a buffer between the Vegas landing and the flight home.'
      }
    ],
    lodgings: [
      {
        id: 'park-plaza', name: 'Park Plaza Lodge Hotel', nativeName: 'Los Angeles - 2 nights',
        dates: '18/12 - 20/12/2026 - 2 nights', location: 'Los Angeles, CA',
        checkIn: 'Fri 18/12', checkOut: 'Sun 20/12', status: 'Booked',
        note: 'The first two nights in Los Angeles after landing. The Ganam family only here, before meeting the Romano family in San Diego.',
        maps: map('Park Plaza Lodge Hotel Los Angeles'), waze: waze('Park Plaza Lodge Hotel Los Angeles'),
        website: '', weather: wx.la
      },
      {
        id: 'romano-house', name: 'Romano family home', nativeName: 'San Diego - family stay',
        dates: '20/12 - 27/12/2026 (approx)', location: 'San Diego, CA',
        checkIn: 'Sun 20/12', checkOut: 'Sun 27/12 (fly to Phoenix)', status: 'Hosted',
        note: 'Staying with the Romano family in San Diego, the base for star-shaped day trips around the area. Christmas with the family. Both families then continue together on the road trip.',
        maps: map('San Diego CA'), waze: waze('San Diego CA'),
        website: '', weather: wx.sd
      },
      {
        id: 'sedona-stay', name: 'Sedona', nativeName: 'Road trip - 2 nights', 
        dates: '27/12 - 29/12/2026 - 2 nights', location: 'Sedona, AZ',
        checkIn: 'Sun 27/12', checkOut: 'Tue 29/12', status: 'To book',
        note: 'Two nights in Sedona among the red rocks, the first base of the road trip. To book.',
        maps: map('Sedona AZ hotels'), waze: waze('Sedona AZ'),
        website: '', weather: wx.sedona
      },
      {
        id: 'grandcanyon-stay', name: 'Grand Canyon (Tusayan / South Rim)', nativeName: 'Road trip - 1 night',
        dates: '29/12 - 30/12/2026 - 1 night', location: 'Grand Canyon South Rim, AZ',
        checkIn: 'Tue 29/12', checkOut: 'Wed 30/12', status: 'To book',
        note: 'One night by the South Rim (Tusayan or the park village) so you can catch sunset and sunrise. Book early - limited rooms in winter.',
        maps: map('Tusayan AZ hotels'), waze: waze('Tusayan AZ'),
        website: '', weather: wx.grca
      },
      {
        id: 'zion-stay', name: 'Zion (Springdale)', nativeName: 'Road trip - 2 nights',
        dates: '30/12/2026 - 01/01/2027 - 2 nights', location: 'Springdale, UT',
        checkIn: 'Wed 30/12', checkOut: 'Fri 01/01', status: 'To book',
        note: 'Two nights in Springdale at the gates of Zion, including a low-key New Year\'s Eve. To book.',
        maps: map('Springdale UT hotels'), waze: waze('Springdale UT'),
        website: '', weather: wx.zion
      },
      {
        id: 'vegas-hotel', name: 'Club Wyndham Grand Desert', nativeName: 'Las Vegas - 3 nights - 2-bedroom suite with kitchen',
        dates: '01/01 - 04/01/2027 - 3 nights', location: '265 East Harmon Avenue, Las Vegas, NV 89169',
        checkIn: 'Fri 01/01 - from 16:00', checkOut: 'Mon 04/01 - before 10:00', status: 'Booked',
        note: 'Non-smoking two-bedroom suite with a kitchen for both families together, just off the Strip near the Convention Center. Hotel phone 1-702-691-2600. Free cancellation until 29/12.',
        maps: map('Club Wyndham Grand Desert Las Vegas'), waze: waze('Club Wyndham Grand Desert Las Vegas'),
        website: '', weather: wx.lv
      }
    ],
    fullRoute: {
      title: 'Southwest road trip',
      subtitle: 'Fly San Diego to Phoenix, then drive the red-rock country: Sedona, the Grand Canyon and Zion, finishing in Las Vegas.',
      google: route('Phoenix Sky Harbor Airport', 'Sedona AZ', 'Grand Canyon South Rim Village', 'Zion National Park Springdale', 'Las Vegas NV'),
      stops: [
        { name: 'Los Angeles', kind: 'First stay', maps: map('Los Angeles CA') },
        { name: 'San Diego', kind: 'Family base', maps: map('San Diego CA') },
        { name: 'Sedona', kind: 'Red rocks', maps: map('Sedona AZ') },
        { name: 'Grand Canyon', kind: 'South Rim', maps: map('Grand Canyon South Rim Village') },
        { name: 'Zion', kind: 'New Year', maps: map('Zion National Park Springdale') },
        { name: 'Las Vegas', kind: 'Finish', maps: map('Las Vegas NV') }
      ]
    },
    days: [
      day(1, '18/12', 'Friday, 18/12/2026', 'Landing in Los Angeles', 'LAX > car > Park Plaza Lodge',
        'Arrival day: morning landing, car pickup, hotel check-in and an easy settling-in day after a long flight.',
        [['06:00', 'Land at LAX', 'Immigration, baggage claim and getting organized.', '🛬'], ['06:30', 'Pick up rental car', 'Collect the first rental car and leave the airport.', '🚗'], ['09:00', 'Breakfast and settle in', 'Early check-in or drop bags at Park Plaza Lodge.', '🥞'], ['16:00', 'Easy day', 'Recover from the flight, grab basic groceries, early night.', '😴']],
        ['Do not plan a big attraction on landing day - jet lag is real.', 'Make sure to have a car seat/booster for the kids in the rental.', 'Check the car and photograph its condition before leaving the airport.'],
        ['Los Angeles International Airport', 'Park Plaza Lodge Hotel Los Angeles'], { duration: 'Flight & arrival day', walking: 'Very little', weather: { label: 'Los Angeles weather', href: wx.la } }),

      day(2, '19/12', 'Saturday, 19/12/2026', 'Universal Studios Hollywood', 'Los Angeles > Universal Studios Hollywood',
        'A full day at Universal Studios Hollywood, built around the movie-set experiences: the famous Studio Tour through the real backlot, live shows and immersive worlds - rather than the thrill coasters.',
        [['08:30', 'Arrive at opening', 'Get there early and head to the Studio Tour before the lines build.', '🎬'], ['09:00', 'Studio Tour', 'Tram ride through the working backlot and real movie sets (the plane-crash set, Bates Motel, Jaws and more).', '🎥'], ['12:00', 'Lunch', 'A break in the park or at CityWalk.', '🍔'], ['13:30', 'Shows and immersive worlds', 'WaterWorld live stunt show, the Special Effects show, and the Harry Potter and Super Nintendo World lands.', '✨'], ['17:00', 'Easy finish', 'A last walk and back to the hotel.', '🌆']],
        ['The Studio Tour is the highlight for movie-set fans - do it first thing, before the lines.', 'Movie-set style over coasters: the WaterWorld stunt show, the Special Effects show, Hogwarts castle and Super Nintendo World. Transformers and King Kong (inside the tour) are immersive simulators, not coasters.', 'If you are skipping thrill rides, you can pass on Revenge of the Mummy (an indoor coaster).', 'Universal fills a full day. Buy tickets ahead and check for holiday-season crowds.'],
        ['Park Plaza Lodge Hotel Los Angeles', 'Universal Studios Hollywood'], { duration: 'Full day', walking: 'A lot', weather: { label: 'Los Angeles weather', href: wx.la }, places: ['Universal CityWalk Hollywood'] }),

      day(3, '20/12', 'Sunday, 20/12/2026', 'Moving to San Diego', 'Los Angeles > San Diego - Romano family',
        'Check out of the LA hotel and drive south to San Diego (about two hours) to stay with the Romano family.',
        [['09:00', 'Check out and pack', 'Leave Park Plaza Lodge.', '🧳'], ['10:00', 'Drive to San Diego', 'About two hours south on I-5.', '🚗'], ['12:30', 'Arrive at the Romano family', 'Settle in, rest and family time.', '🏡'], ['17:00', 'Easy evening', 'Shared meal and getting to know the area.', '🍽️']],
        ['Coordinate an estimated arrival time with the Romano family.', 'Refuel and take breaks as needed with the kids.', 'Bring a small gift for the hosts.'],
        ['Park Plaza Lodge Hotel Los Angeles', 'San Diego CA'], { duration: 'Transfer day', walking: 'A little', badge: 'Transfer' }),

      day(4, '21/12', 'Monday, 21/12/2026', 'San Diego: Zoo and Balboa Park', 'San Diego base',
        'A classic San Diego day: the famous zoo and Balboa Park with its museums and gardens.',
        [['09:30', 'San Diego Zoo', 'One of the world\'s top zoos.', '🦁'], ['13:00', 'Lunch', 'A break in the park.', '🥪'], ['15:00', 'Balboa Park', 'Gardens, museums and green space.', '🌳']],
        ['The zoo is big - comfortable shoes and a planned route.', 'Buy tickets ahead to save time at the gate.', 'Alternative idea: Safari Park in north county.'],
        ['San Diego Zoo', 'Balboa Park San Diego'], { duration: 'Full day', walking: 'A lot', weather: { label: 'San Diego weather', href: wx.sd }, places: ['San Diego Zoo Safari Park'] }),

      day(5, '22/12', 'Tuesday, 22/12/2026', 'Beaches and La Jolla', 'San Diego base',
        'An easy beach day: La Jolla with the sea lions, and the famous Coronado Beach.',
        [['10:00', 'La Jolla Cove', 'A beautiful cove with seals and sea lions.', '🦭'], ['13:00', 'Lunch', 'A restaurant with a sea view.', '🦞'], ['15:30', 'Coronado Beach', 'A wide beach with golden sand and a historic hotel.', '🏖️']],
        ['The sea is cold in December - mostly a beach walk, not swimming.', 'La Jolla: keep your distance from the seals.', 'Parking in Coronado is limited - arrive early.'],
        ['La Jolla Cove', 'Coronado Beach San Diego'], { duration: 'Full day', walking: 'Moderate', tone: 'sea', weather: { label: 'San Diego weather', href: wx.sd } }),

      day(6, '23/12', 'Wednesday, 23/12/2026', 'Legoland or SeaWorld', 'San Diego base',
        'A theme-park day for the kids: Legoland California (great for ages 5-8) or SeaWorld San Diego.',
        [['09:30', 'Arrive at opening', 'Get there early to beat the lines.', '🎢'], ['13:00', 'Lunch in the park', 'A break and some rest.', '🍟'], ['16:00', 'More rides', 'A final loop before heading back.', '🧱']],
        ['Legoland is a great fit for the kids\' ages.', 'Check height/age rules for rides.', 'Buying tickets ahead saves time and money.'],
        ['Legoland California Carlsbad', 'SeaWorld San Diego'], { duration: 'Full day', walking: 'A lot', badge: 'Decision needed', weather: { label: 'San Diego weather', href: wx.sd }, places: ['SeaWorld San Diego'] }),

      day(7, '24/12', 'Thursday, 24/12/2026', 'Christmas Eve', 'San Diego - Romano family',
        'Christmas Eve with the Romano family. A relaxed family day with a holiday feel.',
        [['11:00', 'Free morning', 'Relaxed family time.', '☕'], ['14:00', 'Holiday prep', 'Help with preparations, last-minute shopping.', '🎄'], ['18:00', 'Christmas Eve', 'A festive dinner with the hosts.', '🕯️']],
        ['Many shops and services close early on 24/12.', 'Arrange small gifts for the kids in advance.', 'Check opening hours for any attraction on the holiday.'],
        ['San Diego CA'], { duration: 'Family day', walking: 'Optional', badge: 'Holiday', tone: 'gold' }),

      day(8, '25/12', 'Friday, 25/12/2026', 'Christmas Day', 'San Diego - Romano family',
        'Christmas Day. Most attractions are closed - a family day at home and around the neighborhood.',
        [['09:00', 'Christmas morning', 'Opening gifts and family time.', '🎁'], ['13:00', 'Christmas lunch', 'A big shared meal.', '🍗'], ['16:00', 'Short outing', 'A walk around the neighborhood or an open park.', '🚶']],
        ['Most businesses are closed on 25/12 - do not plan paid attractions.', 'Traffic is light.', 'A good day to rest between the touring days.'],
        ['San Diego CA'], { duration: 'Holiday', walking: 'Light', badge: 'Holiday', tone: 'clay' }),

      day(9, '26/12', 'Saturday, 26/12/2026', 'Harbor, museums and downtown', 'San Diego base',
        'A city day in San Diego: the harbor area, the USS Midway aircraft carrier and downtown (Gaslamp / Seaport). Pack tonight for the early flight tomorrow.',
        [['10:00', 'USS Midway Museum', 'A historic aircraft carrier to explore.', '🛩️'], ['13:00', 'Seaport Village', 'Lunch and a walk by the water.', '⚓'], ['16:00', 'Downtown', 'Gaslamp Quarter, shops and coffee.', '🏙️'], ['19:00', 'Pack for the road trip', 'Bags ready for the morning flight to Phoenix.', '🧳']],
        ['The USS Midway is fascinating for kids and adults.', 'Pack tonight - tomorrow is a travel day.', 'Confirm the San Diego to Phoenix flight and the Phoenix rental car.'],
        ['USS Midway Museum', 'Seaport Village San Diego'], { duration: 'Full day', walking: 'Moderate', weather: { label: 'San Diego weather', href: wx.sd } }),

      day(10, '27/12', 'Sunday, 27/12/2026', 'Fly to Phoenix, drive to Sedona', 'San Diego > fly > Phoenix > Sedona',
        'The road trip begins: return the first car in San Diego, fly to Phoenix, pick up a new car, and drive north to Sedona with a stop at the Montezuma Castle cliff dwellings.',
        [['07:00', 'Return car in San Diego', 'Drop the first rental before the flight.', '🚗'], ['09:00', 'Fly San Diego to Phoenix', 'Short hop, then pick up the new rental car.', '✈️'], ['12:00', 'Montezuma Castle', 'A short, easy stop at well-preserved cliff dwellings off I-17.', '🏜️'], ['14:30', 'Drive to Sedona', 'Red Rock Scenic Byway into town.', '🌄'], ['16:00', 'Settle in Sedona', 'Check in and an easy first evening among the red rocks.', '🏨']],
        ['This swaps the one rental for two: return the first car in San Diego and pick up a new one in Phoenix (one-way to Las Vegas).', 'Montezuma Castle is a 10-minute walk - a perfect leg-stretch with the kids.', 'Sedona sits at about 4,300 ft - cool days and cold nights in winter.'],
        ['Phoenix Sky Harbor Airport', 'Montezuma Castle National Monument', 'Sedona AZ'], { duration: 'Fly & drive day', walking: 'Light', badge: 'Road trip', tone: 'clay', weather: { label: 'Sedona weather', href: wx.sedona }, places: ['Montezuma Castle National Monument'] }),

      day(11, '28/12', 'Monday, 28/12/2026', 'Sedona red rocks', 'Sedona',
        'A full day among Sedona\'s red rocks: scenic drives, easy family trails and the Chapel of the Holy Cross built into the rock.',
        [['09:30', 'Red Rock Scenic Byway', 'The SR-179 drive with pull-offs and views.', '🚙'], ['10:30', 'Bell Rock path', 'A short, flat, easy trail with big views.', '🥾'], ['12:30', 'Lunch in town', 'Sedona\'s shops and galleries.', '🌯'], ['14:30', 'Chapel of the Holy Cross', 'A striking chapel built into the red rock.', '⛪'], ['16:30', 'Sunset viewpoint', 'Airport Mesa or Oak Creek for the glow.', '🌅']],
        ['Mostly easy, flat trails that work for the kids - Bell Rock and the Chapel are good picks.', 'Layers: sunny by day, near freezing after sunset.', 'A jeep tour is an option if you want a guided red-rock adventure.'],
        ['Sedona AZ', 'Chapel of the Holy Cross Sedona', 'Bell Rock Sedona'], { duration: 'Full day', walking: 'Moderate', tone: 'clay', weather: { label: 'Sedona weather', href: wx.sedona }, places: ['Chapel of the Holy Cross Sedona', 'Red Rock Scenic Byway'] }),

      day(12, '29/12', 'Tuesday, 29/12/2026', 'Flagstaff and the Grand Canyon', 'Sedona > Flagstaff > Grand Canyon South Rim',
        'Drive up through Flagstaff to the Grand Canyon South Rim. Possible snow and real cold at altitude - and an unforgettable payoff at the rim.',
        [['08:30', 'Oak Creek Canyon drive', 'The scenic climb from Sedona to Flagstaff.', '🌲'], ['09:30', 'Flagstaff stop', 'Route 66 downtown and Lowell Observatory (where Pluto was found).', '🔭'], ['12:30', 'Drive to the South Rim', 'About 1.5 hours north to the canyon.', '🚗'], ['14:30', 'Grand Canyon South Rim', 'Mather Point, the Rim Trail and the village.', '🏞️'], ['16:45', 'Sunset at the rim', 'Then check in nearby for the night.', '🌇']],
        ['Flagstaff and the rim are around 7,000 ft - expect snow and ice; check road conditions and dress very warm.', 'Keep a close hold on the kids near the rim - no railings in many spots.', 'Short winter daylight: get to the rim with time before sunset.'],
        ['Sedona AZ', 'Flagstaff AZ', 'Grand Canyon South Rim Village'], { duration: 'Drive & sightseeing', walking: 'Moderate', badge: 'Road trip', tone: 'forest', weather: { label: 'Grand Canyon weather', href: wx.grca }, places: ['Lowell Observatory Flagstaff', 'Grand Canyon South Rim Village'] }),

      day(13, '30/12', 'Wednesday, 30/12/2026', 'Grand Canyon to Zion', 'Grand Canyon > Kanab > Zion (Springdale)',
        'A scenic driving day north into Utah, with a stop in the little western town of Kanab, arriving at the gates of Zion in Springdale.',
        [['08:30', 'Sunrise at the rim', 'One more look before leaving.', '🌄'], ['10:00', 'Drive north', 'US-89 across the high desert toward Utah.', '🚗'], ['13:00', 'Kanab, UT', 'Lunch in "Little Hollywood", an old western film town.', '🤠'], ['15:30', 'Into Zion / Springdale', 'Arrive at the park gateway town and check in.', '🏔️'], ['17:00', 'Easy evening', 'Settle in for two nights.', '🌙']],
        ['It is a long driving day (4-5 hours with stops) - break it up and keep snacks handy.', 'Winter roads: check conditions on US-89 and near Zion.', 'Springdale sits right at the park entrance - very walkable.'],
        ['Grand Canyon South Rim Village', 'Kanab UT', 'Springdale UT'], { duration: 'Drive day', walking: 'Light', badge: 'Road trip', tone: 'clay', weather: { label: 'Zion weather', href: wx.zion }, places: ['Kanab UT'] }),

      day(14, '31/12', 'Thursday, 31/12/2026', 'Zion National Park - New Year\'s Eve', 'Zion (Springdale)',
        'A full day in Zion among the towering canyon walls, then a low-key New Year\'s Eve in Springdale.',
        [['09:00', 'Zion Canyon Scenic Drive', 'In winter you can usually drive the canyon yourself (no shuttle).', '🚙'], ['10:30', 'Riverside Walk', 'A flat, paved, kid-friendly trail along the Virgin River.', '🥾'], ['12:30', 'Lunch in Springdale', 'Back in town for a warm break.', '🍲'], ['14:30', 'Lower Emerald Pools', 'A short, easy loop to the pools.', '💧'], ['19:00', 'New Year\'s Eve in Springdale', 'A quiet, cozy New Year with the families.', '🎆']],
        ['Winter Zion is cold and some high trails (Angels Landing, the Narrows) are limited - stick to the easy valley walks with the kids.', 'A low-key New Year in Springdale is far easier with young kids than the Vegas Strip at midnight.', 'Icy patches on shaded trails - traction cleats help.'],
        ['Zion National Park Springdale', 'Zion Canyon Visitor Center'], { duration: 'Full day', walking: 'Moderate', badge: 'New Year', tone: 'gold', weather: { label: 'Zion weather', href: wx.zion }, places: ['Zion Canyon Scenic Drive'] }),

      day(15, '01/01', 'Friday, 01/01/2027', 'Zion to Las Vegas - check in + Sphere', 'Zion (Springdale) > Las Vegas',
        'New Year\'s Day: drive from Zion to Las Vegas (about 2.75 hours), check in to Club Wyndham Grand Desert (from 16:00), and an evening that includes Backstreet Boys at Sphere for two of the adults.',
        [['10:00', 'Leave Zion', 'Scenic drive down I-15 through the Virgin River Gorge.', '🚗'], ['13:00', 'Into Las Vegas', 'Arrive and drop bags.', '🎰'], ['16:00', 'Check in to Club Wyndham Grand Desert', 'Two-bedroom suite just off the Strip.', '🏨'], ['19:00', 'Evening on the Strip', 'Bellagio fountains and the lights.', '🌃'], ['20:30', 'Backstreet Boys at Sphere', 'A night out for two of the adults at the Sphere while the others stay with the kids.', '🎤']],
        ['Check-in is from 16:00 - if you arrive earlier, leave bags and start on the Strip.', 'Backstreet Boys at Sphere is a night out for two of the adults - buy tickets ahead and confirm the exact show date.', 'The Virgin River Gorge on I-15 is a scenic stretch - easy drive in good weather.'],
        ['Springdale UT', 'Club Wyndham Grand Desert Las Vegas', 'Sphere Las Vegas'], { duration: 'Drive & arrival', walking: 'Moderate', tone: 'gold', weather: { label: 'Las Vegas weather', href: wx.lv }, places: ['Sphere Las Vegas', 'Las Vegas Strip'] }),

      day(16, '02/01', 'Saturday, 02/01/2027', 'Las Vegas: Valley of Fire or the Strip', 'Las Vegas',
        'A choice day: a half-day trip to the stunning Valley of Fire (or Hoover Dam), or a relaxed day on the Strip.',
        [['09:00', 'Decide on the day', 'Valley of Fire and Hoover Dam are both about an hour out.', '🗺️'], ['10:00', 'Valley of Fire', 'Red sandstone, easy trails and great photos.', '🏜️'], ['13:30', 'Back to Vegas', 'Lunch and rest.', '🍔'], ['16:00', 'Strip and pool', 'Free time, fountains, family-friendly spots.', '🛍️']],
        ['Valley of Fire (about 1 hour NE) is a gorgeous, easy red-rock park - a great family half-day.', 'Hoover Dam (about 45 minutes) is a shorter alternative.', 'Casinos are not for kids - stick to the family-friendly areas on the Strip.'],
        ['Las Vegas NV', 'Valley of Fire State Park'], { duration: 'Full day', walking: 'Moderate', badge: 'Decision needed', tone: 'clay', weather: { label: 'Las Vegas weather', href: wx.lv }, places: ['Valley of Fire State Park', 'Hoover Dam'] }),

      day(17, '03/01', 'Sunday, 03/01/2027', 'Las Vegas: last day', 'Las Vegas',
        'A last full day in Vegas: a show, outlet shopping and packing for tomorrow\'s flight.',
        [['10:00', 'Free morning', 'Pool / rest.', '🏊'], ['13:00', 'Outlets', 'Shopping at the Las Vegas North/South Premium Outlets.', '🛍️'], ['18:00', 'Evening show', 'A family-friendly show on the Strip.', '🎭'], ['21:00', 'Packing', 'Prep for the early flight.', '🧳']],
        ['Family-friendly shows: Cirque du Soleil, magic shows.', 'Book show tickets ahead.', 'Pack and refuel the car tonight - the flight is early.'],
        ['Las Vegas Strip', 'Las Vegas North Premium Outlets'], { duration: 'Full day', walking: 'Moderate', tone: 'gold', weather: { label: 'Las Vegas weather', href: wx.lv } }),

      day(18, '04/01', 'Monday, 04/01/2027', 'Flying home', 'Las Vegas > Los Angeles > Tel Aviv',
        'Return day: drop the car in Vegas, an internal flight to Los Angeles, and a direct flight to Tel Aviv.',
        [['06:00', 'Return rental car', 'Drop-off in Las Vegas by 06:30.', '🚗'], ['07:00', 'Check in for LY4479', 'Security for the internal flight.', '🛫'], ['09:10', 'Flight to Los Angeles', 'LAS to LAX, about an hour and a quarter.', '✈️'], ['14:00', 'Flight LY6 to Tel Aviv', 'Direct flight home, landing 05/01.', '🛬']],
        ['Confirm the rental drop-off location (Las Vegas) ahead of time.', 'The gap between landing at LAX (10:26) and departure (14:00) - make sure there is enough time for the transfer.', 'Keep passports and boarding passes handy.'],
        ['Harry Reid International Airport Las Vegas', 'Los Angeles International Airport'], { duration: 'Flight day', walking: 'A little', weather: { label: 'Las Vegas weather', href: wx.lv } })
    ],
    useful: {
      emergency: [
        { label: 'Emergency (police/ambulance/fire)', value: '911', href: 'tel:911' },
        { label: 'Israeli Consulate in Los Angeles', value: '+1-323-852-5500', href: 'tel:+13238525500' },
        { label: 'Harel insurance - 24h hotline', value: '+972-3-7547030', href: 'tel:+97237547030' },
        { label: 'Harel - WhatsApp 24h', value: '+972-52-7544589', href: 'https://wa.me/972527544589', caption: 'Tap to open WhatsApp' }
      ],
      carRental: {
        provider: 'Two rentals', title: 'Rental cars in the US',
        status: 'To rebook', pickup: 'Car 1: LAX, 18/12 06:30. Car 2: Phoenix, 27/12',
        return: 'Car 1: San Diego, 27/12. Car 2: Las Vegas, 04/01 06:30',
        vehicle: 'Large vehicle(s) for 9 people - minivan or large SUV', deposit: 'Per rental policy',
        requirements: 'The route change needs two rentals instead of one. Car 1: pick up at LAX on 18/12, use for LA and San Diego, return in San Diego on 27/12 before the Phoenix flight. Car 2: pick up in Phoenix on 27/12, one-way to Las Vegas, return at McCarran Rent A Car Center on 04/01. Each driver needs an international license and a credit card; bring car seats/boosters.',
        alertTitle: 'Rental cars need rebooking',
        warning: 'The original one-way Avis (LAX to Las Vegas) no longer matches the plan. It needs changing to LAX to San Diego (return 27/12), plus a new one-way Phoenix to Las Vegas rental. Confirm both before the trip.',
        document: ''
      },
      weather: [
        { name: 'Los Angeles', dates: '18/12 - 20/12', note: 'Mild winter, cool nights', href: wx.la },
        { name: 'San Diego', dates: '20/12 - 27/12', note: 'Pleasant by day, cool in the evening', href: wx.sd },
        { name: 'Sedona', dates: '27/12 - 29/12', note: 'Cool days, freezing nights (~4,300 ft)', href: wx.sedona },
        { name: 'Grand Canyon', dates: '29/12 - 30/12', note: 'Cold and snowy at ~7,000 ft', href: wx.grca },
        { name: 'Zion', dates: '30/12 - 01/01', note: 'Cold winter days, icy shaded trails', href: wx.zion },
        { name: 'Las Vegas', dates: '01/01 - 04/01', note: 'Cold in winter, especially at night', href: wx.lv }
      ]
    },
    documents: [
      { id: 'doc-flight', title: 'EL AL flights (LY5 / LY4479 / LY6)', category: 'Flights', status: 'Confirmed', note: 'Outbound LY5 on 18/12 (TLV to LAX), internal LY4479 on 04/01 (LAS to LAX), return LY6 on 04/01 (LAX to TLV). The source document includes names and a confirmation code, so it is not published on the site.', href: '' },
      { id: 'doc-sdphx', title: 'San Diego to Phoenix flight', category: 'Flights', status: 'To book', note: 'Short internal flight on 27/12 to start the road trip. Still to book for 4 adults + 4 paying seats (infant on lap).', href: '' },
      { id: 'doc-parkplaza', title: 'Park Plaza Lodge - Los Angeles', category: 'Lodging', status: 'Confirmed', note: '18/12 - 20/12 - 2 nights in Los Angeles.', href: '' },
      { id: 'doc-romano', title: 'San Diego stay - Romano family', category: 'Lodging', status: 'Hosted', note: 'Staying with the Romano family in San Diego, roughly 20/12 - 27/12.', href: '' },
      { id: 'doc-roadtrip-stays', title: 'Road-trip stays (Sedona, Grand Canyon, Zion)', category: 'Lodging', status: 'To book', note: 'Sedona 2 nights, Grand Canyon South Rim 1 night, Springdale (Zion) 2 nights. Book early - limited winter rooms near the parks.', href: '' },
      { id: 'doc-vegas', title: 'Club Wyndham Grand Desert - Las Vegas', category: 'Lodging', status: 'Confirmed', note: '01/01 - 04/01, 3 nights, non-smoking two-bedroom suite with kitchen. 265 East Harmon Avenue. Confirmation number kept off the public site.', href: '' },
      { id: 'doc-car', title: 'Rental cars (two one-ways)', category: 'Transport', status: 'To rebook', note: 'Car 1: LAX to San Diego (18/12 - 27/12). Car 2: Phoenix to Las Vegas (27/12 - 04/01). Reservation numbers kept off the public site.', href: '' },
      { id: 'doc-insurance', title: 'Travel insurance - Harel', category: 'Documents', status: 'To update', note: 'Harel travel health insurance, Ganam family. The policy details for this trip are to be updated. 24h Harel emergency hotline.', href: '' }
    ],
    attractions: [
      { id: 'a-universal', name: 'Universal Studios Hollywood', category: 'Los Angeles', desc: 'Movie park and the Studio Tour backlot in Los Angeles.', maps: map('Universal Studios Hollywood') },
      { id: 'a-disneyland', name: 'Disneyland (Anaheim)', category: 'Los Angeles', desc: 'The classic theme park, near Los Angeles.', maps: map('Disneyland Park Anaheim') },
      { id: 'a-santamonica', name: 'Santa Monica Pier', category: 'Los Angeles', desc: 'A pier with a Ferris wheel and beach in LA.', maps: map('Santa Monica Pier') },
      { id: 'a-griffith', name: 'Griffith Observatory', category: 'Los Angeles', desc: 'An observatory with a view of the Hollywood sign.', maps: map('Griffith Observatory') },
      { id: 'a-sdzoo', name: 'San Diego Zoo', category: 'San Diego', desc: 'One of the world\'s top zoos.', maps: map('San Diego Zoo') },
      { id: 'a-balboa', name: 'Balboa Park', category: 'San Diego', desc: 'A huge park with museums and gardens in San Diego.', maps: map('Balboa Park San Diego') },
      { id: 'a-legoland', name: 'Legoland California', category: 'San Diego', desc: 'A kids\' park in Carlsbad, great for ages 5-8.', maps: map('Legoland California Carlsbad') },
      { id: 'a-seaworld', name: 'SeaWorld San Diego', category: 'San Diego', desc: 'A marine park with shows and rides.', maps: map('SeaWorld San Diego') },
      { id: 'a-lajolla', name: 'La Jolla Cove', category: 'San Diego', desc: 'A beautiful cove with seals and sea lions.', maps: map('La Jolla Cove') },
      { id: 'a-coronado', name: 'Coronado Beach', category: 'San Diego', desc: 'A wide beach with a historic hotel in San Diego.', maps: map('Coronado Beach San Diego') },
      { id: 'a-midway', name: 'USS Midway Museum', category: 'San Diego', desc: 'An aircraft-carrier museum in San Diego harbor.', maps: map('USS Midway Museum') },
      { id: 'a-oldtown', name: 'Old Town San Diego', category: 'San Diego', desc: 'The historic Mexican quarter, food and souvenirs.', maps: map('Old Town San Diego State Historic Park') },
      { id: 'a-montezuma', name: 'Montezuma Castle National Monument', category: 'Road trip', desc: 'Well-preserved cliff dwellings off I-17, an easy stop between Phoenix and Sedona.', maps: map('Montezuma Castle National Monument') },
      { id: 'a-sedona', name: 'Sedona red rocks', category: 'Road trip', desc: 'Red-rock scenery, easy trails and the Red Rock Scenic Byway.', maps: map('Sedona AZ') },
      { id: 'a-chapel', name: 'Chapel of the Holy Cross', category: 'Road trip', desc: 'A striking chapel built into the red rock in Sedona.', maps: map('Chapel of the Holy Cross Sedona') },
      { id: 'a-flagstaff', name: 'Flagstaff / Lowell Observatory', category: 'Road trip', desc: 'Route 66 mountain town; Lowell Observatory, where Pluto was discovered.', maps: map('Lowell Observatory Flagstaff') },
      { id: 'a-grandcanyon', name: 'Grand Canyon South Rim', category: 'Road trip', desc: 'The South Rim: Mather Point, the Rim Trail and the village.', maps: map('Grand Canyon South Rim Village') },
      { id: 'a-kanab', name: 'Kanab, UT', category: 'Road trip', desc: 'A little western film town ("Little Hollywood") between the canyon and Zion.', maps: map('Kanab UT') },
      { id: 'a-zion', name: 'Zion National Park', category: 'Road trip', desc: 'Towering canyon walls and easy valley trails from Springdale.', maps: map('Zion National Park Springdale') },
      { id: 'a-strip', name: 'Las Vegas Strip', category: 'Las Vegas', desc: 'The hotel-and-lights boulevard of Las Vegas.', maps: map('Las Vegas Strip') },
      { id: 'a-sphere', name: 'Sphere', category: 'Las Vegas', desc: 'The Sphere venue - Backstreet Boys show on 01/01 for two of the adults.', maps: map('Sphere Las Vegas') },
      { id: 'a-valleyoffire', name: 'Valley of Fire State Park', category: 'Las Vegas', desc: 'Stunning red sandstone with easy trails, about an hour NE of Las Vegas.', maps: map('Valley of Fire State Park') },
      { id: 'a-hoover', name: 'Hoover Dam', category: 'Las Vegas', desc: 'A huge dam about 45 minutes from Las Vegas.', maps: map('Hoover Dam') },
      { id: 'a-bellagio', name: 'Bellagio Fountains', category: 'Las Vegas', desc: 'The water-fountain show in front of the Bellagio.', maps: map('Bellagio Fountains Las Vegas') },
      { id: 'a-outlets', name: 'Las Vegas Premium Outlets', category: 'Shopping', desc: 'Large outlet malls in Las Vegas.', maps: map('Las Vegas North Premium Outlets') }
    ],
    mapPoints: [
      { name: 'LAX airport', type: 'attraction', coords: [33.9416, -118.4085], maps: map('Los Angeles International Airport') },
      { name: 'Park Plaza Lodge - hotel 18-20/12', type: 'hotel', coords: [34.0555, -118.3620], maps: map('Park Plaza Lodge Hotel Los Angeles') },
      { name: 'Universal Studios Hollywood', type: 'attraction', coords: [34.1381, -118.3534], maps: map('Universal Studios Hollywood') },
      { name: 'Romano family home - San Diego', type: 'hotel', coords: [32.7157, -117.1611], maps: map('San Diego CA') },
      { name: 'San Diego Zoo', type: 'attraction', coords: [32.7353, -117.1490], maps: map('San Diego Zoo') },
      { name: 'Balboa Park', type: 'attraction', coords: [32.7341, -117.1446], maps: map('Balboa Park San Diego') },
      { name: 'La Jolla Cove', type: 'attraction', coords: [32.8508, -117.2713], maps: map('La Jolla Cove') },
      { name: 'Coronado Beach', type: 'attraction', coords: [32.6859, -117.1831], maps: map('Coronado Beach San Diego') },
      { name: 'Legoland California', type: 'attraction', coords: [33.1264, -117.3110], maps: map('Legoland California Carlsbad') },
      { name: 'USS Midway Museum', type: 'attraction', coords: [32.7137, -117.1751], maps: map('USS Midway Museum') },
      { name: 'Phoenix Sky Harbor Airport', type: 'attraction', coords: [33.4342, -112.0116], maps: map('Phoenix Sky Harbor Airport') },
      { name: 'Montezuma Castle', type: 'attraction', coords: [34.6117, -111.8350], maps: map('Montezuma Castle National Monument') },
      { name: 'Sedona - overnight 27-29/12', type: 'hotel', coords: [34.8697, -111.7610], maps: map('Sedona AZ') },
      { name: 'Flagstaff / Lowell Observatory', type: 'attraction', coords: [35.1983, -111.6513], maps: map('Lowell Observatory Flagstaff') },
      { name: 'Grand Canyon South Rim - overnight 29/12', type: 'hotel', coords: [36.0544, -112.1401], maps: map('Grand Canyon South Rim Village') },
      { name: 'Kanab, UT', type: 'attraction', coords: [37.0475, -112.5263], maps: map('Kanab UT') },
      { name: 'Zion / Springdale - overnight 30/12-01/01', type: 'hotel', coords: [37.1972, -112.9870], maps: map('Zion National Park Springdale') },
      { name: 'Valley of Fire State Park', type: 'attraction', coords: [36.4817, -114.5281], maps: map('Valley of Fire State Park') },
      { name: 'Las Vegas - Club Wyndham', type: 'hotel', coords: [36.1147, -115.1728], maps: map('Club Wyndham Grand Desert Las Vegas') },
      { name: 'Sphere (Backstreet Boys 01/01)', type: 'attraction', coords: [36.1211, -115.1620], maps: map('Sphere Las Vegas') },
      { name: 'Hoover Dam', type: 'attraction', coords: [36.0161, -114.7377], maps: map('Hoover Dam') },
      { name: 'Harry Reid Airport - LAS', type: 'attraction', coords: [36.0840, -115.1537], maps: map('Harry Reid International Airport Las Vegas') }
    ],
    routePath: [
      [33.9416, -118.4085],
      [34.0555, -118.3620],
      [32.7157, -117.1611],
      [33.4342, -112.0116],
      [34.8697, -111.7610],
      [36.0544, -112.1401],
      [37.1972, -112.9870],
      [36.1147, -115.1728]
    ]
  };
})();
