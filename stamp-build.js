// Stamps the deploy time (Israel) into the lastUpdated field of trip-data.js.
const fs = require('fs');

const file = 'trip-data.js';
const stamp = new Intl.DateTimeFormat('en-GB', {
  timeZone: 'Asia/Jerusalem',
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  hour12: false
}).format(new Date());

const source = fs.readFileSync(file, 'utf8');
const updated = source.replace(/lastUpdated: '[^']*'/, `lastUpdated: '${stamp}'`);
fs.writeFileSync(file, updated);
console.log('Stamped lastUpdated:', stamp);
