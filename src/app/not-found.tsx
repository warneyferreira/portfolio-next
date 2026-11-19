import type { Metadata } from "next";
import Link from "next/link";
import s from "./not-found.module.css";

export const metadata: Metadata = {
  title: "Página não encontrada",
};

export default function NotFound() {
  return (
    <main className={s.main}>
      <h1>Página não encontrada</h1>
      <p>Este endereço não existe no portfólio.</p>
      <Link href="/">Voltar ao portfólio</Link>
    </main>
  );
}
