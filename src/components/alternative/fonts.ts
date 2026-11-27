import { Archivo, Fraunces } from "next/font/google";

/* Texto: Archivo. A hierarquia vem da largura (eixo wdth, 62–125%) e do
   peso; o texto corrido fica na largura normal. */
export const sans = Archivo({
  subsets: ["latin"],
  weight: "variable",
  axes: ["wdth"],
  variable: "--alt-sans",
});

/* Só o nome do hero: Fraunces no tamanho óptico máximo, macia (SOFT) e
   torta (WONK) — a serifa gorda dos cartazes dos anos 70, a mesma época do
   sol espiral e da retícula da paisagem. */
export const display = Fraunces({
  subsets: ["latin"],
  weight: "variable",
  axes: ["SOFT", "WONK", "opsz"],
  variable: "--alt-display",
});
