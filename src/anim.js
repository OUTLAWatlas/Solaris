import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* wrap every word (keeping <strong> etc.) in a mask so it can slide up */
export function splitWords(el) {
  const out = [];
  const walk = node => {
    [...node.childNodes].forEach(n => {
      if (n.nodeType === 3) {
        const frag = document.createDocumentFragment();
        n.textContent.split(/(\s+)/).forEach(tok => {
          if (!tok) return;
          if (/^\s+$/.test(tok)) { frag.appendChild(document.createTextNode(' ')); return; }
          const w = document.createElement('span'), i = document.createElement('span');
          w.className = 'w'; i.className = 'wi'; i.textContent = tok; w.appendChild(i); frag.appendChild(w); out.push(i);
        });
        n.replaceWith(frag);
      } else if (n.nodeType === 1) walk(n);
    });
  };
  walk(el); return out;
}

export function reveal(el, lazy) {
  if (el._done) return; el._done = true;
  el.classList.remove('lz');           // tap-revealed text starts hidden; from() below re-hides it immediately, then animates it in
  if (reduce) return;
  const c = el.classList;
  // lazy (tap-revealed) text plays when it scrolls into view via IntersectionObserver (no ScrollTrigger positions to go stale)
  const v = o => lazy ? { ...o, paused: true } : { ...o, scrollTrigger: { trigger: el, start: 'top 90%', once: true } };
  let tw;
  if (c.contains('title') || c.contains('big') || c.contains('pull')) {
    tw = gsap.from(splitWords(el), v({ yPercent: 115, opacity: 0, duration: 1.05, ease: 'power4.out', stagger: .05 }));
  } else if (c.contains('emoji')) {
    tw = gsap.from(el, v({ scale: .2, rotate: -25, opacity: 0, duration: 1.3, ease: 'elastic.out(1,.55)' }));
  } else if (c.contains('kicker')) {
    tw = gsap.from(el, v({ opacity: 0, letterSpacing: '.7em', duration: 1.3, ease: 'power3.out' }));
  } else if (c.contains('fig')) {
    tw = gsap.from(el, v({ opacity: 0, y: 70, scale: .86, duration: 1.3, ease: 'power3.out', clearProps: 'transform,opacity' }));
  } else {
    tw = gsap.from(el, v({ opacity: 0, y: 34, filter: 'blur(10px)', duration: 1.15, ease: 'power3.out', clearProps: 'filter' }));
  }
  if (lazy && tw) {
    const io = new IntersectionObserver(es => { if (es.some(e => e.isIntersecting)) { tw.play(); io.disconnect(); } }, { threshold: .05 });
    io.observe(el);
    setTimeout(() => { tw.play(); io.disconnect(); }, 25000);   // safety net: never leave text hidden
  }
}

/* for content that appears after a tap (timeline outro, gift, letter) */
export function animateIn(container) {
  container.querySelectorAll('.lz').forEach(n => reveal(n, true));
}

export function initAnimations(root, bg) {
  const lenis = new Lenis({ lerp: .09, wheelMultiplier: .9 });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add(t => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);

  root.querySelectorAll('.rv').forEach(n => reveal(n));

  if (!reduce) {
    root.querySelectorAll('.fig .ph img').forEach(img => {
      gsap.fromTo(img, { yPercent: -7 }, { yPercent: 7, ease: 'none',
        scrollTrigger: { trigger: img.closest('.fig'), scrub: true, start: 'top bottom', end: 'bottom top' } });
    });
  }

  root.querySelectorAll('.scene[data-mood]').forEach(s => {
    ScrollTrigger.create({ trigger: s, start: 'top 60%', end: 'bottom 60%',
      onToggle: self => { if (self.isActive && bg) bg.setMood(s.dataset.mood); } });
  });

  const bar = document.querySelector('#progress i');
  ScrollTrigger.create({ start: 0, end: 'max', onUpdate: self => { bar.style.transform = `scaleX(${self.progress})`; } });

  return lenis;
}

export { gsap, ScrollTrigger };
