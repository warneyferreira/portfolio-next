import Wings from "@/components/wings/Wings";
import { experience } from "@/data/portfolio";
import s from "./experience.module.css";

/* A chapa em negativo do site, entre a coluna da construção e o guindaste.
   Os empregos descem numa linha do tempo: o período na régua, a empresa,
   o resumo e os números à vista; o relato completo e as tecnologias abrem
   em "Ver detalhes". */
export default function Experience() {
  return (
    <section id="experiencia" aria-labelledby="experience-title" className={s.experience}>
      <Wings
        left={{ src: "/images/experience/column-dither.webp", anchor: "bottom" }}
        right={{ src: "/images/experience/crane-dither.webp", anchor: "top" }}
      />

      <h2 id="experience-title" className={s.title}>
        Experiência<span aria-hidden="true">.</span>
      </h2>

      <ol className={s.timeline}>
        {experience.map((job) => (
          <li key={job.company} className={s.job}>
            <p className={s.period}>{job.period}</p>

            <div className={s.entry}>
              <h3 className={s.company}>{job.company}</h3>
              <p className={s.role}>
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
              </p>
              <p className={s.summary}>{job.summary}</p>

              {job.results.length > 0 && (
                <ul className={s.results} aria-label="Resultados">
                  {job.results.map((result) => (
                    <li key={result.label} className={result.value ? undefined : s.note}>
                      {result.value && <strong>{result.value}</strong>}
                      <span>{result.label}</span>
                    </li>
                  ))}
                </ul>
              )}

              <details className={s.more}>
                <summary>
                  <span className={s.toggle} aria-hidden="true">
                    <svg viewBox="0 0 16 16">
                      <path d="M8 2v12M2 8h12" />
                    </svg>
                  </span>
                  <span className={s.openLabel}>Ver detalhes</span>
                  <span className={s.closeLabel}>Fechar detalhes</span>
                </summary>
                <p className={s.details}>{job.details}</p>
                <ul className={s.tags} aria-label="Tecnologias">
                  {job.tags.map((tag) => (
                    <li key={tag}>{tag}</li>
                  ))}
                </ul>
              </details>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
