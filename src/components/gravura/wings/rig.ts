/*
 * Rig de uma gravura viva (LiveWing): penas que giram em torno da raiz,
 * deformando a própria máscara 1 bit, sem quadros novos. Coordenadas em px
 * da máscara, y para baixo; ângulos em graus (0 = direita, 90 = baixo). Se a
 * máscara for regerada, as medidas precisam ser refeitas.
 */

/** Penas que giram em torno da raiz, dentro de um cone. */
export type Flap = {
  root: [number, number];
  /** Direção da asa a partir da raiz. */
  axis: number;
  /** Meia-abertura do cone: inteira até [0], nula a partir de [1]. */
  spread: [number, number];
  /** Distância da raiz: entra entre [0] e [1], sai entre [2] e [3]. */
  reach: [number, number, number, number];
  /** Amplitude do giro em graus e batidas por segundo. */
  deg: number;
  hz: number;
  phase?: number;
};

export type Rig = { flaps: Flap[] };

/* Literais GLSL ES 1.0 precisam de ponto decimal: 7 → "7.0000". */
const glslFloat = (value: number) => value.toFixed(4);
const rad = (deg: number) => (deg * Math.PI) / 180;

/* Mapeamento inverso: para cada pixel da tela, de onde ler a máscara. Fora
   dos cones das asas o deslocamento é zero, então o resto da gravura sai
   igual à máscara estática. Fora da máscara não há tinta. */
export function fragmentShader(rig: Rig): string {
  const f = glslFloat;
  const steps = rig.flaps.map((flap) => {
    const axis = rad(flap.axis);
    return (
      `p = flap(p, vec2(${f(flap.root[0])}, ${f(flap.root[1])}), vec2(${f(Math.cos(axis))}, ${f(Math.sin(axis))}), ` +
      `vec2(${f(Math.cos(rad(flap.spread[1])))}, ${f(Math.cos(rad(flap.spread[0])))}), ` +
      `vec4(${flap.reach.map((r) => f(r)).join(", ")}), ` +
      `${f(rad(flap.deg))} * sin(TAU * ${f(flap.hz)} * t + ${f(flap.phase ?? 0)}));`
    );
  });

  return `#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
#define TAU 6.2831853

uniform sampler2D u_art;
uniform vec2 u_canvas;
uniform vec2 u_origin;
uniform float u_scale;
uniform vec2 u_size;
uniform float u_time;
uniform vec3 u_ink;

vec2 flap(vec2 p, vec2 root, vec2 axis, vec2 cone, vec4 reach, float angle) {
  vec2 d = p - root;
  float r = length(d);
  float w = smoothstep(cone.x, cone.y, dot(d, axis) / max(r, 0.001))
    * smoothstep(reach.x, reach.y, r)
    * (1.0 - smoothstep(reach.z, reach.w, r));
  float a = -angle * w;
  float s = sin(a);
  float c = cos(a);
  return root + vec2(c * d.x - s * d.y, s * d.x + c * d.y);
}

void main() {
  vec2 p = (vec2(gl_FragCoord.x, u_canvas.y - gl_FragCoord.y) - u_origin) / u_scale;
  float t = u_time;
  ${steps.join("\n  ")}
  vec2 uv = p / u_size;
  float inside = step(0.0, uv.x) * step(0.0, uv.y) * step(uv.x, 1.0) * step(uv.y, 1.0);
  float a = texture2D(u_art, clamp(uv, 0.0, 1.0)).a * inside;
  gl_FragColor = vec4(u_ink * a, a);
}
`;
}
