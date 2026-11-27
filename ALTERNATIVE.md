# ALTERNATIVE.md — o portfólio em `/alternative`

Segundo design do portfólio, independente do Gravura (`/`, ver `DESIGN.md`).
**Não altere nada fora de `src/app/alternative/` e `src/components/alternative/`**
— o Gravura continua sendo o site principal. O conteúdo vem do mesmo
`src/data/portfolio.ts`; não edite esse arquivo, só leia dele.

> **Estado atual (2026-11-27):** a página abre no hero
> (`src/components/alternative/hero-base/`), montado em `page.tsx`: fundo
> preto, o nome se desfazendo e virando o véu de fibras do GhostFibers.
> De `src/components/alternative/hero/` só `GhostFibers.jsx`/`.css` são
> usados; o resto (o mar em Three.js, o cartaz) segue arquivado como
> referência. O Sobre não tem mais a abertura com nome e sol.

Antes de escrever código Next.js, leia `AGENTS.md` (esta versão do Next tem
mudanças; docs em `node_modules/next/dist/docs/`).

## Conceito

Um mar pintado a óleo sob um céu de ardósia — uma gravura japonesa
(azul-prússia sobre papel tingido), à la *A Grande Onda*. Hoje a página é
fundo liso — preto no tema escuro, branco pastel no claro — e o mar fica
só como nome de token: **as seções não usam metáfora de mar** (nada de
medidores de profundidade, "superfície", "mergulho").

## Texto

