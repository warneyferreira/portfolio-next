import type { Metadata } from "next";
import Link from "next/link";
import { mono, sans } from "@/components/gravura/fonts";
import s from "./global-not-found.module.css";

export const metadata: Metadata = {
  title: "Página não encontrada",
};

/* Com três layouts raiz (seletor, Gravura e Luxúria) não há um layout único
   para o 404: este documento cobre os endereços que não existem. */
export default function GlobalNotFound() {
  return (
    <html lang="pt-BR" className={`${sans.variable} ${mono.variable}`}>
      <body className={s.page}>
        <main className={s.main}>
          <h1>Página não encontrada</h1>
          <p>Este endereço não existe no portfólio.</p>
          <Link href="/" prefetch={false}>
            Escolher o design
          </Link>
        </main>
      </body>
    </html>
  );
}
