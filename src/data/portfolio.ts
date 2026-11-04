export const profile = {
  name: "Warney Rego Ferreira Filho",
  shortName: "Warney Rego",
  role: "Desenvolvedor Full Stack e AI Engineer",
  headline: "Full Stack e AI Engineering",
  location: "Teresina, PI",
  experienceYears: "3+ anos",
  description:
    "Full stack com 3+ anos construindo web, mobile e infraestrutura de IA em produção.",
  site: "https://warneyrego.com",
  resume: "/curriculo-warney-rego.pdf",
  highlightStack: ["Next.js", "React Native", "Node.js", "PostgreSQL", "LangChain", "Docker"],
};

export const nav = [
  { href: "#sobre", label: "Sobre" },
  { href: "#stack", label: "Stack" },
  { href: "#experiencia", label: "Experiência" },
  { href: "#projetos", label: "Projetos" },
  { href: "#contato", label: "Contato" },
] as const;

export const hero = {
  /* duas linhas da manchete; o primeiro "o" da primeira linha vira o retrato */
  title: ["Software", "Engineer"],
  resumeLabel: "Baixar currículo",
};

export const contact = {
  intro: "A caixa de correio fica aqui embaixo. Eu abro todo dia, mesmo quando está vazia.",
  letter: "Se você chegou até o último quadro, já dá para a gente conversar.",
  email: "warneydev@gmail.com",
  phone: { label: "(86) 99922-9061", href: "tel:+5586999229061" },
  linkedin: "https://www.linkedin.com/in/warney-rego/",
  github: "https://github.com/WarneyRego",
  city: "Teresina, PI",
  schedule: "Aberto a conversa, sem hora marcada.",
};

export const about = {
  intro:
    "Construo produtos de ponta a ponta, da interface à inteligência artificial.",
  front: {
    title: "a ponta que se toca",
    text: "Desenvolvo interfaces web e mobile com React, Next.js, Angular e React Native, com foco em usabilidade e desempenho.",
  },
  back: {
    title: "quem responde atrás",
    text: "No backend, trabalho com PHP, Node.js e Python. Modernizo sistemas legados e integro IA às aplicações.",
  },
};

export const stackIntro =
  "Ferramenta não é personalidade: é só o que estava na mão quando o problema apareceu.";

export const stack = [
  {
    name: "Web",
    description: "Interfaces responsivas e arquitetura de componentes reutilizáveis.",
    items: ["Next.js", "React", "Angular", "TypeScript", "RxJS", "Tailwind CSS", "Angular Material"],
  },
  {
    name: "Mobile",
    description: "Apps iOS e Android com estado global e suporte offline.",
    items: ["React Native", "Expo", "Zustand", "React Navigation", "PWA"],
  },
  {
    name: "Backend",
    description: "APIs tipadas, autenticação e tempo real.",
    items: ["Node.js", "Express", "Python", "FastAPI", "Django", "Flask", "Java", "JWT", "Zod", "Socket.IO", "WebRTC"],
  },
  {
    name: "Dados",
    description: "Modelagem relacional, políticas de acesso e busca vetorial.",
    items: ["PostgreSQL", "Oracle PL/SQL", "Supabase", "Firebase", "RLS", "Banco vetorial"],
  },
  {
    name: "IA",
    description: "Pipelines de RAG, embeddings e transcrição em produção.",
    items: ["LangChain", "OpenAI", "Gemini", "Whisper", "RAG", "Embeddings", "PyTorch"],
  },
  {
    name: "Infra",
    description: "Empacotamento, orquestração e entrega contínua.",
    items: ["Docker", "Docker Compose", "Kubernetes", "Portainer", "CI/CD"],
  },
];

export const experienceIntro =
  "Publicadas do fim para o começo, como quem lê tira: primeiro o desfecho, depois o que levou até ele.";

export type Result = { value?: string; label: string };

