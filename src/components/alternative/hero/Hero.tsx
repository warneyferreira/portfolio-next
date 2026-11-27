import { about, contact, hero, profile } from "@/data/portfolio";
import { availability } from "../copy";
import Mar from "./Mar";
import s from "./hero.module.css";

/* Um cartaz vivo: o nome em Fraunces sobre o papel, apoiado no horizonte de
   um mar em Three.js impresso como xilogravura (Mar.tsx). O canvas fica por
   cima do nome com o céu transparente, então as cristas mais altas passam
   na frente das letras. Na rolagem (data-scene + Parallax.tsx) a câmera
   mergulha e o nome afunda — para chegar de novo no Sobre. */

export default function Hero() {
  const [first, ...rest] = profile.shortName.split(" ");

  return (
    <header id="inicio" className={s.hero} data-scene>
      <div className={s.stage}>
        {/* Mar em CSS: por baixo do canvas enquanto ele carrega, e o mar
            inteiro sem WebGL. */}
        <div className={s.marCss} aria-hidden="true" />

        <div className={s.intro}>
          <p className={s.role}>
            Software Engineer
            <br />& AI Specialist
          </p>
          <p className={s.lede}>{about.intro}</p>
        </div>

        <h1 className={s.name}>
          <span>{first}</span> <span>{rest.join(" ")}</span>
        </h1>

        <Mar />

        <div className={s.ground}>
          <p className={s.where}>
            {profile.location}
            <br />
            {availability}
          </p>
          <div className={s.actions}>
            <a className={s.primary} href={profile.resume} download>
              {hero.resumeLabel}
              <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
                <path d="M12 4v12m-5-5 5 5 5-5M5 20h14" />
              </svg>
            </a>
            <a className={s.secondary} href={contact.github} target="_blank" rel="noreferrer">
              GitHub
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
