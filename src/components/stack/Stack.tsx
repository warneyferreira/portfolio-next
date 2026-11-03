import { Bricolage_Grotesque } from "next/font/google";
import { stack, stackIntro } from "@/data/portfolio";
import Sisyphus from "./Sisyphus";
import StackScene from "./StackScene";
import s from "./stack.module.css";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  axes: ["opsz", "wdth"],
  variable: "--font-stack",
});

export default function Stack() {
  return (
    <StackScene id="stack" aria-labelledby="stack-title" className={`${s.stack} ${bricolage.variable}`}>
      <div className={s.heading}>
        <h2 id="stack-title">Stack<span aria-hidden="true">.</span></h2>
        <p className={s.intro} data-intro="">{stackIntro}</p>
      </div>

      <div className={s.groups}>
        {stack.map((group) => (
          <article key={group.name} className={s.group} data-group="">
            <h3 data-fade="">{group.name}</h3>
            <p className={s.description} data-fade="">
              {group.description}
            </p>
            <ul>
              {group.items.map((item) => (
                <li key={item} data-item={item}>
                  {item}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>

      <div className={s.stage} data-stage="">
        <Sisyphus />
      </div>
    </StackScene>
  );
}
