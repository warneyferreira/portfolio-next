import {
  siAngular,
  siDjango,
  siDocker,
  siExpo,
  siExpress,
  siFastapi,
  siFirebase,
  siFlask,
  siGooglegemini,
  siJsonwebtokens,
  siKubernetes,
  siLangchain,
  siNextdotjs,
  siNodedotjs,
  siOpenjdk,
  siPortainer,
  siPostgresql,
  siPwa,
  siPython,
  siPytorch,
  siReact,
  siReactivex,
  siSocketdotio,
  siSupabase,
  siTailwindcss,
  siTypescript,
  siWebrtc,
  siZod,
  type SimpleIcon,
} from "simple-icons";
import { stack } from "@/data/portfolio";
import s from "./sisyphus.module.css";

/* Coordenadas do desenho (public/images/about/sisyphus-*.webp, 846×1470):
   a pedra encosta na palma esquerda e passa por trás dos dedos da direita. */
const VIEW_W = 846;
const VIEW_H = 1470;
const CX = 430;
const CY = 360;
const R = 345;

/* Ícone oficial (Simple Icons) de cada item da stack. Item sem marca
   publicada lá fica fora da pedra, mas continua na descrição da figura;
   variantes da mesma ferramenta (React Native, Docker Compose) não repetem
   o ícone. */
const ICONS: Record<string, SimpleIcon> = {
  "Next.js": siNextdotjs,
  React: siReact,
  Angular: siAngular,
  TypeScript: siTypescript,
  RxJS: siReactivex,
  "Tailwind CSS": siTailwindcss,
  Expo: siExpo,
  PWA: siPwa,
  "Node.js": siNodedotjs,
  Express: siExpress,
  Python: siPython,
  FastAPI: siFastapi,
  Django: siDjango,
  Flask: siFlask,
  Java: siOpenjdk,
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
  Kubernetes: siKubernetes,
  Portainer: siPortainer,
};

const tools = stack.flatMap((group) => group.items);
const placed = tools.filter((tool) => ICONS[tool]);

/* Anéis concêntricos que enchem a pedra por igual: um ícone no miolo e os
   demais divididos entre os anéis na proporção do perímetro, então a
   distância entre vizinhos fica quase a mesma do aro ao centro. Anéis a
   ~95 unidades um do outro (e do miolo) dão folga para ícones de 84. */
const ICON = 84;
const RINGS = [285, 192, 100];

function ringSlots(count: number) {
  const rest = count - 1;
  const total = RINGS.reduce((sum, r) => sum + r, 0);
  const shares = RINGS.map((r) => (rest * r) / total);
  const sizes = shares.map(Math.floor);
  // maior resto primeiro, até fechar a conta
  const order = shares.map((v, i) => [v - Math.floor(v), i]).sort((a, b) => b[0] - a[0]);
  for (let k = 0; sizes.reduce((a, b) => a + b, 0) < rest; k++) sizes[order[k][1]]++;

  const slots = [{ x: CX, y: CY }];
  RINGS.forEach((r, ring) => {
    const n = sizes[ring];
    for (let i = 0; i < n; i++) {
      // cada anel começa num ângulo diferente, para os ícones não alinharem em raios
      const angle = -Math.PI / 2 + (ring * Math.PI) / 7 + (2 * Math.PI * i) / n;
      slots.push({ x: CX + r * Math.cos(angle), y: CY + r * Math.sin(angle) });
    }
  });
  return slots;
}

const slots = ringSlots(placed.length);

const circle = (cx: number, cy: number, r: number) =>
  `M${cx - r} ${cy}A${r} ${r} 0 1 0 ${cx + r} ${cy}A${r} ${r} 0 1 0 ${cx - r} ${cy}Z`;

/* sombra em retícula: a pedra menos um círculo de luz deslocado para cima e
   à esquerda deixa um crescente embaixo à direita; dois crescentes, de ponto
   miúdo e ponto graúdo, fazem o degradê como numa fotocópia */
