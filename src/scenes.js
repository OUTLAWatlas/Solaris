/* Builds the DOM for every section from story.js. Text always goes in via textContent: no raw HTML. */
import gsap from 'gsap';
import S from './story.js';
import { FX } from './fx.js';
import { animateIn } from './anim.js';

const el = (t, c, x) => { const n = document.createElement(t); if (c) n.className = c; if (x != null) n.textContent = x; return n; };

function rich(node, text) {
  text.split(/(\*\*[^*]+\*\*)/).forEach(s => {
    if (!s) return;
    if (s.startsWith('**')) { const b = document.createElement('strong'); b.textContent = s.slice(2, -2); node.appendChild(b); }
    else node.appendChild(document.createTextNode(s));
  });
  return node;
}
function paras(parent, list, lazy) {
  (list || []).forEach(it => {
    let cls = 'body', t = it;
    if (Array.isArray(it)) { cls = it[0]; t = it[1]; }
    const p = el('p', cls + (lazy ? ' lz' : ' rv')); rich(p, t); parent.appendChild(p);
  });
  return parent;
}
const head = (parent, d) => parent.append(el('p', 'kicker rv', d.kicker), el('h2', 'title rv', d.title));
const scene = (mood, cls) => { const s = el('section', 'scene' + (cls ? ' ' + cls : '')); s.dataset.mood = mood || 'night'; return s; };

/* lightbox */
const lb = el('div', 'lb'); lb.hidden = true;
const lbi = new Image(), lbc = el('div', 'lbc'); lb.append(lbi, lbc);
lb.onclick = () => { lb.hidden = true; };
document.body.appendChild(lb);

function fig(p, cls) {
  const src = typeof p === 'string' ? p : p.src, cap = typeof p === 'string' ? '' : (p.cap || '');
  const f = el('figure', 'fig rvf ' + (cls || '')), ph = el('div', 'ph'), img = new Image();
  img.alt = cap; img.loading = 'lazy'; img.decoding = 'async'; img.src = src;
  img.onerror = () => { img.remove(); f.classList.add('missing'); ph.appendChild(el('span', 'miss', '📷 ' + src.split('/').pop())); };
  ph.appendChild(img); f.appendChild(ph);
  if (cap) f.appendChild(el('figcaption', '', cap));
  f.addEventListener('click', () => {
    if (f.classList.contains('missing') || cls === 'pol') return;
    lbi.src = src; lbc.textContent = cap; lb.hidden = false;
  });
  return f;
}

/* ---------- phone mockup (Chapter 02) ---------- */
function phoneUI(cfg) {
  const phone = el('div', 'phone'), screen = el('div', 'screen');
  phone.append(el('div', 'notch'), screen);
  let timer = null;
  const set = state => {
    clearInterval(timer); screen.replaceChildren(); screen.dataset.state = state;
    if (state === 'idle') {
      screen.append(el('div', 'lk-time', '11:54'), el('div', 'lk-date', 'Wednesday, 12 November'), el('div', 'lk-hint', '🌙'));
    } else if (state === 'sent' || state === 'read') {
      const top = el('div', 'chat-top'); top.append(el('span', 'av', '🐨'), el('span', '', cfg.contact));
      const body = el('div', 'chat-body');
      body.append(el('div', 'stamp-t', 'Today 11:55 PM'));
      const b = el('div', 'bub out', cfg.sent); body.append(b);
      body.append(el('div', 'dlv', state === 'read' ? 'Read' : 'Delivered'));
      if (state === 'read') {
        const card = el('div', 'linkcard'); card.append(el('b', '', 'RenderFlow'), el('span', '', 'Your AI-powered video editing assistant.'));
        body.append(card);
      }
      screen.append(top, body);
      gsap.from(b, { scale: .6, opacity: 0, transformOrigin: 'right bottom', duration: .6, ease: 'back.out(2)' });
    } else if (state === 'ring') {
      screen.append(el('div', 'ring-av', '🐨'), el('div', 'call-name', cfg.contact), el('div', 'call-sub', 'calling…'));
      screen.append(el('i', 'pulse'), el('i', 'pulse p2'));
    } else if (state === 'call') {
      const tm = el('div', 'call-sub', '00:00'); let s = 0;
      screen.append(el('div', 'ring-av', '🐨'), el('div', 'call-name', cfg.contact), tm, el('div', 'hearts-float', '❤️'));
      timer = setInterval(() => { s++; tm.textContent = String(Math.floor(s / 60)).padStart(2, '0') + ':' + String(s % 60).padStart(2, '0'); }, 1000);
    }
  };
  set('idle');
  return { phone, set };
}

