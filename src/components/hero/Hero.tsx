import { profile } from "@/data/portfolio";
import s from "./hero.module.css";

export default function Hero() {
  return (
    <header id="inicio" className={s.hero}>
      <div className={s.center}>
        <h1 className={s.title} aria-label={profile.shortName}>
          {profile.shortName.split(" ").map((name) => <span key={name}>{name}</span>)}
        </h1>
      </div>
    </header>
  );
}
