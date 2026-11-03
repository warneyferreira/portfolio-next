"use client";

import { useRef, type ComponentProps } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/*
 * O palco fica preso durante uma rolagem mais longa. As
 * nuvens começam fechadas sobre o título e se abrem para os lados, crescendo
 * um pouco como se passassem pela câmera; o título vem junto. Uma pomba
 * atravessa da esquerda para a direita no alto e outra volta da direita para
 * a esquerda mais embaixo. Sem a cena (menos movimento, sem JS), o CSS já
 * mostra o estado final: nuvens abertas, título à vista, pombas fora.
 */
export default function RevealScene({ children, ...props }: ComponentProps<"div">) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const root = ref.current!;
        root.setAttribute("data-scene", "");

        const tl = gsap.timeline({
          defaults: { ease: "power2.inOut" },
          scrollTrigger: {
            trigger: root,
            start: "top top",
            end: "+=240%",
            pin: true,
            scrub: 1,
          },
        });
        // começam fechadas sobre o título; no celular elas andam mais, porque
        // terminam mais longe para fora da tela
        const shut = () => (window.innerWidth <= 700 ? 1.35 : 0.62) * window.innerWidth;
        tl.fromTo('[data-cloud="left"]', { x: () => shut(), scale: 0.92 }, { x: 0, scale: 1.03, duration: 1 }, 0);
        tl.fromTo('[data-cloud="right"]', { x: () => -shut(), scale: 0.92 }, { x: 0, scale: 1.03, duration: 1 }, 0);

        tl.fromTo("h2", { scale: 0.86, opacity: 0.2 }, { scale: 1, opacity: 1, duration: 1, ease: "power2.inOut" }, 0);

        tl.fromTo('[data-dove="ltr"]', { x: "-25vw", y: "6vh" }, { x: "125vw", y: "-4vh", duration: 1.15, ease: "none" }, 0);
        tl.fromTo('[data-dove="rtl"]', { x: "25vw", y: "-4vh" }, { x: "-125vw", y: "5vh", duration: 1.15, ease: "none" }, 0.25);

        return () => root.removeAttribute("data-scene");
      });
    },
    { scope: ref },
  );

  return (
    <div ref={ref} {...props}>
      {children}
    </div>
  );
}
