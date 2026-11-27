import { projects } from "@/data/portfolio";
import SectionHead from "../section/SectionHead";
import layout from "../section/section.module.css";
import s from "./projects.module.css";

/* Projetos: a estante de um só livro. O nome ocupando a largura, a tela do
   produto como um relevo na água (a captura em retícula, pintada de
   espuma) e, ao lado, o que ele faz. */
export default function Projects() {
  return (
    <section id="projetos" className={layout.section} aria-labelledby="projetos-titulo">
      <div className={layout.inner}>
        <SectionHead id="projetos-titulo" title="Projetos" />
      </div>

      <div className={layout.inner}>

        <div className={s.collection}>
          {projects.map((project) => (
            <article key={project.name} className={s.project} data-reveal>
              <header className={s.lead}>
                <p className={s.type}>{project.type}</p>
                <h3 className={s.name}>{project.name}</h3>
                <p className={s.subtitle}>{project.subtitle}</p>
              </header>

              <div className={s.spread}>
                <figure className={s.figure}>
                  <div
                    className={s.preview}
                    role="img"
                    aria-label="Página inicial do Estúdio com a chamada Escreva o assunto. Receba o carrossel."
                  />
                  <figcaption>
                    <ul className={s.tags} aria-label={`Recursos de ${project.name}`}>
                      {project.tags.map((tag) => (
                        <li key={tag}>{tag}</li>
                      ))}
                    </ul>
                  </figcaption>
                </figure>

                <div className={s.body}>
                  <p className={s.description}>{project.description}</p>

                  <ul className={s.highlights}>
                    {project.highlights.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>

                  <a
                    className={s.visit}
                    href={project.href}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Visitar o Estúdio
                    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
                      <path d="M7 17 17 7M8 7h9v9" />
                    </svg>
                    <span className={layout.srOnly}> (abre em nova aba)</span>
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
