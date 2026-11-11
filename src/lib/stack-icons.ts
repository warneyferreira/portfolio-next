import {
  siAngular,
  siDjango,
  siDocker,
  siExpo,
  siExpress,
  siFastapi,
  siFirebase,
  siFlask,
  siGithubactions,
  siGooglegemini,
  siJsonwebtokens,
  siKubernetes,
  siLangchain,
  siNextdotjs,
  siNodedotjs,
  siPortainer,
  siPostgresql,
  siPwa,
  siPython,
  siPytorch,
  siReact,
  siSocketdotio,
  siSupabase,
  siTailwindcss,
  siTypescript,
  siWebrtc,
  siZod,
} from "simple-icons";

/**
 * Ícone de cada stack, impresso na tinta do site.
 * Onde a simple-icons não publica a marca (ou a removeu), cai num monograma
 * tipográfico em mono — nunca num ícone genérico.
 */
export type StackIcon =
  | { kind: "icon"; path: string; title: string }
  | { kind: "monogram"; text: string };

const ICONS: Record<string, { path: string; title: string }> = {
  "Next.js": siNextdotjs,
  React: siReact,
  Angular: siAngular,
  TypeScript: siTypescript,
  "Tailwind CSS": siTailwindcss,
  Expo: siExpo,
  PWA: siPwa,
  "Node.js": siNodedotjs,
  Express: siExpress,
  Python: siPython,
  FastAPI: siFastapi,
  Django: siDjango,
  Flask: siFlask,
  JWT: siJsonwebtokens,
  Zod: siZod,
  "Socket.IO": siSocketdotio,
  WebRTC: siWebrtc,
  PostgreSQL: siPostgresql,
  Supabase: siSupabase,
  Firebase: siFirebase,
  LangChain: siLangchain,
  Gemini: siGooglegemini,
  PyTorch: siPytorch,
  Docker: siDocker,
  "Docker Compose": siDocker,
  Kubernetes: siKubernetes,
  Portainer: siPortainer,
  "CI/CD": siGithubactions,
};

const MONOGRAMS: Record<string, string> = {
  RxJS: "Rx",
  "Angular Material": "AM",
  "React Native": "RN",
  Zustand: "Z",
  "React Navigation": "Nav",
  Java: "J",
  "Oracle PL/SQL": "O",
  RLS: "RLS",
  "Banco vetorial": "BV",
  OpenAI: "OA",
  Whisper: "W",
  RAG: "RAG",
  Embeddings: "E",
};

export function stackIcon(item: string): StackIcon {
  const icon = ICONS[item];
  if (icon) return { kind: "icon", path: icon.path, title: item };
  return { kind: "monogram", text: MONOGRAMS[item] ?? item.slice(0, 2) };
}
