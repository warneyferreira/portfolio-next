import { hero, profile } from "@/data/portfolio";
import s from "./hero.module.css";

export default function Hero() {
  return (
    <header id="inicio" className={s.hero}>
      <div className={s.center}>
        <p className={s.kicker}>{hero.label}</p>
        <h1 className={s.title} aria-label={profile.shortName}>
          {profile.shortName.split(" ").map((name) => <span key={name}>{name}</span>)}
        </h1>
        <p className={s.role}>{profile.role}</p>
        <a className={s.resume} href={profile.resume} download>
          {hero.resumeLabel}
          <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
            <path d="M12 3v13m-5-5 5 5 5-5M5 17v4h14v-4" />
          </svg>
        </a>
      </div>
    </header>
  );
}
