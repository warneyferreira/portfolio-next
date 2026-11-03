import Hero from "@/components/hero/Hero";
import About from "@/components/about/About";
import Stack from "@/components/stack/Stack";
import Experience from "@/components/experience/Experience";
import Projects from "@/components/projects/Projects";
import Education from "@/components/education/Education";
import Contact from "@/components/contact/Contact";

export default function Home() {
  return (
    <>
      <Hero />
      <main>
        <About />
        <Stack />
        <Experience />
        <Projects />
        <Education />
      </main>
      <Contact />
    </>
  );
}
