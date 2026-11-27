"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { corDe, observarTema, temaAtual } from "../tema/tema";
import s from "./nome-desfeito.module.css";

/* O nome se desfaz em fibras e os grãos montam o começo do Sobre.

   Um canvas WebGL2 fixo na tela (por cima das seções, abaixo da barra)
   redesenha o h1 do hero letra por letra, nas posições do layout, e o
   corrói com ruído: a borda da corrosão vira retícula e, do lado de onde
   saem as fibras (cima/direita), grãos se soltam e sobem na direção do véu
   do GhostFibers. Parado, a corrosão respira sem apagar o nome.

   Na rolagem (amarrado ao scroll pelo GSAP ScrollTrigger com scrub, então
   tudo tem inércia e volta junto ao subir):
   • o nome termina de se desfazer até sumir quando o hero sai pela metade,
     acelerando no fim (power2.in);
   • o véu de fibras do Sobre (o segundo GhostFibers, atrás do título)
     descarrega o texto: grãos se soltam da parte da fita à vista — lida a
     cada quadro do próprio GhostFibers (ghostFibersPath) — e voam em arco
     até as letras do título (#sobre-titulo), da esquerda para a direita,
     com power3.inOut; a fita esmaece conforme se esvazia. Terminada a
     montagem, o canvas desenha o título em retícula, com alguns pontos
     faltando e fios que pingam; o h2 fica transparente (segue no DOM).

   Cores do tema (--alt-foam-rgb no nome, --alt-grao-rgb nos grãos): no
   escuro os grãos somam luz; no claro são tinta por cima do papel.

   O h1 e o h2 continuam no DOM; o hero ganha data-nome="pronto" quando o
   canvas assume o nome. Sem WebGL2 ou com movimento reduzido nada disso
   roda: o nome e o título ficam como texto normal. */

type ComFibras = HTMLElement & { ghostFibersPath?: (count: number) => Float32Array };

const PATH_POINTS = 64; // pontos lidos da linha central da fita
const BUILD = 11; // floats por grão do título

// Direção de saída dos grãos (y para baixo): para cima e para a direita,
// onde começa o véu de fibras (ver o translate de .fibers no hero).
const DIR = (() => {
  const x = 0.86;
  const y = -0.5;
  const l = Math.hypot(x, y);
  return [x / l, y / l] as const;
})();

const EMIT_STRIDE = 2; // px entre pixels do nome que podem soltar grãos
const TARGET_STRIDE = 3; // px entre os pontos que montam o título
const MAX_TARGETS = 7000;

const VERT = `#version 300 es
out vec2 vUv;
void main() {
  vec2 p = vec2(gl_VertexID == 1 ? 3.0 : -1.0, gl_VertexID == 2 ? 3.0 : -1.0);
  vUv = p * 0.5 + 0.5;
  gl_Position = vec4(p, 0.0, 1.0);
}`;

