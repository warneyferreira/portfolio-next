import { Bricolage_Grotesque } from "next/font/google";
import Image from "next/image";
import { contact, projects, projectsOutro } from "@/data/portfolio";
import ProjectPull from "./ProjectPull";
import s from "./projects.module.css";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  axes: ["opsz", "wdth"],
  variable: "--font-projects",
});

export default function Projects() {
  return (
    <section id="projetos" aria-labelledby="projects-title" className={`${s.projects} ${bricolage.variable}`}>
      <header className={s.heading}>
        <ProjectPull><h2 id="projects-title">Projetos</h2></ProjectPull>
      </header>

      <div className={s.collection}>
        {projects.map((project) => (
          <article key={project.name} className={s.project}>
            <div className={s.projectLead}>
              <Image className={s.preview} src={project.preview} alt="Página inicial do Estúdio com a chamada Escreva o assunto. Receba o carrossel." width={2462} height={1258} sizes="(max-width: 700px) 100vw, 50vw" />
              <div className={s.brand}>
                <Image src={project.logo} alt="" width={48} height={48} />
                <h3>{project.name}</h3>
              </div>
              <p className={s.type}>{project.type}</p>
              <p className={s.subtitle}>{project.subtitle}</p>
              <p className={s.description}>{project.description}</p>
              <a className={s.visit} href={project.href} target="_blank" rel="noopener noreferrer">
                Visitar studiomkt.com.br
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M5 19 19 5M5 5h14v14" /></svg>
                <span className={s.srOnly}> (abre em nova aba)</span>
              </a>
            </div>
            <div className={s.projectDetails}>
              <ul className={s.highlights}>
                {project.highlights.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <p className={s.tags}><strong>Recursos:</strong> {project.tags.join(", ")}</p>
            </div>
          </article>
        ))}
      </div>

      <p className={s.outro}>
        {projectsOutro} <a href={contact.github}>github.com/WarneyRego</a>
      </p>
    </section>
  );
}
