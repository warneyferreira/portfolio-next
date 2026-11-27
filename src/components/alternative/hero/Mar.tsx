"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import s from "./hero.module.css";

/* O mar do hero, em Three.js, impresso como uma xilogravura.

   Uma malha densa perto da câmera e rala no horizonte, deslocada no vertex
   shader por seis ondas de Gerstner que vêm na direção de quem olha. O
   fragment shader não ilumina: separa o mar em quatro faixas chapadas de
   tinta (prússia, cobalto, mar, raso), risca curvas de nível da altura
   (as linhas de A Grande Onda), põe espuma de papel com contorno de
   nanquim onde a superfície se comprime e uma retícula de respingos em
   volta dela. O céu é transparente: o papel e o nome (DOM, por baixo do
   canvas) aparecem acima do horizonte, e as cristas mais altas que a câmera
   passam por cima das letras.

   Toque/clique no mar: uma onda circular parte dali; o cursor deixa um
   rastro leve. Na rolagem (--scene, escrito por Parallax.tsx no header) a
   câmera desce, atravessa a superfície e afunda até o azul-noite exato do
   Sobre (--alt-deep).

   Custo: só desenha com o hero na tela e a aba visível; DPR até 1.75
   (1.5 no celular), malha menor no celular. Movimento reduzido: um quadro
   parado, sem mergulho nem ondulações. Sem WebGL: o canvas não aparece e
   fica o mar em CSS (.marCss) por baixo. */

// Fração das ondas que sobra logo abaixo da câmera (shader e CPU).
const NEAR_CALM = 0.35;

const VERT = /* glsl */ `
uniform float uTime;
uniform float uWaveTime;
uniform float uAmp;
uniform vec4 uWaves[6];   // direção xy, inclinação, comprimento
uniform vec4 uRipples[8]; // x, z, início (s), força
uniform vec3 uCam;

varying vec3 vWorld;
varying vec3 vNormal;
varying float vJ;
varying float vH;
varying float vRip;
varying float vDist;

void main() {
  vec2 xz = position.xz;
  float dist = length(xz - uCam.xz);
  vec3 p = vec3(xz.x, 0.0, xz.y);
  vec3 T = vec3(1.0, 0.0, 0.0);
  vec3 B = vec3(0.0, 0.0, 1.0);

  for (int i = 0; i < 6; i++) {
    vec4 w = uWaves[i];
    vec2 d = w.xy;
    float L = w.w;
    float k = 6.2831853 / L;
    float c = sqrt(9.8 / k);
    // Onda curta some antes no horizonte: nada de cintilar. Sob a câmera o
    // mar acalma (NEAR_CALM): ela não fura a água, as cristas de longe sim.
    float att = (1.0 - smoothstep(L * 10.0, L * 45.0, dist)) * uAmp
      * mix(${NEAR_CALM.toFixed(2)}, 1.0, smoothstep(3.0, 14.0, dist));
    float st = w.z * att;
    float a = st / k;
    float f = k * (dot(d, xz) - c * uWaveTime);
    float sf = sin(f);
    float cf = cos(f);
    p.x += d.x * a * cf;
    p.y += a * sf;
    p.z += d.y * a * cf;
    T += vec3(-d.x * d.x * st * sf, d.x * st * cf, -d.x * d.y * st * sf);
    B += vec3(-d.x * d.y * st * sf, d.y * st * cf, -d.y * d.y * st * sf);
  }

  vec3 n = normalize(cross(B, T));
  // Jacobiano horizontal: < 1 onde a água se comprime (crista).
  float J = T.x * B.z - T.z * B.x;

  float rip = 0.0;
  vec2 grad = vec2(0.0);
  for (int i = 0; i < 8; i++) {
    vec4 r = uRipples[i];
    float age = uTime - r.z;
    if (r.w <= 0.0 || age < 0.0 || age > 7.0) continue;
    vec2 off = xz - r.xy;
    float d = length(off) + 1e-4;
    float front = 4.2 * age;
    float behind = front - d;
    float env = r.w * exp(-age * 0.7) * smoothstep(-0.8, 0.8, behind)
      * exp(-max(behind, 0.0) * 0.32) / (1.0 + d * 0.22);
    float ph = 2.2 * (d - front);
    p.y += env * cos(ph);
    float dh = -env * 2.2 * sin(ph);
    grad += dh * off / d;
    rip += abs(dh);
  }
  n = normalize(n + vec3(-grad.x, 0.0, -grad.y));

  vWorld = p;
  vNormal = n;
  vJ = J;
  vH = p.y;
  vRip = rip;
  vDist = dist;
  gl_Position = projectionMatrix * viewMatrix * vec4(p, 1.0);
}
`;

