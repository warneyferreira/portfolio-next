import { about } from "@/data/portfolio";

/* Texto revisado só para /alternative. O conteúdo base vem de
   src/data/portfolio.ts, que também alimenta o Gravura em "/"; aqui ficam
   as trocas de frases floreadas por texto direto, sem mexer no site
   principal. */

/** Disponibilidade, no lugar de "Aberto a conversa, sem hora marcada." */
export const availability = "Aberto a conversas e novos projetos.";

/** O título do Sobre, no lugar da descrição do portfólio do Gravura. */
export const aboutStatement =
  "Engenheiro de software com expertise em IA e 3 anos de experiência.";

/** As duas pontas do Sobre, com títulos que dizem o que são. */
export const aboutEnds = [
  { title: "Front-end", text: about.front.text },
  { title: "Back-end e IA", text: about.back.text },
] as const;

/** Resumos de experiência reescritos, por empresa. */
const summaries: Record<string, string> = {
  MedSafe:
    "Liderei a engenharia de IA como coordenador hands-on, da arquitetura à entrega em produção, com privacidade e confiabilidade como requisitos.",
};

export const summaryFor = (job: { company: string; summary: string }) =>
  summaries[job.company] ?? job.summary;
