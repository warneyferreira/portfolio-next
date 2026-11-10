import BrandMark from "@/components/brand/BrandMark";
import { nav, profile } from "@/data/portfolio";
import s from "./nav.module.css";

/* Uma barra só, centrada na página: a marca abre a barra à esquerda, o
   nome assina ao lado dela e os links seguem em linha. */
export default function Nav() {
  return (
    <nav className={s.nav} aria-label="Principal">
      <a href="#inicio" className={s.brand} aria-label={`${profile.shortName}, início`}>
        {/* data-brand-mark: destino do voo da marca ao fim da abertura. */}
        <BrandMark data-brand-mark className={s.mark} />
        <span className={s.word}>{profile.shortName}</span>
      </a>
      <ul className={s.links}>
        {nav.map((item) => (
          <li key={item.href}>
            <a href={item.href}>{item.label}</a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