const PALETTE = /* glsl */ `
const vec3 DEEP = vec3(4.0, 16.0, 37.0) / 255.0;
const vec3 PRUSSIA = vec3(11.0, 31.0, 58.0) / 255.0;
const vec3 COBALT = vec3(11.0, 69.0, 151.0) / 255.0;
const vec3 SEA = vec3(31.0, 95.0, 168.0) / 255.0;
const vec3 SHALLOW = vec3(156.0, 195.0, 238.0) / 255.0;
const vec3 PAPER = vec3(254.0, 245.0, 221.0) / 255.0;

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float vnoise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
             mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}

// A água vista de dentro: azul-noite embaixo, cobalto perto da superfície.
vec3 waterAt(float sy, float abyss) {
  vec3 w = mix(DEEP, COBALT, pow(clamp(sy, 0.0, 1.0), 1.7) * 0.8);
  return mix(w, DEEP, abyss);
}
`;

const FRAG = /* glsl */ `
uniform vec3 uCam;
uniform vec2 uRes;
uniform float uDpr;
uniform float uTime;
uniform float uAbyss;

varying vec3 vWorld;
varying vec3 vNormal;
varying float vJ;
varying float vH;
varying float vRip;
varying float vDist;

${PALETTE}

float band(float x, float edge) {
  float aa = fwidth(x) * 1.2 + 1e-4;
  return smoothstep(edge - aa, edge + aa, x);
}

void main() {
  vec3 n = normalize(vNormal);
  vec3 v = normalize(uCam - vWorld);
  float sy = gl_FragCoord.y / uRes.y;
  float near = 1.0 - smoothstep(30.0, 110.0, vDist);
  vec3 col;

  // Curvas de nível da altura: as linhas da gravura.
  float hl = vH * 5.5;
  float fw = fwidth(hl) + 1e-4;
  float dl = abs(fract(hl) - 0.5) / fw;
  float line = (1.0 - smoothstep(0.5, 1.3, dl)) * (1.0 - smoothstep(0.12, 0.35, fw));

  if (gl_FrontFacing) {
    // A face da onda que vem para a câmera clareia; o vale fica prússia.
    float face = n.z * 0.9 + n.x * 0.25;
    float tone = 0.42 + face * 1.1 + vH * 0.22 + (1.0 - vJ) * 0.35;

    col = PRUSSIA;
    col = mix(col, COBALT, band(tone, 0.3));
    col = mix(col, SEA, band(tone, 0.6));
    col = mix(col, SHALLOW, band(tone, 0.98));
    col = mix(col, mix(col, DEEP, 0.7), line * 0.65);

    // Espuma: onde a água se comprime e sobe, só perto (longe a derivada
    // explode e vira faixa). Borda de nanquim por fora.
    float mid = 1.0 - smoothstep(28.0, 75.0, vDist);
    float nz = vnoise(vWorld.xz * 1.4 + vec2(0.0, uTime * 0.35)) * 0.5
             + vnoise(vWorld.xz * 4.3 - uTime * 0.2) * 0.25;
    float field = ((1.0 - vJ) * 1.75 + vH * 0.3 + nz * 0.4 + vRip * 1.6) * mid;
    float ff = min(fwidth(field), 0.2) + 1e-4;
    float foam = smoothstep(1.18 - ff, 1.18 + ff, field);
    float edge = 1.0 - smoothstep(0.0, ff * 1.6, abs(field - 1.15));

    // Respingos em retícula a 45°, como as nuvens do resto da página.
    vec2 g = mat2(0.7071, -0.7071, 0.7071, 0.7071) * (gl_FragCoord.xy / (uDpr * 5.0));
    vec2 cell = fract(g) - 0.5;
    float spray = smoothstep(0.98, 1.18, field) * (1.0 - smoothstep(12.0, 45.0, vDist));
    float rad = sqrt(spray) * 0.5;
    float dotm = (1.0 - smoothstep(rad - 0.07, rad + 0.07, length(cell))) * step(0.02, spray);

    // Ondulação do toque: anéis de papel onde ela inclina a água.
    float ring = smoothstep(0.16, 0.24, vRip) * mid;
    col = mix(col, PAPER, max(max(foam, dotm), ring));
    col = mix(col, PRUSSIA, edge * 0.9 * mid * (1.0 - foam));
    // Contorno das cristas de lado: separa a espuma do papel do céu.
    float rim = 1.0 - smoothstep(0.05, 0.14, dot(n, v));
    col = mix(col, PRUSSIA, rim * mid);

    // Longe: cobalto chapado até o horizonte, linha firme contra o papel.
    col = mix(col, mix(COBALT, PRUSSIA, 0.3), smoothstep(110.0, 620.0, vDist));
    // Perto da base escurece até o azul-noite: contraste para o chão.
    col = mix(col, DEEP, (1.0 - smoothstep(0.0, 0.34, sy)) * 0.82);
    col += (hash(gl_FragCoord.xy) - 0.5) * 0.03;
  } else {
    // Por baixo: a janela de luz (olhando para cima) clareia; de lado, a
    // superfície espelha o fundo. As curvas de nível viram cáusticas.
    float up = max(dot(-n, v), 0.0);
    col = mix(COBALT, SEA, band(up, 0.55));
    col = mix(col, SHALLOW, max(band(up, 0.86), line * 0.8));
    col = mix(col, waterAt(sy, 0.0), smoothstep(8.0, 70.0, vDist));
  }

  col = mix(col, DEEP, uAbyss);
  gl_FragColor = vec4(col, 1.0);
}
`;

