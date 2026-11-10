// node tests/odds.test.mjs
// Checks the figures the page shows against the prize table in data.js.
import assert from 'node:assert/strict';
import { SORTEO, PRIZES, SIMULATED, SCALES, netPrize, expectedValue } from '../assets/js/data.js';

const N = SORTEO.numbers;

// Table and totals
assert.equal(SORTEO.series * 10, SORTEO.decimosPerNumber);
assert.equal(SORTEO.series * N * 10 * SORTEO.decimoPrice, SORTEO.emission);
const perSeries = PRIZES.reduce((s, p) => s + p.count * p.perDecimo * 10, 0);
assert.equal(perSeries, 14_000_000, 'each series pays 14 million');
assert.equal(perSeries * SORTEO.series, SORTEO.prizePool);
assert.equal(expectedValue().toFixed(2), '14.00');

// Tax
assert.equal(netPrize(400000), 328000);
assert.equal(netPrize(125000), 108000);
assert.equal(netPrize(50000), 48000);
assert.equal(netPrize(20000), 20000);

// Scales
assert.equal(SCALES.arroz.totalKg, 2.1);
assert.equal(SCALES.acera.lengthM, 2000);

// Simulated shares: re-run the simulation and check the page's rounded values.
function draw() {
  const pick = new Set();
  while (pick.size < 1807) pick.add(Math.floor(Math.random() * N));
  const nums = [...pick];
  const [p1, p2, p3] = nums; const p4 = nums.slice(3, 5);
  const win = new Set(nums);
  for (const p of [p1, p2, p3]) { win.add((p + N - 1) % N); win.add((p + 1) % N); }
  for (const p of [p1, p2, p3, ...p4]) { const c = Math.floor(p / 100) * 100; for (let i = c; i < c + 100; i++) win.add(i); }
  for (const p of [p1, p2, p3]) for (let i = p % 100; i < N; i += 100) win.add(i);
  const r = p1 % 10;
  for (let i = r; i < N; i += 10) win.add(i);
  let more = 0; for (const x of win) if (x % 10 !== r) more++;
  return [win.size / N, more / N];
}
let any = 0, more = 0; const runs = 300;
for (let i = 0; i < runs; i++) { const [a, m] = draw(); any += a; more += m; }
any /= runs; more /= runs;
assert.ok(Math.abs(any - SIMULATED.anyPrize) < 0.002, `any prize ${any}`);
assert.ok(Math.abs(more - SIMULATED.moreThanPrice) < 0.002, `more than price ${more}`);

console.log('ok', { anyPrize: any.toFixed(4), moreThanPrice: more.toFixed(4), ev: expectedValue() });
