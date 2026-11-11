/**
 * Escala de tons por retícula ordenada (Bayer).
 *
 * Não existe tom intermediário como cor: cada nível é um padrão de tinta
 * (--ink) sobre papel (--paper). O nível 0 é papel vazio e o 8 é tinta
 * sólida; entre eles, a célula acende quando o limiar do matriz Bayer é
 * menor que a cobertura do nível.
 *
 * O tile tem 8×8 px: matriz 4×4 com células de 2 px. Em CSS, use sempre
 * no tamanho nativo (8px 8px), nunca fracionário.
 */

/** Matriz Bayer 4×4, valores 0–15. */
export const BAYER4: readonly (readonly number[])[] = [
  [0, 8, 2, 10],
  [12, 4, 14, 6],
  [3, 11, 1, 9],
  [15, 7, 13, 5],
];

/** Matriz Bayer 8×8, valores 0–63, crescida recursivamente da 4×4. */
export const BAYER8: readonly (readonly number[])[] = Array.from(
  { length: 8 },
  (_, y) =>
    Array.from({ length: 8 }, (_, x) => {
      const q = BAYER4[y % 4][x % 4];
      const quadrant = (y >> 2) * 2 + (x >> 2);
      // valor da 4×4 * 4 + quadrante [0, 2; 3, 1]
      return q * 4 + [0, 2, 3, 1][quadrant];
    }),
);

/** Codifica um SVG mínimo como data-URI seguro para url("...") em CSS. */
function svgDataUri(svg: string): string {
  return `data:image/svg+xml,${svg
    .replaceAll("%", "%25")
    .replaceAll("#", "%23")
    .replaceAll("<", "%3C")
    .replaceAll(">", "%3E")}`;
}

/**
 * Data-URI de um tile SVG 8×8 px para o nível `level` (0–8).
 * Matriz 4×4 com células de 2 px; célula acesa quando
 * `BAYER4[y][x] < level * 2`. Cor preta: em CSS o tom vem de
 * `background-color: var(--ink)` por baixo de `mask`.
 */
export function shadeTile(level: number): string {
  const on: string[] = [];
  if (level >= 8) {
    on.push(`<rect width='8' height='8'/>`);
  } else if (level > 0) {
    for (let y = 0; y < 4; y++) {
      for (let x = 0; x < 4; x++) {
        if (BAYER4[y][x] < level * 2) {
          on.push(`<rect x='${x * 2}' y='${y * 2}' width='2' height='2'/>`);
        }
      }
    }
  }
  const svg =
    `<svg xmlns='http://www.w3.org/2000/svg' width='8' height='8' ` +
    `shape-rendering='crispEdges'>${on.join("")}</svg>`;
  return svgDataUri(svg);
}

/**
 * Data-URI de uma rampa vertical de 8 px de largura: os níveis 7…1 de
 * cima para baixo, `rows` tiles de 8 px por nível (altura 7 × rows × 8 px).
 * Repetida em x no pé de uma área, dissolve a tinta em papel em degraus de
 * retícula, nunca num gradiente suave. Para subir em vez de descer, vire o
 * elemento (`scale: 1 -1`).
 */
export function rampTile(rows = 2): string {
  const on: string[] = [];
  for (let step = 0; step < 7; step++) {
    const level = 7 - step;
    for (let row = 0; row < rows; row++) {
      const top = (step * rows + row) * 8;
      for (let y = 0; y < 4; y++) {
        for (let x = 0; x < 4; x++) {
          if (BAYER4[y][x] < level * 2) {
            on.push(`<rect x='${x * 2}' y='${top + y * 2}' width='2' height='2'/>`);
          }
        }
      }
    }
  }
  const svg =
    `<svg xmlns='http://www.w3.org/2000/svg' width='8' height='${7 * rows * 8}' ` +
    `shape-rendering='crispEdges'>${on.join("")}</svg>`;
  return svgDataUri(svg);
}
