// Gerado por scripts/recortar-paisagem.mjs — não edite à mão.
// Caixa de cada camada em px do quadro original (1672×941).
import ceu from "./ceu.webp";
import nuvem1 from "./nuvem-1.webp";
import nuvem2 from "./nuvem-2.webp";
import nuvem3 from "./nuvem-3.webp";
import nuvem4 from "./nuvem-4.webp";
import nuvem5 from "./nuvem-5.webp";
import nuvem6 from "./nuvem-6.webp";
import nuvem7 from "./nuvem-7.webp";
import sol from "./sol.webp";
import cumulos from "./cumulos.webp";
import colinas from "./colinas.webp";

export const QUADRO = { w: 1672, h: 941 } as const;

export const camadas = {
  "ceu": { src: ceu, x: 0, y: 0, w: 1672, h: 941 },
  "nuvem-1": { src: nuvem1, x: 0, y: 200, w: 260, h: 158 },
  "nuvem-2": { src: nuvem2, x: 0, y: 465, w: 539, h: 274 },
  "nuvem-3": { src: nuvem3, x: 261, y: 459, w: 155, h: 78 },
  "nuvem-4": { src: nuvem4, x: 412, y: 354, w: 131, h: 58 },
  "nuvem-5": { src: nuvem5, x: 461, y: 0, w: 912, h: 667 },
  "nuvem-6": { src: nuvem6, x: 689, y: 107, w: 215, h: 167 },
  "nuvem-7": { src: nuvem7, x: 1026, y: 619, w: 165, h: 118 },
  "sol": { src: sol, x: 1155, y: 24, w: 331, h: 302 },
  "cumulos": { src: cumulos, x: 508, y: 220, w: 1164, h: 622 },
  "colinas": { src: colinas, x: 0, y: 646, w: 1672, h: 295 },
} as const;

export type NomeCamada = keyof typeof camadas;
