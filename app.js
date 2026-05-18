// app.js — Space Mission Tracker core logic
import { formatDistance, formatSignalDelay, daysUntil, statusLabel, healthLabel } from './utils.js';
import { renderGauge, animateCount } from './charts.js';

const SETTINGS = null; // Loaded lazily from config/settings.json

async function loadJSON(path) {
  const r = await fetch(path);
  if (!r.ok) throw new Error(`Failed to load ${path}: ${r.status}`);
  return r.json();
}

async function bootstrap() {
  const [missions, crew, settings] = await Promise.all([
    loadJSON('../data/missions.json'),
    loadJSON('../data/crew.json'),
    loadJSON('../config/settings.json'),
  ]);

  const crewMap = Object.fromEntries(crew.map(c => [c.id, c]));
  renderMissions(missions, crewMap, settings);
  bindSearch(missions, crewMap, settings);
}

function renderMissions(missions, crewMap, settings) {
  const grid = document.getElementById('mission-grid');
  grid.innerHTML = '';
  for (const m of missions) {
    grid.appendChild(buildCard(m, crewMap, settings));
  }
}

function buildCard(m, crewMap, settings) {
  const card = document.createElement('article');
  card.className = 'mission-card';
  card.dataset.status = m.status;

  const statusColor = settings.statusColors[m.status] ?? '#fff';
  const days = daysUntil(m.eta);
  const daysLabel = m.status === 'COMPLETED' ? 'Arrived' : (days < 0 ? 'Overdue' : `${days} days to ETA`);

  const crewItems = m.crewIds.map(id => {
    const c = crewMap[id];
    if (!c) return '';
    const hc = settings.healthColors[c.healthStatus] ?? '#fff';
    return `<li><span class="health-dot" style="background:${hc}"></span>${c.name} <em>${c.role}</em></li>`;
  }).join('');

  card.innerHTML = `
    <header>
      <div class="mission-id">${m.id}</div>
      <h2>${m.name}</h2>
      <span class="status-badge" style="color:${statusColor};border-color:${statusColor}">
        ${statusLabel(m.status)}
      </span>
    </header>
    <div class="destination">→ ${m.destination}</div>
    <div class="meta-row">
      <span class="eta-label">${daysLabel}</span>
      <span class="signal">Signal delay: ${formatSignalDelay(m.telemetry.signalDelaySec)}</span>
    </div>
    <div class="gauges">
      <div>
        <label>Fuel</label>
        <div class="gauge-wrap" data-val="${m.fuelPercent}" data-color="${m.fuelPercent < 30 ? '#f87171' : '#3ecfcf'}"></div>
      </div>
      <div>
        <label>O₂</label>
        <div class="gauge-wrap" data-val="${m.telemetry.oxygenPercent}" data-color="#a3e635"></div>
      </div>
    </div>
    <div class="telemetry">
      <span>🌡 ${m.telemetry.tempC}°C</span>
      <span>☢ ${m.telemetry.radiationMsv} mSv</span>
      <span class="distance" data-km="${m.distanceKm}">📡 ${formatDistance(m.distanceKm)}</span>
    </div>
    <details class="crew-section">
      <summary>Crew (${m.crewIds.length})</summary>
      <ul class="crew-list">${crewItems}</ul>
    </details>
  `;

  // Render gauges
  card.querySelectorAll('.gauge-wrap').forEach(el => {
    renderGauge(el, +el.dataset.val, el.dataset.color);
  });

  return card;
}

function bindSearch(missions, crewMap, settings) {
  const input = document.getElementById('search');
  const filter = document.getElementById('status-filter');

  function refresh() {
    const q = input.value.toLowerCase();
    const st = filter.value;
    const filtered = missions.filter(m => {
      const matchQ = !q || m.name.toLowerCase().includes(q) || m.destination.toLowerCase().includes(q);
      const matchSt = !st || m.status === st;
      return matchQ && matchSt;
    });
    renderMissions(filtered, crewMap, settings);
  }

  input.addEventListener('input', refresh);
  filter.addEventListener('change', refresh);
}

bootstrap().catch(err => {
  document.getElementById('mission-grid').innerHTML =
    `<p class="error">Failed to load mission data: ${err.message}</p>`;
});