const BG_VERT = /* glsl */ `
void main() { gl_Position = vec4(position.xy, 0.0, 1.0); }
`;

const BG_FRAG = /* glsl */ `
uniform vec2 uRes;
uniform float uTime;
uniform float uUnder;
uniform float uAbyss;
${PALETTE}
void main() {
  vec2 q = gl_FragCoord.xy / uRes;
  vec3 col = waterAt(q.y, 0.0);
  // Feixes de luz inclinados, de borda dura como um entalhe; somem no fundo.
  float s = q.x * 5.0 + q.y * 1.6;
  float w = sin(s * 3.1 + sin(s * 1.3 + uTime * 0.25) * 1.4 + uTime * 0.15);
  float aa = fwidth(w) + 1e-4;
  col = mix(col, SEA, smoothstep(0.72 - aa, 0.72 + aa, w) * q.y * q.y * 0.55);
  gl_FragColor = vec4(mix(col, DEEP, uAbyss), uUnder);
}
`;

// Bolhas que sobem enquanto a câmera afunda: pontos de papel, retícula solta.
const BUBBLE_VERT = /* glsl */ `
attribute float aSeed;
uniform float uTime;
uniform float uPx;
varying float vFade;
void main() {
  vec3 p = position;
  float rise = uTime * (0.35 + aSeed * 0.5);
  p.y = mod(p.y + rise + 16.0, 16.0) - 16.5;
  p.x += sin(uTime * 0.8 + aSeed * 40.0) * 0.18;
  vec4 mv = viewMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * mv;
  gl_PointSize = uPx * (0.03 + aSeed * 0.05) / -mv.z;
  // Somem perto da superfície e longe da câmera.
  vFade = smoothstep(-0.2, -1.2, p.y) * (1.0 - smoothstep(10.0, 28.0, -mv.z));
}
`;

const BUBBLE_FRAG = /* glsl */ `
uniform float uUnder;
uniform float uAbyss;
varying float vFade;
${PALETTE}
void main() {
  float d = length(gl_PointCoord - 0.5);
  float a = (1.0 - smoothstep(0.42, 0.5, d)) * vFade * uUnder * (1.0 - uAbyss);
  if (a < 0.01) discard;
  gl_FragColor = vec4(mix(PAPER, SHALLOW, smoothstep(0.2, 0.38, d)), a * 0.75);
}
`;

