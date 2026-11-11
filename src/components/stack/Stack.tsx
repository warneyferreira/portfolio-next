import { stack } from "@/data/portfolio";
import StackTunnel from "./StackTunnel";
import s from "./stack.module.css";

export default function Stack() {
  return (
    <section id="stack" aria-labelledby="stack-title" className={s.stack}>
      <StackTunnel />

      <div className={s.index}>
        <div className={s.groups}>
          {stack.map((group) => (
            <article key={group.name} className={s.group}>
              <div className={s.groupHeading}>
                <h3>{group.name}</h3>
                <p className={s.description}>{group.description}</p>
              </div>
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
      </div>
    </section>
  );
}
