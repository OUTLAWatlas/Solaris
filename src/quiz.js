/* Boyfriend Performance Review: opens after the renewal button. All text goes in via textContent (no raw HTML). */
import gsap from 'gsap';
import S from './story.js';
import { FX } from './fx.js';

const Q = S.quiz;
const EMOJI = ['💀', '😭', '😬', '😕', '😐', '🙂', '😊', '😄', '🥰', '🤩', '👑'];
const el = (t, c, x) => { const n = document.createElement(t); if (c) n.className = c; if (x != null) n.textContent = x; return n; };
let root = null;
const answers = {};            // id -> { v, text }

export function openQuiz() {
  if (root) return;
  root = el('div', 'quiz');
  root.setAttribute('data-lenis-prevent', ''); root.setAttribute('role', 'dialog'); root.setAttribute('aria-modal', 'true');
  document.body.appendChild(root); document.documentElement.classList.add('qopen');
  gsap.from(root, { opacity: 0, duration: .6 });
  intro();
}
function closeQuiz() {
  gsap.to(root, { opacity: 0, duration: .4, onComplete: () => { root.remove(); root = null; document.documentElement.classList.remove('qopen'); } });
}
function show(node) {
  root.replaceChildren(); const w = el('div', 'q-wrap'); w.appendChild(node); root.appendChild(w); root.scrollTop = 0;
  gsap.from(node, { opacity: 0, y: 24, duration: .55, ease: 'power3.out' });
}

function intro() {
  const c = el('div', 'glass q-card');
  const b = el('button', 'btn', Q.startButton);
  c.append(el('small', 'q-tag', Q.tag), el('h2', 'q-title', Q.title), el('p', 'q-intro', Q.intro), b);
  b.onclick = () => ask(0);
  show(c);
}

function ask(i) {
  const q = Q.questions[i], last = i === Q.questions.length - 1;
  const c = el('div', 'glass q-card');
  const prog = el('div', 'q-prog'), bar = el('i'); bar.style.width = (i / Q.questions.length * 100) + '%';
  prog.append(bar); c.append(prog, el('small', 'q-tag', `Question ${i + 1} of ${Q.questions.length}`), el('h3', 'q-q', q.q));
  const next = el('button', 'btn q-next', last ? Q.submitButton : 'Next →');
  const go = () => (last ? finish() : ask(i + 1));
  next.onclick = go;

  if (q.kind === 'rate') {
    let touched = false;
    const em = el('div', 'q-emoji', '😐'), num = el('div', 'q-num', '?');
    const r = document.createElement('input'); r.type = 'range'; r.min = 0; r.max = 10; r.step = 1; r.value = 5; r.className = 'q-range';
    r.setAttribute('aria-label', q.q); r.style.setProperty('--p', '50%');
    const upd = () => { const v = +r.value; em.textContent = EMOJI[v]; num.textContent = v + '/10'; r.style.setProperty('--p', (v * 10) + '%'); answers[q.id] = { v }; };
    r.addEventListener('input', () => { touched = true; next.disabled = false; next.textContent = last ? Q.submitButton : 'Next →'; upd(); });
    next.disabled = true; next.textContent = 'Slide to answer';
    const ends = el('div', 'q-ends'); ends.append(el('span', '', q.lo), el('span', '', q.hi));
    c.append(em, num, r, ends);
  } else if (q.kind === 'choice') {
    next.disabled = true; next.textContent = 'Pick one';
    const list = el('div', 'q-opts');
    q.options.forEach((o, k) => {
      const b = el('button', 'q-opt', o);
      b.onclick = () => { list.querySelectorAll('.q-opt').forEach(x => x.classList.remove('on')); b.classList.add('on'); answers[q.id] = { v: k, text: o }; next.disabled = false; next.textContent = last ? Q.submitButton : 'Next →'; };
      list.appendChild(b);
    });
    c.append(list);
  } else if (q.kind === 'renew') {
    next.hidden = true;
    const box = el('div', 'q-renew'), yes = el('button', 'btn q-yes', q.yes), no = el('button', 'q-no', q.no), tease = el('div', 'q-tease', '');
    let n = 0;
    const flee = e => {
      if (e && e.cancelable) e.preventDefault();
      const r = box.getBoundingClientRect(), nr = no.getBoundingClientRect();
      no.style.left = Math.max(0, Math.random() * (r.width - nr.width)) + 'px';
      no.style.bottom = 'auto';
      const minTop = 80;   // stays below the Renew button so it can never cover it
      no.style.top = (minTop + Math.random() * Math.max(0, r.height - nr.height - minTop)) + 'px';
      tease.textContent = q.teases[n++ % q.teases.length];
    };
    ['pointerenter', 'pointerdown', 'touchstart'].forEach(ev => no.addEventListener(ev, flee, { passive: false }));
    no.addEventListener('click', () => { tease.textContent = q.caught; });
    yes.onclick = () => { answers[q.id] = { v: 1, text: q.answer }; FX.burst(90); setTimeout(go, 700); };
    box.append(yes, no); c.append(box, tease);
  } else if (q.kind === 'text') {
    const t = document.createElement('textarea'); t.className = 'q-text'; t.maxLength = 300; t.rows = 4; t.placeholder = q.placeholder || '';
    t.addEventListener('input', () => { answers[q.id] = { text: t.value.trim() }; next.textContent = t.value.trim() ? (last ? Q.submitButton : 'Next →') : (last ? Q.submitButton : 'Skip →'); });
    next.textContent = last ? Q.submitButton : 'Skip →';
    c.append(t);
  }
  c.append(next); show(c);
}