// Direção (para a câmera, +z), inclinação, comprimento (m). Σ inclinação < 1.
const WAVES: [number, number, number, number][] = [
  [0.1, 1, 0.32, 27],
  [-0.4, 1, 0.2, 12],
  [0.55, 1, 0.16, 7],
  [-0.75, 1, 0.12, 4.2],
  [0.9, 0.6, 0.08, 2.5],
  [-0.2, 1, 0.07, 1.6],
].map(([x, z, st, l]) => {
  const m = Math.hypot(x, z);
  return [x / m, z / m, st, l];
});

const WAVE_SPEED = 0.62;
const EYE = 1.0; // altura da câmera: as cristas maiores passam acima dela
const RIPPLES = 8;

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
const smooth = (a: number, b: number, v: number) => {
  const t = clamp01((v - a) / (b - a));
  return t * t * (3 - 2 * t);
};

// Altura do mar num ponto (aprox.: sem o arrasto horizontal de Gerstner).
function heightAt(x: number, z: number, t: number, amp: number) {
  let y = 0;
  for (const [dx, dz, st, l] of WAVES) {
    const k = (2 * Math.PI) / l;
    y += ((st * amp) / k) * Math.sin(k * (dx * x + dz * z - Math.sqrt(9.8 / k) * t));
  }
  return y;
}

