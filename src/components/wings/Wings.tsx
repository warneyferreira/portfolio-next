import type { CSSProperties } from "react";
import LiveWing from "./LiveWing";
import type { Rig } from "./rig";
import s from "./wings.module.css";

/* Uma ala: máscara 1 bit (scripts/dither-art.mjs) encostada numa borda
   da página. `anchor` diz onde ela pousa na altura da seção; com `rig`,
   a gravura ganha movimento (LiveWing) e continua estática sem ele. */
export type Wing = {
  src: string;
  anchor: "top" | "center" | "bottom";
  rig?: Rig;
};

function WingArt({ wing, side }: { wing: Wing; side: "left" | "right" }) {
  const className = `${s.wing} ${s[side]}`;
  const style = { "--art": `url("${wing.src}")`, "--anchor": wing.anchor } as CSSProperties;
  if (!wing.rig) return <span className={className} style={style} />;
  return (
    <LiveWing className={className} style={style} src={wing.src} anchor={wing.anchor} side={side} rig={wing.rig} />
  );
}

/* As gravuras laterais de uma seção, como as da hero e da Sobre:
   decorativas, atrás do texto e fora da coluna de leitura. A seção
   precisa de position: relative, isolation: isolate e padding-inline
   var(--gutter). */
export default function Wings({ left, right }: { left: Wing; right: Wing }) {
  return (
    <div className={s.wings} aria-hidden="true">
      <WingArt wing={left} side="left" />
      <WingArt wing={right} side="right" />
    </div>
  );
}
