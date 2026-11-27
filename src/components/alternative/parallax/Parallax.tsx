"use client";

import { useEffect } from "react";

/* Controlador único de parallax da página /alternative.

   Liga html[data-alt-parallax] (o script em PARALLAX_BOOT já faz isso antes
   da primeira pintura, para o layout não pular) e, a cada frame de
   rolagem, escreve o progresso em variáveis CSS. O CSS só lê as variáveis
   e move com transform/opacity, que rodam no compositor.

   Dois contratos, para qualquer seção:

   • [data-scene] — palco fixo (ex.: uma cena de abertura). Recebe --scene
     de 0 a 1 enquanto o elemento, mais alto que a tela, cobre a tela
     inteira (do topo dele no topo da tela até o fim dele no fim da tela).

   • [data-depth="1".."4"] — camada que emerge. Recebe --p de 0 a 1: 0 com o
     topo do elemento entrando pela base da tela, 1 quando ele já cobriu
     45% do percurso. As regras globais em alternative.module.css fazem o
     resto (quanto maior o depth, mais fundo começa e mais atrasa).

   • [data-reveal] — só o progresso, sem movimento pronto. Recebe --r de 0 a
     1: 0 com o topo entrando pela base da tela, 1 quando o topo chega a
     ~40% da altura da tela. Para animações próprias (ex.: as linhas do
     Stack), que leem --r no CSS com var(--r, 1) — sem JS fica tudo pronto.

   Movimento reduzido: desliga tudo e as camadas ficam paradas e visíveis. */

export const PARALLAX_BOOT = `
  try {
    if (!matchMedia("(prefers-reduced-motion: reduce)").matches)
      document.documentElement.dataset.altParallax = "";
  } catch {}
`;

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);

export default function Parallax() {
  useEffect(() => {
    const html = document.documentElement;
    const motion = matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    let on = false;

    const update = () => {
      frame = 0;
      const vh = innerHeight;
      const scenes = document.querySelectorAll<HTMLElement>("[data-scene]");
      const layers = document.querySelectorAll<HTMLElement>("[data-depth]");
      const reveals = document.querySelectorAll<HTMLElement>("[data-reveal]");

      // Lê tudo primeiro, escreve depois: nada de layout forçado no meio.
      const sceneP = Array.from(scenes, (el) => {
        const r = el.getBoundingClientRect();
        const span = r.height - vh;
        return span > 0 ? clamp01(-r.top / span) : 0;
      });
      const layerP = Array.from(layers, (el) => {
        const r = el.getBoundingClientRect();
        return clamp01((vh - r.top) / (0.45 * (vh + r.height)));
      });
      const revealP = Array.from(reveals, (el) => {
        const r = el.getBoundingClientRect();
        return clamp01((vh - r.top) / (0.6 * vh));
      });

      scenes.forEach((el, i) => el.style.setProperty("--scene", sceneP[i].toFixed(4)));
      layers.forEach((el, i) => el.style.setProperty("--p", layerP[i].toFixed(4)));
      reveals.forEach((el, i) => el.style.setProperty("--r", revealP[i].toFixed(4)));
    };

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    const clear = () => {
      document.querySelectorAll<HTMLElement>("[data-scene], [data-depth], [data-reveal]").forEach((el) => {
        el.style.removeProperty("--scene");
        el.style.removeProperty("--p");
        el.style.removeProperty("--r");
      });
    };

    const start = () => {
      if (on) return;
      on = true;
      html.dataset.altParallax = "";
      addEventListener("scroll", schedule, { passive: true });
      addEventListener("resize", schedule);
      update();
    };

    const stop = () => {
      if (!on) return;
      on = false;
      delete html.dataset.altParallax;
      removeEventListener("scroll", schedule);
      removeEventListener("resize", schedule);
      cancelAnimationFrame(frame);
      frame = 0;
      clear();
    };

    const sync = () => (motion.matches ? stop() : start());
    sync();
    motion.addEventListener("change", sync);

    return () => {
      motion.removeEventListener("change", sync);
      stop();
    };
  }, []);

  return null;
}
