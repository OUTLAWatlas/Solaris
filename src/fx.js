/* 2D overlay: confetti + hearts bursts */
const c = document.getElementById('fx'), x = c.getContext('2d');
let W, H, parts = [], running = false;
const COLORS = ['#ff6b8b', '#ffb27a', '#ffe3e6', '#e94057', '#c77dff'];
function size() { const d = Math.min(devicePixelRatio || 1, 2); W = c.width = innerWidth * d; H = c.height = innerHeight * d; }
addEventListener('resize', size); size();

function heart(px, py, s, col, a) {
  x.save(); x.translate(px, py); x.scale(s, s); x.globalAlpha = a; x.fillStyle = col;
  x.beginPath(); x.moveTo(0, .35); x.bezierCurveTo(-1, -.4, -.55, -1, 0, -.45); x.bezierCurveTo(.55, -1, 1, -.4, 0, .35); x.fill(); x.restore();
}
function tick() {
  x.clearRect(0, 0, W, H);
  parts = parts.filter(p => p.life > 0);
  const d = W / innerWidth;
  for (const p of parts) {
    p.x += p.vx * d; p.y += p.vy * d; p.vy += p.g; p.vx *= .995; p.life--;
    const a = Math.min(1, p.life / 40);
    if (p.heart) heart(p.x, p.y, p.s * d, p.col, a); else { x.globalAlpha = a; x.fillStyle = p.col; x.fillRect(p.x, p.y, p.s * d, p.s * .6 * d); }
  }
  x.globalAlpha = 1;
  if (parts.length) requestAnimationFrame(tick); else running = false;
}
export const FX = {
  burst(n = 140) {
    for (let i = 0; i < n; i++) {
      const a = Math.random() * Math.PI * 2, sp = 3 + Math.random() * 10, h = Math.random() < .45;
      parts.push({ heart: h, x: W / 2, y: H * .62, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - 6, g: .2, s: h ? 8 + Math.random() * 11 : 6 + Math.random() * 6,
        col: COLORS[(Math.random() * COLORS.length) | 0], life: 130 + ((Math.random() * 90) | 0) });
    }
    if (!running) { running = true; requestAnimationFrame(tick); }
  }
};
