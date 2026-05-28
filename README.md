# Jersey Rent Tracker 🏠

**What does Jersey really pay?** Track property prices and rents across all 12 parishes — powered by gov.je open data and anonymous crowdsourced submissions from real tenants.

🔗 **Live site:** `https://YOUR_USERNAME.github.io/jersey-rent-tracker`

## Features

- **Purchase price trends** — Quarterly averages by property type (2002–2025) from Statistics Jersey
- **Private Sector Rental Index** — Advertised rent trends from HPI reports (2007–2025)
- **Parish choropleth map** — Leaflet + GeoJSON boundaries coloured by transaction volume
- **Crowdsourced rent data** — Anonymous submissions stored in Firebase Firestore
- **Parish turnover history** — Interactive tables and charts for all 12 parishes
- **Mobile-first** — Responsive design, works on all devices

## Data Sources

| Source | Type | Licence |
|--------|------|---------|
| [Statistics Jersey Open Data](https://opendata.gov.je/dataset/house-prices) | House Price Index, parish turnover | OGL Jersey v1.0 |
| [HPI Reports (Appendix B)](https://stats.je/statistic/house-prices/) | Private Sector Rental Index | OGL Jersey v1.0 |
| [FOI Response #4314](https://www.gov.je/Government/FreedomOfInformation/pages/foi.aspx?ReportID=4314) | Average rental prices 2002–2020 | Public record |
| Crowdsourced | Anonymous tenant submissions | User-contributed |

## Quick Start

```bash
# Clone
git clone https://github.com/YOUR_USERNAME/jersey-rent-tracker.git
cd jersey-rent-tracker

# Serve locally (any static server works)
python3 -m http.server 8000
# or
npx serve .
```

Open `http://localhost:8000` in your browser.

## Firebase Setup (for persistent crowdsourced data)

The app works without Firebase (falls back to localStorage), but for shared persistent data:

1. Create a [Firebase project](https://console.firebase.google.com/)
2. Enable **Firestore Database** in production mode
3. Add a web app and copy the config
4. Edit `js/firebase-config.js` — replace the placeholder values:

```js
const firebaseConfig = {
  apiKey: "your-actual-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};
```

5. Set Firestore rules:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /rent_submissions/{doc} {
      allow read: if true;
      allow create: if request.resource.data.keys().hasAll(['parish', 'type', 'rent', 'year', 'ts'])
                    && request.resource.data.rent is int
                    && request.resource.data.rent > 0
                    && request.resource.data.rent < 20000;
      allow update, delete: if false;
    }
  }
}
```

## GitHub Pages Deployment

1. Push to GitHub:
```bash
git init
git add -A
git commit -m "Initial commit: Jersey Rent Tracker"
git remote add origin https://github.com/YOUR_USERNAME/jersey-rent-tracker.git
git push -u origin main
```

2. Go to **Settings → Pages** in your GitHub repo
3. Set source to **Deploy from a branch → main → / (root)**
4. Your site will be live at `https://YOUR_USERNAME.github.io/jersey-rent-tracker`

## Upgrading Parish Boundaries

The included `data/parishes.geojson` contains approximate boundaries. To get precise ones:

1. Find the OSM relation IDs for each Jersey parish on [OpenStreetMap](https://www.openstreetmap.org)
2. Use [polygons.openstreetmap.fr](http://polygons.openstreetmap.fr/) to export each as GeoJSON
3. Combine into a single FeatureCollection with `name` and `key` properties matching the existing format
4. Replace `data/parishes.geojson`

Alternatively, use Overpass Turbo:
```
[out:json];
relation["admin_level"="8"]["boundary"="administrative"](49.16,-2.26,49.27,-2.01);
out body; >; out skel qt;
```

## Project Structure

```
jersey-rent-tracker/
├── index.html              # Main page
├── css/
│   └── style.css           # Styles
├── js/
│   ├── app.js              # Charts, map, form logic
│   └── firebase-config.js  # Firebase/Firestore module
├── data/
│   ├── parishes.geojson    # Parish boundary polygons
│   └── rental-index.json   # Rental index reference data
└── README.md
```

## Tech Stack

- **Leaflet** — Interactive map with GeoJSON choropleth
- **Chart.js** — Price trends, rental index, parish charts
- **Firebase Firestore** — Crowdsourced data persistence
- **Vanilla JS** (ES modules) — No build step required
- **GitHub Pages** — Free static hosting

## Roadmap

- [ ] Replace approximate parish GeoJSON with precise OSM boundaries
- [ ] Pull HPI CSV dynamically from opendata.gov.je API
- [ ] Add affordability calculator (rent vs median income by parish)
- [ ] Add comparison with UK regions and Guernsey
- [ ] Add data export (CSV download of community submissions)
- [ ] PWA support for offline access

## Licence

Code: MIT · Data: Open Government Licence – Jersey v1.0

Built by [Coderra](https://coderra.je) · A Jersey civic tech project
