import { mono, sans } from "@/components/gravura/fonts";
import Intro from "@/components/gravura/intro/Intro";
import Nav from "@/components/gravura/nav/Nav";
import { siteMetadata } from "@/lib/metadata";
import "../design-transition.css";
import "./globals.css";

export const metadata = siteMetadata;

export default function GravuraLayout({ children }: LayoutProps<"/gravura">) {
  return (
    <html lang="pt-BR" data-intro="playing" className={`${sans.variable} ${mono.variable}`}>
      <body>
        <Nav />
        {children}
        <Intro />
        {/* Sem JS a abertura nunca termina: o véu sai e a marca da barra aparece. */}
        <noscript>
          <style>{`html[data-intro] [data-intro-veil]{display:none}html[data-intro] [data-brand-mark]{visibility:visible!important}`}</style>
        </noscript>
      </body>
    </html>
  );
}
