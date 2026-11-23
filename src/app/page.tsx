import Hero from "@/components/gravura/hero/Hero";
import About from "@/components/gravura/about/About";
import Stack from "@/components/gravura/stack/Stack";
import Experience from "@/components/gravura/experience/Experience";
import Projects from "@/components/gravura/projects/Projects";
import Education from "@/components/gravura/education/Education";
import Contact from "@/components/gravura/contact/Contact";
import Intro from "@/components/gravura/intro/Intro";
import Nav from "@/components/gravura/nav/Nav";
import s from "./opening.module.css";

const startIntro = `
  try {
    if (!location.hash && !matchMedia("(prefers-reduced-motion: reduce)").matches &&
        !sessionStorage.getItem("gravura-intro")) {
      sessionStorage.setItem("gravura-intro", "1");
      document.documentElement.dataset.intro = "playing";
      setTimeout(() => delete document.documentElement.dataset.intro, 4000);
    }
  } catch {}
`;

export default function Home() {
  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: startIntro }} />
      <Nav />
      <main>
        <div className={s.opening}>
          <Hero />
          <About />
        </div>
        <Stack />
        <Experience />
        <Projects />
        <Education />
      </main>
      <Contact />
      <Intro />
    </>
  );
}
