import type { CSSProperties } from "react";
import s from "./wings.module.css";

/* Uma ala: máscara 1 bit (scripts/dither-art.mjs) encostada numa borda
   da página. `anchor` diz onde ela pousa na altura da seção. */
export type Wing = {
  src: string;
  anchor: "top" | "center" | "bottom";
};

const vars = ({ src, anchor }: Wing) =>
  ({ "--art": `url("${src}")`, "--anchor": anchor }) as CSSProperties;

/* As gravuras laterais de uma seção, como as da hero e da Sobre:
   decorativas, atrás do texto e fora da coluna de leitura. A seção
   precisa de position: relative, isolation: isolate e padding-inline
   var(--gutter). */
export default function Wings({ left, right }: { left: Wing; right: Wing }) {
  return (
    <div className={s.wings} aria-hidden="true">
      <span className={`${s.wing} ${s.left}`} style={vars(left)} />
      <span className={`${s.wing} ${s.right}`} style={vars(right)} />
    </div>
  );
}
