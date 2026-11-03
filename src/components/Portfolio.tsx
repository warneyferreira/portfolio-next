import Link from "next/link";
import Hero from "@/components/hero/Hero";
import About from "@/components/about/About";
import Stack from "@/components/stack/Stack";
import Experience from "@/components/experience/Experience";
import Projects from "@/components/projects/Projects";
import Education from "@/components/education/Education";
import Contact from "@/components/contact/Contact";
import MonoHero from "@/components/monochrome/Hero";
import MonoAbout from "@/components/monochrome/About";
import MonoSurface from "@/components/monochrome/Surface";
import s from "./portfolio.module.css";

export default function Portfolio({ aesthetic }: { aesthetic: "colagem" | "monochrome" }) {
  const monochrome = aesthetic === "monochrome";
  const content = (
    <>
      <Link href="/" className={s.switch} prefetch={false}>Trocar estética</Link>
      {monochrome ? <MonoHero /> : <Hero />}
      <main className={s.content}>
        {monochrome ? <MonoAbout /> : <About />}
        <Stack />
        <Experience />
        <Projects />
        <Education />
      </main>
      <Contact />
    </>
  );
  return monochrome ? <MonoSurface>{content}</MonoSurface> : content;
}