// Tudo em px de CSS do documento (y para baixo): o ruído fica preso ao nome
// e não escorrega com a rolagem.
const FRAG = `#version 300 es
precision highp float;
uniform sampler2D uText;
uniform vec2 uRes;      // tamanho do canvas, px do dispositivo
uniform float uDpr;
uniform float uScroll;
uniform vec4 uBox;      // caixa do nome no documento (x0, y0, x1, y1)
uniform float uTime;
uniform float uProgress; // 0 parado, 1 nome todo desfeito
uniform vec2 uDir;
uniform float uCell;
uniform vec3 uInk;
uniform vec3 uSpark;
in vec2 vUv;
out vec4 outColor;

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}
float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1, 0)), u.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), u.x), u.y);
}
float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 4; i++) {
    v += a * noise(p);
    p = p * 2.03 + 17.1;
    a *= 0.5;
  }
  return v;
}

float along(vec2 px) {
  vec2 c = (uBox.xy + uBox.zw) * 0.5;
  vec2 h = (uBox.zw - uBox.xy) * 0.5;
  return dot((px - c) / max(h.x, h.y), uDir);
}

// Quanto do nome já se desfez neste ponto (0 = inteiro). O lado das fibras
// vai primeiro; com a rolagem o resto segue até não sobrar nada.
float dissolve(vec2 px) {
  float a = along(px);
  float breathe = 0.5 + 0.5 * sin(uTime * 0.32);
  float idle = smoothstep(-0.2, 1.1, a) * (0.2 + 0.2 * breathe) + 0.035 * sin(uTime * 0.8 + a * 4.0) - 0.04;
  return idle + uProgress * (1.25 + 0.35 * smoothstep(-1.0, 1.0, a));
}

float field(vec2 px) {
  return fbm(px / 24.0 + vec2(uTime * 0.06, -uTime * 0.09));
}

float textAt(vec2 px) {
  vec2 uv = (px - uBox.xy) / (uBox.zw - uBox.xy);
  if (uv.x < 0.0 || uv.y < 0.0 || uv.x > 1.0 || uv.y > 1.0) return 0.0;
  return texture(uText, uv).a;
}

void main() {
  vec2 px = vec2(vUv.x, 1.0 - vUv.y) * uRes / uDpr + vec2(0.0, uScroll);
  if (px.x < uBox.x - 8.0 || px.y < uBox.y - 8.0 || px.x > uBox.z + 8.0 || px.y > uBox.w + 8.0) discard;
  float d = dissolve(px);
  float band = 0.11;

  float n = field(px);
  float solid = textAt(px) * smoothstep(d + band, d + band + 0.015, n);

  // Faixa da corrosão: a letra vira retícula, pontos menores quanto mais
  // perto de sumir, mais claros na frente da corrosão.
  vec2 cell = (floor(px / uCell) + 0.5) * uCell;
  float cellAlpha = textAt(cell);
  float cellN = field(cell);
  float inBand = step(d, cellN) * (1.0 - step(d + band, cellN));
  float k = clamp((cellN - d) / band, 0.0, 1.0);
  float r = (0.12 + 0.38 * k) * uCell;
  float dotMask = 1.0 - smoothstep(r - 0.6, r + 0.6, length(px - cell));
  float dots = cellAlpha * dotMask * inBand;
  float spark = dots * (1.0 - k);

  float a = max(solid, dots);
  vec3 color = mix(uInk, uSpark, clamp(spark * 1.4, 0.0, 1.0));
  outColor = vec4(color * a, a);
}`;

const PVERT = `#version 300 es
in vec4 aParticle; // x, y (px do dispositivo, na tela), alpha, tamanho
uniform vec2 uRes;
out float vAlpha;
void main() {
  vAlpha = aParticle.z;
  gl_PointSize = aParticle.w;
  gl_Position = vec4(aParticle.x / uRes.x * 2.0 - 1.0, 1.0 - aParticle.y / uRes.y * 2.0, 0.0, 1.0);
}`;

const PFRAG = `#version 300 es
precision highp float;
uniform vec3 uSpark;
in float vAlpha;
out vec4 outColor;
void main() {
  float r = length(gl_PointCoord - 0.5) * 2.0;
  float a = (1.0 - smoothstep(0.55, 1.0, r)) * vAlpha;
  outColor = vec4(uSpark * a, a);
}`;

