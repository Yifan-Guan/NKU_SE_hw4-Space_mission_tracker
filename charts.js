// charts.js — SVG-based mini chart renderers (no external dependencies)

/**
 * Renders a horizontal bar gauge into a container element.
 * @param {HTMLElement} el
 * @param {number} value   0-100
 * @param {string} color   CSS color
 */
export function renderGauge(el, value, color) {
  const pct = Math.min(100, Math.max(0, value));
  el.innerHTML = `
    <div class="gauge-track">
      <div class="gauge-fill" style="width:${pct}%;background:${color};"></div>
    </div>
    <span class="gauge-label">${pct}%</span>
  `;
}

/**
 * Renders a tiny sparkline SVG from an array of numbers.
 * @param {HTMLElement} el
 * @param {number[]} data
 * @param {string} color
 */
export function renderSparkline(el, data, color = '#3ecfcf') {
  if (!data || data.length < 2) { el.innerHTML = ''; return; }
  const W = 120, H = 36, pad = 2;
  const min = Math.min(...data), max = Math.max(...data);
  const range = max - min || 1;
  const xs = data.map((_, i) => pad + (i / (data.length - 1)) * (W - 2 * pad));
  const ys = data.map(v => H - pad - ((v - min) / range) * (H - 2 * pad));
  const d = xs.map((x, i) => `${i === 0 ? 'M' : 'L'}${x},${ys[i]}`).join(' ');
  el.innerHTML = `
    <svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
      <path d="${d}" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round"/>
      <circle cx="${xs[xs.length-1]}" cy="${ys[ys.length-1]}" r="3" fill="${color}"/>
    </svg>
  `;
}

/**
 * Animates a numeric counter from 0 to target inside el.
 * @param {HTMLElement} el
 * @param {number} target
 * @param {number} durationMs
 */
export function animateCount(el, target, durationMs = 800) {
  const start = performance.now();
  const step = (now) => {
    const t = Math.min(1, (now - start) / durationMs);
    const ease = 1 - Math.pow(1 - t, 3);
    el.textContent = Math.round(ease * target).toLocaleString();
    if (t < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}
