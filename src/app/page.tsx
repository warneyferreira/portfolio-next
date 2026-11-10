import Hero from "@/components/hero/Hero";
import About from "@/components/about/About";
import Stack from "@/components/stack/Stack";
import Experience from "@/components/experience/Experience";
import Projects from "@/components/projects/Projects";
import Education from "@/components/education/Education";
import Contact from "@/components/contact/Contact";
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