// O título montado: a letra vira retícula com buracos e fios que pingam.
const TFRAG = `#version 300 es
precision highp float;
uniform sampler2D uTitle;
uniform vec2 uRes;      // canvas, px do dispositivo
uniform float uDpr;
uniform float uScroll;
uniform vec4 uBox;      // caixa do título no documento (x0, y0, x1, y1)
uniform float uTime;
uniform float uReveal;  // 0–1: entra no lugar dos grãos da montagem
uniform float uCell;    // passo da retícula, px de CSS
uniform vec3 uInk;
in vec2 vUv;
out vec4 outColor;

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float textAt(vec2 px) {
  vec2 uv = (px - uBox.xy) / (uBox.zw - uBox.xy);
  if (uv.x < 0.0 || uv.y < 0.0 || uv.x > 1.0 || uv.y > 1.0) return 0.0;
  return textureLod(uTitle, uv, 0.0).a;
}

float dotAt(vec2 px, vec2 cell, float r) {
  return 1.0 - smoothstep(r - 0.7, r + 0.7, length(px - cell));
}

void main() {
  vec2 px = vec2(vUv.x, 1.0 - vUv.y) * uRes / uDpr + vec2(0.0, uScroll);
  if (px.x < uBox.x - 2.0 || px.x > uBox.z + 2.0 || px.y < uBox.y - 2.0 || px.y > uBox.w + 72.0) discard;

  vec2 cell = (floor(px / uCell) + 0.5) * uCell;
  float a = 0.0;
  if (textAt(cell) > 0.1) {
    // Buracos: alguns pontos somem de vez, outros piscam devagar.
    if (hash(cell) < 0.08) discard;
    if (hash(cell + floor(uTime * 0.8) * 13.0) < 0.015) discard;
    a = dotAt(px, cell, 0.36 * uCell);
  } else {
    // Pingos: de alguns pontos na base das letras desce uma trilha de pontos.
    for (int i = 1; i <= 9; i++) {
      vec2 src = cell - vec2(0.0, float(i) * uCell);
      if (textAt(src) < 0.1) continue;
      if (textAt(src + vec2(0.0, uCell)) > 0.1) continue;
      float hs = hash(src);
      if (hs > 0.035) continue;
      float len = 2.0 + 8.0 * hash(src + 3.7);
      float phase = mod(uTime * (0.35 + 0.4 * hash(src + 7.1)) + hash(src + 1.3) * 6.0, len + 1.0);
      float d = float(i) - phase;
      if (d < 0.0 || d > len) continue;
      a = max(a, dotAt(px, cell, 0.26 * uCell) * (1.0 - d / len));
    }
  }

  outColor = vec4(uInk * a * uReveal, a * uReveal);
}`;

function compile(gl: WebGL2RenderingContext, type: number, src: string) {
  const sh = gl.createShader(type);
  if (!sh) return null;
  gl.shaderSource(sh, src);
  gl.compileShader(sh);
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
    gl.deleteShader(sh);
    return null;
  }
  return sh;
}

function program(gl: WebGL2RenderingContext, vs: string, fs: string) {
  const v = compile(gl, gl.VERTEX_SHADER, vs);
  const f = compile(gl, gl.FRAGMENT_SHADER, fs);
  const p = gl.createProgram();
  if (!v || !f || !p) return null;
  gl.attachShader(p, v);
  gl.attachShader(p, f);
  gl.linkProgram(p);
  gl.deleteShader(v);
  gl.deleteShader(f);
  if (!gl.getProgramParameter(p, gl.LINK_STATUS)) {
    gl.deleteProgram(p);
    return null;
  }
  return p;
}

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
const smooth = (a: number, b: number, v: number) => {
  const t = clamp01((v - a) / (b - a));
  return t * t * (3 - 2 * t);
};

// O canvas só aceita larguras nomeadas; o título usa 112%.
const STRETCHES: [number, CanvasFontStretch][] = [
  [62.5, "extra-condensed"],
  [75, "condensed"],
  [87.5, "semi-condensed"],
  [100, "normal"],
  [112.5, "semi-expanded"],
  [125, "expanded"],
];
const stretchOf = (css: string): CanvasFontStretch => {
  const v = parseFloat(css) || 100;
  let best = STRETCHES[3];
  for (const s of STRETCHES) if (Math.abs(s[0] - v) < Math.abs(best[0] - v)) best = s;
  return best[1];
};

/* Desenha o texto de um elemento num canvas, letra por letra, nas posições
   do layout. Devolve o canvas e a caixa do texto no documento (px de CSS). */
