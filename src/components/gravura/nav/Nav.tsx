import BrandMark from "@/components/gravura/brand/BrandMark";
import { nav, profile } from "@/data/portfolio";
import s from "./nav.module.css";

/* Uma barra só, centrada na página: a marca abre a barra à esquerda, o
   nome assina ao lado dela, os links seguem em linha e a troca de design
   fecha a barra. */
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
      <a href="/luxuria" className={s.switch}>
        Trocar design
      </a>
    </nav>
  );
}
