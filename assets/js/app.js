import { SORTEO, FAMILIES, SIMULATED, SCALES, HELP, expectedValue } from './data.js';
import { pickLang, makeT, applyStatic, wireLangButtons, fmt } from './i18n.js';
import { render, renderLupa, simulateDraw } from './scales.js';

const N = SORTEO.numbers;
const COLS = 400, ROWS = 250;          // position grid: 400 numbers per row
const $ = (id) => document.getElementById(id);
const pad = (n) => String(n).padStart(5, '0');

const css = getComputedStyle(document.documentElement);
const v = (name) => css.getPropertyValue(name).trim();
const COLORS = {
  ground: v('--ground'), panel: v('--panel'), border: v('--border'), unit: v('--unit'), unit2: v('--unit-2'), unitHi: v('--unit-hi'),
  wire: v('--wire'), text: v('--text'),
  gordo: v('--gordo'), pedrea: v('--pedrea'), reintegro: v('--reintegro'),
};

const state = {
  lang: pickLang(),
  n: randomNumber(),
  scale: 'arroz',
  family: 'gordo',
  draw: simulateDraw(N, { pedrea: FAMILIES.pedrea.count }),
};
let t = makeT(state.lang);

function randomNumber() {
  const a = new Uint32Array(1); crypto.getRandomValues(a); return a[0] % N;
}

/* ---------- Layer 1: the drum ---------- */
function ballPosition(n) {
  // Spread numbers over the drum with the golden angle, so neighbours do not overlap.
  const a = (n * 137.508) * Math.PI / 180;
  const r = 108 * Math.sqrt(((n * 7919) % 1000) / 1000);
  return { x: 180 + r * Math.cos(a), y: 150 + r * Math.sin(a) * 0.96 };
}

function updateDrum(animate) {
  const { x, y } = ballPosition(state.n);
  $('yourBall').setAttribute('transform', `translate(${x.toFixed(1)} ${y.toFixed(1)})`);
  const tx = x < 180 ? Math.max(48, x - 70) : Math.min(312, x + 70);
  const ty = Math.max(22, y - 58);
  $('tag').setAttribute('transform', `translate(${tx.toFixed(1)} ${ty.toFixed(1)})`);
  const leader = $('leader');
  leader.setAttribute('x1', x + (tx > x ? 10 : -10)); leader.setAttribute('y1', y - 8);
  leader.setAttribute('x2', tx + (tx > x ? -30 : 30)); leader.setAttribute('y2', ty + 15);
  $('tagText').textContent = pad(state.n);
  $('drum').setAttribute('aria-label', t('hero.drum', { n: pad(state.n) }));
  if (animate) {
    const cage = $('cage');
    cage.classList.remove('spin'); void cage.getBBox(); cage.classList.add('spin');
  }
}

/* ---------- Layer 1: where your number sits ---------- */
let gridImage = null;
function gridBase() {
  if (gridImage) return gridImage;
  const off = document.createElement('canvas');
  off.width = COLS; off.height = ROWS;
  const ctx = off.getContext('2d');
  const img = ctx.createImageData(COLS, ROWS);
  const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
  const a = hex(COLORS.unit), b = hex(COLORS.unit2);
  for (let i = 0; i < N; i++) {
    const c = Math.floor(i / 10000) % 2 ? b : a;    // bands of 10,000 numbers
    img.data.set([c[0], c[1], c[2], 255], i * 4);
  }
  ctx.putImageData(img, 0, 0);
  gridImage = off;
  return off;
}

function renderGrid() {
  const canvas = $('grid');
  const dpr = Math.min(window.devicePixelRatio || 1, 3);
  const w = Math.round(canvas.clientWidth * dpr), h = Math.round(w * ROWS / COLS);
  if (!w) return;
  if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; }
  const ctx = canvas.getContext('2d');
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(gridBase(), 0, 0, w, h);
  const k = w / COLS;
  const row = Math.floor(state.n / COLS), col = state.n % COLS;
  const cx = (col + 0.5) * k, cy = (row + 0.5) * k;
  const gap = 12 * dpr;
  ctx.strokeStyle = COLORS.gordo; ctx.lineWidth = 1 * dpr;
  ctx.beginPath();
  ctx.moveTo(0, cy); ctx.lineTo(cx - gap, cy); ctx.moveTo(cx + gap, cy); ctx.lineTo(w, cy);
  ctx.moveTo(cx, 0); ctx.lineTo(cx, cy - gap); ctx.moveTo(cx, cy + gap); ctx.lineTo(cx, h);
  ctx.stroke();
  ctx.lineWidth = 2 * dpr;
  ctx.beginPath(); ctx.arc(cx, cy, 7 * dpr, 0, Math.PI * 2); ctx.stroke();
  ctx.fillStyle = COLORS.gordo;
  ctx.fillRect(cx - Math.max(k, dpr) / 2, cy - Math.max(k, dpr) / 2, Math.max(k, dpr), Math.max(k, dpr));
}

