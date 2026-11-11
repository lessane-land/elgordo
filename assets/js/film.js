import { S, pickLang, nf as nfmt, applyText } from './strings.js';

/* ---------------- language ---------------- */
let lang = pickLang();
const nf = (n, o = {}) => nfmt(lang, n, o);
function applyLang() {
  applyText(lang);
  document.getElementById('film').setAttribute('aria-label', S[lang].film);
  document.getElementById('people').setAttribute('aria-label', S[lang].people);
  document.getElementById('bars').setAttribute('aria-label', S[lang].bars);
  document.getElementById('flaconSvg').setAttribute('aria-label', S[lang].flacon);
  document.querySelectorAll('.bar b').forEach((el, i) => { el.textContent = nf(i ? 720 : 2000, { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }); });
  const cred = document.getElementById('toCred'); if (cred) cred.href = 'creditos.html?lang=' + lang;
}
document.querySelectorAll('[data-lang]').forEach((b) => b.addEventListener('click', () => { lang = b.dataset.lang; applyLang(); }));

/* ---------------- state ---------------- */
const N = 100000;
const rnd32 = () => { const a = new Uint32Array(1); crypto.getRandomValues(a); return a[0]; };
let you = rnd32() % N;
const pad = (n) => String(n).padStart(5, '0');
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* seeded rng for layouts */
let seed = 20261222;
const rand = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; };

/* ---------------- canvas ---------------- */
const cv = document.getElementById('c');
const ctx = cv.getContext('2d');
let W = 0, H = 0, DPR = 1;
function resize() {
  DPR = Math.min(window.devicePixelRatio || 1, 2);
  W = innerWidth; H = innerHeight;
  cv.width = Math.round(W * DPR); cv.height = Math.round(H * DPR);
  pileCache = null; stadiumCache = null;
}
addEventListener('resize', resize);

const C = { night: '#05080F', grain: ['#E8ECF4', '#C5CEDD', '#AEB9CC', '#8E9AB2'], champ: '#F3E3BF', or: '#FF7A3D', orSoft: '#FFB48F', wire: '#8090B5', dim: '#1C2640', border: '#283550', text: '#E8ECF4' };

/* ---------- snow: rice falling in three depths, gathering into the drum ---------- */
const SNOW = Array.from({ length: 240 }, () => ({
  x: rand(), y: rand(), z: 0.35 + rand() * 0.65, a: rand() * Math.PI, va: (rand() - 0.5) * 0.6, drift: rand() * Math.PI * 2, shade: (rand() * 4) | 0,
}));
SNOW.forEach((s, i) => {
  const k = i + 0.5, phi = Math.acos(1 - 2 * k / SNOW.length), th = Math.PI * (1 + Math.sqrt(5)) * k;
  s.px = Math.cos(th) * Math.sin(phi); s.py = Math.cos(phi); s.pz = Math.sin(th) * Math.sin(phi);
});

const BOKEH = (() => {
  const out = [];
  for (const col of ['#E8ECF4', '#C5CEDD', '#F3E3BF']) {
    const c = document.createElement('canvas'); c.width = 240; c.height = 120;
    const o = c.getContext('2d');
    o.filter = 'blur(9px)'; o.fillStyle = col;
    o.beginPath(); o.ellipse(120, 60, 92, 30, 0, 0, Math.PI * 2); o.fill();
    out.push(c);
  }
  return out;
})();
const FORE = Array.from({ length: 9 }, () => ({ x: rand(), y: rand(), s: 0.7 + rand() * 1.1, a: rand() * Math.PI, v: (rand() - 0.5) * 0.4, c: (rand() * 3) | 0 }));
function drawFore(alpha) {
  if (alpha <= 0) return;
  for (const f of FORE) {
    const x = ((f.x + T * 0.000012 * f.s) % 1.3) - 0.15, y = ((f.y + T * 0.000018 * f.s) % 1.3) - 0.15;
    const w = Math.min(W, H) * 0.5 * f.s, h = w / 2;
    ctx.save(); ctx.translate(x * W, y * H); ctx.rotate(f.a + T * 0.00008 * f.v);
    ctx.globalAlpha = alpha * 0.33; ctx.drawImage(BOKEH[f.c], -w / 2, -h / 2, w, h);
    ctx.restore();
  }
  ctx.globalAlpha = 1;
}
function grain(x, y, len, ang, fill, sheen) {
  const c = Math.cos(ang), sn = Math.sin(ang);
  ctx.setTransform(DPR * c, DPR * sn, -DPR * sn, DPR * c, DPR * x, DPR * y);
  ctx.fillStyle = fill; ctx.beginPath(); ctx.ellipse(0, 0, len / 2, len / 5, 0, 0, Math.PI * 2); ctx.fill();
  if (sheen && len > 18) { const ga0 = ctx.globalAlpha; ctx.globalAlpha = ga0 * (0.12 + 0.5 * Math.max(0, Math.cos(ang - LIGHT)) ** 6); ctx.fillStyle = '#FFFFFF'; ctx.beginPath(); ctx.ellipse(-len * 0.08, -len * 0.065, len * 0.28, len * 0.045, 0, 0, Math.PI * 2); ctx.fill(); ctx.globalAlpha = ga0; }
  ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
}

