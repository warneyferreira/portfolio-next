import { contact, hero, nav, profile } from "@/data/portfolio";
import ThemeToggle from "./ThemeToggle";
import s from "./hero.module.css";

export default function Hero() {
  return (
    <header className={s.hero}>
      {/* céu impresso em retícula: nuvens, sol com raios e Ícaro subindo */}
      <div className={s.sky} aria-hidden="true">
        <span className={s.clouds} />
        <span className={s.light} />
        <span className={s.icarus}>
          <span className={s.icarusFloat}>
            <span className={s.icarusShape} />
            <span className={s.icarusInk} />
          </span>
        </span>
      </div>

      <div className={s.bar}>
        <p className={s.place}>{profile.location}</p>
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

      <div className={s.masthead}>
        <h1 className={s.title}>
          {hero.title.map((line) => (
            <span key={line} className={s.line}>
              {line}
            </span>
          ))}
        </h1>
        <p className={s.byline}>
          {hero.role} <span aria-hidden="true">/</span> {profile.headline}
        </p>
      </div>

      <div className={s.foot}>
        <p className={s.lede}>{profile.description}</p>
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