// Malha em trapézio: densa perto da câmera, rala no horizonte.
function seaGeometry(cols: number, rows: number) {
  const pos = new Float32Array((cols + 1) * (rows + 1) * 3);
  let o = 0;
  for (let j = 0; j <= rows; j++) {
    const t = j / rows;
    const z = 3 - t * t * 900;
    const half = 6 + Math.abs(z) * 1.4;
    for (let i = 0; i <= cols; i++) {
      const u = (i / cols) * 2 - 1;
      pos[o++] = u * half;
      pos[o++] = 0;
      pos[o++] = z;
    }
  }
  const idx = new Uint32Array(cols * rows * 6);
  o = 0;
  for (let j = 0; j < rows; j++) {
    for (let i = 0; i < cols; i++) {
      const a = j * (cols + 1) + i;
      const b = a + cols + 1;
      // Anti-horário visto de cima: a face da frente é a de cima.
      idx[o++] = a;
      idx[o++] = a + 1;
      idx[o++] = b;
      idx[o++] = a + 1;
      idx[o++] = b + 1;
      idx[o++] = b;
    }
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  geo.setIndex(new THREE.BufferAttribute(idx, 1));
  return geo;
}

export default function Mar() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const stage = canvas?.parentElement;
    const hero = stage?.closest<HTMLElement>("[data-scene]");
    if (!canvas || !stage || !hero) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "high-performance" });
    } catch {
      return; // sem WebGL: fica o mar em CSS
    }
    renderer.setClearColor(0x000000, 0);

    const motion = matchMedia("(prefers-reduced-motion: reduce)");
    const narrowMq = matchMedia("(max-width: 720px)");
    const narrow = narrowMq.matches;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, 1, 0.05, 2000);
    camera.rotation.order = "YXZ";

    const ripples = Array.from({ length: RIPPLES }, () => new THREE.Vector4(0, 0, -100, 0));
    const shared = {
      uTime: { value: 0 },
      uRes: { value: new THREE.Vector2(1, 1) },
      uUnder: { value: 0 },
      uAbyss: { value: 0 },
    };
    const seaMat = new THREE.ShaderMaterial({
      vertexShader: VERT,
      fragmentShader: FRAG,
      side: THREE.DoubleSide,
      uniforms: {
        ...shared,
        uWaveTime: { value: 0 },
        uAmp: { value: 1 },
        uDpr: { value: 1 },
        uCam: { value: camera.position },
        uWaves: { value: WAVES.map((w) => new THREE.Vector4(...w)) },
        uRipples: { value: ripples },
      },
    });
    const seaGeo = narrow ? seaGeometry(200, 260) : seaGeometry(360, 420);
    const sea = new THREE.Mesh(seaGeo, seaMat);
    sea.frustumCulled = false;
    scene.add(sea);

    const bgGeo = new THREE.PlaneGeometry(2, 2);
    // Fica na lista opaca (transparent: false) para desenhar antes do mar
    // (renderOrder -1); a mistura customizada mantém o alfa: transparente
    // acima da água, onde o papel aparece.
    const bgMat = new THREE.ShaderMaterial({
      vertexShader: BG_VERT,
      fragmentShader: BG_FRAG,
      uniforms: shared,
      blending: THREE.CustomBlending,
      blendSrc: THREE.SrcAlphaFactor,
      blendDst: THREE.OneMinusSrcAlphaFactor,
      blendSrcAlpha: THREE.OneFactor,
      blendDstAlpha: THREE.OneMinusSrcAlphaFactor,
      depthTest: false,
      depthWrite: false,
    });
    const bg = new THREE.Mesh(bgGeo, bgMat);
    bg.frustumCulled = false;
    bg.renderOrder = -1;
    scene.add(bg);

    const BUBBLES = narrow ? 160 : 320;
    const bubblePos = new Float32Array(BUBBLES * 3);
    const bubbleSeed = new Float32Array(BUBBLES);
    for (let i = 0; i < BUBBLES; i++) {
      bubblePos[i * 3] = (Math.random() * 2 - 1) * 14;
      bubblePos[i * 3 + 1] = -Math.random() * 16;
      bubblePos[i * 3 + 2] = 2 - Math.random() * 30;
      bubbleSeed[i] = Math.random();
    }
    const bubbleGeo = new THREE.BufferGeometry();
    bubbleGeo.setAttribute("position", new THREE.BufferAttribute(bubblePos, 3));
    bubbleGeo.setAttribute("aSeed", new THREE.BufferAttribute(bubbleSeed, 1));
    const bubbleMat = new THREE.ShaderMaterial({
      vertexShader: BUBBLE_VERT,
      fragmentShader: BUBBLE_FRAG,
      uniforms: { ...shared, uPx: { value: 1 } },
      transparent: true,
      depthWrite: false,
    });
    const bubbles = new THREE.Points(bubbleGeo, bubbleMat);
    bubbles.frustumCulled = false;
    scene.add(bubbles);

    // O horizonte fica onde o CSS diz (--horizon, fração da altura do palco):
    // o nome se apoia nele. Daqui sai a inclinação da câmera.
    let basePitch = 0;
    const resize = () => {
      const w = stage.clientWidth;
      const h = stage.clientHeight;
      const dpr = Math.min(devicePixelRatio || 1, narrow ? 1.5 : 1.75);
      renderer.setPixelRatio(dpr);
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.fov = camera.aspect < 1 ? 52 : 40;
      camera.updateProjectionMatrix();
      shared.uRes.value.set(w * dpr, h * dpr);
      seaMat.uniforms.uDpr.value = dpr;
      bubbleMat.uniforms.uPx.value = h * dpr;
      const f = parseFloat(getComputedStyle(stage).getPropertyValue("--horizon")) / 100 || 0.6;
      basePitch = Math.atan((2 * f - 1) * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)));
      if (!running) draw();
    };

    // Cursor: a câmera acompanha de leve (só guinada, o horizonte não
    // entorta) e deixa um rastro de ondulações; clique/toque solta uma onda.
    const pointer = { x: 0, tx: 0 };
    const ndc = new THREE.Vector2();
    const ray = new THREE.Raycaster();
    const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
    const hit = new THREE.Vector3();
    let next = 0;
    let lastWake = 0;
    const wake = new THREE.Vector2(1e9, 1e9);
    // Projeta o ponteiro no plano do mar (em `hit`); longe demais não conta.
    const project = (cx: number, cy: number) => {
      const r = canvas.getBoundingClientRect();
      ndc.set(((cx - r.left) / r.width) * 2 - 1, -((cy - r.top) / r.height) * 2 + 1);
      ray.setFromCamera(ndc, camera);
      return ray.ray.intersectPlane(plane, hit) !== null && hit.distanceTo(camera.position) < 80;
    };
    const drop = (force: number) => {
      ripples[next].set(hit.x, hit.z, shared.uTime.value, force);
      next = (next + 1) % RIPPLES;
    };
    const onMove = (e: PointerEvent) => {
      const r = stage.getBoundingClientRect();
      pointer.tx = ((e.clientX - r.left) / r.width) * 2 - 1;
      const now = shared.uTime.value;
      if (e.pointerType !== "mouse" || now - lastWake < 0.12 || seaMat.uniforms.uAmp.value < 0.9) return;
      if (!project(e.clientX, e.clientY) || Math.hypot(hit.x - wake.x, hit.z - wake.y) < 1.2) return;
      wake.set(hit.x, hit.z);
      lastWake = now;
      drop(0.1);
    };
    const onDown = (e: PointerEvent) => {
      if ((e.target as Element).closest("a, button") || !project(e.clientX, e.clientY)) return;
      drop(0.42);
    };

    // Relógio: só anda enquanto desenha (aba escondida não acumula).
    let running = false;
    let raf = 0;
    let last = 0;
    let clock = 0;
    let visible = true;

    const draw = () => {
      const t = clock;
      const still = motion.matches;
      const amp = still ? 1 : 0.18 + 0.82 * (1 - Math.pow(2, -10 * Math.min(1, t / 2.8)));
      const waveTime = (still ? 6 : t) * WAVE_SPEED;
      const p = still ? 0 : clamp01(parseFloat(hero.style.getPropertyValue("--scene")) || 0);

      pointer.x += (pointer.tx - pointer.x) * 0.04;
      // Mergulho: desce até a superfície e atravessa (~0.3), olha para cima
      // e vê a superfície acesa por baixo (~0.5), depois afunda olhando para
      // o fundo até sobrar só o azul-noite (0.95).
      camera.position.set(
        pointer.x * 0.35,
        EYE - smooth(0.05, 0.32, p) * 1.6 - smooth(0.32, 0.95, p) * 6.4,
        0,
      );
      camera.rotation.set(
        basePitch + smooth(0.26, 0.5, p) * 0.5 - smooth(0.55, 0.92, p) * 1.3,
        still ? 0 : -pointer.x * 0.035,
        0,
      );
      camera.updateMatrixWorld();

      const surface = NEAR_CALM * heightAt(camera.position.x, 0, waveTime, amp);
      shared.uTime.value = t;
      shared.uUnder.value = smooth(0.3, -0.3, camera.position.y - surface);
      shared.uAbyss.value = smooth(0.62, 0.95, p);
      seaMat.uniforms.uWaveTime.value = waveTime;
      seaMat.uniforms.uAmp.value = amp;
      renderer.render(scene, camera);
    };

    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      clock += Math.min(0.05, (now - (last || now)) / 1000);
      last = now;
      draw();
    };

    const sync = () => {
      const want = visible && !document.hidden && !motion.matches;
      if (want === running) return;
      running = want;
      if (running) {
        last = 0;
        raf = requestAnimationFrame(loop);
      } else {
        cancelAnimationFrame(raf);
        draw();
      }
    };

    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      sync();
    });
    io.observe(hero);
    const ro = new ResizeObserver(resize);
    ro.observe(stage);
    resize();
    sync();
    stage.dataset.mar = "pronto";

    const onScroll = () => {
      if (!running) draw();
    };
    document.addEventListener("visibilitychange", sync);
    motion.addEventListener("change", sync);
    stage.addEventListener("pointermove", onMove);
    stage.addEventListener("pointerdown", onDown);
    addEventListener("scroll", onScroll, { passive: true });

    const onLost = (e: Event) => {
      e.preventDefault();
      delete stage.dataset.mar;
      running = false;
      cancelAnimationFrame(raf);
    };
    canvas.addEventListener("webglcontextlost", onLost);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      document.removeEventListener("visibilitychange", sync);
      motion.removeEventListener("change", sync);
      stage.removeEventListener("pointermove", onMove);
      stage.removeEventListener("pointerdown", onDown);
      removeEventListener("scroll", onScroll);
      canvas.removeEventListener("webglcontextlost", onLost);
      delete stage.dataset.mar;
      seaGeo.dispose();
      seaMat.dispose();
      bgGeo.dispose();
      bgMat.dispose();
      bubbleGeo.dispose();
      bubbleMat.dispose();
      renderer.dispose();
    };
  }, []);

  return <canvas ref={ref} className={s.mar} aria-hidden="true" />;
}
