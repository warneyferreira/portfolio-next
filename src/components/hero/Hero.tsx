import { Bricolage_Grotesque } from "next/font/google";
import { contact, hero, nav, profile } from "@/data/portfolio";
import Head from "./Head";
import ThemeToggle from "./ThemeToggle";
import s from "./hero.module.css";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  axes: ["opsz", "wdth"],
  variable: "--font-hero",
});

export default function Hero() {
  const [first, second] = hero.title;
  const o = first.toLowerCase().indexOf("o");

  return (
    <header id="inicio" className={`${s.hero} ${bricolage.variable}`}>
      <div className={s.bar}>
        <div className={s.identity}>
          <a className={s.brand} href="#inicio" aria-label={`${profile.shortName}, início`}>
            <span aria-hidden="true" />
          </a>
          <p className={s.place}>{profile.location}</p>
        </div>
        <div className={s.end}>
          <nav aria-label="Seções">
            <ul>
              {nav.map(({ href, label }) => (
                <li key={href}>
                  <a href={href}>{label}</a>
                </li>
              ))}
            </ul>
          </nav>
          <ThemeToggle />
        </div>
      </div>

      <h1 className={s.title}>
        <span className={s.srOnly}>{profile.shortName}, </span>
        <span className={s.line}>
          {first.slice(0, o)}
          <span className={s.o}>
            <span className={s.srOnly}>{first[o]}</span>
            <Head />
            <svg className={s.pointer} viewBox="0 0 120 70" aria-hidden="true">
              <path
                className={s.stroke}
                pathLength={1}
                d="M4 64C14 46 26 30 44 30C60 30 62 50 49 51C35 52 42 22 70 15C86 11 100 14 113 19"
              />
              <path className={s.tip} pathLength={1} d="M100 7L114 19L100 31" />
            </svg>
            <span className={s.tag} aria-hidden="true">
              <span>{profile.shortName}</span>
            </span>
          </span>
          {first.slice(o + 1)}
        </span>{" "}
        <span className={s.line}>{second}</span>
      </h1>

      <div className={s.foot}>
        <div className={s.introduction}>
          <p className={s.lede}>{profile.description}</p>
          <a className={s.workLink} href="#projetos">
            Ver projetos
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M12 4v16m-6-6 6 6 6-6" /></svg>
          </a>
        </div>
        <div className={s.actions}>
          <a className={s.mail} href={`mailto:${contact.email}`}>
            {contact.email}
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M5 19 19 5M8 5h11v11" />
            </svg>
          </a>
          <p className={s.links}>
            <a href={profile.resume} download>
              {hero.resumeLabel}
            </a>
            <a href={contact.linkedin}>LinkedIn</a>
            <a href={contact.github}>GitHub</a>
          </p>
        </div>
      </div>
    </header>
  );
}
