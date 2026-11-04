"use client";

import { useRef, type ComponentProps } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function FlightScene({ children, ...props }: ComponentProps<"ol">) {
  const ref = useRef<HTMLOListElement>(null);

  useGSAP(() => {
    const root = ref.current!;
    const media = gsap.matchMedia();

    const refresh = () => ScrollTrigger.refresh();
    root.addEventListener("toggle", refresh, true);
    media.add("(prefers-reduced-motion: no-preference)", () => {
      root.setAttribute("data-flights-active", "");
      root.querySelectorAll<HTMLElement>("[data-panel-flight]").forEach((bird, index) => {
        const panel = bird.parentElement!;
        const reverse = index % 2 === 1;
        const left = () => -bird.offsetWidth;
        const right = () => panel.clientWidth + bird.offsetWidth;
        const flight = gsap.timeline({
          scrollTrigger: {
            trigger: panel,
            start: "top bottom+=100%",
            end: "bottom top-=100%",
            scrub: 1.5,
            invalidateOnRefresh: true,
            onToggle: (trigger) => bird.toggleAttribute("data-flying", trigger.isActive),
          },
        });
        flight.fromTo(bird, { x: reverse ? right : left, autoAlpha: 0 }, { x: reverse ? left : right, autoAlpha: 1, duration: 1, ease: "none" });
        flight.to(bird, { autoAlpha: 0, duration: 0.1 }, 0.9);
      });
      return () => {
        root.removeAttribute("data-flights-active");
        root.querySelectorAll("[data-panel-flight]").forEach((bird) => bird.removeAttribute("data-flying"));
      };
    });
    return () => root.removeEventListener("toggle", refresh, true);
  }, { scope: ref });

  return <ol ref={ref} {...props}>{children}</ol>;
}
