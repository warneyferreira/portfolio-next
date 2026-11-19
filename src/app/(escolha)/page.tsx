import Link from "next/link";
import frame from "@/components/luxuria/frame/frame.module.css";
import { profile } from "@/data/portfolio";
import s from "./escolha.module.css";

/* A entrada do site: a tela dividida ao meio, cada lado já impresso no seu
   design, e o lado inteiro é o link. Cada design tem layout raiz próprio,
   então entrar recarrega a página e pré-carregar não serve. */
export default function Escolha() {
  return (
    <main className={s.choice}>
      <h1 className={s.question}>
        <span>Escolha o</span> <span>design</span>
      </h1>

      <Link href="/gravura" prefetch={false} className={`${s.side} ${s.gravura}`}>
        <span className={s.plate} aria-hidden>
          {profile.shortName.split(" ").map((name) => (
            <span key={name}>{name}</span>
          ))}
        </span>
        <h2 className={s.name}>Gravura</h2>
        <p className={s.about}>Uma tinta laranja sobre papel, gravuras clássicas e retícula.</p>
        <span className={s.enter}>Entrar</span>
      </Link>

      <Link href="/luxuria" prefetch={false} className={`${s.side} ${s.luxuria}`}>
        <span className={`${frame.frame} ${s.cover}`} aria-hidden>
          {profile.shortName}
        </span>
        <h2 className={s.name}>Luxúria</h2>
        <p className={s.about}>Creme sobre carmim, moldura de gotas e letra gótica.</p>
        <span className={s.enter}>Entrar</span>
      </Link>
    </main>
  );
}
