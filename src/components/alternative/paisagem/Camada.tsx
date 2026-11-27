import Image from "next/image";
import type { CSSProperties, ReactNode } from "react";
import { camadas, QUADRO } from "./camadas";
import { camadasOndas } from "./ondas";
import s from "./paisagem.module.css";

/* As peças recortadas da paisagem: camadas.ts (scripts/recortar-paisagem.mjs,
   céu, nuvens, sol, cúmulos e colinas) e ondas.ts (scripts/recortar-ondas.mjs,
   as ondas em cobalto), todas no mesmo quadro.
   Dentro de um <Quadro> — uma caixa com a proporção da imagem original —
   cada <Camada> cai no lugar exato dela, e o quadro pode ser
   posicionado/escalado como um todo. Para usar uma peça solta em outra
   seção, use pecas[nome].src direto num <Image>.

   Os arquivos já saem no tamanho e na compressão certos (a retícula
   pede croma completo, que o otimizador do Next descartaria): unoptimized. */

export const pecas = { ...camadas, ...camadasOndas };
export type NomePeca = keyof typeof pecas;

const pct = (v: number, total: number) => `${((v / total) * 100).toFixed(4)}%`;

/** Variáveis de posição da peça no quadro (--x, --y, --w, --h, em %). */
export function caixa(nome: NomePeca) {
  const c = pecas[nome];
  return {
    "--x": pct(c.x, QUADRO.w),
    "--y": pct(c.y, QUADRO.h),
    "--w": pct(c.w, QUADRO.w),
    "--h": pct(c.h, QUADRO.h),
  } as CSSProperties;
}

/** URL da peça, para máscaras CSS (ex.: escurecer só as ondas). */
export const urlDe = (nome: NomePeca) => `url(${pecas[nome].src.src})`;

type CamadaProps = {
  nome: NomePeca;
  className?: string;
  style?: CSSProperties;
  /** Primeira dobra: baixa já, com prioridade. */
  prioridade?: boolean;
};

export function Camada({ nome, className = "", style, prioridade = false }: CamadaProps) {
  return (
    <Image
      src={pecas[nome].src}
      alt=""
      unoptimized
      draggable={false}
      loading={prioridade ? "eager" : "lazy"}
      fetchPriority={prioridade ? "high" : "auto"}
      className={`${s.camada} ${className}`}
      style={{ ...caixa(nome), ...style }}
    />
  );
}

export function Quadro({ className = "", children }: { className?: string; children?: ReactNode }) {
  return (
    <div className={`${s.quadro} ${className}`} aria-hidden="true">
      {children}
    </div>
  );
}
