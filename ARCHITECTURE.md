# Architecture — Space Mission Tracker

## Overview

Space Mission Tracker is a **zero-dependency, browser-native** single-page application. All data is stored as plain JSON files; no server or build step is required.

```
Browser
  └── index.html
        ├── src/app.js       ← Orchestrates data loading & rendering
        ├── src/charts.js    ← SVG gauge & sparkline primitives
        ├── src/utils.js     ← Pure formatting / calculation helpers
        ├── data/missions.json
        ├── data/crew.json
        └── config/settings.json
```

## Data Flow

```
fetch(missions.json) ──┐
fetch(crew.json)    ──►│ bootstrap() in app.js
fetch(settings.json)──┘
        │
        ▼
  renderMissions(missions, crewMap, settings)
        │
        ├── buildCard(mission) × N
        │     ├── renderGauge(el, fuelPercent)
        │     └── renderGauge(el, oxygenPercent)
        └── bindSearch()   ← re-renders on user input
```

## Key Design Decisions

| Decision | Rationale |
|---|---|
| Plain JSON data files | No database needed; easy to hand-edit |
| ES Modules (`type="module"`) | Native browser support, no bundler required |
| Inline SVG charts | No canvas or chart library dependency |
| CSS custom properties | Single source of truth for the color system |
| `<details>` for crew | Progressively disclosed detail without JS modals |

## Adding a Mission

Edit `data/missions.json` and append an object matching this schema:

```json
{
  "id": "MSN-005",
  "name": "Your Mission Name",
  "destination": "Asteroid Belt",
  "status": "LAUNCHED",
  "launchDate": "2026-06-01",
  "eta": "2028-01-15",
  "distanceKm": 350000000,
  "fuelPercent": 95,
  "crewIds": ["C01"],
  "telemetry": {
    "oxygenPercent": 99,
    "tempC": 21,
    "radiationMsv": 0.3,
    "signalDelaySec": 1200
  }
}
```

Valid `status` values: `LAUNCHED` · `EN_ROUTE` · `CRITICAL` · `COMPLETED` · `ABORTED`

## Extending

- **Real-time data**: Replace JSON files with a REST API; `loadJSON()` in `app.js` already wraps `fetch`.
- **Charts**: Pass telemetry history arrays to `renderSparkline()` in `charts.js`.
- **Auth**: Add a login layer in front of `bootstrap()`.
