import { experience } from "@/data/portfolio";
import { summaryFor } from "../copy";
import SectionHead from "../section/SectionHead";
import layout from "../section/section.module.css";
import s from "./experience.module.css";

/* Experiência: cada empresa é uma entrada de índice. À esquerda, quando e
   onde; à direita, o que mudou. Os resultados numéricos são os únicos
   números grandes da seção. Os detalhes abrem com <details> — sem JS.
   Cada entrada entra inteira na rolagem (data-reveal → --r). */
export default function Experience() {
  return (
    <section id="experiencia" className={layout.section} aria-labelledby="experiencia-titulo">
      <div className={layout.inner}>
        <SectionHead id="experiencia-titulo" title="Experiência" />

        <ol className={s.timeline} role="list">
          {experience.map((job) => (
            <li key={job.company} className={s.entry}>
              <article className={s.job} data-reveal>
                <div className={s.who}>
                  <p className={s.period}>{job.period}</p>
                  <h3 className={s.company}>{job.company}</h3>
                  <p className={s.role}>{job.promotedTo ?? job.role}</p>
                  {job.promotedTo && <p className={s.previous}>Antes: {job.role}</p>}
                </div>

                <div className={s.what}>
                  <p className={s.summary}>{summaryFor(job)}</p>

                  {job.results.length > 0 && (
                    <ul className={s.results} aria-label={`Resultados em ${job.company}`}>
                      {job.results.map((result) => (
                        <li
                          key={result.label}
                          className={result.value ? s.metric : s.delivery}
                        >
                          {result.value && <strong className={s.value}>{result.value}</strong>}
                          <span className={s.label}>{result.label}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  <details className={s.more}>
                    <summary>
                      <span>
                        <span className={s.openLabel}>Detalhes e tecnologias</span>
                        <span className={s.closeLabel}>Ocultar detalhes</span>
                        <span className={layout.srOnly}> de {job.company}</span>
                      </span>
                      <svg className={s.toggle} viewBox="0 0 16 16" aria-hidden="true">
                        <path d="M8 2v12M2 8h12" />
                      </svg>
                    </summary>

                    <div className={s.expanded}>
                      <div className={s.details}>
                        {job.details.map((paragraph) => (
                          <p key={paragraph}>{paragraph}</p>
                        ))}
                      </div>

                      <div className={s.stack}>
                        <h4 className={s.stackTitle}>Tecnologias</h4>
                        <ul className={s.tags} aria-label={`Tecnologias em ${job.company}`}>
                          {job.tags.map((tag) => (
                            <li key={tag}>{tag}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </details>
                </div>
              </article>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
