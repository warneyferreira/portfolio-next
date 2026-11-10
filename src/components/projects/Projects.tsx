import Image from "next/image";
import { projects } from "@/data/portfolio";
import s from "./projects.module.css";

export default function Projects() {
  return (
    <section id="projetos" aria-labelledby="projects-title" className={s.projects}>
      <header className={s.heading}>
        <h2 id="projects-title">Projetos</h2>
        <div className={s.mark} aria-hidden="true">
          <span className={s.markInk} />
        </div>
      </header>

      <div className={s.collection}>
        {projects.map((project) => (
          <article key={project.name} className={s.project}>
            <div className={s.projectLead}>
              <Image className={s.preview} src={project.preview} alt="Página inicial do Estúdio com a chamada Escreva o assunto. Receba o carrossel." width={2462} height={1258} sizes="(max-width: 700px) 100vw, 50vw" />
            </div>
            <div className={s.projectDetails}>
              <div className={s.brand}>
                <Image src={project.logo} alt="" width={48} height={48} />
                <h3>{project.name}</h3>
              </div>
              <p className={s.type}>{project.type}</p>
              <p className={s.subtitle}>{project.subtitle}</p>
              <p className={s.description}>{project.description}</p>
              <a className={s.visit} href={project.href} target="_blank" rel="noopener noreferrer">
                Visitar o Estúdio
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M5 19 19 5M5 5h14v14" /></svg>
                <span className={s.srOnly}> (abre em nova aba)</span>
              </a>
              <ul className={s.tags} aria-label="Recursos">
                {project.tags.map((tag) => <li key={tag}>{tag}</li>)}
              </ul>
              <details className={s.disclosure}>
                <summary>Conheça os recursos <span aria-hidden="true">+</span></summary>
                <ul className={s.highlights}>
                  {project.highlights.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </details>
            </div>
          </article>
        ))}
      </div>

    </section>
  );
}