/* ---------- the pile: 100,000 grains ---------- */
const PW = 5000, PH = 3250, GL = 14;
const vis = new Int32Array(N);
const gx = new Float32Array(N), gy = new Float32Array(N), ga = new Float32Array(N), gs = new Uint8Array(N);
(() => {
  let i = 0;
  while (i < N) {
    const x = rand() * PW, y = rand() * PH;
    const t = y / PH;
    if (Math.abs(x - PW / 2) > (PW / 2) * Math.pow(t, 0.7)) continue;
    gx[i] = x; gy[i] = y; ga[i] = rand() * Math.PI; gs[i] = Math.min(3, ((1 - t) * 2.2 + rand() * 1.8) | 0); i++;
  }
})();
let pileCache = null, pileCacheZ = 0;
function pileBitmap(z) {
  if (pileCache && pileCacheZ === z) return pileCache;
  const off = document.createElement('canvas');
  off.width = Math.ceil(PW * z * DPR); off.height = Math.ceil(PH * z * DPR);
  const o = off.getContext('2d'); o.scale(z * DPR, z * DPR);
  for (let s = 0; s < 4; s++) {
    o.fillStyle = C.grain[s];
    for (let i = 0; i < N; i++) if (gs[i] === s) o.fillRect(gx[i] - GL * 0.35, gy[i] - GL * 0.12, GL * 0.7, GL * 0.24);
  }
  pileCache = off; pileCacheZ = z; return off;
}

/* ---------- the stadium: 100,000 seats ---------- */
const seats = { x: new Float32Array(N), y: new Float32Array(N) };
(() => {
  const rows = 120, rx0 = 0.30, ry0 = 0.15, rx1 = 0.49, ry1 = 0.30;
  const len = []; let tot = 0;
  for (let r = 0; r < rows; r++) { const t = r / (rows - 1); const l = Math.PI * 2 * Math.sqrt(((rx0 + (rx1 - rx0) * t) ** 2 + (ry0 + (ry1 - ry0) * t) ** 2) / 2); len.push(l); tot += l; }
  let i = 0;
  for (let r = 0; r < rows; r++) {
    const t = r / (rows - 1), k = r === rows - 1 ? N - i : Math.round(N * len[r] / tot);
    const rx = rx0 + (rx1 - rx0) * t, ry = ry0 + (ry1 - ry0) * t, gap = (r % 30 === 29) ? 1 : 0;
    for (let j = 0; j < k && i < N; j++) {
      const a = (j / k) * Math.PI * 2 + r * 0.013;
      seats.x[i] = rx * Math.cos(a); seats.y[i] = ry * Math.sin(a) + gap * 0.004; i++;
    }
  }
})();
let stadiumCache = null;
const BULBS = Array.from({ length: 1400 }, () => (rand() * N) | 0);
function stadiumBitmaps(scale) {
  if (stadiumCache && stadiumCache.scale === scale) return stadiumCache;
  const mk = (color) => {
    const off = document.createElement('canvas'); off.width = cv.width; off.height = cv.height;
    const o = off.getContext('2d'); o.fillStyle = color;
    const cx = W / 2 * DPR, cy = H * 0.52 * DPR, s = scale * DPR, d = Math.max(0.8, 0.9 * DPR * scale / 900);
    for (let i = 0; i < N; i++) o.fillRect(cx + seats.x[i] * s, cy + seats.y[i] * s, d, d);
    return off;
  };
  stadiumCache = { scale, dim: mk('#1A2338'), lit: mk(C.champ), lit2: mk('#FFD9A0') };
  return stadiumCache;
}

