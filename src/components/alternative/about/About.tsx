import type { CSSProperties } from "react";
import { stack } from "@/data/portfolio";
import { aboutEnds, aboutStatement } from "../copy";
import Fibras from "../fibras/Fibras";
import s from "./about.module.css";

/* Sobre: "ponta a ponta", literalmente. Abre com um segundo véu de fibras
   que descarrega o título: os grãos saem da fita e montam as letras
   (hero-base/NomeDesfeito); conforme o título se forma, a fita esmaece.
   Depois, a linha que atravessa a largura inteira com as seis áreas reais
   do stack (Web → Infra) como paradas; o front-end fica sob a ponta
   esquerda e o back-end sob a direita. Títulos diretos (copy.ts), sem
   frase de efeito.
   Na rolagem a linha se desenha da esquerda para a direita e cada parada
   acende quando a linha passa por ela (--p vem do data-depth do percurso). */
export default function About() {
  return (
    <section id="sobre" className={s.about} aria-labelledby="sobre-titulo">
      <Fibras className={s.fibras} ajustes={{ rotation: -10, perspective: 0.5, scale: 1.05 }} />
      <div className={s.inner}>
        <h2 id="sobre-titulo" className={s.statement}>
          {aboutStatement}
        </h2>

        <div className={s.route} data-reveal style={{ "--stops": stack.length } as CSSProperties}>
          <div className={s.track} aria-hidden="true">
            <span className={s.fill} />
          </div>
          <ol className={s.stops} aria-label="Áreas, da interface à infraestrutura">
            {stack.map((group, i) => (
              <li key={group.name} style={{ "--i": i } as CSSProperties}>
                {group.name}
              </li>
            ))}
          </ol>
        </div>

        <div className={s.ends}>
          {aboutEnds.map((end, i) => (
            <article key={end.title} className={`${s.end} ${i ? s.endBack : ""}`} data-depth={i ? "3" : "2"}>
              <h3 className={s.endTitle}>{end.title}</h3>
              <p className={s.endText}>{end.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
