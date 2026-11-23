import { about, profile } from "@/data/portfolio";
import s from "./about.module.css";

export default function About() {
  return (
    <section id="sobre" aria-labelledby="about-title" className={s.about}>
      <p className={s.label} aria-hidden="true">{about.label}</p>

      <div className={s.composition}>
        <h2 id="about-title" className={s.title}>
          Sobre<span aria-hidden="true">.</span>
        </h2>
        <p className={s.intro}>{about.intro}</p>

        <div className={s.artwork} aria-hidden="true">
          <span className={s.artworkInk} />
        </div>

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

      <dl className={s.facts}>
        <div className={s.role}>
          <dt>Atuação</dt>
          <dd>{profile.role}</dd>
        </div>
        <div>
          <dt>Base</dt>
          <dd>{profile.location}</dd>
        </div>
        <div>
          <dt>Experiência</dt>
          <dd>{profile.experienceYears}</dd>
        </div>
      </dl>
    </section>
  );
}
