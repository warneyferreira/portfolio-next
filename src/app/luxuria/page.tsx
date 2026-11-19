import type { ReactNode } from "react";
import frame from "@/components/luxuria/frame/frame.module.css";
import {
  about,
  certifications,
  certificationsIntro,
  contact,
  education,
  experience,
  hero,
  profile,
  projects,
  stack,
} from "@/data/portfolio";
import s from "./luxuria.module.css";

function Chapter({ id, number, title, children }: {
  id: string;
  number: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className={s.chapter} aria-labelledby={`${id}-titulo`}>
      <header className={s.chapterHeading}>
        <span className={s.kicker} aria-hidden="true">Capítulo / {number}</span>
        <h2 id={`${id}-titulo`}>{title}</h2>
      </header>
      <div className={s.chapterBody}>{children}</div>
    </section>
  );
}

function Labels({ items, label }: { items: string[]; label: string }) {
  return (
    <ul className={s.labels} aria-label={label}>
      {items.map((item) => <li key={item}>{item}</li>)}
    </ul>
  );
}

export default function Luxuria() {
  return (
    <div className={s.edition}>
      <main>
        <section className={`${frame.frame} ${s.cover}`} aria-labelledby="nome">
          <div className={s.coverMeta}>
            <span>Portfólio / Luxúria</span>
            <span>{profile.location}</span>
          </div>
          <div className={s.coverGrid}>
            <h1 id="nome" className={s.name} aria-label={profile.shortName}>
              {profile.shortName.split(" ").map((name) => <span key={name}>{name}</span>)}
            </h1>
            <div className={s.coverAside}>
              <svg className={s.seal} viewBox="0 0 96 96" aria-hidden="true">
                <path d="M48 3 93 48 48 93 3 48Z M48 11 85 48 48 85 11 48Z" fill="none" stroke="currentColor" />
                <path d="M48 26c-5 8-13 16-13 24a13 13 0 0 0 26 0c0-8-8-16-13-24Z" fill="currentColor" />
              </svg>
              <p className={s.specialty}>{profile.headline}</p>
              <p>{profile.description}</p>
              <div className={s.actions}>
                <a className={s.button} href={profile.resume} download>{hero.resumeLabel} <span aria-hidden="true">↓</span></a>
                <a className={s.textLink} href="#contato">Entrar em contato <span aria-hidden="true">↘</span></a>
              </div>
            </div>
          </div>
        </section>

        <Chapter id="sobre" number="01" title="Sobre">
          <p className={s.lead}>{about.intro}</p>
          <div className={s.aboutColumns}>
            {[about.front, about.back].map((item) => (
              <div key={item.title}>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </div>
            ))}
          </div>
        </Chapter>

        <Chapter id="stack" number="02" title="Stack">
          <ul className={s.stack}>
            {stack.map((group) => (
              <li key={group.name}>
                <h3>{group.name}</h3>
                <p>{group.description}</p>
                <Labels items={group.items} label={`Tecnologias de ${group.name}`} />
              </li>
            ))}
          </ul>
        </Chapter>

        <Chapter id="experiencia" number="03" title="Experiência">
          <ol className={s.timeline}>
            {experience.map((job) => (
              <li key={job.company}>
                <p className={s.kicker}>{job.period}</p>
                <article>
                  <h3>{job.company}</h3>
                  <p className={s.role}>{job.role}{job.promotedTo && ` · ${job.promotedTo}`}</p>
                  <p>{job.summary}</p>
                  {job.results.length > 0 && (
                    <ul className={s.results} aria-label="Resultados">
                      {job.results.map((result) => (
                        <li key={result.label}>
                          {result.value && <strong>{result.value}</strong>}
                          {result.label}
                        </li>
                      ))}
                    </ul>
                  )}
                  <details className={s.details}>
                    <summary>Ver detalhes <span className={s.context}>de {job.company}</span></summary>
                    <p>{job.details}</p>
                    <Labels items={job.tags} label="Tecnologias" />
                  </details>
                </article>
              </li>
            ))}
          </ol>
        </Chapter>

        <Chapter id="projetos" number="04" title="Projetos">
          {projects.map((project) => (
            <article key={project.name} className={s.project}>
              <figure className={s.projectFigure}>
                <div
                  className={s.projectArt}
                  role="img"
                  aria-label={`Prévia da página inicial do ${project.name}`}
                  style={{ maskImage: `url("${project.preview}")` }}
                />
                <figcaption className={s.kicker}>{project.type} / {project.subtitle}</figcaption>
              </figure>
              <h3>{project.name}</h3>
              <p>{project.description}</p>
              <Labels items={project.tags} label="Recursos" />
              <details className={s.details}>
                <summary>Conheça os recursos <span className={s.context}>do {project.name}</span></summary>
                <ul className={s.bullets}>
                  {project.highlights.map((item) => <li key={item}>{item}</li>)}
                </ul>
              </details>
              <a className={s.button} href={project.href}>Visitar o {project.name} <span aria-hidden="true">↗</span></a>
            </article>
          ))}
        </Chapter>

        <Chapter id="educacao" number="05" title="Formação">
          {education.map((item) => (
            <article key={item.course} className={s.degree}>
              <p className={s.kicker}>{item.institution} / {item.period}</p>
              <h3>{item.course}</h3>
              <ul className={s.bullets}>
                {item.highlights.map((highlight) => <li key={highlight}>{highlight}</li>)}
              </ul>
            </article>
          ))}
          <h3>Certificações</h3>
          <p>{certificationsIntro}</p>
          <ul className={s.certifications}>
            {certifications.map((item) => (
              <li key={item.name}>
                <p className={s.kicker}>{item.date} / {item.issuer}</p>
                <h4>{item.name}</h4>
                {item.badge && <p>{item.badge}</p>}
              </li>
            ))}
          </ul>
        </Chapter>
      </main>

      <footer id="contato" className={`${frame.frame} ${s.contact}`} aria-labelledby="contato-titulo">
        <div>
          <span className={s.kicker} aria-hidden="true">Capítulo / 06</span>
          <h2 id="contato-titulo">Contato</h2>
          <p className={s.lead}>{contact.letter}</p>
          <a className={s.button} href={`mailto:${contact.email}`}>{contact.email} <span aria-hidden="true">↗</span></a>
        </div>
        <ul className={s.contactLinks} aria-label="Mais canais de contato">
          <li><a href={contact.phone.href}>{contact.phone.label} <span aria-hidden="true">↗</span></a></li>
          <li><a href={contact.linkedin}>LinkedIn <span aria-hidden="true">↗</span></a></li>
          <li><a href={contact.github}>GitHub <span aria-hidden="true">↗</span></a></li>
        </ul>
        <div className={s.colophon}>
          <span>{profile.shortName} / {contact.city}</span>
          <a className={s.textLink} href="#inicio">Voltar ao início <span aria-hidden="true">↑</span></a>
        </div>
      </footer>
    </div>
  );
}