const BOULDER = circle(CX, CY, R);
const HALF_SHADE = `${BOULDER}${circle(CX - 60, CY - 75, R * 0.95)}`;
const FULL_SHADE = `${BOULDER}${circle(CX - 120, CY - 140, R * 1.0)}`;

/* Os data-* são os ganchos da cena de rolagem (StackScene): cada ícone sabe
   de que item da lista veio e onde fica o centro dele no desenho, e a casca
   da pedra e o corpo entram separados. */
export default function Sisyphus() {
  return (
    <figure
      className={s.sisyphus}
      data-sisyphus=""
      role="img"
      aria-label={`Sísifo de joelhos sustentando uma pedra feita da stack: ${tools.join(", ")}.`}
    >
      <svg
        className={s.boulder}
        viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
        data-boulder=""
        data-view-w={VIEW_W}
        data-cx={CX}
        data-cy={CY}
        aria-hidden="true"
      >
        <defs>
          <pattern id="boulder-dots-fine" width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(30)">
            <circle cx="5" cy="5" r="1.5" />
          </pattern>
          <pattern id="boulder-dots" width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(30)">
            <circle cx="5" cy="5" r="2.9" />
          </pattern>
          <clipPath id="boulder-clip">
            <circle cx={CX} cy={CY} r={R} />
          </clipPath>
          {/* cabelo vivo, como o do retrato da hero: ruído lento deslocando os cachos */}
          <filter id="sisyphus-hair" x="-10%" y="-10%" width="120%" height="120%">
            <feTurbulence type="fractalNoise" baseFrequency="0.03 0.045" numOctaves={2} seed={7} result="noise">
              <animate
                attributeName="baseFrequency"
                dur="7s"
                values="0.03 0.045;0.038 0.055;0.03 0.045"
                repeatCount="indefinite"
              />
            </feTurbulence>
            <feDisplacementMap in="SourceGraphic" in2="noise" scale={4} xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>
        <g className={s.boulderLift}>
          <g data-shell="">
            <circle className={s.boulderSticker} cx={CX} cy={CY} r={R + 12} />
            <path d={HALF_SHADE} fill="url(#boulder-dots-fine)" fillRule="evenodd" clipPath="url(#boulder-clip)" />
            <path d={FULL_SHADE} fill="url(#boulder-dots)" fillRule="evenodd" clipPath="url(#boulder-clip)" />
            <circle className={s.boulderEdge} cx={CX} cy={CY} r={R} />
          </g>
          <g className={s.boulderSpin}>
            {placed.map((tool, i) => (
              <g key={tool} data-tool={tool} data-x={slots[i].x} data-y={slots[i].y}>
                <path
                  className={s.boulderIcon}
                  d={ICONS[tool].path}
                  transform={`translate(${slots[i].x - ICON / 2} ${slots[i].y - ICON / 2}) scale(${ICON / 24})`}
                />
              </g>
            ))}
          </g>
        </g>
      </svg>
      {/* corpo, braço erguido e cabelo em máscaras separadas: o braço cede no
          ombro, o cabelo balança, e todos os adesivos ficam por baixo de
          todos os traços para a emenda não aparecer */}
      <div className={s.sisyphusFigure} data-figure="">
        <span className={`${s.part} ${s.shapeBody}`} />
        <span className={`${s.part} ${s.arm} ${s.shapeArm}`} />
        <span className={`${s.part} ${s.inkBody}`} />
        <span className={`${s.part} ${s.arm} ${s.inkArm}`} />
        <span className={`${s.part} ${s.hair}`}>
          <span className={`${s.part} ${s.inkHair}`} />
        </span>
        <svg className={s.effort} viewBox={`0 0 ${VIEW_W} ${VIEW_H}`} aria-hidden="true">
          <g className={s.strainMarks}>
            <path d="M242 700L216 688M238 721L208 722M242 742L218 755" />
            <path d="M832 498L856 486M838 524L864 524M834 550L858 562" />
          </g>
        </svg>
      </div>
    </figure>
  );
}
