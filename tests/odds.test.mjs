// node tests/odds.test.mjs
// Re-derives every figure the site shows from the 2026 prize table and a seeded
// simulation, so the copy can never quietly drift from the maths.
import assert from 'node:assert/strict';
import { SORTEO, PRIZES, SIMULATED, SCALES, netPrize, expectedValue } from '../assets/js/data.js';

const N = SORTEO.numbers;

/* ---------- static table and totals ---------- */
assert.equal(SORTEO.series * 10, SORTEO.decimosPerNumber);
assert.equal(SORTEO.series * N * 10 * SORTEO.decimoPrice, SORTEO.emission);
const perSeries = PRIZES.reduce((s, p) => s + p.count * p.perDecimo * 10, 0);
assert.equal(perSeries, 14_000_000, 'each series pays 14 million');
assert.equal(perSeries * SORTEO.series, SORTEO.prizePool);
assert.equal(expectedValue().toFixed(2), '14.00');

/* ---------- tax (gravamen especial, 20 % over 40,000) ---------- */
assert.equal(netPrize(400000), 328000);
assert.equal(netPrize(125000), 108000);
assert.equal(netPrize(50000), 48000);
assert.equal(netPrize(20000), 20000);

/* ---------- scales ---------- */
assert.equal(SCALES.arroz.totalKg, 2.1);
assert.equal(SCALES.acera.lengthM, 2000);

/* ---------- the 100 friends breakdown is internally consistent ---------- */
const f = SIMULATED.friends;
assert.equal(f.nothing + f.back + f.more, 100, 'friends sum to 100');
assert.equal(SIMULATED.groupGordoOdds, N / 100, 'group holds the Gordo 1 in 1000');
assert.equal(SIMULATED.friendsMean, 100 * expectedValue(), 'mean = 100 x EV');

/* ---------- seeded simulation ---------- */
function mulberry32(a) { return () => { a |= 0; a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
const rnd = mulberry32(2026);
const rint = (m) => Math.floor(rnd() * m);
function sampleDistinct(k, m) { const s = new Set(); while (s.size < k) s.add(rint(m)); return [...s]; }

function makeDraw() {
  const nums = sampleDistinct(1807, N);
  const [p1, p2, p3] = nums; const p4 = nums.slice(3, 5), p5 = nums.slice(5, 13);
  const ped = new Set(nums.slice(13));
  return { p1, p2, p3, p4, p5, ped };
}
function value(x, d) {
  let v = 0;
  if (x === d.p1) v += 400000;
  if (x === d.p2) v += 125000;
  if (x === d.p3) v += 50000;
  if (d.p4.includes(x)) v += 20000;
  if (d.p5.includes(x)) v += 6000;
  if (d.ped.has(x)) v += 100;
  for (const [p, a] of [[d.p1, 2000], [d.p2, 1250], [d.p3, 960]]) if (x === (p + N - 1) % N || x === (p + 1) % N) v += a;
  for (const p of [d.p1, d.p2, d.p3, ...d.p4]) if (Math.floor(x / 100) === Math.floor(p / 100) && x !== p) v += 100;
  for (const p of [d.p1, d.p2, d.p3]) if (x % 100 === p % 100 && x !== p) v += 100;
  if (x % 10 === d.p1 % 10 && x !== d.p1) v += 20;
  return v;
}

// Population shares, from sampled numbers across many draws.
let any = 0, more = 0, cells = 0;
for (let i = 0; i < 1200; i++) {
  const d = makeDraw();
  for (const x of sampleDistinct(800, N)) { const v = value(x, d); cells++; if (v > 0) any++; if (v > 20) more++; }
}
const anyShare = any / cells, moreShare = more / cells;
assert.ok(Math.abs(anyShare - SIMULATED.anyPrize) < 0.004, `any prize ${anyShare.toFixed(4)}`);
assert.ok(Math.abs(moreShare - SIMULATED.moreThanPrice) < 0.004, `more than price ${moreShare.toFixed(4)}`);

// 100 friends: counts and the typical and average total.
let cN = 0, cB = 0, cM = 0; const totals = [];
for (let i = 0; i < 2500; i++) {
  const d = makeDraw(); const friends = sampleDistinct(100, N); let tot = 0, n0 = 0, b = 0, m = 0;
  for (const x of friends) { const v = value(x, d); tot += v; if (v === 0) n0++; else if (v === 20) b++; else m++; }
  cN += n0; cB += b; cM += m; totals.push(tot);
}
totals.sort((a, b) => a - b);
const median = totals[totals.length >> 1], mean = totals.reduce((s, x) => s + x, 0) / totals.length;
assert.ok(Math.abs(cN / 2500 - f.nothing) < 0.8, `nothing ${(cN / 2500).toFixed(1)}`);
assert.ok(Math.abs(cB / 2500 - f.back) < 0.8, `back ${(cB / 2500).toFixed(1)}`);
assert.ok(Math.abs(cM / 2500 - f.more) < 0.8, `more ${(cM / 2500).toFixed(1)}`);
assert.ok(median >= 620 && median <= 820, `median ${median}`);
assert.ok(mean >= 1250 && mean <= 1550, `mean ${Math.round(mean)}`);

console.log('ok', {
  anyPrize: anyShare.toFixed(4), moreThanPrice: moreShare.toFixed(4), ev: expectedValue(),
  friends: { nothing: +(cN / 2500).toFixed(1), back: +(cB / 2500).toFixed(1), more: +(cM / 2500).toFixed(1) },
  median, mean: Math.round(mean),
});