export const experience: {
  period: string;
  company: string;
  role: string;
  promotedTo?: string;
  summary: string;
  details: string;
  results: Result[];
  tags: string[];
}[] = [
  {
    period: "out 2026 – atual",
    company: "Inforgeneses",
    role: "Engenheiro de Software",
    summary:
      "Atuo na evolução de sistemas em PHP, com refatoração de aplicações legadas e integração de inteligência artificial.",
    details:
      "Desenvolvimento e manutenção de sistemas em PHP, refatoração de código legado e integração de recursos de IA às aplicações.",
    results: [],
    tags: ["PHP", "Sistemas legados", "Refatoração", "Integração de IA"],
  },
  {
    period: "2026 – out 2026",
    company: "MedSafe",
    role: "Engenheiro de Software Pleno",
    promotedTo: "Coordenador de Engenharia de IA",
    summary:
      "Liderei a engenharia de IA como coordenador hands-on, da arquitetura à entrega em produção, com privacidade e confiabilidade como requisito e não como enfeite.",
    details:
      "Fine-tuning de modelos sobre dados regulatórios da ANVISA para triagem e análise clínica, assistentes conversacionais e geração automatizada de relatórios em infraestrutura privacy-first e descentralizada para dados sensíveis. Avaliação de modelos e provedores, open source contra proprietários, equilibrando custo, janela de contexto e latência, com inferência local otimizada por quantização, tuning de system prompt e uso racional de GPU. Também respondi pela liderança técnica do time mobile do app de saúde usado em todo o Piauí: decisões arquiteturais, revisão de código, mentoria e alinhamento com stakeholders.",
    results: [
      { value: "65%", label: "de redução no tempo de resposta das telas principais" },
      { value: "55%", label: "de redução no carregamento inicial do app" },
      { value: "40%", label: "de ganho na renderização de listas de alto volume" },
      { label: "Modelos ajustados sobre a base da ANVISA rodando em produção" },
    ],
    tags: ["LLMs", "RAG", "Fine-tuning", "Quantização", "Privacy-first", "React Native"],
  },
  {
    period: "2025",
    company: "Grupo Simplifit",
    role: "Desenvolvedor Frontend",
    summary:
      "Plataformas web, apps e PWAs com foco em performance e consistência entre iOS e Android.",
    details:
      "Arquitetura de componentes reutilizáveis, integração com APIs, gerenciamento de estado global e funcionalidades offline. Estruturação de bancos PostgreSQL com criação e otimização de policies de segurança (RLS), garantindo controle de acesso granular sobre dados sensíveis.",
    results: [
      { value: "40% a 60%", label: "menos tempo de carregamento" },
      { value: "30%", label: "de redução no bundle via code splitting e lazy loading" },
      { value: "25%", label: "de ganho na pontuação Lighthouse" },
    ],
    tags: ["Next.js", "Tailwind CSS", "Angular", "React Native", "PostgreSQL", "RLS"],
  },
  {
    period: "2024, 1 ano e 5 meses",
    company: "Grupo Vanguarda",
    role: "Estágio em Sistemas",
    summary: "Automação de processos empresariais sobre base Oracle e ferramentas internas de gestão.",
    details:
      "Procedures e consultas complexas em PL/SQL, interfaces de PDV em Java e uma aplicação web em Next.js com fine-tuning de modelos em PyTorch para processos internos de gestão.",
    results: [
      { value: "70% a 80%", label: "menos tempo de execução nos processos" },
      { value: "15 a 20", label: "horas semanais economizadas em tarefas repetitivas" },
      { value: "50%", label: "de aumento na produtividade da equipe" },
    ],
    tags: ["Oracle", "PL/SQL", "Java", "Next.js", "PyTorch"],
  },
];

export const projects = [
  {
    name: "Estúdio",
    subtitle: "Conteúdo para redes sociais com IA",
    type: "Aplicação web",
    href: "https://studiomkt.com.br",
    logo: "/images/projects/studio-logo.svg",
    preview: "/images/projects/studio-screenshot.webp",
    description:
      "Do assunto ao conteúdo pronto: uma plataforma para criar carrosséis e posts, editar vídeos falados e produzir motions de produto com IA.",
    highlights: [
      "Roteiros, legendas e imagens para carrosséis, com revisão do texto antes de gerar as imagens",
      "Edição de vídeo pela transcrição, com cortes de hesitações, legendas automáticas e cards",
      "Motions de produto com cenas, textos e música ajustáveis, exportados em MP4",
      "Biblioteca de referências para reaproveitar fundos, direção de arte e ideias de posts",
    ],
    tags: ["IA generativa", "Carrosséis", "Edição de vídeo", "Motion de produto"],
  },
];

export const education = [
  {
    course: "Bacharelado em Engenharia de Software",
    institution: "ICEV",
    period: "2024 a 2028",
    highlights: [
      "Metodologias ágeis, modelagem de software, padrões de projeto e arquitetura",
      "Projetos práticos de aplicações web e mobile",
      "Maratonas de programação competitiva",
    ],
  },
];

export const certificationsIntro =
  "Curso que terminou vira papel guardado. Estes são os que valeram trabalho novo.";

export const certifications: { date: string; badge?: string; name: string; issuer: string }[] = [
  { date: "dez 2025", badge: "AWS Academy Graduate", name: "Machine Learning Foundations", issuer: "Amazon Web Services" },
  { date: "set 2025", badge: "AWS Academy Graduate", name: "Microservices and CI/CD Pipeline Builder", issuer: "Amazon Web Services" },
  { date: "set 2025", name: "Introduction to Generative AI", issuer: "Google" },
  { date: "mar 2025", badge: "AWS Academy Graduate", name: "Cloud Developing", issuer: "Amazon Web Services" },
  { date: "fev 2025", name: "CS50's Web Programming with Python and JavaScript", issuer: "Harvard" },
  { date: "ago 2024", badge: "Red Hat Academy", name: "Program Learner", issuer: "Red Hat" },
];
