import * as THREE from 'three';
import gsap from 'gsap';

const FRAG = /* glsl */`
precision highp float;
uniform float uTime, uLevel;
uniform vec2 uRes;
uniform vec3 uA, uB, uC;
float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p){
  vec2 i = floor(p), f = fract(p); f = f*f*(3.0-2.0*f);
  return mix(mix(hash(i), hash(i+vec2(1,0)), f.x), mix(hash(i+vec2(0,1)), hash(i+vec2(1,1)), f.x), f.y);
}
float fbm(vec2 p){ float v = 0.0, a = 0.5; for(int i=0;i<4;i++){ v += a*noise(p); p *= 2.02; a *= 0.5; } return v; }
void main(){
  vec2 p = (gl_FragCoord.xy - 0.5*uRes) / min(uRes.x, uRes.y);
  float t = uTime * 0.045;
  vec2 q = vec2(fbm(p*1.4 + t), fbm(p*1.4 + vec2(5.2,1.3) - t));
  vec2 r = vec2(fbm(p*1.6 + q*2.0 + vec2(1.7,9.2) + t*1.5), fbm(p*1.6 + q*2.0 + vec2(8.3,2.8) - t));
  float f = fbm(p*1.2 + r*2.5);
  vec3 col = mix(uA, uB, clamp(f*1.7, 0.0, 1.0));
  col = mix(col, uC, clamp(length(q)*0.85*(0.55+uLevel*0.9), 0.0, 1.0)*0.75);
  col += uC * 0.18 * uLevel * smoothstep(1.1, 0.0, length(p));
  float vig = smoothstep(1.3, 0.2, length(p));
  col *= 0.5 + 0.65*vig;
  col += (hash(gl_FragCoord.xy + uTime) - 0.5) * 0.03;
  gl_FragColor = vec4(col, 1.0);
}`;

export const MOODS = {
  hero:  ['#1a0420', '#7a1f50', '#ff7a8a'],
  rose:  ['#2a0a22', '#8a2a55', '#ff6b8b'],
  dusk:  ['#0b1433', '#3d2a7a', '#d060a8'],
  ember: ['#1d0910', '#7a2f1a', '#ffb27a'],
  night: ['#07040f', '#1a0f38', '#7a3fd1']
};

function glowSprite() {
  const c = document.createElement('canvas'); c.width = c.height = 64;
  const x = c.getContext('2d'), g = x.createRadialGradient(32, 32, 0, 32, 32, 32);
  g.addColorStop(0, 'rgba(255,255,255,1)'); g.addColorStop(.35, 'rgba(255,200,215,.55)'); g.addColorStop(1, 'rgba(255,255,255,0)');
  x.fillStyle = g; x.fillRect(0, 0, 64, 64);
  return new THREE.CanvasTexture(c);
}

export function initBG(canvas) {
  let renderer;
  try { renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: false, powerPreference: 'high-performance' }); }
  catch (e) { return null; }
  const small = Math.min(innerWidth, innerHeight) < 700;
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, small ? 1.25 : 1.5));

  const scene = new THREE.Scene();
  const cam = new THREE.PerspectiveCamera(50, 1, 0.1, 50); cam.position.z = 7;

  const U = {
    uTime: { value: 0 }, uLevel: { value: 0 }, uRes: { value: new THREE.Vector2() },
    uA: { value: new THREE.Color(MOODS.hero[0]) }, uB: { value: new THREE.Color(MOODS.hero[1]) }, uC: { value: new THREE.Color(MOODS.hero[2]) }
  };
  const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), new THREE.ShaderMaterial({
    uniforms: U, vertexShader: 'void main(){ gl_Position = vec4(position.xy, 0.0, 1.0); }', fragmentShader: FRAG, depthTest: false, depthWrite: false
  }));
  quad.frustumCulled = false; quad.renderOrder = -1; scene.add(quad);

  /* particles: drift upward; can morph into a heart */
  const N = small ? 420 : 800;
  const pos = new Float32Array(N * 3), base = new Float32Array(N * 3), heart = new Float32Array(N * 3), spd = new Float32Array(N);
  for (let i = 0; i < N; i++) {
    base[i*3] = (Math.random() - .5) * 16; base[i*3+1] = (Math.random() - .5) * 11; base[i*3+2] = (Math.random() - .5) * 8;
    spd[i] = .15 + Math.random() * .5;
    const t = Math.random() * Math.PI * 2, k = Math.sqrt(Math.random());
    const hx = 16 * Math.pow(Math.sin(t), 3), hy = 13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t);
    heart[i*3] = hx * .17 * k; heart[i*3+1] = hy * .17 * k + .3; heart[i*3+2] = (Math.random() - .5) * .8;
  }
  const geo = new THREE.BufferGeometry(); geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  const mat = new THREE.PointsMaterial({ size: .16, map: glowSprite(), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, color: 0xffc0d0, opacity: .8 });
  const pts = new THREE.Points(geo, mat); scene.add(pts);

  const S = { morph: 0, level: 0, scroll: 0, k: 1 };
  function resize() {
    const w = innerWidth, h = innerHeight;
    renderer.setSize(w, h, false); cam.aspect = w / h; cam.updateProjectionMatrix();
    U.uRes.value.set(w * renderer.getPixelRatio(), h * renderer.getPixelRatio());
    S.k = Math.min(1, cam.aspect * 1.1);
  }
  addEventListener('resize', resize); resize();

  let last = performance.now(), run = true;
  document.addEventListener('visibilitychange', () => { run = !document.hidden; if (run) { last = performance.now(); loop(last); } });
  function loop(now) {
    if (!run) return;
    const dt = Math.min(.05, (now - last) / 1000); last = now;
    U.uTime.value += dt; U.uLevel.value += (S.level - U.uLevel.value) * .15;
    const m = S.morph, lv = U.uLevel.value, tt = U.uTime.value;
    for (let i = 0; i < N; i++) {
      const j = i * 3;
      base[j+1] += spd[i] * dt * (1 + lv); if (base[j+1] > 5.8) base[j+1] = -5.8;
      const ax = base[j] + Math.sin(tt * .4 + i) * .25, ay = base[j+1], az = base[j+2];
      const pulse = 1 + lv * .18 * m;
      const hx = heart[j] * S.k * pulse * 1.15, hy = heart[j+1] * S.k * pulse * 1.15, hz = heart[j+2];
      pos[j] = ax + (hx - ax) * m; pos[j+1] = ay + (hy - ay) * m; pos[j+2] = az + (hz - az) * m;
    }
    geo.attributes.position.needsUpdate = true;
    mat.size = .13 + lv * .09 + m * .03;
    pts.rotation.y = Math.sin(tt * .15) * .12 * (1 - m);
    renderer.render(scene, cam);
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);

  return {
    setMood(name) {
      const m = MOODS[name] || MOODS.night;
      ['uA', 'uB', 'uC'].forEach((k, i) => {
        const c = new THREE.Color(m[i]);
        gsap.to(U[k].value, { r: c.r, g: c.g, b: c.b, duration: 1.6, ease: 'power2.out', overwrite: true });
      });
    },
    setLevel(v) { S.level = v; },
    heart(ms = 6500) {
      gsap.killTweensOf(S);
      gsap.to(S, { morph: 1, duration: 2.2, ease: 'power3.inOut' });
      gsap.to(S, { morph: 0, duration: 2.4, ease: 'power2.inOut', delay: ms / 1000 });
    }
  };
}
