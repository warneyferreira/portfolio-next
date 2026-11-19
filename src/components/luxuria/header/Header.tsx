import frame from "@/components/luxuria/frame/frame.module.css";
import { nav, profile } from "@/data/portfolio";
import s from "./header.module.css";

/* A header da Luxúria: um painel vinho dentro da moldura das capas. O nome
   assina em gótica à esquerda; as seções e a troca de design seguem à
   direita, em versaletes. */
export default function Header() {
  return (
    <header className={s.header}>
      <div className={`${frame.frame} ${s.bar}`}>
        <a href="#inicio" className={s.brand} aria-label={`${profile.shortName}, início`}>
          {profile.shortName}
        </a>
        <nav aria-label="Principal" className={s.nav}>
          <ul className={s.links}>
            {nav.map((item) => (
              <li key={item.href}>
                <a href={item.href}>{item.label}</a>
              </li>
            ))}
          </ul>
        </nav>
        {/* A mesma gota do friso (frame.svg), separando as seções da troca. */}
        <svg className={s.drop} viewBox="4 3 5 7" aria-hidden>
          <path d="M6.5 9.8C5.028 8.348 4.2 6.852 4.2 5.4a2.3 2.3 0 0 1 4.6 0c0 1.452-.828 2.948-2.3 4.4z" />
        </svg>
        <a href="/gravura#inicio" className={s.switch}>
          Trocar design
        </a>
      </div>
    </header>
  );
}
