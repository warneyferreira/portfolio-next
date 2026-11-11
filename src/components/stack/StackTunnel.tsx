"use client";

import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { stack } from "@/data/portfolio";
import { stackIcon, type StackIcon } from "@/lib/stack-icons";
import s from "./stack-tunnel.module.css";

/*
 * O túnel da Stack: cada ferramenta vira um prato de papel com o ícone em
 * tinta, distribuído numa espiral de ângulo áureo e atravessado pela rolagem
 * (sem capturar a roda do mouse). O título fica no centro e cresce com o
 * percurso. Com "menos movimento", os mesmos pratos aparecem numa grade
 * estática — sem transformação 3D e sem área presa.
 */

type TunnelCard = {
  name: string;
  group: string;
  icon: StackIcon;
  index: number;
  cos: number;
  sin: number;
  radiusX: number;
  radiusY: number;
  rotation: number;
};

const GOLDEN_ANGLE = 137.5 * (Math.PI / 180);
const STAGGER = 0.55;

const CARDS: TunnelCard[] = stack
  .flatMap((group) => group.items.map((name) => ({ name, group: group.name })))
  .map((item, index) => ({
    ...item,
    icon: stackIcon(item.name),
    index,
    cos: Math.cos(index * GOLDEN_ANGLE),
    sin: Math.sin(index * GOLDEN_ANGLE),
    radiusX: 0.28 + (index % 3) * 0.08,
    radiusY: 0.26 + (index % 2) * 0.09,
    rotation: (index % 2 === 0 ? 1 : -1) * (3 + (index % 5) * 2),
  }));

const TOTAL = CARDS.length;

interface Stage {
  width: number;
  height: number;
  isMobile: boolean;
}

function useStage(): Stage {
  const [stage, setStage] = useState<Stage>({ width: 1440, height: 900, isMobile: false });

  useEffect(() => {
    const update = () =>
      setStage({ width: window.innerWidth, height: window.innerHeight, isMobile: window.innerWidth < 768 });
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return stage;
}

function usePointerParallax(enabled: boolean) {
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, { stiffness: 60, damping: 25, mass: 0.5 });
  const y = useSpring(rawY, { stiffness: 60, damping: 25, mass: 0.5 });

  useEffect(() => {
    if (!enabled) return;
    const onMove = (event: PointerEvent) => {
      rawX.set((event.clientX / window.innerWidth - 0.5) * 2);
      rawY.set((event.clientY / window.innerHeight - 0.5) * 2);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [enabled, rawX, rawY]);

  return { x, y };
}

function CardPlate({ card }: { card: TunnelCard }) {
  return (
    <div className={s.plate}>
      {card.icon.kind === "icon" ? (
        <svg className={s.icon} viewBox="0 0 24 24" aria-hidden="true">
          <path d={card.icon.path} />
        </svg>
      ) : (
        <span className={s.monogram} aria-hidden="true">{card.icon.text}</span>
      )}
      <span className={s.name}>{card.name}</span>
      <span className={s.group}>{card.group}</span>
    </div>
  );
}

function TunnelCardView({
  card,
  progress,
  pointer,
  stage,
}: {
  card: TunnelCard;
  progress: MotionValue<number>;
  pointer: { x: MotionValue<number>; y: MotionValue<number> };
  stage: Stage;
}) {
  const start = (card.index / TOTAL) * (1 - STAGGER);
  const end = start + STAGGER;
  const local = useTransform(progress, [start, end], [0, 1]);

  const farZ = stage.isMobile ? -1200 : -1700;
  const nearZ = stage.isMobile ? 350 : 500;
  const z = useTransform(local, [0, 1], [farZ, nearZ]);
  const opacity = useTransform(local, [0, 0.18, 0.82, 0.98], [0, 1, 1, 0]);

  const width = stage.isMobile
    ? Math.max(104, Math.min(136, stage.width * 0.3))
    : Math.max(132, Math.min(168, stage.width * 0.115));

  const baseX = card.cos * stage.width * card.radiusX;
  const baseY = card.sin * stage.height * card.radiusY;
  const pan = stage.isMobile ? 18 : 40;

  const transform = useTransform([z, pointer.x, pointer.y], ([currZ, px, py]: number[]) => {
    const offsetX = baseX - px * pan;
    const offsetY = baseY - py * pan;
    return `translate3d(calc(-50% + ${offsetX}px), calc(-50% + ${offsetY}px), ${currZ}px) rotateZ(${card.rotation}deg)`;
  });

  return (
    <motion.div
      className={s.card}
      style={{ width, transform, opacity, zIndex: card.index + 1 }}
    >
      <CardPlate card={card} />
    </motion.div>
  );
}

export default function StackTunnel() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const stage = useStage();
  const pointer = usePointerParallax(!reduce);

  // progresso medido direto da rolagem: 0 no topo do wrapper, 1 no fim
  const rawProgress = useMotionValue(0);
  const progress = useSpring(rawProgress, { stiffness: 80, damping: 30, restDelta: 0.0001 });

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const rect = el.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      const p = total > 0 ? Math.min(1, Math.max(0, -rect.top / total)) : 0;
      rawProgress.set(p);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [rawProgress]);

  const titleScale = useTransform(progress, [0, 0.5, 1], [0.72, 1, 1.3]);
  const titleOpacity = useTransform(progress, [0, 0.12, 0.85, 1], [1, 1, 1, 0.35]);

  if (reduce) {
    return (
      <div className={s.staticWrap}>
        <header className={s.staticHeading}>
          <h2 id="stack-title">Stack<span aria-hidden="true">.</span></h2>
          <span className={s.rule} aria-hidden="true" />
        </header>
        <ul className={s.staticGrid}>
          {CARDS.map((card) => (
            <li key={card.name} className={s.staticCard}>
              <CardPlate card={card} />
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <div ref={wrapperRef} className={s.wrapper}>
      <div className={s.stage}>
        <motion.header className={s.anchor} style={{ scale: titleScale, opacity: titleOpacity }}>
          <h2 id="stack-title">Stack<span aria-hidden="true">.</span></h2>
          <span className={s.rule} aria-hidden="true" />
        </motion.header>

        <div className={s.cards} aria-hidden="true">
          {CARDS.map((card) => (
            <TunnelCardView key={card.name} card={card} progress={progress} pointer={pointer} stage={stage} />
          ))}
        </div>
      </div>
    </div>
  );
}
