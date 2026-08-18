# Christmas in the US - family trip app

A static, mobile-friendly web app in English for the Ganam family's US trip, December 18, 2026 to January 4, 2027: Los Angeles, San Diego and Las Vegas.

## What's in the app

- Home screen with a countdown and the current day.
- A full day-by-day plan, from Los Angeles through San Diego to Las Vegas.
- EL AL flight details (LY5 / LY4479 / LY6).
- Stays: Park Plaza Lodge in Los Angeles, hosted by the Romano family in San Diego, and a Las Vegas hotel (to plan).
- Direct navigation, weather by location and emergency numbers.
- Recommended attractions in Los Angeles, San Diego, the road trip and Las Vegas.
- Local edit mode, with import/export of the trip data.
- PWA to keep the app shell available even on a weak connection.

## Run locally

```bash
python3 -m http.server 8080
```

Then open `http://localhost:8080`.

## Privacy

The source documents include traveler names, confirmation codes and reservation numbers, so they are not copied to the public site. Only a useful, redacted summary is kept in the app.

## Editing the plan

`trip-data.js` is the source of truth. You can also enable edit mode on the site; changes are saved in that browser's `localStorage` and can be exported to a JSON file.
