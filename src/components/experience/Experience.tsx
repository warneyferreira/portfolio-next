import { Bricolage_Grotesque } from "next/font/google";
import { experience, experienceIntro } from "@/data/portfolio";
import ExperienceReveal from "./ExperienceReveal";
import FlightScene from "./FlightScene";
import reveal from "./reveal.module.css";
import s from "./experience.module.css";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  axes: ["opsz", "wdth"],
  variable: "--font-experience",
});

/* Lida como tira: o desfecho primeiro. Cada emprego é um quadro em
   nanquim, com o período e a empresa no letreiro, a história no meio e os
   números no rodapé do quadro. */
export default function Experience() {
  return (
    <section id="experiencia" aria-labelledby="experience-title" className={`${s.experience} ${bricolage.variable}`}>
      <ExperienceReveal title="Experiência" />

      <div className={s.strip}>
        <p className={s.intro}>{experienceIntro}</p>

        <FlightScene className={s.panels}>
          {experience.map((job, index) => (
            <li key={job.company} className={s.panel}>
              <div className={`${reveal.flight} ${s.panelFlight}`} data-panel-flight aria-hidden="true">
                <div className={`${reveal.dove} ${index % 2 ? reveal.mirrored : ""}`}>
                  <span className={reveal.shape} style={{ maskImage: "url(/images/experience/dove-shape.webp)" }} />
                  <span className={reveal.ink} style={{ maskImage: "url(/images/experience/dove-ink.webp)" }} />
                </div>
              </div>
              <details className={s.disclosure}>
                <summary className={s.cardSummary}>
                  <span className={s.period}>{job.period}</span>
                  <h3 className={s.company}>{job.company}</h3>
                  <span className={s.role}>
                    {job.role}
                    {job.promotedTo && (
                      <>
                        <svg className={s.arrow} viewBox="0 0 24 24" aria-hidden="true">
                          <path d="M3 12h17m-6-6 6 6-6 6" />
                        </svg>
                        <span className={s.srOnly}>, promovido a </span>
                        {job.promotedTo}
                      </>
                    )}
                  </span>
                  <span className={s.toggle}><span className={s.openLabel}>Ver detalhes</span><span className={s.closeLabel}>Fechar detalhes</span><span aria-hidden="true" className={s.toggleIcon}>+</span></span>
                </summary>
                <div className={s.body}>
                  <div className={s.story}>
                    <p className={s.summary}>{job.summary}</p>
                    <p className={s.details}>{job.details}</p>
                    <ul className={s.tags} aria-label="Tecnologias">
                      {job.tags.map((tag) => <li key={tag}>{tag}</li>)}
                    </ul>
                  </div>
                </div>
                <ul className={s.results} aria-label="Resultados">
                  {job.results.map((result) => (
                    <li key={result.label} className={result.value ? undefined : s.resultNote}>
                      {result.value && <strong>{result.value}</strong>}
                      <span>{result.label}</span>
                    </li>
                  ))}
                </ul>
              </details>
            </li>
          ))}
        </FlightScene>
      </div>
    </section>
  );
}