const R = {
  hero(d) {
    const s = scene('hero', 'hero');
    const bg = new Image(); bg.className = 'hero-bg'; bg.alt = ''; bg.src = d.bg; bg.onerror = () => bg.remove(); s.appendChild(bg);
    const w = el('div', 'hero-in');
    const live = el('p', 'live'); live.id = 'live';
    w.append(el('h1', 'hero-title', d.title), el('p', 'hero-sub', d.sub), el('p', 'hero-ep', d.epigraph), live, el('div', 'scroll-hint', '↓'));
    s.appendChild(w); return s;
  },

  editorial(d) { const s = scene(d.mood), w = el('div', 'wrap'); head(w, d); paras(w, d.paras); s.appendChild(w); return s; },

  chapter(d) {
    const s = scene(d.mood), g = el('div', 'chapter'), ph = el('div', 'photos');
    (d.photos || []).forEach((p, i, a) => {
      const f = fig(p, 'pol'); f.style.setProperty('--r', (a.length === 1 ? -2.5 : (i - (a.length - 1) / 2) * 6) + 'deg'); ph.appendChild(f);
    });
    const t = el('div', 'text'); head(t, d); paras(t, d.paras);
    if (d.photos && d.photos.length) g.appendChild(ph); else g.classList.add('solo');
    g.appendChild(t); s.appendChild(g); return s;
  },

  timeline(d) {
    const s = scene(d.mood, 'tl'), w = el('div', 'wrap'); head(w, d); paras(w, d.intro);
    const ui = phoneUI(d.phone), stage = el('div', 'stage'), cap = el('div', 'cap');
    const btn = el('button', 'btn next', d.startLabel || 'Next →');
    const after = el('div', 'after-steps'); paras(after, d.after, true); after.hidden = true;
    stage.append(ui.phone, cap, btn);
    let i = 0;
    btn.onclick = () => {
      const st = d.steps[i];
      ui.set(d.phones[i] || 'call');
      const swap = () => {
        cap.replaceChildren();
        if (st.time) cap.appendChild(el('span', 'time', st.time));
        cap.appendChild(rich(el('p', st.big ? 'capbig' : 'captxt'), st.text));
        gsap.fromTo(cap, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: .7, ease: 'power3.out' });
      };
      cap.children.length ? gsap.to(cap, { opacity: 0, duration: .25, onComplete: swap }) : swap();
      if (st.fx) { FX.burst(); S._onYes && S._onYes(); }
      i++; btn.textContent = 'Next →';
      if (i >= d.steps.length) { btn.hidden = true; after.hidden = false; setTimeout(() => animateIn(after), 800); }
    };
    w.append(stage, after); s.appendChild(w); return s;
  },

  gallery(d) {
    const s = scene(d.mood), w = el('div', 'wrap wide'); head(w, d); paras(w, d.before);
    if (d.photos && d.photos.length) { const g = el('div', 'grid'); d.photos.forEach(p => g.appendChild(fig(p, 'tile'))); w.appendChild(g); }
     paras(w, d.after); s.appendChild(w); return s;
  },

  carousel(d) {
    const s = scene(d.mood), w = el('div', 'wrap wide'); head(w, d); paras(w, d.intro);
    d.blocks.forEach(b => {
      const blk = el('div', 'block'); blk.appendChild(el('h3', 'sub rv', b.title)); paras(blk, b.paras);
      if (b.photos && b.photos.length) { const rail = el('div', 'rail'); b.photos.forEach(p => rail.appendChild(fig(p, 'card'))); blk.appendChild(rail); } w.appendChild(blk);
    });
    s.appendChild(w); return s;
  },

  split(d) {
    const s = scene('night', 'splitscene'), top = el('div', 'wrap'); head(top, d); s.appendChild(top);
    const g = el('div', 'split');
    [['L', d.left], ['R', d.right]].forEach(([k, side]) => {
      const p = el('div', 'panel ' + k); p.appendChild(el('p', 'kicker rv', side.label)); paras(p, side.paras); g.appendChild(p);
    });
    s.appendChild(g); return s;
  },

  polaroids(d) {
    const s = scene(d.mood), w = el('div', 'wrap wide'); head(w, d); paras(w, d.before);
    const bag = el('div', 'scatter');
    d.photos.forEach((p, i) => { const f = fig(p, 'pol'); f.style.setProperty('--r', ((i % 2 ? 1 : -1) * (2 + (i * 3) % 6)) + 'deg'); f.onclick = () => f.classList.toggle('up'); bag.appendChild(f); });
    w.append(bag, el('p', 'hint', d.hint || '')); paras(w, d.after); s.appendChild(w); return s;
  },

  gift(d) {
    const s = scene(d.mood), w = el('div', 'wrap'); head(w, d); paras(w, d.before);
    const box = el('button', 'giftbox'); box.append(el('span', 'gift', '🎁'), el('span', 'body', d.boxLabel));
    const rev = el('div', 'reveal'); rev.hidden = true;
    rev.appendChild(el('div', 'stampbig', d.reveal));
    const pair = el('div', 'pair'); if (d.photos && d.photos.length) { d.photos.forEach(p => pair.appendChild(fig(p, 'pol'))); rev.appendChild(pair); }
    paras(rev, d.after, true);
    box.onclick = () => {
      FX.burst();
      gsap.to(box, { scale: 1.5, opacity: 0, rotate: 12, duration: .6, ease: 'power2.in', onComplete: () => {
        box.hidden = true; rev.hidden = false;
        gsap.from(rev.querySelector('.stampbig'), { scale: 2.4, opacity: 0, duration: .9, ease: 'expo.out' });
        if (pair.children.length) gsap.from(pair.children, { y: 80, opacity: 0, rotate: 0, duration: 1, stagger: .2, ease: 'power3.out', clearProps: 'transform,opacity' });
        animateIn(rev);
      } });
    };
    w.append(box, rev); s.appendChild(w); return s;
  },

  letter(d) {
    const s = scene(d.mood), w = el('div', 'wrap'); head(w, d);
    const env = el('button', 'env'); env.append(el('span', 'flap', '💌'), el('span', 'body', d.openLabel));
    const paper = el('div', 'paper'); paras(paper, d.paras, true);
    env.onclick = () => {
      gsap.to(env, { scale: .6, opacity: 0, duration: .5, onComplete: () => { env.hidden = true; } });
      paper.classList.add('open');
      gsap.fromTo(paper, { height: 0 }, { height: 'auto', duration: 2.2, ease: 'power2.inOut', onComplete: () => animateIn(paper) });
      setTimeout(() => animateIn(paper), 600);
    };
    w.append(env, paper); s.appendChild(w); return s;
  },

  finale(d) {
    const s = scene(d.mood, 'finalescene'), w = el('div', 'wrap'); head(w, d); paras(w, d.paras);
    const ps = d.ps, card = el('div', 'glass ps rv');
    card.append(el('h3', '', ps.appName), el('small', '', ps.heading), el('p', '', ps.text));
    const b = el('button', 'btn', ps.button), sign = el('p', 'sign'); sign.hidden = true;
    ps.after.split('\n').forEach((ln, i) => { if (i) sign.appendChild(document.createElement('br')); sign.appendChild(document.createTextNode(ln)); });
    b.onclick = () => {
      b.hidden = true; sign.hidden = false; gsap.from(sign, { opacity: 0, y: 20, duration: 1 });
      FX.burst(170); setTimeout(() => FX.burst(120), 800); setTimeout(() => FX.burst(120), 1700);
      S._onHeart && S._onHeart();
    };
    card.append(b, sign); w.appendChild(card); s.appendChild(w); return s;
  }
};

export function buildScenes(root, hooks) {
  S._onYes = hooks.onYes; S._onHeart = hooks.onHeart;
  S.sections.forEach(d => root.appendChild(R[d.type](d)));
}
