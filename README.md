# 🚀 Space Mission Tracker

A web-based dashboard for tracking fictional deep-space missions, crew status, and telemetry data.

## Project Structure

```
space-mission-tracker/
├── index.html          ← Main dashboard (open in browser)
├── README.md           ← This file
├── config/
│   └── settings.json   ← App configuration
├── data/
│   ├── missions.json   ← Mission data
│   └── crew.json       ← Crew roster
├── src/
│   ├── app.js          ← Main application logic
│   ├── charts.js       ← Telemetry chart rendering
│   └── utils.js        ← Utility helpers
└── docs/
    ├── ARCHITECTURE.md ← Technical architecture
    └── mission-brief.docx ← Official mission briefing document
```

## Getting Started

1. Open `index.html` in any modern browser — no server needed.
2. The dashboard loads mission data from `data/missions.json`.
3. Click any mission card to view crew and telemetry details.

## Features

- Live mission status board with animated telemetry
- Crew roster with health indicators
- Distance and fuel metrics per mission
- Dark-mode astronaut aesthetic

## Data Format

Missions follow the schema in `config/settings.json`. Add new missions to `data/missions.json` to see them appear on the dashboard automatically.
