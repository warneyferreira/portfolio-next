"use client";

import { useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import s from "./projects.module.css";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function ProjectPull({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      const root = ref.current!;
      const title = root.querySelector("h2")!;
      const rope = root.querySelector<HTMLElement>("[data-rope]")!;
      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          start: "top 20%",
          end: "+=300%",
          pin: root.parentElement!,
          scrub: true,
          invalidateOnRefresh: true,
        },
      });

      const distance = () => window.innerWidth + title.clientWidth;
      timeline.fromTo(title, { x: () => -distance() }, { x: 0, duration: 1.4, ease: "power1.inOut" }, 0);
      timeline.fromTo(rope, {
        opacity: 1,
        scaleX: () => 1 + distance() / Math.max(rope.clientWidth, 1),
        transformOrigin: "100% 50%",
      }, { scaleX: 1, duration: 1.4, ease: "power1.inOut" }, 0);
      timeline.fromTo("[data-standing]", { opacity: 1, backgroundPosition: "0% 0%" }, {
        backgroundPosition: "100% 0%", duration: 1.4, ease: "steps(6)",
      }, 0);
      timeline.set("[data-sitting]", { opacity: 0, backgroundPosition: "0% 0%" }, 0);
      timeline.to(rope, { opacity: 0, duration: 0.15 }, 1.4);
      timeline.to("[data-standing]", { opacity: 0, duration: 0.08 }, 1.5);
      timeline.to("[data-sitting]", { opacity: 1, duration: 0.08 }, 1.5);
      timeline.to("[data-sitting]", { backgroundPosition: "100% 0%", duration: 0.8, ease: "steps(6)" }, 1.5);
      timeline.to({}, { duration: 0.2 });
      return () => {
        gsap.set(title, { clearProps: "transform" });
        gsap.set(rope, { clearProps: "transform,opacity" });
        gsap.set("[data-standing], [data-sitting]", { clearProps: "opacity,backgroundPosition" });
      };
    });
  }, { scope: ref });

  return (
    <div ref={ref} className={s.pullScene}>
      <div className={s.pullGroup}>
        {children}
        <span className={s.rope} data-rope aria-hidden="true" />
        <span className={s.gladiator} aria-hidden="true">
          <span className={s.standing} data-standing />
          <span className={s.sitting} data-sitting />
        </span>
      </div>
    </div>
  );
}
