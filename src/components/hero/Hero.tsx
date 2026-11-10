import { Bricolage_Grotesque } from "next/font/google";
import { profile } from "@/data/portfolio";
import s from "./hero.module.css";
import ThemeToggle from "./ThemeToggle";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  axes: ["opsz", "wdth"],
  variable: "--font-hero",
});

export default function Hero() {

  return (
    <header id="inicio" className={`${s.hero} ${bricolage.variable}`}>
      <div className={s.themeBar}>
        <ThemeToggle />
      </div>

      <div className={s.center}>
        <h1 className={s.title} aria-label={profile.shortName}>
          {profile.shortName.split(" ").map((name) => <span key={name}>{name}</span>)}
        </h1>
      </div>

    </header>
  );
}
