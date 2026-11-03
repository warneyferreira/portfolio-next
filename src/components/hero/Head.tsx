import {
  browLPath,
  browRPath,
  eyes,
  facePath,
  hairPath,
  headViewBox,
  stickerFacePath,
  stickerHairPath,
} from "./head-paths";
import s from "./hero.module.css";

/*
 * Retrato em camadas: rosto fixo, cabelo que balança a partir da linha da
 * testa, sobrancelhas que sobem e franzem, e olhos em que a pupila corre por
 * baixo da pálpebra (recortada pelo contorno do olho) enquanto o olho inteiro
 * pisca. O cabelo se sobrepõe ao rosto numa faixa de tinta repetida, então o
 * balanço nunca abre fresta. No modo escuro, uma silhueta clara por trás
 * transforma o retrato num adesivo; a parte do cabelo dela repete os mesmos
 * movimentos, por isso fica numa cópia do grupo de balanço, atrás de tudo.
 */
export default function Head() {
  return (
    <svg className={s.head} viewBox={headViewBox} aria-hidden="true">
      <defs>
        <filter id="hair-wobble" filterUnits="userSpaceOnUse" x="100" y="0" width="1060" height="700">
          <feTurbulence type="fractalNoise" baseFrequency="0.006 0.011" numOctaves={2} seed={7} result="noise">
            <animate
              attributeName="baseFrequency"
              dur="9s"
              values="0.006 0.011;0.0085 0.015;0.006 0.011"
              repeatCount="indefinite"
            />
          </feTurbulence>
          <feDisplacementMap in="SourceGraphic" in2="noise" scale={16} xChannelSelector="R" yChannelSelector="G" />
        </filter>
        {/* contorno escuro em volta do adesivo, separando-o das letras vizinhas */}
        <filter id="sticker-halo" filterUnits="userSpaceOnUse" x="110" y="0" width="1040" height="1230">
          <feMorphology in="SourceAlpha" operator="dilate" radius={14} result="grown" />
          <feFlood className={s.haloInk} result="ink" />
          <feComposite in="ink" in2="grown" operator="in" result="halo" />
          <feMerge>
            <feMergeNode in="halo" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        {eyes.map((eye) => (
          <clipPath key={eye.id} id={`eye-clip-${eye.id}`}>
            <polygon points={eye.clip} />
          </clipPath>
        ))}
        {/* retícula de pontos no rosto, como sombra de screentone: some do lado
            da luz (alto à esquerda) e adensa embaixo à direita. O traço grosso
            preto da máscara recua os pontos da borda da silhueta dilatada,
            então eles ficam dentro do contorno */}
        <pattern id="portrait-dots" width="9" height="9" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <circle cx="4.5" cy="4.5" r="2.1" fill="currentColor" />
        </pattern>
        <linearGradient id="portrait-shade" x1="0.15" y1="0.1" x2="0.95" y2="1">
          <stop offset="0.35" stopColor="#000" />
          <stop offset="1" stopColor="#fff" />
        </linearGradient>
        <mask id="portrait-dots-mask">
          <path d={stickerFacePath} fill="url(#portrait-shade)" stroke="#000" strokeWidth={56} />
        </mask>
      </defs>
      <g className={s.stickerLayer}>
        <g className={s.sway}>
          <g className={s.breathe}>
            <path className={`${s.hair} ${s.sticker}`} d={stickerHairPath} />
          </g>
        </g>
        <path className={s.sticker} d={stickerFacePath} />
      </g>
      <path d={stickerFacePath} fill="url(#portrait-dots)" mask="url(#portrait-dots-mask)" />
      <path d={facePath} />
      <g className={s.sway}>
        <g className={s.breathe}>
          <path className={s.hair} d={hairPath} />
        </g>
      </g>
      <path className={`${s.brow} ${s.browL}`} d={browLPath} />
      <path className={`${s.brow} ${s.browR}`} d={browRPath} />
      {eyes.map((eye) => (
        <g key={eye.id} className={s.eye}>
          <g clipPath={`url(#eye-clip-${eye.id})`}>
            <circle className={s.pupil} cx={eye.iris.cx} cy={eye.iris.cy} r={eye.iris.r} />
          </g>
          <path d={eye.lid} />
        </g>
      ))}
    </svg>
  );
}
