import Wings from "@/components/gravura/wings/Wings";
import { experience } from "@/data/portfolio";
import s from "./experience.module.css";

export default function Experience() {
  return (
    <section id="experiencia" aria-labelledby="experience-title" className={s.experience}>
      <header className={s.heading}>
        <p className={s.kicker}>Trajetória profissional</p>
        <h2 id="experience-title" className={s.title}>
          Experiência<span aria-hidden="true">.</span>
        </h2>
      </header>

      <Wings
        left={{ src: "/images/experience/column-dither.webp", anchor: "bottom" }}
        right={{ src: "/images/experience/crane-dither.webp", anchor: "top" }}
      />

      <ol className={s.timeline} role="list">
        {experience.map((job) => (
          <li key={job.company} className={s.job}>
            <div className={s.overview}>
              <p className={s.period}>{job.period}</p>
              <h3 className={s.company}>{job.company}</h3>
              <p className={s.role}>{job.promotedTo ?? job.role}</p>
              {job.promotedTo && <p className={s.promotion}>Cargo anterior: {job.role}</p>}
              <p className={s.summary}>{job.summary}</p>
            </div>

            {job.results.length > 0 && (
              <div className={s.impact}>
                <h4 className={s.kicker}>Resultados</h4>
                <ul className={s.results} role="list">
                  {job.results.map((result) => (
                    <li key={result.label} className={result.value ? s.metric : s.delivery}>
                      {result.value && <strong>{result.value} </strong>}
                      <span>{result.label}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <details className={s.more}>
              <summary>
                <span>
                  <span className={s.openLabel}>Detalhes e tecnologias</span>
                  <span className={s.closeLabel}>Ocultar detalhes</span>
                  <span className={s.srOnly}> de {job.company}</span>
                </span>
                <svg className={s.toggle} viewBox="0 0 16 16" aria-hidden="true">
                  <path d="M8 2v12M2 8h12" />
                </svg>
              </summary>
              <div className={s.expanded}>
                <div className={s.details}>
                  {job.details.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                </div>
                <div>
                  <h4 className={s.kicker}>Tecnologias</h4>
                  <ul className={s.tags} role="list">
                    {job.tags.map((tag) => <li key={tag}>{tag}</li>)}
                  </ul>
                </div>
              </div>
            </details>
          </li>
        ))}
      </ol>
    </section>
  );
}
