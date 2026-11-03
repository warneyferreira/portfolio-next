import {
  certifications,
  certificationsIntro,
  contact,
  education,
  educationIntro,
  experience,
  experienceIntro,
  profile,
  projects,
  projectsIntro,
  projectsOutro,
  stack,
  stackIntro,
} from "@/data/portfolio";
import Hero from "@/components/hero/Hero";
import About from "@/components/about/About";

export default function Home() {
  return (
    <>
      <Hero />

      <main>
        <About />

        <section id="stack">
          <h2>Stack</h2>
          <p>{stackIntro}</p>
          {stack.map((group) => (
            <article key={group.name}>
              <h3>{group.name}</h3>
              <p>{group.description}</p>
              <ul>
                {group.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
          ))}
        </section>

        <section id="experiencia">
          <h2>Experiência</h2>
          <p>{experienceIntro}</p>
          {experience.map((job) => (
            <article key={job.company}>
              <h3>{job.company}</h3>
              <p>{job.period}</p>
              <p>
                {job.role}
                {job.promotedTo && <> — promovido a {job.promotedTo}</>}
              </p>
              <p>{job.summary}</p>
              <p>{job.details}</p>
              <h4>Resultado</h4>
              <ul>
                {job.results.map((result) => (
                  <li key={result.label}>
                    {result.value && <strong>{result.value} </strong>}
                    {result.label}
                  </li>
                ))}
              </ul>
              <ul>
                {job.tags.map((tag) => (
                  <li key={tag}>{tag}</li>
                ))}
              </ul>
            </article>
          ))}
        </section>

        <section id="projetos">
          <h2>Projetos</h2>
          <p>{projectsIntro}</p>
          {projects.map((project) => (
            <article key={project.name}>
              <h3>{project.name}</h3>
              <p>
                {project.subtitle} · {project.type}
              </p>
              <p>{project.description}</p>
              <ul>
                {project.highlights.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <p>Feito com: {project.tags.join(", ")}</p>
            </article>
          ))}
          <p>
            {projectsOutro} <a href={contact.github}>github.com/WarneyRego</a>
          </p>
        </section>

        <section id="educacao">
          <h2>Educação</h2>
          <p>{educationIntro}</p>
          {education.map((item) => (
            <article key={item.course}>
              <h3>{item.course}</h3>
              <p>
                {item.institution} — {item.period}
              </p>
              <ul>
                {item.highlights.map((h) => (
                  <li key={h}>{h}</li>
                ))}
              </ul>
            </article>
          ))}
          <h3>Certificações</h3>
          <p>{certificationsIntro}</p>
          <ul>
            {certifications.map((cert) => (
              <li key={cert.name}>
                <h4>{cert.name}</h4>
                <p>
                  {cert.issuer} · {cert.date}
                  {cert.badge && <> · {cert.badge}</>}
                </p>
              </li>
            ))}
          </ul>
        </section>

        <section id="contato">
          <h2>Contato</h2>
          <p>{contact.intro}</p>
          <p>{contact.letter}</p>
          <p>
            Escreva para <a href={`mailto:${contact.email}`}>{contact.email}</a>
          </p>
          <dl>
            <dt>Cidade</dt>
            <dd>{contact.city}</dd>
            <dt>Agenda</dt>
            <dd>{contact.schedule}</dd>
          </dl>
          <ul>
            <li><a href={profile.resume}>Currículo em PDF</a></li>
            <li><a href={contact.phone.href}>{contact.phone.label}</a></li>
            <li><a href={contact.linkedin}>LinkedIn</a></li>
            <li><a href={contact.github}>GitHub</a></li>
            <li><a href={profile.site}>warney.dev</a></li>
          </ul>
        </section>
      </main>

      <footer>
        <p>
          {profile.name} · {profile.location} · 2026
        </p>
      </footer>
    </>
  );
}
