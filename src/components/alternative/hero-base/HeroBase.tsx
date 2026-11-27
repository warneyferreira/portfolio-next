import { contact, hero, profile } from "@/data/portfolio";
import { availability } from "../copy";
import Fibras from "../fibras/Fibras";
import s from "./hero-base.module.css";

/* Hero da /alternative: o nome se desfaz e vira as fibras, no fundo do
   tema (preto ou branco pastel). O canvas que redesenha e corrói o nome
   (NomeDesfeito) fica em page.tsx, fixo na tela, porque os grãos dele
   atravessam até o Sobre; o véu de fibras (fibras/Fibras, GhostFibers do
   React Bits) começa no fim do nome e segue até o canto de cima. Cargo e
   cidade no topo, disponibilidade e ações embaixo. Sem Fraunces: a
   hierarquia vem da largura do Archivo. */

export default function HeroBase() {
  const [first, ...rest] = profile.shortName.split(" ");

  return (
    <header id="inicio" className={s.hero}>
      <Fibras className={s.fibers} />
      <div className={s.scrim} aria-hidden="true" />

      <div className={s.meta}>
        <p>{profile.role}</p>
        <p>{profile.location}</p>
      </div>

      <div className={s.main}>
        <h1 className={s.name}>
          <span>{first}</span>
          <span>{rest.join(" ")}</span>
        </h1>
      </div>

      <div className={s.foot}>
        <p className={s.availability}>{availability}</p>
        <div className={s.actions}>
          <a className={s.primary} href={profile.resume} download>
            {hero.resumeLabel}
          </a>
          <a className={s.secondary} href={contact.github} target="_blank" rel="noreferrer">
            GitHub
          </a>
        </div>
      </div>
    </header>
  );
}
