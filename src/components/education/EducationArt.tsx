"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import s from "./EducationArt.module.css";

gsap.registerPlugin(ScrollTrigger, useGSAP);

type EducationArtProps = {
  kind: "owl" | "diploma";
};

export default function EducationArt({ kind }: EducationArtProps) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const root = ref.current;
    if (!root) return;

    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      if (kind === "owl") {
        gsap.fromTo(root, { "--frame-position": "0%" }, {
          "--frame-position": "100%",
          ease: "steps(5)",
          scrollTrigger: {
            trigger: root,
            start: "top 88%",
            end: "bottom 30%",
            scrub: true,
          },
        });
      } else {
        const stamp = root.querySelector<HTMLElement>("[data-stamp]");
        if (!stamp) return;

        gsap.fromTo(stamp, { yPercent: -45, rotation: -12 }, {
          yPercent: 0,
          rotation: -5,
          ease: "power2.in",
          scrollTrigger: {
            trigger: root,
            start: "top 85%",
            end: "center 48%",
            scrub: true,
          },
        });
      }
    }, root);

    return () => media.revert();
  }, { scope: ref, dependencies: [kind], revertOnUpdate: true });

  return (
    <div ref={ref} className={`${s.scene} ${kind === "diploma" ? s.diplomaScene : ""}`} aria-hidden="true">
      {kind === "owl" ? (
        <div className={`${s.art} ${s.owlArt}`}>
          <span className={`${s.layer} ${s.shape}`} />
          <span className={`${s.layer} ${s.ink}`} />
        </div>
      ) : (
        <>
          <div className={`${s.art} ${s.diploma}`}>
            <span className={`${s.layer} ${s.shape}`} />
            <span className={`${s.layer} ${s.ink}`} />
          </div>
          <div className={`${s.art} ${s.stamp}`} data-stamp="">
            <span className={`${s.layer} ${s.shape}`} />
            <span className={`${s.layer} ${s.ink}`} />
          </div>
        </>
      )}
    </div>
  );
}
