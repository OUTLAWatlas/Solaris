/* Intro: Instagram-browser wall, then the fake RenderFlow editor render + countdown lock + optional passcode */
import S from './story.js';

const $ = id => document.getElementById(id);
const el = (t, c, x) => { const n = document.createElement(t); if (c) n.className = c; if (x != null) n.textContent = x; return n; };
const preview = /[?&]preview\b/.test(location.search);
const unlock = new Date(S.unlockAt).getTime();
const locked = () => !preview && Date.now() < unlock;
const inApp = /Instagram|FBAN|FBAV|FB_IAB/i.test(navigator.userAgent);

function fmt(ms) {
  const t = Math.max(0, Math.floor(ms / 1000)), d = Math.floor(t / 86400), h = Math.floor(t / 3600) % 24, m = Math.floor(t / 60) % 60, s = t % 60;
  return (d ? d + 'd ' : '') + h + 'h ' + m + 'm ' + s + 's';
}

function wall() {
  return new Promise(res => {
    const w = $('igwall'); w.hidden = false;
    $('ig-copy').onclick = async () => {
      try { await navigator.clipboard.writeText(location.href.split('?')[0]); }
      catch (e) { const t = el('textarea'); t.value = location.href; document.body.appendChild(t); t.select(); document.execCommand('copy'); t.remove(); }
      $('ig-copy').textContent = 'Link copied ✓ now open Safari and paste it';
    };
    $('ig-skip').onclick = () => { w.hidden = true; res(); };
  });
}

function buildEditor() {
  const tl = $('ed-tracks');
  const clips = [
    ['a1', ['song.mp3']],
  ];
  clips.forEach(([k, labels]) => {
    const row = el('div', 'trk ' + k); const gap = 1.2, w = (100 - gap * (labels.length - 1)) / labels.length;
    labels.forEach(l => { const c = el('span', 'clip', l); c.style.width = w + '%'; row.appendChild(c); });
    if (k === 'a1') { row.firstChild.classList.add('wave'); for (let i = 0; i < 90; i++) { const b = el('i'); b.style.height = (20 + Math.abs(Math.sin(i * .7) * 55) + Math.random() * 25) + '%'; row.firstChild.appendChild(b); } row.firstChild.firstChild.remove?.(); }
    tl.appendChild(row);
  });
}

export function runGate() {
  return new Promise(async resolve => {
    $('gate-title').textContent = S.intro.appName;
    $('gate-tag').textContent = S.intro.tagline;
    const btn = $('gate-btn'), line = $('gate-line'), fill = $('bar-fill'), pass = $('gate-pass'), head = $('ed-now'), ph = $('playhead');
    btn.textContent = S.intro.button;
    if (S.passcode) pass.hidden = false;
    buildEditor();
    if (inApp) await wall();

    let pct = 0, li = 0; const lines = S.intro.renderLines;
    const timer = setInterval(() => {
      pct = Math.min(100, pct + 1.6 + Math.random() * 3.6);
      fill.style.width = pct + '%'; ph.style.left = pct + '%';
      const want = Math.min(lines.length - 1, Math.floor(pct / (100 / lines.length)));
      if (want !== li || !line.textContent) { li = want; line.textContent = lines[li]; head.textContent = lines[li]; }
      if (pct >= 100) { clearInterval(timer); ready(); }
    }, 150);

    function ready() {
      const open = () => { line.textContent = S.intro.doneLine; head.textContent = S.intro.doneLine; btn.hidden = false; };
      if (!locked()) return open();
      (function tick() {
        if (!locked()) return open();
        line.textContent = S.intro.lockedLine + ' ' + fmt(unlock - Date.now());
        setTimeout(tick, 1000);
      })();
    }

    btn.onclick = () => {
      if (S.passcode && pass.value.trim().toLowerCase() !== S.passcode.toLowerCase()) {
        pass.classList.add('bad'); pass.focus(); setTimeout(() => pass.classList.remove('bad'), 600); return;
      }
      resolve();
    };
  });
}