Direto e informativo, sem frase de efeito ("a ponta que se toca", "sem
hora marcada", "como requisito e não como enfeite" foram rejeitadas). O
conteúdo vem de `src/data/portfolio.ts`, que também alimenta o Gravura em
`/` — não edite esse arquivo para o `/alternative`. Reescritas ficam em
`src/components/alternative/copy.ts`.

## Tokens e temas (em `src/app/alternative/alternative.module.css`, classe `.root`)

Dois temas em `html[data-alt-tema]`: **escuro** (padrão) e **claro**. O
botão fica na barra (`nav/`); `tema/tema.ts` guarda a escolha no
`localStorage` e `tema/boot.ts` (script no `layout.tsx`) aplica antes da
primeira pintura. Os nomes vêm do primeiro conceito: `--alt-foam` é o
texto principal em qualquer tema. **Nunca escreva uma cor fixa nas
seções**: use os tokens, e para transparência `rgb(var(--alt-foam-rgb) / a)`.

| token | escuro | claro | uso |
|---|---|---|---|
| `--alt-bg` / `-rgb` | `#000` | `#f6f2ea` (branco pastel) | fundo da página, véu do vidro |
| `--alt-foam` / `-rgb` | `#f4ece4` | `#16181d` | texto principal |
| `--alt-foam-soft` | foam 72% | foam 68% | texto secundário |
| `--alt-shallow` | `#9cc3ee` | `#1f5fa8` | ênfase (números, a linha do Sobre) — com parcimônia |
| `--alt-rule` | foam 20% | foam 16% | divisórias de 1px |
| `--alt-sky` | `#cdd7df` | `#2a2f3a` | fundo do botão cheio |
| `--alt-ink` | `#0b1f3a` | `#f6f2ea` | texto do botão cheio |
| `--alt-sea` | `#1f5fa8` | igual | seleção, foco |
| `--alt-grao-rgb` | quase branco | quase preto | grãos do nome e do título (canvas) |

`--alt-deep` só existe para o hero arquivado. Os canvas leem as cores com
`corDe()` e se redesenham com `observarTema()` (ambos em `tema/tema.ts`).
Não crie cores novas sem motivo forte.

## Tipografia — Archivo (`--alt-sans`) e, só no hero arquivado, Fraunces (`--alt-display`)

A hierarquia vem do **eixo de largura** (`font-stretch`, 62–125%) e do
peso, não de famílias diferentes. É o padrão do site; `font-family` já
está no `.root`, não precisa repetir. O hero base usa Archivo na largura
normal (100%), porque o dono rejeitou o nome em Archivo expandida, caixa
alta e de borda a borda. A única exceção é o hero arquivado:
Fraunces gorda, macia e torta (serifa de cartaz dos anos 70, a época do sol
espiral e da retícula). Não use Fraunces em mais nada. Enquanto o hero
estiver fora, `layout.tsx` não carrega `display.variable`; o componente
arquivado precisaria dela de volta.

| papel | tamanho | peso | largura | outros |
|---|---|---|---|---|
| nome do hero arquivado | `clamp(72px, 11.5vw, 220px)` | 800 | — | Fraunces `SOFT 100, WONK 1, opsz 144`; duas linhas à esquerda, a 2ª recuada `0.95em`; creme com sombra de nanquim deslocada (`0.035em 0.045em`), sem `text-stroke` |
| nome do hero base | `clamp(64px, min(15vw, 22svh), 240px)` | 800 | 100% | duas linhas, a 2ª recuada `1.08em`; `line-height: 0.86`, `-0.045em`; sem caixa alta |
| título de seção (h2) | `clamp(34px, 4.6vw, 72px)` | 650 | 112% | `line-height: 1.04`, `-0.025em`, `text-wrap: balance` |
| números de destaque | `clamp(28px, 3vw, 44px)` | 750 | 125% | `tabular-nums`, `--alt-shallow` |
| subtítulo (h3) | `clamp(22px, 2.2vw, 30px)` | 600 | 100% | `line-height: 1.2`, `-0.01em` |
| texto corrido | `clamp(16px, 1.3vw, 18px)` | 400 | 100% | `line-height: 1.6`, `max-width: 44ch`, `text-wrap: pretty` |
| lista de tecnologias | `clamp(16px, 1.4vw, 20px)` | 600 | 112% | |
| meta, legendas, nav | 15px | 400–500 | 100% | |

**Proibido** (são marcas de página genérica, o usuário rejeitou):
- rótulos em CAIXA ALTA espaçada acima dos títulos ("01 / SOBRE",
  "EXPERIÊNCIA"); a seção começa direto no título;
- fonte mono para rótulos pequenos;
- textos unidos com "·" ("A · B · C") e "—" espaçado como separador;
- destacar uma única palavra do título em itálico ou outra cor;
- numeração 01/02/03 em coisas que não são sequência;
- "→" no fim de links e botões.

Sem caixa alta nos textos. Itálico não é carregado — não use.

## Layout

- Margem lateral das seções: `var(--edge)` (definida no `.root`):
  `clamp(20px, 4vw, 48px)` no celular e `clamp(48px, 9vw, 200px)` a partir de
  900px, para abrir espaço às nuvens das laterais. Conteúdo na largura
  inteira entre as margens (como o Sobre),
  sem max-width no contêiner; limite só a medida dos textos (~44ch).
- Composição editorial assimétrica (ver About: título grande à esquerda,
  colunas desencontradas, a mais "funda" desce mais). Sem cards com sombra,
  sem border-radius exceto botões em pílula.
- Botões: pílula de 48px, 15px peso 600, em caixa normal (ver `.pill` no
  Contato). Claro = fundo `--alt-sky`, texto
  `--alt-ink`; contorno = borda `1.5px rgb(244 236 228 / 0.45)`.
- Links de texto: sublinhado que aparece no hover (ver `.links a` no nav).
- Responsivo de 360px ao desktop largo, sem rolagem horizontal. Em
  ≤720px colunas viram pilha.
- Rodapé da seção: `padding-bottom: clamp(96px, 18svh, 200px)`.

## Parallax — como usar nas seções novas

Controlador único: `src/components/alternative/parallax/Parallax.tsx`,
montado uma vez em `src/app/alternative/page.tsx`. Funciona em qualquer
navegador (JS + variáveis CSS, só `transform`/`opacity`). Com movimento
reduzido ou sem JS, `html[data-alt-parallax]` não existe e tudo fica parado
e visível — **não quebre isso**.

**1. Camadas que emergem — basta um atributo.** Qualquer elemento com
`data-depth="1"` a `"4"` sobe e aparece ao entrar na tela; quanto maior o
número, mais fundo ele começa e mais atrasa. As regras já estão em
`alternative.module.css`; não precisa de CSS na seção.

```tsx
<h2 className={s.title} data-depth="2">…</h2>
<p className={s.period} data-depth="1">…</p>
<article data-depth="3">…</article>
```

Regras: use depth 1 para metas curtas, 2 para títulos/listas, 3–4 para blocos
que devem parecer "mais fundos". Não ponha `data-depth` em elemento que já
tem `transform` ou `opacity` próprios (eles são sobrescritos) — envolva num
wrapper. Não aninhe `data-depth` dentro de `data-depth`. Em listas longas
(ex.: cada job da experiência), alterne 2/3 ou 3/4 para dar ritmo, sem
pôr depth em cada linha pequena.

**1b. Progresso puro — `data-reveal`.** Recebe `--r` de 0 a 1 (topo
entrando pela base da tela → topo a ~40% da altura), sem movimento pronto.
Para animações próprias no CSS, sempre com `var(--r, 1)` (sem JS, pronto).

**2. Palco fixo — para uma cena maior.** Um elemento com `data-scene`
recebe `--scene` de 0 a 1 enquanto ele (mais alto que a tela) cobre a
tela. Padrão do hero arquivado: o elemento fica com `height: 170svh` e um filho
`position: sticky; top: 0; height: 100svh`, e os planos usam
`transform: translate3d(0, calc(var(--scene, 0) * Xsvh), 0)`, tudo sob
`:global(html[data-alt-parallax])`. Use no máximo em mais uma seção (talvez
Contato, como "o fundo do mar"), senão cansa.

## O que já existe

- `src/components/alternative/nav/` — barra fixa em vidro, montada em
  `page.tsx` por cima de tudo: `GlassSurface` do React Bits
  (`glass/`, copiado do registry `@react-bits/GlassSurface-JS-CSS`; o
  `shadcn add` pediria `components.json`/Tailwind, que o projeto não usa).
  Marca + âncoras do `nav` de `portfolio.ts` + "Versão clássica" + o botão
  de tema (sol/lua, o ícone é o do tema para onde ele leva; fica visível
  no celular). Texto e véu do vidro nas cores do tema; o `color-scheme`
  do `.root` troca o vidro (`light-dark()`).
- `src/components/alternative/hero-base/` — a abertura, montada em
  `page.tsx`. Fundo do tema (`--alt-bg`), o mesmo das seções. Três faixas: cargo e cidade no
  topo (régua de 1px), nome grande em Archivo no terço de baixo, e
  disponibilidade + currículo/GitHub no rodapé. `NomeDesfeito.tsx` é um
  canvas WebGL2 **fixo na tela**, montado em `page.tsx` (z-index 2, abaixo
  da barra), porque os grãos atravessam do hero ao Sobre. Ele redesenha o
  h1 (letra por letra, nas posições do layout, em coordenadas do
  documento) e o corrói com ruído: a borda vira retícula e o lado de
  cima/direita solta grãos que sobem nessa direção; parado, a corrosão
  respira e o nome continua legível. Na rolagem — **GSAP ScrollTrigger**
  com `scrub` (inércia; volta ao subir), escrevendo `progress` e
  `assembly` num objeto que o laço lê: o nome termina de se desfazer
  quando o hero sobe 55% da altura (`power2.in`); depois o **véu de fibras
  do Sobre** descarrega o título — grãos se soltam da parte da fita que
  está à vista, lida a cada quadro do próprio GhostFibers
  (`ghostFibersPath(count)` no contêiner, a única adição ao código do
  React Bits), e voam em arco (`power3.inOut`) até as letras do título
  (`#sobre-titulo`, gatilho `top 95%` → `top 40%`), da
  esquerda para a direita. Terminada a montagem, o canvas troca os grãos
  pelo próprio título em retícula (célula de 4px, ~8% dos pontos faltando,
  fios de pontos pingando da base das letras) e o h2 fica transparente
  (`--montado: 0`; segue no DOM e para leitores de tela) — por isso o
  título não tem `data-depth`. A retícula continua animando enquanto o
  título está na tela e o canvas limpa ao sair. O texto do título é
  `aboutStatement` em `copy.ts`: "Engenheiro de software com expertise em
  IA e 3 anos de experiência.", centralizado (`text-align: center`,
  `margin: 0 auto`). Com o canvas pronto, o hero ganha `data-nome="pronto"`
  e o h1 fica com texto transparente (segue no DOM). Sem WebGL2 ou com
  movimento reduzido o canvas não roda: nome e título são texto normal.
  Atrás, o véu de fibras (`fibras/Fibras.tsx`: `GhostFibers` com cores do
  tema, `lightMode` no claro; `ajustes` muda só a forma) deslocado
  com `translate: 14% 14%` para a ponta da fita cair no fim do nome, e uma
  máscara que apaga o trecho por baixo/à esquerda das letras. A direção
  dos grãos (`DIR` em `NomeDesfeito.tsx`) e esse deslocamento andam
  juntos: mudou um, ajuste o outro. O único `h1` da página é aqui.
