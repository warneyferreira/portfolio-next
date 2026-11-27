import { certifications, education } from "@/data/portfolio";
import SectionHead from "../section/SectionHead";
import layout from "../section/section.module.css";
import s from "./education.module.css";

/* Educação e certificações: o curso com as ênfases ao lado, e depois a
   lista de certificados como um índice datado — data à esquerda, o que foi
   à direita. A intro das certificações é uma frase, não um rótulo. */
export default function Education() {
  return (
    <section id="educacao" className={layout.section} aria-labelledby="educacao-titulo">
      <div className={layout.inner}>
        <SectionHead id="educacao-titulo" title="Educação" />
      </div>

      <div className={layout.inner}>

        <div className={s.degrees}>
          {education.map((item) => (
            <article key={item.course} className={s.degree} data-reveal>
              <div className={s.degreeInner}>
                <div className={s.degreeMain}>
                  <p className={s.institution}>
                    {item.institution} <span className={s.period}>{item.period}</span>
                  </p>
                  <h3 className={s.course}>{item.course}</h3>
                </div>

                <ul className={s.highlights} aria-label={`Ênfases do curso na ${item.institution}`}>
                  {item.highlights.map((highlight) => (
                    <li key={highlight}>{highlight}</li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>

        <div className={s.certs}>
          <div className={s.certsHead}>
            <h3 className={s.certsTitle}>Certificações</h3>
          </div>

          <ul className={s.certList} role="list" data-depth="2">
            {certifications.map((cert) => (
              <li key={cert.name} className={s.cert}>
                <p className={s.date}>{cert.date}</p>
                <div className={s.certBody}>
                  <h4 className={s.certName}>{cert.name}</h4>
                  <p className={s.issuer}>
                    {cert.issuer}
                    {cert.badge && <span className={s.badge}>{cert.badge}</span>}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
