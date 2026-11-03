import type { ReactNode } from "react";
import { Archivo, Bricolage_Grotesque } from "next/font/google";
import s from "./surface.module.css";

const display = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  style: ["normal", "italic"],
  variable: "--font-monochrome-display",
});

const text = Bricolage_Grotesque({
  subsets: ["latin"],
  axes: ["opsz", "wdth"],
  variable: "--font-monochrome-text",
});

export default function Surface({ children }: { children: ReactNode }) {
  return (
    <div className={`${display.variable} ${text.variable} ${s.surface}`}>
      {children}
    </div>
  );
}
