import Wings from "@/components/wings/Wings";
import { certifications, certificationsIntro, education } from "@/data/portfolio";
import s from "./education.module.css";

export default function Education() {
  return (
    <section id="educacao" aria-labelledby="education-title" className={s.education}>
      <Wings
        left={{ src: "/images/education/scrolls-dither.webp", anchor: "bottom" }}
        right={{ src: "/images/education/sphere-dither.webp", anchor: "top" }}
      />

      <div className={s.heading}>
        <div className={s.headingTitle}>
          <h2 id="education-title">Educação<span aria-hidden="true">.</span></h2>
        </div>
      </div>

      <div className={s.degrees}>
        {education.map((item) => (
          <article className={s.degree} key={item.course}>
            <div className={s.degreeTitle}>
              <p className={s.institution}>{item.institution} <span aria-hidden="true">—</span> {item.period}</p>
              <h3>{item.course}</h3>
            </div>
            <ul className={s.highlights}>
              {item.highlights.map((highlight) => <li key={highlight}>{highlight}</li>)}
            </ul>
          </article>
        ))}
      </div>

      <div className={s.certifications}>
        <div className={s.certHeading}>
          <div className={s.headingTitle}>
            <h3>Certificações</h3>
          </div>
          <p>{certificationsIntro}</p>
        </div>
        <ul className={s.certList}>
          {certifications.map((cert) => (
            <li className={s.cert} key={cert.name}>
              <p className={s.date}>{cert.date}</p>
              <div className={s.certBody}>
                <h4>{cert.name}</h4>
                <p className={s.issuer}>{cert.issuer}</p>
                {cert.badge && <p className={s.badge}>{cert.badge}</p>}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
