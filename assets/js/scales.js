// Draws 100,000 numbers as 100,000 things (grains, seats, tiles, people).
// Each scale is a silhouette filled with a grid of exactly N cells; cell i is number i.

export const W = 720;
export const H = 440;

const SHAPES = {
  arroz: {
    inside(x, y) {
      if (y < 36 || y > 424) return false;
      const t = (y - 36) / 388;
      return Math.abs(x - 360) < 345 * Math.pow(t, 0.72);
    },
    decor(ctx, c) {
      ctx.strokeStyle = c.border; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(0, 427); ctx.lineTo(W, 427); ctx.stroke();
    },
  },
  estadio: {
    inside(x, y) {
      const ox = (x - 360) / 350, oy = (y - 220) / 212;
      const ix = (x - 360) / 214, iy = (y - 220) / 118;
      return ox * ox + oy * oy < 1 && ix * ix + iy * iy > 1;
    },
    decor(ctx, c) {
      ctx.strokeStyle = c.wire; ctx.lineWidth = 1.5;
      ctx.strokeRect(196, 132, 328, 176);
      ctx.beginPath(); ctx.moveTo(360, 132); ctx.lineTo(360, 308); ctx.stroke();
      ctx.beginPath(); ctx.arc(360, 220, 30, 0, Math.PI * 2); ctx.stroke();
      ctx.strokeRect(196, 182, 40, 76); ctx.strokeRect(484, 182, 40, 76);
    },
  },
  acera: {
    // 20 stretches of 100 m, each 500 tiles long and 10 wide.
    layout(n) {
      const xs = new Float32Array(n), ys = new Float32Array(n);
      const s = 1.4, rows = 20, per = 5000, top = 10, pitch = 21;
      for (let i = 0; i < n; i++) {
        const r = Math.floor(i / per), k = i % per;
        let col = Math.floor(k / 10); const w = k % 10;
        if (r % 2 === 1) col = 499 - col; // serpentine, like walking it
        xs[i] = 10 + col * s; ys[i] = top + r * pitch + w * s;
      }
      return { xs, ys, s };
    },
    decor(ctx, c) {
      ctx.strokeStyle = c.wire; ctx.lineWidth = 1.5;
      for (let r = 0; r < 19; r++) {
        const y = 10 + r * 21 + 7 + 10.5;
        const right = r % 2 === 0;
        ctx.beginPath();
        ctx.arc(right ? 710 : 10, y, 10.5, right ? -Math.PI / 2 : Math.PI / 2, right ? Math.PI / 2 : Math.PI * 1.5, false);
        ctx.stroke();
      }
    },
  },
  ciudad: {
    inside(x, y) {
      const dx = (x - 360) / 1.75, dy = y - 220;
      const a = Math.atan2(dy, dx), r = Math.hypot(dx, dy);
      const R = 196 * (1 + 0.10 * Math.sin(3 * a + 0.6) + 0.06 * Math.cos(5 * a));
      if (r > R) return false;
      if (((x + 8) % 44) < 5 || ((y + 6) % 40) < 5) return false;     // streets
      if (Math.abs((y - 220) - (x - 360) * 0.42) < 6) return false;   // avenue
      return true;
    },
    decor() {},
  },
};

function gridFill(inside, n) {
  // Find the largest cell size that still fits n cells inside the silhouette.
  let lo = 0.5, hi = 6, best = null;
  for (let it = 0; it < 22; it++) {
    const s = (lo + hi) / 2;
    let count = 0;
    for (let y = s / 2; y < H; y += s) for (let x = s / 2; x < W; x += s) if (inside(x, y)) count++;
    if (count >= n) { best = s; lo = s; } else hi = s;
  }
  const s = best, xs = new Float32Array(n), ys = new Float32Array(n);
  let i = 0;
  for (let y = s / 2; y < H && i < n; y += s) for (let x = s / 2; x < W && i < n; x += s) {
    if (inside(x, y)) { xs[i] = x - s / 2; ys[i] = y - s / 2; i++; }
  }
  return { xs, ys, s };
}

const cache = {};
export function layoutFor(scale, n) {
  if (!cache[scale]) {
    const sh = SHAPES[scale];
    cache[scale] = sh.layout ? sh.layout(n) : gridFill(sh.inside, n);
  }
  return cache[scale];
}

// A simulated draw, made once per page load. It is not the real draw.
export function simulateDraw(n, prizes) {
  const rnd = (m) => { const a = new Uint32Array(1); crypto.getRandomValues(a); return a[0] % m; };
  const gordo = rnd(n);
  const pedrea = new Set();
  while (pedrea.size < prizes.pedrea) { const k = rnd(n); if (k !== gordo) pedrea.add(k); }
  return { gordo, pedrea, reintegroDigit: gordo % 10 };
}

export function winnersOf(family, draw, n) {
  if (family === 'gordo') return [draw.gordo];
  if (family === 'pedrea') return [...draw.pedrea];
  const out = [];
  for (let i = draw.reintegroDigit; i < n; i += 10) if (i !== draw.gordo) out.push(i);
  return out;
}

