import s from "./section-head.module.css";

/* Abertura de seção: régua em cima e o título em Archivo expandida. A régua
   é do <header>, que não emerge; o título sobe na camada de parallax. */
export default function SectionHead({ id, title }: { id: string; title: string }) {
  return (
    <header className={s.head}>
      <h2 id={id} className={s.title} data-depth="2">
        {title}
      </h2>
    </header>
  );
}
