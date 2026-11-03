import { Archivo, Bricolage_Grotesque } from "next/font/google";
import s from "./choice.module.css";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  axes: ["opsz", "wdth"],
  variable: "--font-choice",
});

const archivo = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  variable: "--font-choice-monochrome",
});

export default function Home() {
  return (
    <div className={`${s.page} ${bricolage.variable} ${archivo.variable}`}>
      <header className={s.identity}>
        <p className={s.name}>Warney Rego</p>
        <p>Portfólio</p>
      </header>

      <main className={s.main}>
        <div className={s.intro}>
          <h1>Escolha sua estética.</h1>
          <p>Duas formas de explorar meu trabalho. Por onde vamos?</p>
        </div>

        <nav className={s.choices} aria-label="Escolha a estética do portfólio">
          <a className={s.choice} href="/colagem">
            <div className={`${s.preview} ${s.collage}`} aria-hidden="true">
              <span className={s.paperFirst}>Warney</span>
              <span className={s.paperSecond}>Rego</span>
            </div>
            <div className={s.details}>
              <h2>Colagem</h2>
              <p>Recortes, texturas e composições que saem do lugar.</p>
              <span className={s.action}>
                Explorar Colagem
                <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M4 12h15m-6-6 6 6-6 6" />
                </svg>
              </span>
            </div>
          </a>

          <a className={s.choice} href="/monochrome">
            <div className={`${s.preview} ${s.monochrome}`} aria-hidden="true">
              <span>Warney</span>
              <span>Rego</span>
            </div>
            <div className={s.details}>
              <h2>Monochrome</h2>
              <p>Contraste, retícula e tipografia em primeiro plano.</p>
              <span className={s.action}>
                Explorar Monochrome
                <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M4 12h15m-6-6 6 6-6 6" />
                </svg>
              </span>
            </div>
          </a>
        </nav>
      </main>

      <footer className={s.footer}>
        Você pode voltar aqui para escolher outro caminho.
      </footer>
    </div>
  );
}
