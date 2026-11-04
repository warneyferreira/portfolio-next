"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import s from "./contact-art.module.css";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function ContactArt() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const root = ref.current!;
    const letter = root.querySelector<HTMLElement>("[data-letter]")!;
    const layers = root.querySelectorAll<HTMLElement>("[data-frame]");
    const media = gsap.matchMedia();

    media.add("(prefers-reduced-motion: no-preference)", () => {
      const distance = () => Math.min(420, Math.max(0, root.clientWidth - letter.offsetWidth - letter.offsetLeft * 2));
      const flight = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          start: "top 90%",
          end: "bottom 62%",
          scrub: 0.65,
          invalidateOnRefresh: true,
        },
      });

      flight.fromTo(letter,
        { x: distance, y: -12, rotation: 8 },
        { x: () => distance() * 0.46, y: -28, rotation: -6, duration: 0.5, ease: "sine.inOut" },
      );
      flight.to(letter, { x: 0, y: 0, rotation: -3, duration: 0.5, ease: "power2.out" });
      flight.fromTo(layers,
        { maskPosition: "0% 50%", webkitMaskPosition: "0% 50%" },
        { maskPosition: "100% 50%", webkitMaskPosition: "100% 50%", duration: 1, ease: "steps(5)" },
        0,
      );
    });

    return () => media.revert();
  }, { scope: ref });

  return (
    <div ref={ref} className={s.stage} aria-hidden="true">
      <div className={s.letter} data-letter>
        <span className={s.shape} data-frame />
        <span className={s.ink} data-frame />
      </div>
    </div>
  );
}