function updatePosition() {
  const row = Math.floor(state.n / COLS) + 1, col = (state.n % COLS) + 1;
  const vars = { n: pad(state.n), row: fmt(state.lang, row), col: fmt(state.lang, col) };
  $('where').textContent = `${pad(state.n)} · ${t('pos.where', vars)}`;
  $('grid').setAttribute('aria-label', t('pos.grid', vars));
  $('copies').textContent = t('pos.copies', {
    copies: fmt(state.lang, SORTEO.decimosPerNumber), series: fmt(state.lang, SORTEO.series),
  });
  const near = $('near');
  near.textContent = '';
  for (let dr = -2; dr <= 2; dr++) for (let dc = -2; dc <= 2; dc++) {
    const r = Math.floor(state.n / COLS) + dr, c = (state.n % COLS) + dc;
    if (r < 0 || r >= ROWS || c < 0 || c >= COLS) { near.append(document.createElement('span')); continue; }
    const m = r * COLS + c;
    const b = document.createElement('button');
    b.type = 'button'; b.textContent = pad(m);
    if (m === state.n) b.setAttribute('aria-current', 'true');
    else b.addEventListener('click', () => setNumber(m, true));
    near.append(b);
  }
  renderGrid();
}

/* ---------- Layer 2: the odds, at scale ---------- */
function scaleVars() {
  const kg = SCALES.arroz.totalKg;
  return {
    kg: fmt(state.lang, kg, { maximumFractionDigits: 1 }),
    g: fmt(state.lang, Math.round(FAMILIES.pedrea.count * SCALES.arroz.gramsPer1000 / 1000)),
    seats: fmt(state.lang, SCALES.estadio.seats),
    km: fmt(state.lang, SCALES.acera.lengthM / 1000),
    city: SCALES.ciudad.name,
  };
}

function renderScale() {
  const opts = {
    scale: state.scale, family: state.family, draw: state.draw, you: state.n, n: N, colors: COLORS,
    labels: { you: t('scale.you'), gordo: t('prize.gordo') },
  };
  render($('scale'), opts);
  renderLupa($('lupa'), opts);
  const vars = scaleVars();
  $('caption').textContent = t(`${state.scale}.${state.family}`, vars);
  $('fact').textContent = t(`${state.scale}.fact`, vars);
  $('scale').setAttribute('aria-label', `${t(`${state.scale}.fact`, vars)} ${t(`${state.scale}.${state.family}`, vars)}`);
}

function wireSegments() {
  document.querySelectorAll('[data-scale]').forEach((b) => b.addEventListener('click', () => {
    state.scale = b.dataset.scale;
    document.querySelectorAll('[data-scale]').forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
    renderScale();
  }));
  document.querySelectorAll('[data-family]').forEach((b) => b.addEventListener('click', () => {
    state.family = b.dataset.family;
    document.querySelectorAll('[data-family]').forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
    renderScale();
  }));
}

/* ---------- Sums, help, language ---------- */
function updateTexts() {
  applyStatic(t, state.lang);
  $('s-any').textContent = fmt(state.lang, SIMULATED.anyPrize, { style: 'percent', minimumFractionDigits: 1 });
  $('s-more').textContent = fmt(state.lang, SIMULATED.moreThanPrice, { style: 'percent', minimumFractionDigits: 1 });
  $('s-ev').textContent = fmt(state.lang, expectedValue(), { style: 'currency', currency: 'EUR' });
  $('help-official').href = HELP.official;
  $('help-phone').textContent = t('help.phone', { phone: HELP.fejarPhone });
  const credits = $('to-credits');
  credits.href = `creditos.html?lang=${state.lang}`;
}

function setNumber(n, animate) {
  state.n = ((n % N) + N) % N;
  $('num').value = pad(state.n);
  updateDrum(animate);
  updatePosition();
  renderScale();
}

function setLang(lang) {
  state.lang = lang; t = makeT(lang);
  updateTexts();
  updateDrum(false); updatePosition(); renderScale();
}

function wireInput() {
  const input = $('num');
  input.addEventListener('input', () => {
    const digits = input.value.replace(/\D/g, '').slice(0, 5);
    if (input.value !== digits) input.value = digits;
    if (digits.length === 5) setNumber(parseInt(digits, 10), true);
  });
  input.addEventListener('blur', () => {
    const digits = input.value.replace(/\D/g, '');
    setNumber(digits ? parseInt(digits, 10) : state.n, false);
  });
  input.addEventListener('keydown', (e) => { if (e.key === 'Enter') input.blur(); });
  $('random').addEventListener('click', () => setNumber(randomNumber(), true));
}

function init() {
  updateTexts();
  wireLangButtons(setLang);
  wireSegments();
  wireInput();
  setNumber(state.n, false);
  let raf = 0;
  new ResizeObserver(() => {
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(() => { renderGrid(); renderScale(); });
  }).observe(document.body);
  document.fonts?.ready.then(() => renderScale());
}

init();
