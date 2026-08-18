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
    weather: options.weather || { label: 'San Diego weather', href: wx.sd }
  });

  window.DEFAULT_TRIP = {
    version: 1,
    title: 'Christmas in the US',
    subtitle: 'The Ganam family in the US, visiting the Romano family in San Diego',
    lastUpdated: '8/18/2026, 06:30',
    dateLabel: 'December 18, 2026 - January 4, 2027',
    startDate: '2026-12-18',
    endDate: '2027-01-04',
    routeLabel: 'Los Angeles > San Diego > Las Vegas',
    travelers: 'Ganam family (2 adults, 2 kids). In San Diego, together with the Romano family: 4 adults and 5 kids.',
    notes: 'A winter break in the US: a few days in Los Angeles, Christmas in San Diego with the Romano family, a national-parks road trip, and Las Vegas for New Year.',
    flights: [
      {
        id: 'outbound', direction: 'Outbound', airline: 'EL AL', flightNumber: 'LY 5',
        from: 'Tel Aviv (TLV)', to: 'Los Angeles (LAX)', date: 'Friday, Dec 18',
        depart: '00:45', arrive: '06:00', duration: 'About 15h 15m',
        status: 'Confirmed', note: 'Long direct flight. Get to the airport well ahead of time. Morning landing in Los Angeles, then pick up the Avis car right after arrival.'
      },
      {
        id: 'lv-lax', direction: 'Internal', airline: 'EL AL', flightNumber: 'LY 4479',
        from: 'Las Vegas (LAS)', to: 'Los Angeles (LAX)', date: 'Monday, Jan 4',
        depart: '09:10', arrive: '10:26', duration: 'About 1h 16m',
        status: 'Confirmed', note: 'Short internal hop from Las Vegas to Los Angeles on the morning of the return day, before the flight home.'
      },
      {
        id: 'return', direction: 'Return', airline: 'EL AL', flightNumber: 'LY 6',
        from: 'Los Angeles (LAX)', to: 'Tel Aviv (TLV)', date: 'Monday, Jan 4 - Tuesday, Jan 5',
        depart: '14:00', arrive: '13:55 (+1)', duration: 'About 13h 55m',
        status: 'Confirmed', note: 'Direct flight home, landing in Israel Tuesday afternoon. Enough of a buffer between the Vegas landing and the flight home.'
      }
    ],
    lodgings: [
      {
        id: 'park-plaza', name: 'Park Plaza Lodge Hotel', nativeName: 'Los Angeles - 2 nights',
        dates: 'December 18-20 - 2 nights', location: 'Los Angeles, CA',
        checkIn: 'Fri Dec 18', checkOut: 'Sun Dec 20', status: 'Booked',
        note: 'The first two nights in Los Angeles after landing. The Ganam family only here, before meeting the Romano family in San Diego. An easy settling-in day.',
        maps: map('Park Plaza Lodge Hotel Los Angeles'), waze: waze('Park Plaza Lodge Hotel Los Angeles'),
        website: '', weather: wx.la
      },
      {
        id: 'romano-house', name: 'Romano family home', nativeName: 'San Diego - family stay',
        dates: 'December 20-30 (approx)', location: 'San Diego, CA',
        checkIn: 'Sun Dec 20', checkOut: 'Depends on the road trip', status: 'Hosted',
        note: 'Staying with the Romano family in San Diego, the base for star-shaped day trips around the area. Christmas with the family.',
        maps: map('San Diego CA'), waze: waze('San Diego CA'),
        website: '', weather: wx.sd
      },
      {
        id: 'vegas-hotel', name: 'Las Vegas hotel', nativeName: 'Las Vegas - 3-4 nights',
        dates: 'December 31 - January 4 (approx)', location: 'Las Vegas Strip, NV',
        checkIn: 'To plan', checkOut: 'Mon Jan 4 - before the flight', status: 'To book',
        note: 'A Las Vegas hotel to close out the trip, including New Year\'s Eve. Not booked yet - pick a hotel on or near the Strip.',
        maps: map('Las Vegas Strip hotels'), waze: waze('Las Vegas Strip'),
        website: '', weather: wx.lv
      }
    ],
    fullRoute: {
      title: 'Cross-state route',
      subtitle: 'Los Angeles, a family visit in San Diego, and a parks road trip up to Las Vegas.',
      google: route('Los Angeles International Airport', 'Park Plaza Lodge Hotel Los Angeles', 'San Diego CA', 'Joshua Tree National Park', 'Las Vegas NV', 'Los Angeles International Airport'),
      stops: [
        { name: 'LAX airport', kind: 'Arrival & return', maps: map('Los Angeles International Airport') },
        { name: 'Los Angeles', kind: 'First stay', maps: map('Los Angeles CA') },
        { name: 'San Diego', kind: 'Family base', maps: map('San Diego CA') },
        { name: 'Parks en route', kind: 'Road trip', maps: map('Joshua Tree National Park') },
        { name: 'Las Vegas', kind: 'Finish & New Year', maps: map('Las Vegas NV') }
      ]
    },
    days: [
      day(1, 'Dec 18', 'Friday, December 18', 'Landing in Los Angeles', 'LAX > Avis > Park Plaza Lodge',
        'Arrival day: morning landing, car pickup, hotel check-in and an easy settling-in day after a long flight.',
        [['06:00', 'Land at LAX', 'Immigration, baggage claim and getting organized.', '🛬'], ['06:30', 'Pick up Avis car', 'Collect the rental car and leave the airport.', '🚗'], ['09:00', 'Breakfast and settle in', 'Early check-in or drop bags at Park Plaza Lodge.', '🥞'], ['16:00', 'Easy day', 'Recover from the flight, grab basic groceries, early night.', '😴']],
        ['Do not plan a big attraction on landing day - jet lag is real.', 'Make sure to have a car seat/booster for the kids in the rental.', 'Check the car and photograph its condition before leaving the airport.'],
        ['Los Angeles International Airport', 'Park Plaza Lodge Hotel Los Angeles'], { duration: 'Flight & arrival day', walking: 'Very little', weather: { label: 'Los Angeles weather', href: wx.la } }),

      day(2, 'Dec 19', 'Saturday, December 19', 'A day in Los Angeles', 'Los Angeles and around',
        'First full day in Los Angeles. Options to choose from depending on energy and jet-lag recovery.',
        [['09:30', 'Head out by choice', 'Pick one main attraction for the day.', '🌴'], ['13:00', 'Lunch', 'A relaxed stop.', '🍔'], ['16:00', 'Free afternoon', 'Boardwalk / shopping / beach depending on the weather.', '🛍️']],
        ['Options: Disneyland, Universal Studios, Santa Monica, Hollywood, Griffith Observatory.', 'For Disneyland/Universal, buy tickets ahead and arrive at opening.', 'Choose by distance and traffic - LA is spread out.'],
        ['Park Plaza Lodge Hotel Los Angeles', 'Santa Monica Pier'], { duration: 'Full day', walking: 'Moderate', badge: 'Decision needed', weather: { label: 'Los Angeles weather', href: wx.la }, places: ['Disneyland Park Anaheim', 'Universal Studios Hollywood', 'Santa Monica Pier', 'Griffith Observatory'] }),

      day(3, 'Dec 20', 'Sunday, December 20', 'Moving to San Diego', 'Los Angeles > San Diego - Romano family',
        'Check out of the LA hotel and drive south to San Diego (about two hours) to stay with the Romano family.',
        [['09:00', 'Check out and pack', 'Leave Park Plaza Lodge.', '🧳'], ['10:00', 'Drive to San Diego', 'About two hours south on I-5.', '🚗'], ['12:30', 'Arrive at the Romano family', 'Settle in, rest and family time.', '🏡'], ['17:00', 'Easy evening', 'Shared meal and getting to know the area.', '🍽️']],
        ['Coordinate an estimated arrival time with the Romano family.', 'Refuel and take breaks as needed with the kids.', 'Bring a small gift for the hosts.'],
        ['Park Plaza Lodge Hotel Los Angeles', 'San Diego CA'], { duration: 'Transfer day', walking: 'A little', badge: 'Transfer' }),

      day(4, 'Dec 21', 'Monday, December 21', 'San Diego: Zoo and Balboa Park', 'San Diego base',
        'A classic San Diego day: the famous zoo and Balboa Park with its museums and gardens.',
        [['09:30', 'San Diego Zoo', 'One of the world\'s top zoos.', '🦁'], ['13:00', 'Lunch', 'A break in the park.', '🥪'], ['15:00', 'Balboa Park', 'Gardens, museums and green space.', '🌳']],
        ['The zoo is big - comfortable shoes and a planned route.', 'Buy tickets ahead to save time at the gate.', 'Alternative idea: Safari Park in north county.'],
        ['San Diego Zoo', 'Balboa Park San Diego'], { duration: 'Full day', walking: 'A lot', places: ['San Diego Zoo Safari Park'] }),

      day(5, 'Dec 22', 'Tuesday, December 22', 'Beaches and La Jolla', 'San Diego base',
        'An easy beach day: La Jolla with the sea lions, and the famous Coronado Beach.',
        [['10:00', 'La Jolla Cove', 'A beautiful cove with seals and sea lions.', '🦭'], ['13:00', 'Lunch', 'A restaurant with a sea view.', '🦞'], ['15:30', 'Coronado Beach', 'A wide beach with golden sand and a historic hotel.', '🏖️']],
        ['The sea is cold in December - mostly a beach walk, not swimming.', 'La Jolla: keep your distance from the seals.', 'Parking in Coronado is limited - arrive early.'],
        ['La Jolla Cove', 'Coronado Beach San Diego'], { duration: 'Full day', walking: 'Moderate', tone: 'sea' }),

      day(6, 'Dec 23', 'Wednesday, December 23', 'Legoland or SeaWorld', 'San Diego base',
        'A theme-park day for the kids: Legoland California (great for ages 5-8) or SeaWorld San Diego.',
        [['09:30', 'Arrive at opening', 'Get there early to beat the lines.', '🎢'], ['13:00', 'Lunch in the park', 'A break and some rest.', '🍟'], ['16:00', 'More rides', 'A final loop before heading back.', '🧱']],
        ['Legoland is a great fit for the kids\' ages.', 'Check height/age rules for rides.', 'Buying tickets ahead saves time and money.'],
        ['Legoland California Carlsbad', 'SeaWorld San Diego'], { duration: 'Full day', walking: 'A lot', badge: 'Decision needed', places: ['SeaWorld San Diego'] }),

      day(7, 'Dec 24', 'Thursday, December 24', 'Christmas Eve', 'San Diego - Romano family',
        'Christmas Eve with the Romano family. A relaxed family day with a holiday feel.',
        [['11:00', 'Free morning', 'Relaxed family time.', '☕'], ['14:00', 'Holiday prep', 'Help with preparations, last-minute shopping.', '🎄'], ['18:00', 'Christmas Eve', 'A festive dinner with the hosts.', '🕯️']],
        ['Many shops and services close early on Dec 24.', 'Arrange small gifts for the kids in advance.', 'Check opening hours for any attraction on the holiday.'],
        ['San Diego CA'], { duration: 'Family day', walking: 'Optional', badge: 'Holiday', tone: 'gold' }),

      day(8, 'Dec 25', 'Friday, December 25', 'Christmas Day', 'San Diego - Romano family',
        'Christmas Day. Most attractions are closed - a family day at home and around the neighborhood.',
        [['09:00', 'Christmas morning', 'Opening gifts and family time.', '🎁'], ['13:00', 'Christmas lunch', 'A big shared meal.', '🍗'], ['16:00', 'Short outing', 'A walk around the neighborhood or an open park.', '🚶']],
        ['Most businesses are closed on Dec 25 - do not plan paid attractions.', 'Traffic is light.', 'A good day to rest between the touring days.'],
        ['San Diego CA'], { duration: 'Holiday', walking: 'Light', badge: 'Holiday', tone: 'clay' }),

      day(9, 'Dec 26', 'Saturday, December 26', 'Harbor, museums and downtown', 'San Diego base',
        'A city day in San Diego: the harbor area, the USS Midway aircraft carrier and downtown (Gaslamp / Seaport).',
        [['10:00', 'USS Midway Museum', 'A historic aircraft carrier to explore.', '🛩️'], ['13:00', 'Seaport Village', 'Lunch and a walk by the water.', '⚓'], ['16:00', 'Downtown', 'Gaslamp Quarter, shops and coffee.', '🏙️']],
        ['The USS Midway is fascinating for kids and adults.', 'Parking downtown - use a proper garage.', 'You can add a short bay cruise.'],
        ['USS Midway Museum', 'Seaport Village San Diego'], { duration: 'Full day', walking: 'Moderate' }),

      day(10, 'Dec 27', 'Sunday, December 27', 'Point Loma, tide pools and whales', 'San Diego base',
        'A coast-and-views day at Point Loma: Cabrillo with its tide pools and lighthouse, and in winter a gray-whale-watching cruise during migration season.',
        [['09:30', 'Cabrillo National Monument', 'Historic lighthouse, bay views and tide pools.', '🔭'], ['12:00', 'Lunch', 'A break in the Point Loma area.', '🌮'], ['14:00', 'Whale-watching cruise', 'Gray whale migration season, December to April.', '🐋'], ['16:30', 'Sunset Cliffs', 'Cliffs and a sunset over the ocean.', '🌅']],
        ['Tide pools are best at low tide - check the tide chart ahead.', 'Whale watching: book ahead and dress warm, it is cold and windy at sea in winter.', 'At Sunset Cliffs, keep the kids away from the cliff edge.'],
        ['San Diego CA', 'Cabrillo National Monument San Diego', 'Sunset Cliffs Natural Park'], { duration: 'Full day', walking: 'Moderate', tone: 'sea' }),

      day(11, 'Dec 28', 'Monday, December 28', 'Safari Park in north county', 'San Diego base > Escondido',
        'A different kind of animal day from the zoo: San Diego Zoo Safari Park in Escondido, with savanna expanses, a safari tram and animal encounters. About 45 minutes north of San Diego.',
        [['09:00', 'Drive to Escondido', 'About 45 minutes north.', '🚗'], ['10:00', 'Safari Park', 'Savanna zones with giraffes, rhinos and elephants.', '🦒'], ['13:00', 'Lunch and rest', 'A lunch break in the park.', '🥪'], ['15:00', 'More of the route', 'The kids\' area, animal encounters and viewpoints.', '🦏']],
        ['The park is large and remote - plan a full day and wear comfortable shoes.', 'Check feeding times and shows ahead.', 'The Africa Tram is included and is the highlight for the kids.'],
        ['San Diego CA', 'San Diego Zoo Safari Park Escondido'], { duration: 'Full day', walking: 'A lot' }),

      day(12, 'Dec 29', 'Tuesday, December 29', 'Mission Beach, Belmont Park and Old Town', 'San Diego base',
        'A last fun day in San Diego before the road trip: a beachfront amusement park, the historic Old Town with tacos, and prepping the car for tomorrow.',
        [['10:00', 'Belmont Park', 'A historic beachfront amusement park at Mission Beach, roller coaster and arcade.', '🎢'], ['13:00', 'Old Town San Diego', 'The historic Mexican quarter, tacos and souvenirs.', '🌮'], ['16:00', 'Free time', 'A short rest.', '☕'], ['18:00', 'Road-trip prep', 'Pack, buy snacks and get the car ready to leave for Vegas tomorrow.', '🧳']],
        ['Belmont Park: free entry, pay per ride - a great fit for the kids\' ages.', 'Old Town is walkable and tasty - real Mexican food.', 'Refuel and check the car tonight, and confirm the Vegas hotel before leaving.'],
        ['San Diego CA', 'Belmont Park San Diego', 'Old Town San Diego State Historic Park'], { duration: 'Full day', walking: 'Moderate' }),

      day(13, 'Dec 30', 'Wednesday, December 30', 'Road trip: Joshua Tree', 'San Diego > Joshua Tree > Twentynine Palms',
        'Leave San Diego and start the road trip to Vegas. Stop at Joshua Tree National Park for a half day of giant boulders and short hikes, and overnight in Twentynine Palms by the park.',
        [['08:00', 'Leave San Diego', 'Start early, about 3 hours to the park.', '🚗'], ['11:00', 'Joshua Tree', 'Giant boulders and Joshua trees.', '🌵'], ['11:30', 'Hidden Valley', 'A short, easy loop (about 1 mile), perfect for kids.', '🥾'], ['13:00', 'Skull Rock and Cholla Garden', 'Skull Rock and a photogenic cactus field.', '📸'], ['16:30', 'Overnight in Twentynine Palms', 'A night by the park before continuing to Vegas.', '🏨']],
        ['December days are pleasant but desert nights are freezing - warm layers and a hat.', 'No fuel or food inside the park - fill up on water and food before entering.', 'Cell coverage is weak in the park - download an offline map ahead.'],
        ['San Diego CA', 'Joshua Tree National Park', 'Twentynine Palms CA'], { duration: 'Drive & hike day', walking: 'Light to moderate', badge: 'Road trip', tone: 'clay', weather: { label: 'Joshua Tree weather', href: wx.jt } }),

      day(14, 'Dec 31', 'Thursday, December 31', 'Arriving in Las Vegas - New Year\'s Eve', 'Twentynine Palms > Calico > Seven Magic Mountains > Las Vegas',
        'Finish the road trip to Vegas with two fun stops along the way, and arrive in Las Vegas for New Year\'s Eve on the Strip.',
        [['08:30', 'Head toward Vegas', 'Get on I-15 north.', '🚗'], ['10:30', 'Calico Ghost Town', 'A restored silver-mining ghost town, fun for kids.', '🤠'], ['13:30', 'Seven Magic Mountains', 'Colorful stacked-rock art installation right before Vegas, a quick photo stop.', '🎨'], ['15:00', 'Check in to the Vegas hotel', 'Check-in and getting settled.', '🏨'], ['22:00', 'New Year\'s Eve', 'New Year celebrations on the Strip, fireworks at midnight.', '🎆']],
        ['The Strip closes to traffic on New Year\'s Eve - plan your spot and parking ahead.', 'Huge crowds at midnight - keep the kids close, and bring ear protection for the fireworks.', 'Seven Magic Mountains is free and about 10 minutes off the highway - a quick photo stop.'],
        ['Twentynine Palms CA', 'Calico Ghost Town', 'Seven Magic Mountains', 'Las Vegas Strip'], { duration: 'Drive & holiday evening', walking: 'Light', badge: 'New Year', tone: 'gold', weather: { label: 'Las Vegas weather', href: wx.lv } }),

      day(15, 'Jan 1', 'Friday, January 1', 'Las Vegas: the Strip', 'Las Vegas',
        'The first day of the year. A relatively relaxed day: themed hotels, fountains and shows on the Strip.',
        [['11:00', 'Easy morning', 'Rest after New Year\'s Eve.', '☕'], ['13:00', 'Hotel-hopping', 'Bellagio, Venetian, Caesars - lobbies and attractions.', '⛲'], ['16:00', 'Free time', 'Pool / shopping / rest.', '🛍️'], ['20:00', 'Evening on the Strip', 'Bellagio fountains and the lights.', '🌃']],
        ['Lots of free attractions on the Strip: fountains, themed lobbies.', 'Casinos are not for kids - plan a route through the family-friendly areas.', 'Kid ideas: High Roller, Adventuredome, Shark Reef.'],
        ['Las Vegas Strip', 'Bellagio Fountains'], { duration: 'Full day', walking: 'A lot', tone: 'gold', weather: { label: 'Las Vegas weather', href: wx.lv }, places: ['The Venetian Las Vegas', 'Adventuredome Las Vegas'] }),

      day(16, 'Jan 2', 'Saturday, January 2', 'Las Vegas or a Grand Canyon trip', 'Las Vegas',
        'A choice day: a long day trip to the Grand Canyon (or the closer Hoover Dam), or another day in Vegas.',
        [['08:00', 'Decide on the destination', 'Grand Canyon = a long day; Hoover Dam = a half day.', '🗺️'], ['12:00', 'Views and a walk', 'Breathtaking scenery.', '📸'], ['16:00', 'Back to Vegas', 'Drive back to the hotel.', '🚗']],
        ['Grand Canyon (West Rim) is about 2-3 hours from Vegas - a full day.', 'Hoover Dam is about 45 minutes from Vegas - a short, impressive alternative.', 'Bring water and warm clothes - it is cold at altitude in winter.'],
        ['Las Vegas NV', 'Grand Canyon West', 'Hoover Dam'], { duration: 'Full day', walking: 'Moderate', badge: 'Decision needed', tone: 'clay', weather: { label: 'Las Vegas weather', href: wx.lv } }),

      day(17, 'Jan 3', 'Sunday, January 3', 'Las Vegas: last day', 'Las Vegas',
        'A last full day in Vegas: a show, outlet shopping and packing for tomorrow\'s flight.',
        [['10:00', 'Free morning', 'Pool / rest.', '🏊'], ['13:00', 'Outlets', 'Shopping at the Las Vegas North/South Premium Outlets.', '🛍️'], ['18:00', 'Evening show', 'A family-friendly show on the Strip.', '🎭'], ['21:00', 'Packing', 'Prep for the early flight.', '🧳']],
        ['Family-friendly shows: Cirque du Soleil, magic shows.', 'Book show tickets ahead.', 'Pack and refuel the car tonight - the flight is early.'],
        ['Las Vegas Strip', 'Las Vegas North Premium Outlets'], { duration: 'Full day', walking: 'Moderate', tone: 'gold', weather: { label: 'Las Vegas weather', href: wx.lv } }),

      day(18, 'Jan 4', 'Monday, January 4', 'Flying home', 'Las Vegas > Los Angeles > Tel Aviv',
        'Return day: drop the car in Vegas, an internal flight to Los Angeles, and a direct flight to Tel Aviv.',
        [['06:00', 'Return Avis car', 'Drop-off in Las Vegas by 06:30.', '🚗'], ['07:00', 'Check in for LY4479', 'Security for the internal flight.', '🛫'], ['09:10', 'Flight to Los Angeles', 'LAS to LAX, about an hour and a quarter.', '✈️'], ['14:00', 'Flight LY6 to Tel Aviv', 'Direct flight home, landing Jan 5.', '🛬']],
        ['Confirm the Avis drop-off location (Las Vegas) ahead of time.', 'The gap between landing at LAX (10:26) and departure (14:00) - make sure there is enough time for the transfer.', 'Keep passports and boarding passes handy.'],
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
        provider: 'Avis', title: 'Rental car in the US',
        status: 'Confirmed', pickup: 'LAX airport - Dec 18 - 06:30',
        return: 'Las Vegas (LAS) - Jan 4 - 06:30',
        vehicle: 'Family car (confirm size and car seats)', deposit: 'Per Avis policy',
        requirements: 'Pick up at LAX right after landing and return in Las Vegas before the flight home (one-way rental). Requires an international license and the driver\'s credit card. Make sure to have a booster/car seat for the kids.',
        alertTitle: 'Confirm the drop-off location',
        warning: 'The Jan 4 drop-off at 06:30 must be in Las Vegas (LAS) to make the 09:10 flight. Verify with Avis that the booking is one-way LAX to LAS.',
        document: ''
      },
      weather: [
        { name: 'Los Angeles', dates: 'Dec 18-20', note: 'Mild winter, cool nights', href: wx.la },
        { name: 'San Diego', dates: 'Dec 20-30', note: 'Pleasant by day, cool in the evening', href: wx.sd },
        { name: 'Las Vegas', dates: 'Dec 31 - Jan 4', note: 'Cold in winter, especially at night', href: wx.lv }
      ]
    },
    documents: [
      { id: 'doc-flight', title: 'EL AL flights (LY5 / LY4479 / LY6)', category: 'Flights', status: 'Confirmed', note: 'Outbound LY5 on Dec 18 (TLV to LAX), internal LY4479 on Jan 4 (LAS to LAX), return LY6 on Jan 4 (LAX to TLV). The source document includes names and a confirmation code, so it is not published on the site.', href: '' },
      { id: 'doc-parkplaza', title: 'Park Plaza Lodge - Los Angeles', category: 'Lodging', status: 'Confirmed', note: 'December 18-20 - 2 nights in Los Angeles.', href: '' },
      { id: 'doc-romano', title: 'San Diego stay - Romano family', category: 'Lodging', status: 'Hosted', note: 'Staying with the Romano family in San Diego, roughly December 20-30.', href: '' },
      { id: 'doc-vegas', title: 'Las Vegas hotel', category: 'Lodging', status: 'To book', note: '3-4 nights to close out the trip, including New Year\'s Eve. Still to choose and book.', href: '' },
      { id: 'doc-car', title: 'Rental car - Avis', category: 'Transport', status: 'Confirmed', note: 'Pick up at LAX on Dec 18 and return in Las Vegas on Jan 4 (one-way). The reservation number is not published on the site.', href: '' },
      { id: 'doc-insurance', title: 'Travel insurance - Harel', category: 'Documents', status: 'To update', note: 'Harel travel health insurance, Ganam family. The policy details for this trip are to be updated. 24h Harel emergency hotline.', href: '' }
    ],
    attractions: [
      { id: 'a-disneyland', name: 'Disneyland (Anaheim)', category: 'Attractions', desc: 'The classic theme park, near Los Angeles.', maps: map('Disneyland Park Anaheim') },
      { id: 'a-universal', name: 'Universal Studios Hollywood', category: 'Attractions', desc: 'Movie park and rides in Los Angeles.', maps: map('Universal Studios Hollywood') },
      { id: 'a-santamonica', name: 'Santa Monica Pier', category: 'Attractions', desc: 'A pier with a Ferris wheel and beach in LA.', maps: map('Santa Monica Pier') },
      { id: 'a-griffith', name: 'Griffith Observatory', category: 'Attractions', desc: 'An observatory with a view of the Hollywood sign.', maps: map('Griffith Observatory') },
      { id: 'a-sdzoo', name: 'San Diego Zoo', category: 'Attractions', desc: 'One of the world\'s top zoos.', maps: map('San Diego Zoo') },
      { id: 'a-balboa', name: 'Balboa Park', category: 'Attractions', desc: 'A huge park with museums and gardens in San Diego.', maps: map('Balboa Park San Diego') },
      { id: 'a-legoland', name: 'Legoland California', category: 'Attractions', desc: 'A kids\' park in Carlsbad, great for ages 5-8.', maps: map('Legoland California Carlsbad') },
      { id: 'a-seaworld', name: 'SeaWorld San Diego', category: 'Attractions', desc: 'A marine park with shows and rides.', maps: map('SeaWorld San Diego') },
      { id: 'a-lajolla', name: 'La Jolla Cove', category: 'Attractions', desc: 'A beautiful cove with seals and sea lions.', maps: map('La Jolla Cove') },
      { id: 'a-coronado', name: 'Coronado Beach', category: 'Attractions', desc: 'A wide beach with a historic hotel in San Diego.', maps: map('Coronado Beach San Diego') },
      { id: 'a-midway', name: 'USS Midway Museum', category: 'Attractions', desc: 'An aircraft-carrier museum in San Diego harbor.', maps: map('USS Midway Museum') },
      { id: 'a-cabrillo', name: 'Cabrillo National Monument', category: 'Attractions', desc: 'Lighthouse, viewpoints and tide pools at Point Loma.', maps: map('Cabrillo National Monument San Diego') },
      { id: 'a-whales', name: 'Whale-watching cruise', category: 'Attractions', desc: 'Gray whale migration off San Diego, December to April.', maps: map('San Diego whale watching Embarcadero') },
      { id: 'a-safaripark', name: 'San Diego Zoo Safari Park', category: 'Attractions', desc: 'An open safari in Escondido, different from the zoo.', maps: map('San Diego Zoo Safari Park Escondido') },
      { id: 'a-belmont', name: 'Belmont Park (Mission Beach)', category: 'Attractions', desc: 'A historic beachfront amusement park, coaster and arcade.', maps: map('Belmont Park San Diego') },
      { id: 'a-oldtown', name: 'Old Town San Diego', category: 'Attractions', desc: 'The historic Mexican quarter, food and souvenirs.', maps: map('Old Town San Diego State Historic Park') },
      { id: 'a-joshua', name: 'Joshua Tree National Park', category: 'Attractions', desc: 'A desert park with giant boulders and Joshua trees, the main road-trip stop.', maps: map('Joshua Tree National Park') },
      { id: 'a-calico', name: 'Calico Ghost Town', category: 'Attractions', desc: 'A restored silver-mining ghost town, a stop on I-15.', maps: map('Calico Ghost Town Yermo') },
      { id: 'a-sevenmagic', name: 'Seven Magic Mountains', category: 'Attractions', desc: 'Colorful stacked-rock art installation right before Las Vegas.', maps: map('Seven Magic Mountains Las Vegas') },
      { id: 'a-mojave', name: 'Mojave National Preserve / Kelso Dunes (backup)', category: 'Attractions', desc: 'A desert preserve with singing sand dunes, a backup stop on the way to Vegas.', maps: map('Kelso Dunes Mojave National Preserve') },
      { id: 'a-strip', name: 'Las Vegas Strip', category: 'Attractions', desc: 'The hotel-and-lights boulevard of Las Vegas.', maps: map('Las Vegas Strip') },
      { id: 'a-bellagio', name: 'Bellagio Fountains', category: 'Attractions', desc: 'The water-fountain show in front of the Bellagio.', maps: map('Bellagio Fountains Las Vegas') },
      { id: 'a-grandcanyon', name: 'Grand Canyon (West)', category: 'Attractions', desc: 'The Grand Canyon, a day trip from Las Vegas.', maps: map('Grand Canyon West') },
      { id: 'a-hoover', name: 'Hoover Dam', category: 'Attractions', desc: 'A huge dam about 45 minutes from Las Vegas.', maps: map('Hoover Dam') },
      { id: 'a-outlets', name: 'Las Vegas Premium Outlets', category: 'Shopping', desc: 'Large outlet malls in Las Vegas.', maps: map('Las Vegas North Premium Outlets') }
    ],
    mapPoints: [
      { name: 'LAX airport', type: 'attraction', coords: [33.9416, -118.4085], maps: map('Los Angeles International Airport') },
      { name: 'Park Plaza Lodge - hotel Dec 18-20', type: 'hotel', coords: [34.0555, -118.3620], maps: map('Park Plaza Lodge Hotel Los Angeles') },
      { name: 'Santa Monica Pier', type: 'attraction', coords: [34.0094, -118.4973], maps: map('Santa Monica Pier') },
      { name: 'Disneyland (Anaheim)', type: 'attraction', coords: [33.8121, -117.9190], maps: map('Disneyland Park Anaheim') },
      { name: 'Romano family home - San Diego', type: 'hotel', coords: [32.7157, -117.1611], maps: map('San Diego CA') },
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
      { name: 'Kelso Dunes (Mojave) - backup', type: 'attraction', coords: [34.8917, -115.7089], maps: map('Kelso Dunes Mojave National Preserve') },
      { name: 'Seven Magic Mountains', type: 'attraction', coords: [35.8449, -115.2707], maps: map('Seven Magic Mountains Las Vegas') },
      { name: 'Las Vegas - the Strip', type: 'hotel', coords: [36.1147, -115.1728], maps: map('Las Vegas Strip') },
      { name: 'Grand Canyon (West)', type: 'attraction', coords: [36.0104, -113.8110], maps: map('Grand Canyon West') },
      { name: 'Hoover Dam', type: 'attraction', coords: [36.0161, -114.7377], maps: map('Hoover Dam') },
      { name: 'Harry Reid Airport - LAS', type: 'attraction', coords: [36.0840, -115.1537], maps: map('Harry Reid International Airport Las Vegas') }
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
