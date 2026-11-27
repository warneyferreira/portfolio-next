import type { Metadata } from "next";
import { sans } from "@/components/alternative/fonts";
import { TEMA_BOOT } from "@/components/alternative/tema/boot";
import { profile } from "@/data/portfolio";
import s from "./alternative.module.css";

export const metadata: Metadata = {
  title: `${profile.shortName} | Versão alternativa`,
  description: profile.description,
};

export default function AlternativeLayout({ children }: LayoutProps<"/alternative">) {
  return (
    <div className={`${s.root} ${sans.variable}`}>
      {/* Tema guardado (escuro/claro) antes da primeira pintura. */}
      <script dangerouslySetInnerHTML={{ __html: TEMA_BOOT }} />
      {children}
    </div>
  );
}
