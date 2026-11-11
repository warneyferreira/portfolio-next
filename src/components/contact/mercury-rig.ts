import type { Rig } from "@/components/wings/rig";

/* Mercúrio (public/images/contact/mercury-dither.webp, 640×2052): só as
   duas asas do pétaso batem, bem devagar (um ciclo a cada ~5,5 s), em
   torno da raiz no capacete; o resto da gravura fica parado. Medidas em px
   da máscara. */
export const mercuryRig: Rig = {
  flaps: [
    { root: [178, 222], axis: -149, spread: [30, 50], reach: [12, 50, 200, 228], deg: 6, hz: 0.18 },
    { root: [147, 263], axis: 178, spread: [22, 38], reach: [10, 36, 120, 140], deg: 6, hz: 0.18, phase: 0.4 },
  ],
};
