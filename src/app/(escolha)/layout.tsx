import { mono, sans } from "@/components/gravura/fonts";
import { gotica, romana } from "@/components/luxuria/fonts";
import { siteMetadata } from "@/lib/metadata";
import "./globals.css";

export const metadata = siteMetadata;

/* O seletor tem raiz própria: cada design é outro documento, e ir de um
   para o outro recarrega a página, sem herdar o CSS global do anterior. */
export default function EscolhaLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-BR"
      className={`${sans.variable} ${mono.variable} ${gotica.variable} ${romana.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
