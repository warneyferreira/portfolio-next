import type { Metadata } from "next";
import { Archivo, Bricolage_Grotesque } from "next/font/google";
import { profile } from "@/data/portfolio";
import "./globals.css";

/* Display larga e pesada do pôster (Archivo no eixo de largura máximo) e
   Bricolage para texto corrido. */
const display = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  style: ["normal", "italic"],
  variable: "--font-display",
});

const text = Bricolage_Grotesque({
  subsets: ["latin"],
  axes: ["opsz", "wdth"],
  variable: "--font-text",
});

const title = `${profile.name} | ${profile.role}`;

/* Aplica o tema salvo (ou o do sistema) antes da primeira pintura. */
const themeScript = `(function(){try{var t=localStorage.getItem("theme");if(t!=="dark"&&t!=="light")t=matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light";document.documentElement.setAttribute("data-theme",t)}catch(e){}})()`;

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
    <html lang="pt-BR" data-theme="light" className={`${display.variable} ${text.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