function rasterize(el: Element, scale: number) {
  const range = document.createRange();
  const glyphs: { ch: string; x: number; y: number; w: number; h: number; parent: Element }[] = [];
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    const text = node.textContent ?? "";
    for (let i = 0; i < text.length; i++) {
      if (/\s/.test(text[i])) continue;
      range.setStart(node, i);
      range.setEnd(node, i + 1);
      const r = range.getBoundingClientRect();
      if (!r.width) continue;
      glyphs.push({ ch: text[i], x: r.left + scrollX, y: r.top + scrollY, w: r.width, h: r.height, parent: node.parentElement ?? el });
    }
  }
  const box = [Infinity, Infinity, -Infinity, -Infinity];
  for (const g of glyphs) {
    box[0] = Math.min(box[0], g.x);
    box[1] = Math.min(box[1], g.y);
    box[2] = Math.max(box[2], g.x + g.w);
    box[3] = Math.max(box[3], g.y + g.h);
  }
  const canvas = document.createElement("canvas");
  if (!glyphs.length) return { canvas, box: [0, 0, 1, 1] };
  // Folga para as pontas das letras que passam da caixa do caractere.
  box[0] -= 8;
  box[1] -= 8;
  box[2] += 8;
  box[3] += 8;
  canvas.width = Math.max(1, Math.ceil((box[2] - box[0]) * scale));
  canvas.height = Math.max(1, Math.ceil((box[3] - box[1]) * scale));
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) return { canvas, box };
  ctx.fillStyle = "#fff";
  ctx.textBaseline = "alphabetic";
  let font = "";
  let ascent = 0;
  for (const g of glyphs) {
    const cs = getComputedStyle(g.parent);
    const next = `${cs.fontStyle} ${cs.fontWeight} ${parseFloat(cs.fontSize) * scale}px ${cs.fontFamily}|${cs.fontStretch}`;
    if (next !== font) {
      font = next;
      ctx.font = next.split("|")[0];
      ctx.fontStretch = stretchOf(cs.fontStretch);
      ascent = ctx.measureText("H").fontBoundingBoxAscent;
    }
    ctx.fillText(g.ch, (g.x - box[0]) * scale, (g.y - box[1]) * scale + ascent);
  }
  return { canvas, box };
}

// Pixels acesos do texto, em px de CSS do documento.
function samplePixels(canvas: HTMLCanvasElement, box: number[], scale: number, stride: number) {
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) return new Float32Array(0);
  const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
  const step = Math.max(1, Math.round(stride * scale));
  const out: number[] = [];
  for (let y = 0; y < canvas.height; y += step) {
    for (let x = 0; x < canvas.width; x += step) {
      if (data[(y * canvas.width + x) * 4 + 3] > 140) out.push(box[0] + x / scale, box[1] + y / scale);
    }
  }
  return new Float32Array(out);
}

