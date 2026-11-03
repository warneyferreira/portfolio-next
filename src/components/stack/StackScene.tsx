"use client";

import { useRef, type ComponentProps } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/*
 * A seção Stack carrega como uma lista normal. Ao rolar, ela fica presa na
 * tela e a cena corre presa à rolagem: Sísifo entra pela direita, o texto
 * dos grupos se apaga e cada item da lista é puxado para a pedra. Item com
 * ícone vira o próprio ícone, que sai de onde estava o nome e voa até a casa
 * dele na pedra; item sem ícone voa até a pedra e some dentro dela. Por fim
 * a casca da pedra se fecha. Só em telas grandes o bastante para a lista
 * caber presa, e nunca com "menos movimento"; fora disso a lista e o Sísifo
 * pronto ficam um embaixo do outro.
 */
export default function StackScene({ children, ...props }: ComponentProps<"section">) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(min-width: 1001px) and (min-height: 600px) and (prefers-reduced-motion: no-preference)", () => {
        const root = ref.current!;
        const figure = root.querySelector<HTMLElement>("[data-sisyphus]")!;
        const svg = root.querySelector<SVGSVGElement>("[data-boulder]")!;
        const items = gsap.utils.toArray<HTMLElement>("[data-item]", root);
        const icons = new Map(
          gsap.utils.toArray<SVGGElement>("[data-tool]", root).map((g) => [g.dataset.tool, g] as const),
        );

        const viewW = Number(svg.dataset.viewW);
        const cx = Number(svg.dataset.cx);
        const cy = Number(svg.dataset.cy);

        /* centro de um elemento em unidades do desenho; o ScrollTrigger
           desfaz as animações antes de medir, então é a posição de repouso */
        const inBoulder = (el: Element) => {
          const box = svg.getBoundingClientRect();
          const r = el.getBoundingClientRect();
          const unit = box.width / viewW;
          return {
            x: (r.left + r.width / 2 - box.left) / unit,
            y: (r.top + r.height / 2 - box.top) / unit,
            unit,
          };
        };

        figure.setAttribute("data-scene", "");

        // a pedra fica pronta quando ele termina de crescer (FORMED_AT)
        const FORMED_AT = 1.16;
        const tl = gsap.timeline({
          defaults: { ease: "power2.inOut" },
          scrollTrigger: {
            trigger: root,
            start: "top top",
            // ~4 telas de rolagem para a cena inteira, com folga no fim
            end: "+=420%",
            pin: true,
            scrub: 1.2,
            invalidateOnRefresh: true,
            onUpdate: () => figure.toggleAttribute("data-formed", tl.time() >= FORMED_AT),
          },
        });

        // Sísifo entra; o texto dos grupos sai
        tl.fromTo("[data-figure]", { xPercent: 45, opacity: 0 }, { xPercent: 0, opacity: 1, duration: 0.25, ease: "power3.out" }, 0);
        tl.to("[data-fade]", { opacity: 0, y: -12, duration: 0.2, stagger: 0.01 }, 0.05);
        tl.to("[data-group]", { borderTopColor: "transparent", duration: 0.2 }, 0.05);

        // cada item é puxado para a pedra, um grupo depois do outro
        items.forEach((li, i) => {
          const at = 0.18 + (i / items.length) * 0.5;
          const icon = icons.get(li.dataset.item);

          if (icon) {
            const slotX = Number(icon.dataset.x);
            const slotY = Number(icon.dataset.y);
            tl.fromTo(
              icon,
              { x: () => inBoulder(li).x - slotX, y: () => inBoulder(li).y - slotY, opacity: 0 },
              { x: 0, y: 0, opacity: 1, duration: 0.3 },
              at,
            );
            tl.to(li, { opacity: 0, duration: 0.06 }, at);
          } else {
            // sem ícone: cai num ponto do miolo da pedra e some nele
            const angle = i * 2.4;
            const reach = 60 + (i % 4) * 40;
            tl.to(
              li,
              {
                x: () => {
                  const p = inBoulder(li);
                  return (cx + Math.cos(angle) * reach - p.x) * p.unit;
                },
                y: () => {
                  const p = inBoulder(li);
                  return (cy + Math.sin(angle) * reach - p.y) * p.unit;
                },
                scale: 0.4,
                opacity: 0,
                duration: 0.3,
              },
              at,
            );
          }
        });

        // a casca da pedra fecha por último
        tl.fromTo(
          "[data-shell]",
          { opacity: 0, scale: 0.85, svgOrigin: `${cx} ${cy}` },
          { opacity: 1, scale: 1, duration: 0.25, ease: "power3.out" },
          0.62,
        );

        // pedra pronta: Sísifo caminha até o meio da seção e cresce um pouco,
        // de pé no chão; a frase de abertura sai para dar lugar à pedra
        const stage = root.querySelector<HTMLElement>("[data-stage]")!;
        tl.to(
          stage,
          {
            x: () => {
              const box = root.getBoundingClientRect();
              const r = stage.getBoundingClientRect();
              return box.left + box.width / 2 - (r.left + r.width / 2);
            },
            scale: 1.18,
            transformOrigin: "50% 100%",
            duration: 0.3,
          },
          0.86,
        );
        tl.to("[data-intro]", { opacity: 0, y: -16, duration: 0.2 }, 0.86);

        // um respiro com a pedra pronta antes de a seção soltar
        tl.to({}, { duration: 0.3 }, FORMED_AT);

        return () => {
          figure.removeAttribute("data-scene");
          figure.removeAttribute("data-formed");
        };
      });
    },
    { scope: ref },
  );

  return (
    <section ref={ref} {...props}>
      {children}
    </section>
  );
}
