import type { SVGProps } from "react";

/* A marca: um prato de tinta 14×14 com um W de pixel vazado, e a sombra
   reticulada do site (xadrez, deslocada 2 unidades para a direita e para
   baixo). Grade de 16 unidades: imprimir em múltiplos de 16 px para cada
   célula do xadrez cair em pixels inteiros. */

const PLATE = "M0 0h14v14H0z";
// W vazado (fill-rule evenodd): pernas de fora, perna do meio, dois pés.
const LETTER = "M2 3h2v6H2zM10 3h2v6h-2zM6 5h2v4H6zM4 9h2v2H4zM8 9h2v2H8z";

function shadow() {
  let d = "";
  for (let y = 2; y < 16; y++) {
    for (let x = 2; x < 16; x++) {
      if ((x >= 14 || y >= 14) && (x + y) % 2 === 0) d += `M${x} ${y}h1v1h-1z`;
    }
  }
  return d;
}

export const MARK_PATH = PLATE + LETTER + shadow();

/** Markup da marca para quem precisa da forma como textura (a abertura). */
export const MARK_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor"><path fill-rule="evenodd" d="${MARK_PATH}"/></svg>`;

export default function BrandMark(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 16 16" fill="currentColor" shapeRendering="crispEdges" aria-hidden {...props}>
      <path fillRule="evenodd" d={MARK_PATH} />
    </svg>
  );
}
