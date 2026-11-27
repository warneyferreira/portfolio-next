"use client";

import GhostFibers from "../hero/GhostFibers";
import { useTema } from "../tema/tema";

/* O véu de fibras (GhostFibers do React Bits) nas cores do tema: luz
   cinza-clara sobre o preto no escuro; tinta (lightMode) sobre o branco
   pastel no claro. Usado no hero (de onde o nome se desfaz) e no Sobre (de
   onde os grãos descarregam o título). `ajustes` muda só a forma. */

const ESCURO = { glowColor: "#d4d4d8", secondaryColor: "#a1a1aa", lineColor: "#ffffff", lightMode: false };
const CLARO = { glowColor: "#3a3f4b", secondaryColor: "#6b7280", lineColor: "#111318", lightMode: true };

type Ajustes = {
  rotation?: number;
  perspective?: number;
  scale?: number;
  twist?: number;
  spread?: number;
  waves?: number;
};

export default function Fibras({ className, ajustes }: { className?: string; ajustes?: Ajustes }) {
  const cores = useTema() === "claro" ? CLARO : ESCURO;
  return (
    <GhostFibers
      className={className}
      {...cores}
      layers={1}
      twist={1.5}
      threads={54}
      fiberStyle="dots"
      depthOfField={0.6}
      hoverEffect="focus"
      intro
      mouseInteraction
      volume={0.4}
      foldGlow={1.5}
      particles={0.15}
      sparkle={0.35}
      glow={0.6}
      {...ajustes}
    />
  );
}
