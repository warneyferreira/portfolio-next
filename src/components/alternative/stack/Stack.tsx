import type { CSSProperties } from "react";
import { stack } from "@/data/portfolio";
import SectionHead from "../section/SectionHead";
import layout from "../section/section.module.css";
import { ICONES } from "./icones";
import s from "./stack.module.css";

/* Stack como índice tipográfico: seis linhas, o nome da categoria grande à
   esquerda e a descrição com as tecnologias à direita. Nada de chips.

   Cada linha se revela com a rolagem (data-reveal → --r, ver Parallax.tsx),
   em sequência: a régua se desenha da esquerda para a direita, o nome sobe
   de trás de uma máscara, a descrição aparece e as tecnologias entram em
   cascata. Tudo é transform/opacity; sem JS ou com movimento reduzido,
   --r vale 1 e a linha já está pronta. */
export default function Stack() {
  return (
    <section id="stack" className={layout.section} aria-labelledby="stack-titulo">
      <div className={layout.inner}>
        <SectionHead id="stack-titulo" title="Stack" />

        <ul className={s.index} role="list">
          {stack.map((group) => (
            <li
              key={group.name}
              className={s.row}
              data-reveal
              style={{ "--n": group.items.length } as CSSProperties}
            >
              <h3 className={s.name}>
                <span>{group.name}</span>
              </h3>

              <div className={s.body}>
                <p className={s.description}>{group.description}</p>
                <ul className={s.items} aria-label={`Tecnologias de ${group.name}`}>
                  {group.items.map((item, i) => {
                    const icon = ICONES[item];
                    return (
                      <li key={item} style={{ "--i": i } as CSSProperties}>
                        <span className={s.icon} aria-hidden="true">
                          {icon ? (
                            <svg viewBox="0 0 24 24"><path d={icon.path} /></svg>
                          ) : (
                            <span className={s.stub} />
                          )}
                        </span>
                        <span>{item}</span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
