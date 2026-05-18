// utils.js — Shared helper functions for Space Mission Tracker

export function formatDistance(km) {
  if (km >= 1e9) return (km / 1e9).toFixed(2) + ' Bn km';
  if (km >= 1e6) return (km / 1e6).toFixed(2) + ' M km';
  if (km >= 1e3) return (km / 1e3).toFixed(0) + ',000 km';
  return km + ' km';
}

export function formatSignalDelay(seconds) {
  if (seconds < 60) return `${seconds}s`;
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  if (mins < 60) return `${mins}m ${secs}s`;
  return `${Math.floor(mins / 60)}h ${mins % 60}m`;
}

export function daysUntil(dateStr) {
  const ms = new Date(dateStr) - new Date();
  return Math.ceil(ms / 86400000);
}

export function clamp(val, min, max) {
  return Math.min(max, Math.max(min, val));
}

export function statusLabel(status) {
  const labels = {
    EN_ROUTE:  'En Route',
    LAUNCHED:  'Launched',
    CRITICAL:  'Critical',
    COMPLETED: 'Completed',
    ABORTED:   'Aborted',
  };
  return labels[status] ?? status;
}

export function healthLabel(health) {
  const labels = { NOMINAL: 'Nominal', DEGRADED: 'Degraded', CRITICAL: 'Critical' };
  return labels[health] ?? health;
}
