import { Bricolage_Grotesque } from "next/font/google";
import { about, profile } from "@/data/portfolio";
import s from "./about.module.css";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  axes: ["opsz", "wdth"],
  variable: "--font-about",
});

export default function About() {
  return (
    <section id="sobre" aria-labelledby="about-title" className={`${s.about} ${bricolage.variable}`}>
      {/* pilar jônico tombado, entrando pela borda direita da tela */}
      <div className={s.column} aria-hidden="true">
        <span className={s.columnShape} />
        <span className={s.columnInk} />
      </div>

      <div className={s.heading}>
        <h2 id="about-title">Sobre<span aria-hidden="true">.</span></h2>
        <p className={s.intro}>{about.intro}</p>
      </div>

      <div className={s.body}>
        <div className={s.story}>
          <div>
            <h3>{about.front.title}</h3>
            <p>{about.front.text}</p>
          </div>
          <div>
            <h3>{about.back.title}</h3>
            <p>{about.back.text}</p>
          </div>
        </div>
      </div>

      <div className={s.bottom}>
        <dl className={s.facts}>
          <div><dt>Função</dt><dd>{profile.role}</dd></div>
          <div><dt>Base</dt><dd>{profile.location}</dd></div>
          <div><dt>Estrada</dt><dd>{profile.experienceYears}</dd></div>
        </dl>
        <a className={s.resume} href={profile.resume} download>
          Baixar currículo
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v13m-5-5 5 5 5-5M5 17v4h14v-4" /></svg>
        </a>
      </div>
    </section>
  );
}