/* ---------------- scroll ---------------- */
const film = document.getElementById('film');
let P = 0;
function progress() { const max = film.offsetHeight - innerHeight; return Math.min(1, Math.max(0, scrollY / max)); }
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const ease = (t) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
const span = (p, a, b) => clamp((p - a) / (b - a));
const bump = (p, a, b, f = 0.22) => { const t = span(p, a, b); return Math.min(1, t / f, (1 - t) / f); };

const layers = [...document.querySelectorAll('.layer')].map((el) => ({ el, a: +el.dataset.a, b: +el.dataset.b, inter: el.hasAttribute('data-interactive') }));
function updateLayers(p) {
  for (const L of layers) {
    const o = L.a === 0 ? clamp((L.b - p) / ((L.b - L.a) * 0.22)) : clamp(bump(p, L.a, L.b));
    L.el.style.opacity = o.toFixed(3);
    const base = L.el.classList.contains('mid') ? 'translateY(-50%) ' : '';
    L.el.style.transform = base + `translateY(${((1 - o) * 14).toFixed(1)}px)`;
    L.el.style.pointerEvents = L.inter && o > 0.6 ? 'auto' : 'none';
    L.el.style.visibility = o < 0.01 ? 'hidden' : 'visible';
    if (!reduce) {
      L.el.style.filter = o > 0.98 ? 'none' : `blur(${((1 - o) * 7).toFixed(2)}px)`;
      L.el.querySelectorAll('.big, .huge, .mid-t').forEach((t) => { t.style.letterSpacing = `${(-0.03 + (1 - o) * 0.16).toFixed(3)}em`; });
    }
  }
  document.querySelector('.top').classList.toggle('solid', document.getElementById('after').getBoundingClientRect().top < 60);
  document.getElementById('cue').style.opacity = String(1 - span(p, 0.01, 0.04));
}

/* ---------------- scenes ---------------- */
let T = 0, LIGHT = 0;
function drawSnow(p, alpha, gather) {
  const R = Math.min(W * 0.36, H * 0.2), cx = W / 2, cy = H * 0.66, rot = T * 0.00012 + p * 3;
  for (const s of SNOW) {
    const fy = ((s.y + T * 0.000022 * s.z) % 1.08) - 0.04;
    const fx = s.x + Math.sin(T * 0.0004 * s.z + s.drift) * 0.015;
    const sx0 = fx * W, sy0 = fy * H;
    const x3 = s.px * Math.cos(rot) - s.pz * Math.sin(rot), z3 = s.px * Math.sin(rot) + s.pz * Math.cos(rot);
    const sx1 = cx + x3 * R, sy1 = cy + s.py * R, depth = (z3 + 1) / 2;
    const g = ease(gather);
    const x = sx0 + (sx1 - sx0) * g, y = sy0 + (sy1 - sy0) * g;
    const len = (6 + 12 * s.z) * (1 - g) + (5 + 6 * depth) * g;
    const tw = !reduce && Math.cos(s.a + T * 0.0006 * s.va - LIGHT) > 0.985;
    ctx.globalAlpha = alpha * ((0.35 + 0.65 * s.z) * (1 - g) + (0.25 + 0.75 * depth) * g);
    grain(x, y, len, s.a + T * 0.0006 * s.va, tw ? C.champ : C.grain[s.shade], s.z > 0.8 && g < 0.5);
  }
  ctx.globalAlpha = 1;
}

