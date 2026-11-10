import { stack, stackIntro } from "@/data/portfolio";
import s from "./stack.module.css";

export default function Stack() {
  return (
    <section id="stack" aria-labelledby="stack-title" className={s.stack}>
      <div className={s.heading}>
        <h2 id="stack-title">Stack<span aria-hidden="true">.</span></h2>
        <p className={s.intro}>{stackIntro}</p>

        <div className={s.instrument} aria-hidden="true">
          <span className={s.instrumentInk} />
        </div>
      </div>

      <div className={s.groups}>
        {stack.map((group) => (
          <article key={group.name} className={s.group}>
            <h3>{group.name}</h3>
            <p className={s.description}>
              {group.description}
            </p>
            <ul>
              {group.items.map((item) => (
                <li key={item}>
                  {item}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}
