import './style.css';
import gsap from 'gsap';
import S from './story.js';
import { initBG } from './bg.js';
import { Music } from './audio.js';
import { buildScenes } from './scenes.js';
import { initAnimations, ScrollTrigger } from './anim.js';
import { runGate } from './gate.js';

const $ = id => document.getElementById(id);
Music.init(S.song, S.bpm);

(async function () {
  await runGate();

  // user gesture: start music first so the browser allows it
  const playing = Music.play();

  const root = $('story');
  const bg = initBG($('bg'));
  if (!bg) document.body.classList.add('nogl');   // CSS gradient fallback

  let pulse = null;
  const hooks = {
    onYes() { if (bg) { gsap.fromTo(document.body, { '--flash': 1 }, { '--flash': 0, duration: 1.2 }); } },
    onHeart() { if (bg) bg.heart(); }
  };
  buildScenes(root, hooks);
  root.hidden = false; $('progress').hidden = false;
  document.title = '365 Days of Us ❤️';
  const lenis = initAnimations(root, bg);
  window.scrollTo(0, 0);
  ScrollTrigger.refresh();

  // beat → visuals
  const t0 = performance.now();
  (function beat() {
    if (bg) bg.setLevel(Music.level((performance.now() - t0) / 1000));
    requestAnimationFrame(beat);
  })();

  // gate wipe, then hero intro
  const gate = $('gate');
  gsap.to(gate, { clipPath: 'circle(0% at 50% 50%)', duration: 1.4, ease: 'power3.inOut', onComplete: () => gate.remove() });
  if (bg) bg.setMood('hero');
  const hi = root.querySelector('.hero-in').children;
  gsap.from(hi, { opacity: 0, y: 50, filter: 'blur(14px)', duration: 1.6, stagger: .25, ease: 'power3.out', delay: .8 });

  if (await playing) $('mute').hidden = false;
  $('mute').onclick = function () { this.classList.toggle('off', Music.toggle()); };

  // live counter
  const start = new Date(S.startDate).getTime(), live = $('live');
  (function tick() {
    const d = Date.now() - start;
    if (live && d > 0) {
      const days = Math.floor(d / 864e5), h = Math.floor(d / 36e5) % 24, m = Math.floor(d / 6e4) % 60, s = Math.floor(d / 1e3) % 60;
      live.textContent = `${days} days · ${h}h ${m}m ${s}s together, and counting`;
    }
    setTimeout(tick, 1000);
  })();
})();
