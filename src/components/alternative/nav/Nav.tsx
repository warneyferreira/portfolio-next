"use client";

import Link from "next/link";
import { type ComponentType, type CSSProperties, type ReactNode } from "react";
import { nav, profile } from "@/data/portfolio";
import GlassSurfaceJs from "../glass/GlassSurface";
import { definirTema, useTema } from "../tema/tema";
import s from "./nav.module.css";

/* Barra flutuante: a pílula de vidro do React Bits (glass/GlassSurface),
   fixa no topo para a página passar por trás. Cores do tema (texto e véu
   do vidro); no fim, o botão que troca entre escuro e claro. */

// O componente é JS: os tipos inferidos dos defaults não aceitam largura em
// CSS ("100%"). Só os props usados aqui.
type GlassProps = {
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
  width?: number | string;
  height?: number | string;
  borderRadius?: number;
  borderWidth?: number;
  brightness?: number;
  opacity?: number;
  blur?: number;
  displace?: number;
  backgroundOpacity?: number;
  saturation?: number;
  distortionScale?: number;
  redOffset?: number;
  greenOffset?: number;
  blueOffset?: number;
  refraction?: boolean;
  renderer?: "auto" | "svg" | "webgl";
};
const GlassSurface = GlassSurfaceJs as unknown as ComponentType<GlassProps>;

export default function Nav() {
  const tema = useTema();
  const proximo = tema === "escuro" ? "claro" : "escuro";

  return (
    <nav className={s.nav} aria-label="Principal">
      <GlassSurface
        className={s.glass}
        width="100%"
        height={64}
        borderRadius={32}
        borderWidth={0.07}
        brightness={70}
        opacity={0.55}
        blur={12}
        displace={0.5}
        backgroundOpacity={0.1}
        saturation={1}
        distortionScale={-180}
        redOffset={0}
        greenOffset={10}
        blueOffset={20}
        refraction
        renderer="auto"
      >
        <div className={s.inner}>
          <a href="#inicio" className={s.brand} aria-label={`${profile.shortName}, início`}>
            <span className={s.mark} aria-hidden="true">
              WR
            </span>
            <span className={s.name}>{profile.shortName}</span>
          </a>
          <div className={s.links}>
            {nav.map((item) => (
              <a key={item.href} href={item.href}>
                {item.label}
              </a>
            ))}
            <Link href="/" className={s.classic}>
              Versão clássica
            </Link>
            <button
              type="button"
              className={s.tema}
              onClick={() => definirTema(proximo)}
              aria-label={proximo === "claro" ? "Ativar tema claro" : "Ativar tema escuro"}
              title={proximo === "claro" ? "Tema claro" : "Tema escuro"}
            >
              {proximo === "claro" ? (
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <circle cx="12" cy="12" r="4" />
                  <path d="M12 2.5v2.2M12 19.3v2.2M4.6 4.6l1.6 1.6M17.8 17.8l1.6 1.6M2.5 12h2.2M19.3 12h2.2M4.6 19.4l1.6-1.6M17.8 6.2l1.6-1.6" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5Z" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </GlassSurface>
    </nav>
  );
}