function drawDrum(p, alpha) {
  const R = Math.min(W * 0.36, H * 0.2), cx = W / 2, cy = H * 0.66, rot = T * 0.00012 + p * 3, tilt = 0.32;
  const proj = (x, y, z) => { const y2 = y * Math.cos(tilt) - z * Math.sin(tilt), z2 = y * Math.sin(tilt) + z * Math.cos(tilt); return [cx + x * R, cy + y2 * R, z2]; };
  const curve = (fn) => {
    let prev = null;
    for (let k = 0; k <= 72; k++) {
      const pt = fn(k / 72 * Math.PI * 2);
      if (prev) {
        const z = (prev[2] + pt[2]) / 2;
        ctx.globalAlpha = alpha * (z > 0 ? 0.9 : 0.22);
        ctx.beginPath(); ctx.moveTo(prev[0], prev[1]); ctx.lineTo(pt[0], pt[1]); ctx.stroke();
      }
      prev = pt;
    }
  };
  ctx.strokeStyle = '#D8C49A'; ctx.lineWidth = 0.9;
  for (let m = 0; m < 8; m++) {
    const a = rot + m * Math.PI / 8;
    curve((t) => proj(Math.cos(t) * Math.cos(a), Math.sin(t), Math.cos(t) * Math.sin(a)));
  }
  for (const k of [-0.7, -0.35, 0, 0.35, 0.7]) {
    const r = Math.sqrt(1 - k * k);
    curve((t) => proj(Math.cos(t) * r, k, Math.sin(t) * r));
  }
  ctx.globalAlpha = alpha * 0.8; ctx.lineWidth = 1.4;
  ctx.beginPath(); ctx.moveTo(cx - R * 1.22, cy); ctx.lineTo(cx + R * 1.22, cy); ctx.stroke();
  ctx.lineWidth = 0.9;
  ctx.beginPath(); ctx.moveTo(cx - R * 1.15, cy); ctx.lineTo(cx - R * 1.32, cy + R * 1.3); ctx.moveTo(cx + R * 1.15, cy); ctx.lineTo(cx + R * 1.32, cy + R * 1.3); ctx.stroke();
  const a = (you * 137.508) * Math.PI / 180;
  const bx = cx + Math.cos(a) * R * 0.42, by = cy + Math.sin(a) * R * 0.42;
  const pulse = reduce ? 0 : Math.sin(T * 0.003) * 2;
  ctx.globalAlpha = alpha;
  ctx.fillStyle = C.or; ctx.beginPath(); ctx.arc(bx, by, 7, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = C.orSoft; ctx.beginPath(); ctx.arc(bx - 2.2, by - 2.2, 2.2, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = C.or; ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(bx, by, 16 + pulse, 0, Math.PI * 2); ctx.stroke();
  ctx.globalAlpha = 1;
}

let lastCount = 0;
function drawPile(p, alpha) {
  const q = ease(span(p, 0.3, 0.62));
  const zFit = Math.min(W * 0.9 / PW, H * 0.5 / PH);
  const z0 = Math.min(W, H) * 0.7 / GL;
  const z = Math.exp(Math.log(z0) + (Math.log(zFit) - Math.log(z0)) * q);
  const camT = clamp((Math.log(z0) - Math.log(z)) / (Math.log(z0) - Math.log(zFit)));
  const yx = gx[you], yy = gy[you];
  const camX = yx + (PW / 2 - yx) * Math.pow(camT, 2.2), camY = yy + (PH * 0.55 - yy) * Math.pow(camT, 2.2);
  const oy0 = H * (0.36 + 0.06 * (1 - camT)); const ox = W / 2 - camX * z, oy = oy0 - camY * z;
  ctx.globalAlpha = alpha;
  const len = GL * z;
  let drawn = N;
  if (z < zFit * 2.6) {
    const bmp = pileBitmap(zFit);
    ctx.imageSmoothingEnabled = true;
    ctx.drawImage(bmp, ox, oy, PW * z, PH * z);
  } else {
    const x0 = -ox / z - GL, x1 = (W - ox) / z + GL, y0 = -oy / z - GL, y1 = (H - oy) / z + GL;
    let m = 0;
    for (let i = 0; i < N; i++) {
      const x = gx[i], y = gy[i];
      if (x < x0 || x > x1 || y < y0 || y > y1 || i === you) continue;
      vis[m++] = i;
    }
    drawn = m + 1;
    if (len < 12) {
      for (let sh = 0; sh < 4; sh++) {
        ctx.fillStyle = C.grain[sh];
        for (let k = 0; k < m; k++) { const i = vis[k]; if (gs[i] !== sh) continue; ctx.fillRect(ox + gx[i] * z - len * 0.35, oy + gy[i] * z - len * 0.12, len * 0.7, Math.max(1, len * 0.24)); }
      }
    } else {
      for (let k = 0; k < m; k++) { const i = vis[k]; grain(ox + gx[i] * z, oy + gy[i] * z, len, ga[i], C.grain[gs[i]], true); }
    }
  }
  const px = ox + yx * z, py = oy + yy * z;
  grain(px, py, Math.max(len, 3), ga[you], C.or, true);
  if (len < 40) {
    ctx.strokeStyle = C.or; ctx.lineWidth = 1.2;
    ctx.beginPath(); ctx.arc(px, py, 12, 0, Math.PI * 2); ctx.stroke();
    ctx.font = '600 12px "Spline Sans Mono", monospace'; ctx.fillStyle = C.or; ctx.textAlign = 'center';
    ctx.fillText(pad(you), px, py - 20);
  }
  ctx.globalAlpha = 1;
  lastCount = drawn;
}

function drawStadium(p, alpha) {
  const scale = Math.min(W * 1.02, H * 1.45);
  const b = stadiumBitmaps(scale);
  const wave = ease(span(p, 0.62, 0.71));
  const off = ease(span(p, 0.735, 0.79));
  ctx.globalAlpha = alpha; ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.drawImage(b.dim, 0, 0);
  if (wave > 0 && off < 1) {
    ctx.save();
    const cx = W / 2 * DPR, cy = H * 0.52 * DPR;
    ctx.beginPath(); ctx.moveTo(cx, cy); ctx.arc(cx, cy, Math.max(cv.width, cv.height), -Math.PI / 2, -Math.PI / 2 + wave * Math.PI * 2); ctx.closePath(); ctx.clip();
    const flick = reduce ? 1 : 0.86 + 0.14 * Math.sin(T * 0.006);
    ctx.globalAlpha = alpha * (1 - off) * flick; ctx.drawImage(b.lit, 0, 0);
    if (!reduce) { ctx.globalAlpha = alpha * (1 - off) * (0.5 + 0.5 * Math.sin(T * 0.004)); ctx.drawImage(b.lit2, 0, 0); }
    ctx.restore();
  }
  ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  if (wave > 0 && off < 1 && !reduce) {
    const lim = wave * Math.PI * 2;
    for (let k = 0; k < BULBS.length; k++) {
      const i = BULBS[k];
      let a = Math.atan2(seats.y[i], seats.x[i]) + Math.PI / 2; if (a < 0) a += Math.PI * 2;
      if (a > lim) continue;
      const tw = 0.5 + 0.5 * Math.sin(T * 0.004 + k * 2.399);
      ctx.globalAlpha = alpha * (1 - off) * tw * tw;
      ctx.fillStyle = k % 5 === 0 ? '#FFFFFF' : C.champ;
      const bxp = W / 2 + seats.x[i] * scale, byp = H * 0.52 + seats.y[i] * scale;
      ctx.fillRect(bxp - 1, byp - 1, 2.2, 2.2);
    }
  }
  ctx.globalAlpha = alpha * 0.7; ctx.strokeStyle = '#D8C49A'; ctx.lineWidth = 0.8;
  const cx = W / 2, cy = H * 0.52;
  ctx.beginPath(); ctx.ellipse(cx, cy, scale * 0.2, scale * 0.09, 0, 0, Math.PI * 2); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(cx, cy - scale * 0.09); ctx.lineTo(cx, cy + scale * 0.09); ctx.stroke();
  ctx.beginPath(); ctx.ellipse(cx, cy, scale * 0.03, scale * 0.014, 0, 0, Math.PI * 2); ctx.stroke();
  const i = you;
  const sx = cx + seats.x[i] * scale, sy = cy + seats.y[i] * scale;
  ctx.globalAlpha = alpha; ctx.fillStyle = C.or; ctx.fillRect(sx - 2, sy - 2, 4, 4);
  if (off > 0.3) { ctx.strokeStyle = C.or; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.arc(sx, sy, 12, 0, Math.PI * 2); ctx.stroke(); }
  ctx.globalAlpha = 1;
}

function frame(now) {
  T = reduce ? 0 : now; LIGHT = T * 0.00025;
  P = progress();
  ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  ctx.fillStyle = C.night; ctx.fillRect(0, 0, W, H);
  const p = P;
  const aOut = 1 - span(p, 0.27, 0.31);
  if (aOut > 0) {
    drawSnow(p, aOut, span(p, 0.12, 0.2));
    drawFore(aOut * (1 - span(p, 0.12, 0.17)));
    const d = span(p, 0.16, 0.21) * aOut;
    if (d > 0) drawDrum(p, d);
  }
  const cIn = span(p, 0.28, 0.31) * (1 - span(p, 0.6, 0.63));
  if (cIn > 0) { drawPile(p, cIn); drawFore(cIn * (1 - span(p, 0.3, 0.4)) * 0.8); }
  const dIn = span(p, 0.615, 0.64) * (1 - span(p, 0.795, 0.82));
  if (dIn > 0) drawStadium(p, dIn);
  const eIn = span(p, 0.82, 0.86);
  if (eIn > 0) { drawSnow(p, eIn * 0.35, 0); drawFore(eIn * 0.7); }
  updateLayers(p);
  document.getElementById('counter').innerHTML = `<b>${nf(Math.max(1, lastCount))}</b> ${S[lang].counter}`;
  requestAnimationFrame(frame);
}

/* ---------------- your number ---------------- */
const num = document.getElementById('num');
function setYou(n) { you = ((n % N) + N) % N; num.value = pad(you); document.getElementById('flaconNum').textContent = pad(you); }
num.addEventListener('input', () => {
  const d = num.value.replace(/\D/g, '').slice(0, 5); if (num.value !== d) num.value = d;
  if (d.length === 5) setYou(parseInt(d, 10));
});
num.addEventListener('blur', () => { const d = num.value.replace(/\D/g, ''); setYou(d ? parseInt(d, 10) : you); });
num.addEventListener('keydown', (e) => { if (e.key === 'Enter') num.blur(); });
document.getElementById('random').addEventListener('click', () => setYou(rnd32() % N));

/* ---------------- 100 friends ---------------- */
const people = document.getElementById('people');
const NS = 'http://www.w3.org/2000/svg';
const kind = Array(100).fill('none');
(() => {
  const idx = [...Array(100).keys()].sort(() => rand() - 0.5);
  idx.slice(0, 9).forEach((i) => { kind[i] = 'back'; });
  idx.slice(9, 14).forEach((i) => { kind[i] = 'more'; });
})();
const figs = [];
for (let i = 0; i < 100; i++) {
  const g = document.createElementNS(NS, 'g');
  g.setAttribute('transform', `translate(${(i % 10) * 30 + 15} ${Math.floor(i / 10) * 30 + 6})`);
  const head = document.createElementNS(NS, 'circle'); head.setAttribute('cy', '4'); head.setAttribute('r', '4');
  const body = document.createElementNS(NS, 'path'); body.setAttribute('d', 'M-7 20 Q-7 10 0 10 Q7 10 7 20 Z');
  for (const el of [head, body]) { el.setAttribute('class', 'p'); el.setAttribute('stroke-width', '1.2'); g.append(el); }
  people.append(g); figs.push([head, body]);
}
const LOOK = { start: ['none', '#F3E3BF'], grey: ['#1C2640', '#1C2640'], back: ['#C9C46A', '#C9C46A'], more: ['#6FB7FF', '#6FB7FF'], wait: ['none', '#F3E3BF'] };
let lastStep = -1;
function friendsStep() {
  const box = document.getElementById('friends');
  const r = box.getBoundingClientRect();
  const step = Math.min(5, Math.floor(clamp(-r.top / Math.max(1, r.height - innerHeight)) * 6));
  if (step === lastStep) return;
  lastStep = step;
  document.querySelectorAll('.fr-step').forEach((el) => el.classList.toggle('on', +el.dataset.step === step));
  figs.forEach(([h, b], i) => {
    let look = 'start';
    if (step >= 1) look = kind[i] === 'none' ? 'grey' : 'wait';
    if (step >= 2 && kind[i] === 'back') look = 'back';
    if (step >= 3 && kind[i] === 'more') look = 'more';
    for (const el of [h, b]) { el.setAttribute('fill', LOOK[look][0]); el.setAttribute('stroke', LOOK[look][1]); }
  });
}
addEventListener('scroll', friendsStep, { passive: true });

resize(); applyLang(); setYou(you); friendsStep();
document.fonts.ready.then(() => requestAnimationFrame(frame));
