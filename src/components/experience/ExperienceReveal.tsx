import { Bricolage_Grotesque } from "next/font/google";
import RevealScene from "./RevealScene";
import s from "./reveal.module.css";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  axes: ["opsz", "wdth"],
  variable: "--font-reveal",
});

function Sticker({ name, className }: { name: string; className: string }) {
  return (
    <div className={className} aria-hidden="true">
      <span className={s.shape} style={{ maskImage: `url(/images/experience/${name}-shape.webp)` }} />
      <span className={s.ink} style={{ maskImage: `url(/images/experience/${name}-ink.webp)` }} />
    </div>
  );
}

/* Abertura da seção Experiência: duas nuvens em nanquim e retícula cobrem o
   título e se abrem com a rolagem, enquanto pombas atravessam a tela, uma
   de cada lado. As nuvens e a pomba são máscaras pintadas com as cores do
   tema; a pomba bate as asas num ciclo de 9 quadros. */
export default function ExperienceReveal({ title }: { title: string }) {
  return (
    <RevealScene className={`${s.reveal} ${bricolage.variable}`}>
      <h2 id="experience-title" className={s.title}>
        {title}
        <span aria-hidden="true">.</span>
      </h2>

      <div className={`${s.cloud} ${s.cloudLeft}`} data-cloud="left">
        <Sticker name="cloud-left" className={s.cloudArt} />
      </div>
      <div className={`${s.cloud} ${s.cloudRight}`} data-cloud="right">
        <Sticker name="cloud-right" className={s.cloudArt} />
      </div>
      <div className={`${s.flight} ${s.flightLtr}`} data-dove="ltr">
        <Sticker name="dove" className={s.dove} />
      </div>
      <div className={`${s.flight} ${s.flightRtl}`} data-dove="rtl">
        <Sticker name="dove" className={`${s.dove} ${s.mirrored}`} />
      </div>
    </RevealScene>
  );
}
