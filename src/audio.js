/* Music + level meter.
   Desktop/Android: real beat analysis via Web Audio.
   iPhone: plays the file directly (so the ringer switch behaves like a normal media player)
   and drives the visuals with a gentle tempo pulse instead. */
const isIOS = /iP(hone|ad|od)/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

let el = null, ok = true, muted = false, target = .75, playing = false, bpm = 90;
let ctx = null, an = null, buf = null, smooth = 0;

function fade(to, ms) {
  if (!el) return;
  const from = el.volume, t0 = performance.now();
  (function step(t) {
    const k = Math.min(1, (t - t0) / ms);
    el.volume = Math.max(0, Math.min(1, from + (to - from) * k));
    if (k < 1) requestAnimationFrame(step);
  })(t0);
}

export const Music = {
  init(src, tempo) {
    bpm = tempo || 90;
    el = new Audio(src); el.loop = true; el.volume = 0; el.preload = 'auto'; el.playsInline = true;
    el.addEventListener('error', () => { ok = false; });
  },
  async play() {
    if (!el || !ok) return false;
    try {
      if (!isIOS && !ctx) {
        const AC = window.AudioContext || window.webkitAudioContext;
        ctx = new AC(); const src = ctx.createMediaElementSource(el);
        an = ctx.createAnalyser(); an.fftSize = 256; an.smoothingTimeConstant = .8;
        src.connect(an); an.connect(ctx.destination); buf = new Uint8Array(an.frequencyBinCount);
      }
      if (ctx && ctx.state === 'suspended') await ctx.resume();
      await el.play(); fade(target, 3000); playing = true; return true;
    } catch (e) { return false; }
  },
  toggle() {
    if (!el || !ok) return muted;
    muted = !muted; fade(muted ? 0 : target, 400); return muted;
  },
  /* 0..1, call every frame */
  level(t) {
    let v = 0;
    if (an && playing && !muted) {
      an.getByteFrequencyData(buf);
      let s = 0; for (let i = 1; i < 9; i++) s += buf[i];
      v = Math.min(1, (s / 8 / 255) * 1.35);
    } else {
      const ph = (t * bpm / 60) % 1;
      v = (playing && !muted ? .55 : .2) * Math.pow(1 - ph, 3);
    }
    smooth += (v - smooth) * .25; return smooth;
  },
  get available() { return ok; }
};
