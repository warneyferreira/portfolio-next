import Hero from "@/components/gravura/hero/Hero";
import About from "@/components/gravura/about/About";
import Stack from "@/components/gravura/stack/Stack";
import Experience from "@/components/gravura/experience/Experience";
import Projects from "@/components/gravura/projects/Projects";
import Education from "@/components/gravura/education/Education";
import Contact from "@/components/gravura/contact/Contact";
import s from "./opening.module.css";

export default function Home() {
  return (
    <>
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
    </>
  );
}
