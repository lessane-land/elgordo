// A music box playing "Noche de paz" (Stille Nacht, Franz Xaver Gruber, 1818, public domain).
// Synthesised in the browser: no audio files, nothing downloaded. Only starts on a click.

const E = 0.36; // seconds per eighth note (6/8 time)
// [midi note, length in eighths]. C major. C5 = 72.
const G5 = 79, A5 = 81, E5 = 76, D6 = 86, B5 = 83, C6 = 84, F6 = 89, E6 = 88, F5 = 77, D5 = 74, C5 = 72;
const TUNE = [
  [G5, 3], [A5, 1], [G5, 2], [E5, 6], [G5, 3], [A5, 1], [G5, 2], [E5, 6],
  [D6, 4], [D6, 2], [B5, 6], [C6, 4], [C6, 2], [G5, 6],
  [A5, 4], [A5, 2], [C6, 3], [B5, 1], [A5, 2], [G5, 3], [A5, 1], [G5, 2], [E5, 6],
  [A5, 4], [A5, 2], [C6, 3], [B5, 1], [A5, 2], [G5, 3], [A5, 1], [G5, 2], [E5, 6],
  [D6, 4], [D6, 2], [F6, 3], [D6, 1], [B5, 2], [C6, 6], [E6, 6],
  [C6, 2], [G5, 2], [E5, 2], [G5, 3], [F5, 1], [D5, 2], [C5, 6],
];
// One low note per bar: C C C C · G G C C · F F C C · F F C C · G G C C · C G C
const BASS = [60, 60, 60, 60, 55, 55, 60, 60, 53, 53, 60, 60, 53, 53, 60, 60, 55, 55, 60, 60, 60, 55, 60];
const EVENTS = (() => {
  const ev = []; let t = 0;
  for (const [n, d] of TUNE) { ev.push([t, n, 0.2]); t += d; }
  BASS.forEach((n, i) => { ev.push([i * 6, n, 0.1]); ev.push([i * 6 + 3, n + 7, 0.05]); });
  return { ev: ev.sort((a, b) => a[0] - b[0]), length: t + 14 }; // a pause before it comes round again
})();

export function createMusicBox() {
  let ctx = null, out = null, timer = 0, loopStart = 0, next = 0;

  function build() {
    ctx = new (window.AudioContext || window.webkitAudioContext)();
    out = ctx.createGain(); out.gain.value = 0;
    const verb = ctx.createConvolver();
    const len = Math.floor(ctx.sampleRate * 1.8), ir = ctx.createBuffer(2, len, ctx.sampleRate);
    for (let ch = 0; ch < 2; ch++) { const d = ir.getChannelData(ch); for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 3); }
    verb.buffer = ir;
    const wet = ctx.createGain(); wet.gain.value = 0.22;
    out.connect(ctx.destination); out.connect(verb); verb.connect(wet); wet.connect(ctx.destination);
  }

  // One tine of the comb: a pure tone that rings out, with a faint metallic overtone.
  function pluck(when, midi, vel) {
    const f = 440 * Math.pow(2, (midi - 69) / 12);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, when);
    g.gain.exponentialRampToValueAtTime(vel, when + 0.006);
    g.gain.exponentialRampToValueAtTime(0.0001, when + 2.4);
    g.connect(out);
    for (const [mul, amp, dur] of [[1, 1, 2.4], [2, 0.22, 1.2], [5.4, 0.07, 0.35]]) {
      const o = ctx.createOscillator(), og = ctx.createGain();
      o.frequency.value = f * mul; og.gain.setValueAtTime(amp, when); og.gain.exponentialRampToValueAtTime(0.0001, when + dur);
      o.connect(og); og.connect(g); o.start(when); o.stop(when + 2.5);
    }
  }

  function tick() {
    const horizon = ctx.currentTime + 0.5;
    for (;;) {
      if (next >= EVENTS.ev.length) { next = 0; loopStart += EVENTS.length * E; }
      const [t, n, v] = EVENTS.ev[next];
      const when = loopStart + t * E;
      if (when > horizon) break;
      if (when >= ctx.currentTime) pluck(when, n, v);
      next++;
    }
  }

  return {
    get on() { return !!timer; },
    start() {
      if (!ctx) build();
      ctx.resume();
      loopStart = ctx.currentTime + 0.3; next = 0;
      out.gain.cancelScheduledValues(ctx.currentTime); out.gain.setValueAtTime(out.gain.value, ctx.currentTime); out.gain.linearRampToValueAtTime(0.8, ctx.currentTime + 0.6);
      tick(); timer = setInterval(tick, 150);
    },
    stop() {
      clearInterval(timer); timer = 0;
      if (ctx) { out.gain.cancelScheduledValues(ctx.currentTime); out.gain.setValueAtTime(out.gain.value, ctx.currentTime); out.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.4); }
    },
  };
}