export default function NomeDesfeito() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const hero = document.getElementById("inicio");
    const h1 = hero?.querySelector("h1");
    const title = document.getElementById("sobre-titulo");
    const section = document.getElementById("sobre");
    if (!canvas || !hero || !h1 || !title || !section) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const gl = canvas.getContext("webgl2", { alpha: true, premultipliedAlpha: true, antialias: false });
    if (!gl) return;

    const textProg = program(gl, VERT, FRAG);
    const partProg = program(gl, PVERT, PFRAG);
    const titleProg = program(gl, VERT, TFRAG);
    if (!textProg || !partProg || !titleProg) return;

    const U = (p: WebGLProgram, n: string) => gl.getUniformLocation(p, n);
    const tu = {
      text: U(textProg, "uText"),
      res: U(textProg, "uRes"),
      dpr: U(textProg, "uDpr"),
      scroll: U(textProg, "uScroll"),
      box: U(textProg, "uBox"),
      time: U(textProg, "uTime"),
      progress: U(textProg, "uProgress"),
      dir: U(textProg, "uDir"),
      cell: U(textProg, "uCell"),
      ink: U(textProg, "uInk"),
      spark: U(textProg, "uSpark"),
    };
    const pu = { res: U(partProg, "uRes"), spark: U(partProg, "uSpark") };
    const yu = {
      title: U(titleProg, "uTitle"),
      res: U(titleProg, "uRes"),
      dpr: U(titleProg, "uDpr"),
      scroll: U(titleProg, "uScroll"),
      box: U(titleProg, "uBox"),
      time: U(titleProg, "uTime"),
      reveal: U(titleProg, "uReveal"),
      cell: U(titleProg, "uCell"),
      ink: U(titleProg, "uInk"),
    };

    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

    const titleTex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, titleTex);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

    const vao = gl.createVertexArray();
    const pvao = gl.createVertexArray();
    const pbuf = gl.createBuffer();
    gl.bindVertexArray(pvao);
    gl.bindBuffer(gl.ARRAY_BUFFER, pbuf);
    const loc = gl.getAttribLocation(partProg, "aParticle");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 4, gl.FLOAT, false, 0, 0);
    gl.bindVertexArray(null);

    let dpr = 1;
    let W = 1; // canvas, px do dispositivo
    let H = 1;
    let heroTop = 0;
    let heroHeight = 1;
    let nameBox = [0, 0, 1, 1];
    let titleBox = [0, 0, 1, 1];
    let emitFrom = new Float32Array(0); // x, y dos pixels do nome
    let emitCount = 0;
    // Grãos que se soltam do nome: x, y, vx, vy, vida, duração, tamanho.
    let loose = new Float32Array(0);
    let looseCount = 0;
    // Grãos que montam o título (BUILD floats cada): posição na fita (0–1),
    // desvio da fita x/y, sorteios do arco x/y, alvo x/y, atraso, tamanho e
    // a origem de reserva x/y (fim do nome) para quando não há fita.
    let build = new Float32Array(0);
    let buildCount = 0;
    let gpu = new Float32Array(0);
    let t = 0;
    let last = 0;
    let raf = 0;
    let alive = true;
    let idle = false;

    // A parte da fita do Sobre que está à vista, em px do documento.
    const fibras = () => section.querySelector<ComFibras>(".ghost-fibers-container");
    const path = new Float32Array(PATH_POINTS * 2);
    let pathCount = 0;
    const updatePath = () => {
      pathCount = 0;
      const el = fibras();
      const pts = el?.ghostFibersPath?.(PATH_POINTS);
      if (!el || !pts?.length) return;
      const r = el.getBoundingClientRect();
      for (let i = 0; i < pts.length / 2; i++) {
        const x = pts[i * 2];
        const y = pts[i * 2 + 1];
        if (x < 0 || x > r.width) continue;
        // Mesma máscara do .fibras do Sobre (some em cima e embaixo).
        if (y < r.height * 0.12 || y > r.height * 0.7) continue;
        path[pathCount * 2] = r.left + scrollX + x;
        path[pathCount * 2 + 1] = r.top + scrollY + y;
        pathCount++;
      }
    };

    // Progresso do desfazer (0–1) e da montagem do título (0–1), escritos
    // pelo ScrollTrigger com scrub (inércia na rolagem).
    const anim = { progress: 0, assembly: 0 };
    const flight = gsap.parseEase("power3.inOut");
    let ctx: gsap.Context | null = null;

    // Cores do tema.
    let claro = false;
    let ink: [number, number, number] = [0.957, 0.925, 0.894];
    let grain: [number, number, number] = [0.92, 0.92, 0.95];
    const readColors = () => {
      claro = temaAtual() === "claro";
      ink = corDe(canvas, "--alt-foam-rgb", ink);
      grain = corDe(canvas, "--alt-grao-rgb", grain);
    };

    const alongOf = (x: number, y: number) => {
      const cx = (nameBox[0] + nameBox[2]) / 2;
      const cy = (nameBox[1] + nameBox[3]) / 2;
      const h = Math.max(nameBox[2] - nameBox[0], nameBox[3] - nameBox[1]) / 2;
      return ((x - cx) / h) * DIR[0] + ((y - cy) / h) * DIR[1];
    };

    // Um pixel do nome, de preferência do lado que está se desfazendo.
    const pickEmitter = (bias: number) => {
      let j = 0;
      for (let tries = 0; tries < 8; tries++) {
        j = (Math.random() * emitCount) | 0;
        const w = smooth(-0.2, 1.1, alongOf(emitFrom[j * 2], emitFrom[j * 2 + 1]));
        if (Math.random() < w * w + 0.04 + bias) break;
      }
      return j;
    };

    const spawnLoose = (i: number, progress: number, prewarm = false) => {
      const o = i * 7;
      // Nome todo desfeito: o grão não renasce.
      if (!emitCount || progress > 0.97) {
        loose[o + 4] = loose[o + 5] = 1;
        return;
      }
      const j = pickEmitter(progress * 1.5);
      const speed = 18 + Math.random() * 46 + progress * 60;
      loose[o] = emitFrom[j * 2] + (Math.random() - 0.5) * 2;
      loose[o + 1] = emitFrom[j * 2 + 1] + (Math.random() - 0.5) * 2;
      loose[o + 2] = DIR[0] * speed + (Math.random() - 0.5) * 14;
      loose[o + 3] = DIR[1] * speed + (Math.random() - 0.5) * 14;
      loose[o + 5] = 1.6 + Math.random() * 2.6;
      loose[o + 4] = prewarm ? Math.random() * loose[o + 5] : 0;
      loose[o + 6] = 0.9 + Math.random() * 1.6;
    };

    const stepLoose = (dt: number, progress: number) => {
      for (let i = 0; i < looseCount; i++) {
        const o = i * 7;
        loose[o + 4] += dt;
        if (loose[o + 4] >= loose[o + 5]) {
          spawnLoose(i, progress);
          continue;
        }
        const x = loose[o];
        const y = loose[o + 1];
        // Redemoinho leve: o grão serpenteia enquanto sobe.
        const ang = Math.sin(x * 0.004 + t * 0.6) * Math.cos(y * 0.005 - t * 0.45) * Math.PI;
        loose[o + 2] += (DIR[0] * 26 + Math.cos(ang) * 22) * dt;
        loose[o + 3] += (DIR[1] * 26 + Math.sin(ang) * 22) * dt;
        loose[o + 2] *= 1 - 0.35 * dt;
        loose[o + 3] *= 1 - 0.35 * dt;
        loose[o] += loose[o + 2] * dt;
        loose[o + 1] += loose[o + 3] * dt;
      }
    };

    const setup = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      W = Math.max(1, Math.round(innerWidth * dpr));
      H = Math.max(1, Math.round(innerHeight * dpr));
      canvas.width = W;
      canvas.height = H;

      const hr = hero.getBoundingClientRect();
      heroTop = hr.top + scrollY;
      heroHeight = hr.height;

      // O nome vira textura (posição no documento) e lista de emissores.
      const name = rasterize(h1, dpr);
      nameBox = name.box;
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, name.canvas);
      emitFrom = samplePixels(name.canvas, name.box, dpr, EMIT_STRIDE);
      emitCount = emitFrom.length / 2;

      const area = (nameBox[2] - nameBox[0]) * (nameBox[3] - nameBox[1]);
      looseCount = Math.round(Math.min(2600, Math.max(700, area / 90)));
      loose = new Float32Array(looseCount * 7);
      const progress = anim.progress;
      for (let i = 0; i < looseCount; i++) spawnLoose(i, progress, true);
      // Já começa com a trilha formada.
      for (let k = 0; k < 90; k++) stepLoose(1 / 30, progress);

      // O título: cada ponto aceso ganha um grão que sai da fita do Sobre
      // e voa em arco até ele.
      const target = rasterize(title, 1);
      titleBox = target.box;
      gl.bindTexture(gl.TEXTURE_2D, titleTex);
      gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, target.canvas);
      // O título de verdade sai de cena: o canvas desenha a retícula que pinga.
      title.style.setProperty("--montado", "0");
      let points = samplePixels(target.canvas, target.box, 1, TARGET_STRIDE);
      if (points.length / 2 > MAX_TARGETS) {
        const keep = new Float32Array(MAX_TARGETS * 2);
        for (let i = 0; i < MAX_TARGETS; i++) {
          const j = (Math.random() * (points.length / 2)) | 0;
          keep[i * 2] = points[j * 2];
          keep[i * 2 + 1] = points[j * 2 + 1];
        }
        points = keep;
      }
      buildCount = points.length / 2;
      build = new Float32Array(buildCount * BUILD);
      const tx0 = target.box[0];
      const tw = Math.max(1, target.box[2] - target.box[0]);
      for (let i = 0; i < buildCount; i++) {
        const o = i * BUILD;
        const tx = points[i * 2];
        const ty = points[i * 2 + 1];
        build[o] = Math.random();
        build[o + 1] = (Math.random() - 0.5) * 72;
        build[o + 2] = (Math.random() - 0.5) * 72;
        build[o + 3] = Math.random();
        build[o + 4] = Math.random();
        build[o + 5] = tx;
        build[o + 6] = ty;
        build[o + 7] = ((tx - tx0) / tw) * 0.7 + Math.random() * 0.3;
        build[o + 8] = 1.4 + Math.random() * 0.9;
        const j = emitCount ? pickEmitter(0.2) : 0;
        const reach = 40 + Math.random() * 260;
        build[o + 9] = (emitFrom[j * 2] ?? nameBox[2]) + DIR[0] * reach;
        build[o + 10] = (emitFrom[j * 2 + 1] ?? nameBox[1]) + DIR[1] * reach;
      }

      gpu = new Float32Array((looseCount + buildCount) * 4);
    };

    const draw = (progress: number, assembly: number) => {
      gl.viewport(0, 0, W, H);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.enable(gl.BLEND);

      // O nome (some de vez com progress = 1).
      if (progress < 1 && nameBox[3] > scrollY) {
        gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
        gl.useProgram(textProg);
        gl.bindVertexArray(vao);
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.uniform1i(tu.text, 0);
        gl.uniform2f(tu.res, W, H);
        gl.uniform1f(tu.dpr, dpr);
        gl.uniform1f(tu.scroll, scrollY);
        gl.uniform4f(tu.box, nameBox[0], nameBox[1], nameBox[2], nameBox[3]);
        gl.uniform1f(tu.time, t);
        gl.uniform1f(tu.progress, progress);
        gl.uniform2f(tu.dir, DIR[0], DIR[1]);
        gl.uniform1f(tu.cell, 5);
        gl.uniform3f(tu.ink, ink[0], ink[1], ink[2]);
        const spark = claro ? grain : [1, 1, 1];
        gl.uniform3f(tu.spark, spark[0], spark[1], spark[2]);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
      }

      let n = 0;
      const sy = scrollY;
      const reveal = smooth(0.82, 1, assembly);

      // O título montado: a mesma caixa do h2, agora em retícula. Alguns
      // pontos faltam e fios de pontos pingam da base das letras.
      if (reveal > 0 && titleBox[3] + 80 > sy && titleBox[1] - 80 < sy + innerHeight) {
        gl.blendFunc(gl.ONE, claro ? gl.ONE_MINUS_SRC_ALPHA : gl.ONE);
        gl.useProgram(titleProg);
        gl.bindVertexArray(vao);
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, titleTex);
        gl.uniform1i(yu.title, 0);
        gl.uniform2f(yu.res, W, H);
        gl.uniform1f(yu.dpr, dpr);
        gl.uniform1f(yu.scroll, sy);
        gl.uniform4f(yu.box, titleBox[0], titleBox[1], titleBox[2], titleBox[3]);
        gl.uniform1f(yu.time, t);
        gl.uniform1f(yu.reveal, reveal);
        gl.uniform1f(yu.cell, 4);
        gl.uniform3f(yu.ink, ink[0], ink[1], ink[2]);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
      }

      // Grãos soltos: aparecem rápido e somem devagar ao subir.
      for (let i = 0; i < looseCount; i++) {
        const o = i * 7;
        const life = loose[o + 4] / loose[o + 5];
        if (life >= 1) continue;
        const fade = Math.min(1, life * 8) * (1 - life) * (1 - life);
        gpu[n * 4] = loose[o] * dpr;
        gpu[n * 4 + 1] = (loose[o + 1] - sy) * dpr;
        gpu[n * 4 + 2] = fade * 0.9;
        gpu[n * 4 + 3] = loose[o + 6] * (1 - 0.5 * life) * dpr;
        n++;
      }

      // Grãos que montam o título; somem quando a retícula toma o lugar.
      if (assembly > 0 && reveal < 1) {
        updatePath();
        for (let i = 0; i < buildCount; i++) {
          const o = i * BUILD;
          const e = clamp01((assembly - build[o + 7] * 0.3) / 0.7);
          if (e <= 0) continue;
          let ox = build[o + 9];
          let oy = build[o + 10];
          if (pathCount) {
            const p = Math.min(pathCount - 1, (build[o] * pathCount) | 0);
            ox = path[p * 2] + build[o + 1];
            oy = path[p * 2 + 1] + build[o + 2];
          }
          const tx = build[o + 5];
          const ty = build[o + 6];
          // Arco: o grão se solta da fita, sobe um pouco e cai no alvo.
          const cx = (ox + tx) / 2 + (build[o + 3] - 0.5) * 240;
          const cy = Math.min(oy, ty) - 60 - build[o + 4] * 180;
          const k = flight(e);
          const u = 1 - k;
          const x = u * u * ox + 2 * u * k * cx + k * k * tx;
          const y = u * u * oy + 2 * u * k * cy + k * k * ty;
          gpu[n * 4] = x * dpr;
          gpu[n * 4 + 1] = (y - sy) * dpr;
          gpu[n * 4 + 2] = Math.min(1, e * 6) * (0.55 + 0.4 * k) * (1 - reveal);
          gpu[n * 4 + 3] = build[o + 8] * (1.6 - 0.6 * k) * dpr;
          n++;
        }
      }
      // A fita do Sobre esmaece conforme descarrega o título.
      const fio = fibras();
      if (fio) fio.style.opacity = (1 - 0.72 * smooth(0.2, 1, assembly)).toFixed(3);

      if (n) {
        // Escuro: os grãos somam luz. Claro: tinta por cima do papel.
        gl.blendFunc(gl.ONE, claro ? gl.ONE_MINUS_SRC_ALPHA : gl.ONE);
        gl.useProgram(partProg);
        gl.bindVertexArray(pvao);
        gl.bindBuffer(gl.ARRAY_BUFFER, pbuf);
        gl.bufferData(gl.ARRAY_BUFFER, gpu.subarray(0, n * 4), gl.DYNAMIC_DRAW);
        gl.uniform2f(pu.res, W, H);
        gl.uniform3f(pu.spark, grain[0], grain[1], grain[2]);
        gl.drawArrays(gl.POINTS, 0, n);
      }
      gl.bindVertexArray(null);
    };

    // O título continua pingando enquanto está na tela; fora dela, para.
    const titleOnScreen = () => titleBox[3] + 80 > scrollY && titleBox[1] - 80 < scrollY + innerHeight;
    const offstage = () => !titleOnScreen() && scrollY > heroTop + heroHeight && anim.assembly >= 1;

    const frame = (now: number) => {
      raf = 0;
      if (!alive || document.hidden) return;
      const dt = last ? Math.min(0.05, (now - last) / 1000) : 1 / 60;
      last = now;
      if (offstage()) {
        if (!idle) {
          gl.clearColor(0, 0, 0, 0);
          gl.clear(gl.COLOR_BUFFER_BIT);
          idle = true;
        }
        last = 0;
        return;
      }
      idle = false;
      t += dt;
      stepLoose(dt, anim.progress);
      draw(anim.progress, anim.assembly);
      raf = requestAnimationFrame(frame);
    };

    const wake = () => {
      if (!raf && alive && !document.hidden) raf = requestAnimationFrame(frame);
    };

    let pending = 0;
    const rebuild = () => {
      if (pending) return;
      pending = requestAnimationFrame(() => {
        pending = 0;
        if (!alive) return;
        setup();
        ScrollTrigger.refresh();
        idle = false;
        wake();
      });
    };

    const ro = new ResizeObserver(rebuild);
    const stopTheme = observarTema(() => {
      readColors();
      idle = false;
      wake();
    });

    document.fonts.ready.then(() => {
      if (!alive) return;
      readColors();
      setup();
      gsap.registerPlugin(ScrollTrigger);
      ctx = gsap.context(() => {
        gsap.to(anim, {
          progress: 1,
          ease: "power2.in",
          onUpdate: wake,
          scrollTrigger: {
            trigger: hero,
            start: "top top",
            end: () => `+=${hero.offsetHeight * 0.55}`,
            scrub: 0.6,
            invalidateOnRefresh: true,
          },
        });
        gsap.to(anim, {
          assembly: 1,
          ease: "none",
          onUpdate: wake,
          scrollTrigger: { trigger: title, start: "top 95%", end: "top 40%", scrub: 0.9 },
        });
      });
      hero.dataset.nome = "pronto";
      ro.observe(hero);
      ro.observe(title);
      addEventListener("resize", rebuild);
      addEventListener("scroll", wake, { passive: true });
      document.addEventListener("visibilitychange", wake);
      wake();
    });

    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      cancelAnimationFrame(pending);
      ro.disconnect();
      stopTheme();
      ctx?.revert();
      fibras()?.style.removeProperty("opacity");
      removeEventListener("resize", rebuild);
      removeEventListener("scroll", wake);
      document.removeEventListener("visibilitychange", wake);
      delete hero.dataset.nome;
      title.style.removeProperty("--montado");
      gl.deleteTexture(texture);
      gl.deleteTexture(titleTex);
      gl.deleteBuffer(pbuf);
      gl.deleteVertexArray(vao);
      gl.deleteVertexArray(pvao);
      gl.deleteProgram(textProg);
      gl.deleteProgram(partProg);
      gl.deleteProgram(titleProg);
    };
  }, []);

  return <canvas ref={ref} className={s.canvas} aria-hidden="true" />;
}