/* ---------- scoring + guilt trip ---------- */
const rateQs = () => Q.questions.filter(q => q.kind === 'rate' && answers[q.id]);
function score() { const a = rateQs(); return a.length ? a.reduce((s, q) => s + answers[q.id].v, 0) / a.length : 0; }
const fill = (line, o) => line.replace('{n}', o.v).replace('{t}', o.text || '');

function guilt() {
  const out = [], rated = rateQs().map(q => ({ q, v: answers[q.id].v })).sort((a, b) => a.v - b.v);
  const low = rated.filter(x => x.v <= 5).slice(0, 4);
  low.forEach(x => out.push(fill(x.q.low, { v: x.v })));
  if (!low.length) out.push(Q.noGuilt);
  rated.filter(x => x.v >= 8).slice(-2).reverse().forEach(x => out.push(fill(x.q.high, { v: x.v })));
  Q.questions.forEach(q => {
    const a = answers[q.id];
    if (q.kind === 'choice' && a) out.push(q.lines[a.v]);
    if (q.kind === 'renew' && a) out.push(q.line);
    if (q.kind === 'text' && a && a.text) out.push(fill(q.line, a));
  });
  return out;
}
function summary(avg, verdict) {
  const lines = [`💌 ${Q.title}: ${S.herName}`, `Overall: ${avg.toFixed(1)}/10. ${verdict.title}`, ''];
  Q.questions.forEach((q, i) => {
    const a = answers[q.id]; let v = '(skipped)';
    if (a) v = q.kind === 'rate' ? a.v + '/10' : (a.text || (q.kind === 'renew' ? q.answer : '(skipped)'));
    lines.push(`${i + 1}. ${q.q.replace(/\s*\(.*?\)\s*/g, ' ').trim()} -> ${v}`);
  });
  return lines.join('\n');
}

async function send(avg, verdict, shown) {
  const body = { _subject: `💌 ${S.herName} rated you ${avg.toFixed(1)}/10`, _template: 'table', _captcha: 'false', name: S.herName,
    'Overall score': avg.toFixed(1) + '/10', 'Verdict shown': verdict.title };
  Q.questions.forEach((q, i) => { const a = answers[q.id]; body[`${String(i + 1).padStart(2, '0')} ${q.id}`] = a ? (q.kind === 'rate' ? a.v + '/10' : (a.text || '')) : '(skipped)'; });
  body['What she read'] = shown.join('\n');
  const ctl = new AbortController(), to = setTimeout(() => ctl.abort(), 15000);
  try {
    const r = await fetch('https://formsubmit.co/ajax/' + encodeURIComponent(Q.email), {
      method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(body), signal: ctl.signal });
    const j = await r.json().catch(() => ({}));
    return r.ok && String(j.success) !== 'false';
  } catch (e) { return false; } finally { clearTimeout(to); }
}

function finish() {
  const avg = score(), verdict = Q.verdicts.find(v => avg < v.max) || Q.verdicts[Q.verdicts.length - 1], shown = guilt();
  try { localStorage.setItem('review-answers', JSON.stringify({ at: Date.now(), avg, answers })); } catch (e) { /* storage may be blocked */ }

  // loading screen (the send happens during it)
  const c = el('div', 'glass q-card q-load'), bar = el('div', 'bar'), fillBar = el('i'), line = el('small', 'q-tag', Q.loading[0]);
  bar.appendChild(fillBar); c.append(el('h3', 'q-q', 'Calculating…'), bar, line); show(c);
  const sending = send(avg, verdict, shown);
  gsap.to(fillBar, { width: '100%', duration: 3.6, ease: 'power1.inOut' });
  Q.loading.forEach((t, i) => setTimeout(() => { line.textContent = t; }, i * 900));
  setTimeout(async () => result(avg, verdict, shown, await sending), 4200);
}

function result(avg, verdict, shown, ok) {
  const c = el('div', 'glass q-card q-res');
  const sc = el('div', 'q-score', '0.0');
  c.append(el('small', 'q-tag', 'Final score'), sc, el('h3', 'q-verdict', verdict.title), el('p', 'q-sub', verdict.sub));
  const list = el('div', 'q-lines'); shown.forEach(t => list.appendChild(el('p', 'q-line', t))); c.appendChild(list);
  const status = el('div', 'q-status');
  if (ok) { status.append(el('b', '', Q.sent), el('span', '', Q.sentSub)); }
  else {
    status.append(el('b', '', Q.failed));
    const a = el('a', 'btn q-wa', Q.failedBtn); a.target = '_blank'; a.rel = 'noopener';
    a.href = `https://wa.me/${Q.whatsapp || ''}?text=${encodeURIComponent(summary(avg, verdict))}`;
    status.appendChild(a);
  }
  const back = el('button', 'linkbtn', Q.back); back.onclick = closeQuiz;
  c.append(status, back); show(c);
  const o = { v: 0 }; gsap.to(o, { v: avg, duration: 1.6, ease: 'power2.out', onUpdate: () => { sc.textContent = o.v.toFixed(1) + '/10'; } });
  gsap.from(list.children, { opacity: 0, y: 16, duration: .7, stagger: .55, delay: 1.2, ease: 'power3.out' });
  gsap.from(status, { opacity: 0, y: 16, duration: .8, delay: 1.2 + shown.length * .55 });
  setTimeout(() => FX.burst(avg >= 7.5 ? 140 : 60), 1500);
}