// Render the base layer (all units) into an offscreen canvas, cached per scale and size.
const baseCache = new Map();
function baseLayer(scale, n, pxW, pxH, colors) {
  const key = `${scale}:${pxW}x${pxH}`;
  if (baseCache.has(key)) return baseCache.get(key);
  const off = document.createElement('canvas');
  off.width = pxW; off.height = pxH;
  const ctx = off.getContext('2d');
  const k = pxW / W;
  ctx.setTransform(k, 0, 0, k, 0, 0);
  const { xs, ys, s } = layoutFor(scale, n);
  SHAPES[scale].decor(ctx, colors);
  const d = Math.max(s * 0.8, 0.6 / k);
  // Two shades, mixed by a cheap hash, so the pile reads as grains and not as a flat shape.
  for (const [shade, keep] of [[colors.unit, 0], [colors.unitHi, 1]]) {
    ctx.fillStyle = shade;
    for (let i = 0; i < n; i++) if ((((i * 2654435761) >>> 28) < 3 ? 1 : 0) === keep) ctx.fillRect(xs[i], ys[i], d, d);
  }
  baseCache.set(key, off);
  return off;
}

export function render(canvas, { scale, family, draw, you, n, colors, labels }) {
  const dpr = Math.min(window.devicePixelRatio || 1, 3);
  const cssW = canvas.clientWidth || 340;
  const cssH = cssW * H / W;
  const pxW = Math.round(cssW * dpr), pxH = Math.round(cssH * dpr);
  if (canvas.width !== pxW || canvas.height !== pxH) { canvas.width = pxW; canvas.height = pxH; }
  const ctx = canvas.getContext('2d');
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, pxW, pxH);
  ctx.drawImage(baseLayer(scale, n, pxW, pxH, colors), 0, 0);

  const k = pxW / W;              // logical to device px
  const css = (v) => v * dpr / k; // css px to logical
  ctx.setTransform(k, 0, 0, k, 0, 0);
  const { xs, ys, s } = layoutFor(scale, n);
  const winners = winnersOf(family, draw, n);
  const col = colors[family];

  ctx.fillStyle = col;
  // Pedrea dots stay close to true size: 1.8 % must look like 1.8 %, not a third of the drawing.
  const size = family === 'reintegro' ? Math.max(s, css(0.9)) : family === 'pedrea' ? Math.max(s * 1.15, css(1)) : Math.max(s * 1.8, css(2.6));
  for (const i of winners) ctx.fillRect(xs[i] + s / 2 - size / 2, ys[i] + s / 2 - size / 2, size, size);

  const ring = (i, r, stroke, text) => {
    const cx = xs[i] + s / 2, cy = ys[i] + s / 2;
    ctx.lineWidth = css(2); ctx.strokeStyle = stroke;
    ctx.beginPath(); ctx.arc(cx, cy, css(r), 0, Math.PI * 2); ctx.stroke();
    if (!text) return;
    ctx.font = `600 ${css(12)}px "Spline Sans Mono", monospace`;
    const tw = ctx.measureText(text).width;
    const left = cx + css(r + 6) + tw > W;
    const tx = left ? cx - css(r + 6) - tw : cx + css(r + 6);
    const ty = cy - css(r) + css(2);
    ctx.fillStyle = colors.ground;
    ctx.fillRect(tx - css(4), ty - css(12), tw + css(8), css(17));
    ctx.fillStyle = stroke; ctx.fillText(text, tx, ty);
  };
  if (family === 'gordo') ring(draw.gordo, 9, col, labels.gordo);
  ring(you, 13, colors.text, labels.you);
}

// Magnifier: redraw the neighbourhood of `you` at a larger scale.
export function renderLupa(canvas, { scale, family, draw, you, n, colors }) {
  const dpr = Math.min(window.devicePixelRatio || 1, 3);
  const cssW = canvas.clientWidth || 140;
  const px = Math.round(cssW * dpr);
  if (canvas.width !== px) { canvas.width = px; canvas.height = px; }
  const ctx = canvas.getContext('2d');
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.fillStyle = colors.panel; ctx.fillRect(0, 0, px, px);
  const { xs, ys, s } = layoutFor(scale, n);
  const half = s * 9;
  const cx = xs[you] + s / 2, cy = ys[you] + s / 2;
  const z = px / (half * 2);
  const winners = new Set(winnersOf(family, draw, n));
  for (let i = 0; i < n; i++) {
    const dx = xs[i] - (cx - half), dy = ys[i] - (cy - half);
    if (dx < -s || dy < -s || dx > half * 2 || dy > half * 2) continue;
    ctx.fillStyle = i === you ? colors.text : winners.has(i) ? colors[family] : colors.unit;
    const g = s * z * 0.16;
    ctx.fillRect(dx * z + g, dy * z + g, s * z - 2 * g, s * z - 2 * g);
  }
  ctx.strokeStyle = colors.text; ctx.lineWidth = 2 * dpr;
  const o = (half - s / 2) * z;
  ctx.strokeRect(o - 3 * dpr, o - 3 * dpr, s * z + 6 * dpr, s * z + 6 * dpr);
}
