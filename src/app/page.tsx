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

export default function Home() {
  return (
    <>
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
      <noscript>
        <style>{`html[data-intro] [data-intro-veil]{display:none}html[data-intro] [data-brand-mark]{visibility:visible!important}`}</style>
      </noscript>
    </>
  );
}
