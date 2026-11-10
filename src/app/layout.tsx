import type { Metadata } from "next";
import { Bricolage_Grotesque, Martian_Mono } from "next/font/google";
import Intro from "@/components/intro/Intro";
import Nav from "@/components/nav/Nav";
import { profile } from "@/data/portfolio";
import "./globals.css";

const title = `${profile.name} | ${profile.role}`;

const sans = Bricolage_Grotesque({
  subsets: ["latin"],
  axes: ["opsz", "wdth"],
  variable: "--font-sans",
});

const mono = Martian_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  metadataBase: new URL(profile.site),
  title,
  description: profile.description,
  openGraph: {
    title,
    description: profile.description,
    url: profile.site,
    locale: "pt_BR",
    type: "profile",
  },
  twitter: { description: profile.description },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
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