- `src/components/alternative/hero/` — **arquivado, não montado** (exceto
  `GhostFibers.jsx`/`.css`, usados pelo hero-base): hero-cartaz vivo: papel creme
  (`--papel`, `#fef5dd`) em cima e, embaixo, o mar em Three.js
  (`Mar.tsx`), impresso como xilogravura: seis ondas de Gerstner na
  direção da câmera, quatro faixas chapadas de tinta (prússia, cobalto,
  `--alt-sea`, `--alt-shallow`), curvas de nível da altura como as linhas
  de *A Grande Onda*, espuma de papel com contorno de nanquim e respingos
  em retícula. O nome em Fraunces cobalto (`--cobalto`, `#0b4597`) se apoia
  no horizonte (`--horizon`, 60% / 64% no celular — o `Mar.tsx` lê essa
  variável para inclinar a câmera, não duplique o valor). O canvas fica
  por cima do nome com o céu transparente: as cristas mais altas que a
  câmera passam na frente das letras. Clique/toque no mar solta uma onda
  circular; o cursor deixa um rastro leve e gira a câmera de leve. Na
  rolagem (`--scene`) a câmera atravessa a superfície (~0.26, a barra
  escurece aí), olha a superfície acesa por baixo, com bolhas e feixes de
  luz, e afunda até o `--alt-deep` exato em 0.95 — a emenda com o Sobre.
  Sem WebGL fica o mar em CSS (`.marCss`); movimento reduzido: um quadro
  parado, sem mergulho. O dono pediu sem sol, cúmulos, nuvens nem o céu
  em retícula — as peças continuam em `paisagem/`.
