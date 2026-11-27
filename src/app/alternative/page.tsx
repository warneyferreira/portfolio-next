import HeroBase from "@/components/alternative/hero-base/HeroBase";
import NomeDesfeito from "@/components/alternative/hero-base/NomeDesfeito";
import About from "@/components/alternative/about/About";
import Stack from "@/components/alternative/stack/Stack";
import Experience from "@/components/alternative/experience/Experience";
import Projects from "@/components/alternative/projects/Projects";
import Education from "@/components/alternative/education/Education";
import Contact from "@/components/alternative/contact/Contact";
import Parallax, { PARALLAX_BOOT } from "@/components/alternative/parallax/Parallax";
import Nav from "@/components/alternative/nav/Nav";

export default function Alternative() {
  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: PARALLAX_BOOT }} />
      {/* Barra fixa em vidro, por cima de tudo. */}
      <Nav />
      <main>
        <HeroBase />
        <About />
        <Stack />
        <Experience />
        <Projects />
        <Education />
        <Contact />
      </main>
      {/* O nome do hero se desfazendo; os grãos montam o título do Sobre. */}
      <NomeDesfeito />
      <Parallax />
    </>
  );
}