- `src/components/alternative/paisagem/` — duas ilustrações originais no
  mesmo quadro (1672×941), recortadas em WebP com transparência:
  `scripts/recortar-paisagem.mjs <origem.png>` (céu, nuvens em meio-tom,
  sol espiral, cúmulos, colinas → `camadas.ts`) e
  `scripts/recortar-ondas.mjs <origem.png>` (as ondas em azul-cobalto, o
  papel creme vira transparente e a espuma fica → `ondas.ts`). Não desenhe
  peças novas: reaproveite estas. `pecas` (em `Camada.tsx`) junta as duas;
  `<Quadro>` + `<Camada nome>` montam as peças no lugar exato;
  `caixa(nome)`/`urlDe(nome)` servem para máscaras (ex.: o mar escurecido
  do hero); numa seção, uma peça solta é `pecas[nome].src` num
  `<Image unoptimized>`. Debaixo de cada peça o céu é refeito, então sol,
  nuvens e cúmulos podem sair do lugar.
- `src/components/alternative/about/` — "Sobre". Abre com o segundo véu de
  fibras (`Fibras` com `rotation: -10`, atrás do título, `.about .fibras`
  some em cima e embaixo): é dele que saem os grãos que montam o título, e
  ele esmaece até 28% conforme o título se forma (opacidade escrita pelo
  NomeDesfeito). O título é centralizado e, depois de montado, vira a
  retícula que pinga (ver hero-base). Não há mais nuvens em nenhuma seção.
  Depois, o percurso ponta a ponta Web → Infra; front-end e back-end nas
  pontas.
- `src/components/alternative/section/` — `SectionHead` (régua + título) e a
  base das seções.
- `src/components/alternative/copy.ts` — texto revisado só do /alternative,
  incluindo `aboutStatement`, o título centralizado do Sobre.
- Stack: cada linha usa `data-reveal` (→ `--r`) e se revela em sequência —
  régua, nome por trás de máscara, descrição, tecnologias em cascata. Cada
  tecnologia leva o ícone da marca via **simple-icons** (já era dependência;
  mapa em `stack/icones.ts`), em um tom só (`currentColor`). Itens sem marca
  no pacote (RAG, embeddings, RLS, banco vetorial, Oracle, OpenAI, Whisper,
  Zustand etc.) recebem um ponto neutro do mesmo tamanho, para a coluna não
  desalinhar. Ao adicionar tecnologia, inclua o slug em `icones.ts`.
- `src/components/alternative/parallax/` — o controlador.

## O que falta (ordem sugerida)

Seções em `src/components/alternative/<secao>/<Secao>.tsx` + `<secao>.module.css`,
adicionadas em `src/app/alternative/page.tsx` depois de `<About />`, com os
`id` do `nav` de `portfolio.ts` (`stack`, `experiencia`, `projetos`,
`contato`; educação pode ser `educacao`):

1. **Stack** (`stack`) — 6 categorias com descrição e itens. Índice
   tipográfico, não grade de chips.
2. **Experiência** (`experience`) — período, empresa, cargo, resumo,
   resultados (`results`, alguns com `value` numérico — destaque esses),
   detalhes expansíveis (use `<details>`, funciona sem JS) e tags.
3. **Projetos** (`projects`).
4. **Educação + certificações** (`education`, `certificationsIntro`,
   `certifications`).
5. **Contato + rodapé** (`contact`) — o "fundo do mar"; e-mail, telefone,
   LinkedIn, GitHub, cidade. Link "Versão clássica" para `/`.
6. ~~Trocar os links da barra pelos do `nav`~~ — feito na barra
   de vidro (`nav/`).

Leia os componentes equivalentes do Gravura em `src/components/gravura/`
para entender o conteúdo e a acessibilidade (não copie o visual).

## Qualidade

- `npx tsc --noEmit` e `npx eslint src/app/alternative src/components/alternative` limpos.
- Contraste AA. Foco visível (já global em `.root :focus-visible`).
- Teste em 1440×900 e 390×844, e role a página inteira: a passagem entre
  seções não pode ter faixa vazia nem emenda de cor.
- Nenhuma animação além do parallax e das entradas do Sobre sem motivo.
