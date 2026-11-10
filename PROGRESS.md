# Portfolio progress

## Status
Current focus: 2. Design tokens, shade scale and `Dither` utility
Iteration count: 1

## Loop notes
Read these and DESIGN.md before picking a task.

- **Owner decisions (2026-11-10, final).** One ink `#c43c00` on paper `#fef0d3`; no black, no grey, no second colour, art included; no dark theme and no toggle. Reasons are in DESIGN.md under Refinements. Do not ask again.
- **Stack.** Next.js 16.4.3 App Router (Turbopack, `cacheComponents`, `partialPrefetching`), React 19.3, TypeScript strict, CSS Modules, GSAP 3 + `@gsap/react` for scroll scenes, `simple-icons`. AGENTS.md applies: read the guide in `node_modules/next/dist/docs/01-app/` before writing Next code. Useful ones: in `01-getting-started/`, `03-layouts-and-pages.md`, `11-css.md`, `12-images.md`, `13-fonts.md` and `14-metadata-and-og-images.md`; in `03-api-reference/03-file-conventions/`, `dynamic-routes.md`, `01-metadata/opengraph-image.md` and `01-metadata/app-icons.md`; and `03-api-reference/04-functions/generate-static-params.md`.
- **Checks.** `npm run lint`, `npx tsc --noEmit`, `npm run build`. All three pass at baseline. There is no test runner.
- **Servers.** The owner may have `next dev` on :3000; never stop it. `next build` is safe next to it because dev writes to `.next/dev`.
- **Visual check.** Start `npx next start --port 3020` as a named service. Managed Chromium does not start on this machine (`libnspr4.so` missing). Look in `proc://` for a live `chrome-headless-shell` service; otherwise start `~/.cache/ms-playwright/chromium_headless_shell-1248/chrome-headless-shell-linux64/chrome-headless-shell --no-sandbox --remote-debugging-port=9333 --user-data-dir=/tmp/portfolio-loop-browser about:blank` as a service. Attach with `browser.open({ app: { cdp_url: "http://127.0.0.1:<port>" } })`. With motion on, the GSAP pins make the page 16–23k px tall, so emulate `prefers-reduced-motion: reduce` for per-section screenshots (`#inicio`, `#sobre`, `#stack`, `#experiencia`, `#projetos`, `#educacao`, `#contato`), then check the scenes with motion on by scrolling into `#stack`, `#experiencia` and `#projetos`. Stop the services you start.
- **Commits.** `git add -A && git commit`. 22 unused work-in-progress images (52 MB: `hero-angel-*`, `hero-lady-justice-*`, `hero-ruins-*`, `lady_justice_hero_4k.png`, `about-roman-{left,right,bottom}.webp`, `janus-*`) stay on disk and out of git through `.git/info/exclude`, by owner decision. Never delete or force-add them. If a task starts using one, remove its line from the exclude file and log it: `about-roman-*.webp` are the continuous-tone sources of the `*-dither` masks, and `hero-lady-justice-desktop.webp` is the sharpened upper panel of the hero composite.
- **Content.** Every string comes from `src/data/portfolio.ts`, in pt-BR. Labels stay pt-BR (`01 / SOBRE`). Never invent content.
- **New assets.** The owner allows GPT Images 2 (`generate_image` tool) for monochrome assets. Match the existing classical engraving and stipple line art, run the result through the dithering pipeline, and write a `<asset>.webp.json` provenance sidecar without absolute local paths.
- **Dependencies.** `sharp` 0.35.5 is already installed as a dependency of Next. If the dithering script uses it, add it to `devDependencies` and log that here. Nothing else new without a note.
- **impeccable skill.** `impeccable context` reports NO_PRODUCT_MD and BUILD_INIT_REQUIRED. The owner answered the palette and theme questions in iteration 1 and DESIGN.md pins the visual world, so there is no new interview. `.impeccable/surfaces/src-components-about-about-tsx.md` still describes `#e84b08` and a dark theme; it is stale until the Sobre task rewrites it.

## Backlog
Listed in priority order. Split a task here before doing part of it.

- [ ] 2. Design tokens, shade scale and `Dither` utility. Global `--ink` and `--paper`, border and spacing tokens; `--shade-0…8` from 4×4 and 8×8 Bayer matrices as pixel-aligned tiles; a generator module plus a component or class API. Module-local `--ink` definitions shadow the global one until 3c, so sections should look the same after this task.
- [ ] 3a. Remove the dark theme (owner decision). `ThemeToggle.tsx`; the theme script, `data-theme` and `suppressHydrationWarning` in `layout.tsx`; every `html[data-theme="dark"]` rule (12 CSS modules and `globals.css`); the dead `::view-transition` theme-reveal CSS; `hero-about-continuous-dark.webp`, `paper-dark.webp`; the gladiator `drop-shadow`. Set `color-scheme: light`.
- [ ] 3b. Fonts and type scale. One Bricolage Grotesque instance in `layout.tsx` (today there are 8 `next/font` calls, one per component, each with its own CSS variable); add one mono; global type tokens for display, heading, body and mono micro-label; record the mono in DESIGN.md.
- [ ] 3c. Colour cutover, reset and focus. Every module reads the global `--ink` and `--paper`; delete the per-component palettes (`--ink` ×8, `--muted`, `--rule`, `--sheet`, `--quiet`, `--line`, `--line-muted`, `--scene-paper`, `--engraving-ink`). Muted grey text becomes ink; grey hairlines become ink or dither dividers. Replace the continuous-tone `paper-light.webp` background with flat paper; the README documents the crumpled-paper texture as deliberate, so a sparse 1-bit grain may stand in for it if it shows no moiré. Global reset, `::selection`, thick ink `:focus-visible`.
- [ ] 4. Layout shell: nav, footer, page grid. `nav` in `portfolio.ts` is unused and no `<nav>` exists. The README records that nav links, monogram, intro and CTA were moved out of the hero on purpose: the hero holds the name and the art only, so the nav starts below it. Shared section frame with mono micro-labels in page order. Fix the landmarks: `#contato` renders outside `<main>` and the hero `<header>` inside it.
- [ ] 5a. Image dithering pipeline. A script in `scripts/` or a runtime canvas component that prints 1-bit `--ink` aligned to device pixels. The current pre-dithered masks are scaled fractionally by `mask-size`, which DESIGN.md forbids. First input: the hero composite `hero-about-continuous.webp` (1672×1928 RGB, orange baked on ivory, 2.7 MB lossless).
- [ ] 5b. Run the remaining art through the pipeline: gladiator sprites (grey RGBA rasters, 7 frames each, 1.4 MB), `studio-screenshot.webp` (full colour), `studio-logo.svg` (three colours, `rx="9"`), and the soft-alpha ink masks (6–23% partially transparent pixels: Sisyphus, clouds, dove, owl, diploma, stamp, winged letter). There is no portrait in the repo.
- [ ] 6. Hero. The approved engraving as the dithered signature piece, name in ink. A threshold shimmer is optional and must stay within 5 ms/frame with a static reduced-motion frame; the README documents the hero as static, so a static piece is acceptable. The smooth `mask-image: linear-gradient` fade at the bottom of `opening.module.css` becomes a stepped dither ramp. Mobile keeps the name on a solid paper plate.
- [ ] 7. Sobre. Global tokens, grey rule and muted text out, 4px radius off the résumé button, hover by inversion, dither divider; rewrite the `.impeccable` surface brief.
- [ ] 8. Stack and Sisyphus. The boulder shade uses rotated halftone-dot SVG patterns: switch to pixel-aligned Bayer. Grey `/` separators and group rules to ink or dither. Keep the GSAP scene and check the patterns under its `scale: 1.18`.
- [ ] 9. Experiência (timeline). Cards: 3px borders to 1–2px, drop the ±0.6° tilt (it breaks pixel alignment), halftone `radial-gradient` shadow to an offset Bayer block, round toggle and pill tags to hard edges, period as mono micro-label, `color-mix` text out. `RevealScene` holds the title at `opacity: 0.2`, which is a flat tint: use a stepped or dithered reveal. Keep the `<details>` behaviour, clouds and doves.
- [ ] 10. Projetos: grid and cards with dithered depth. Shadow to Bayer block, `color-mix` fills and borders out, pill tags to hard edges, dithered thumbnail, one-ink logo. Move the Estúdio-only `alt` text and link label from `Projects.tsx` into `projects[]` so the grid works for any project.
- [ ] 11. Project detail page. `src/app/projetos/[slug]/page.tsx` with `generateStaticParams` (read the dynamic-routes doc first; `cacheComponents` is on); add `slug` to `projects[]`; content only from the data file; cards link to it.
- [ ] 12. Educação and Certificações. Tokens, grey rules, badge halftone to Bayer, owl and diploma/stamp art.
- [ ] 13. Writing section. No articles exist in the repo. Build the list component and a `writing` array in `portfolio.ts` that renders nothing while empty, marked `TODO(content):`.
- [ ] 14. Contato and footer links. Letter card shadow to Bayer block, facts, links, footer line.
- [ ] 15. Responsive pass (360 / 768 / 1280 / 1920).
- [ ] 16. Accessibility pass (contrast, keyboard nav, alt text, landmarks, reduced motion).
- [ ] 17. Performance pass (image sizes, canvas cost, fonts, bundle). Baseline first load: 6.9 MB.
- [ ] 18. Consistency pass: every surface uses the shade scale; remove leftover greys, tints, gradients, shadows, radii; delete tracked assets nothing references (`public/images/brand/*` if still unused).
- [ ] 19. SEO/meta: title, description, OG image (dithered; none today and `twitter:card` is `summary`), favicon (`favicon.ico` is the WR monogram on cream).
- [ ] 20. Final QA: build, lint, type-check, visual review of every page; update README (pt-BR; it still documents the collage design, the dark theme and the toggle).

## Done
- [x] 1. Audit the current portfolio: pages, components, content, gaps. Findings are under Audit.

## Needs owner input
- Writing/blog: the repo has no articles or external posts. Send titles, links and dates, or the section stays empty and hidden (task 13).
- Projects: only Estúdio has data. Each further project needs a name, description, link and screenshot.
- Portrait: none in the repo (the animated head was removed; Sobre uses the eye-and-hand engraving). Send a photo only if a dithered portrait is wanted.

## Found issues
- `globals.css`: the `::view-transition` theme-reveal rules are dead; nothing calls `document.startViewTransition` (removed by 3a).
- `portfolio.ts`: `nav`, `hero.resumeLabel`, `profile.headline` and `profile.highlightStack` are unused; `About.tsx` hard-codes "Baixar currículo".
- `Projects.tsx`: the Estúdio `alt` text and "Visitar o Estúdio" are hard-coded inside `projects.map` (task 10).
- Landmarks: no `<nav>`; `#contato` sits outside `<main>`; the hero `<header>` sits inside it (tasks 4 and 16).
- The provenance sidecars (`*.webp.json`) committed in the snapshot contain an absolute local path (`/mnt/c/Users/…/htp.png`).
- `README.md` and `.impeccable/surfaces/src-components-about-about-tsx.md` describe the pre-loop design (tasks 7 and 20).

## Audit (iteration 1, 2026-11-10)

**Routes.** `/` (static) and `/_not-found`. One page; no detail pages, no writing. `layout.tsx` sets `lang="pt-BR"`, title, description and Open Graph text; there is no OG image.

**Page order and files** (`src/app/page.tsx`, paths under `src/components/`):

| # | Section | id | Files | Art and motion |
|---|---|---|---|---|
| 0 | Hero | `inicio` | `hero/Hero.tsx`, `ThemeToggle.tsx`, `hero.module.css`; background in `src/app/opening.module.css` | Lady Justice and Colosseum engraving (RGB raster shared with Sobre). Static. Name and theme toggle only. |
| 1 | Sobre | `sobre` | `about/About.tsx`, `about.module.css` | Eye-and-hand mask; Roman fragments left, right and bottom (binary Bayer masks). Static. |
| 2 | Stack | `stack` | `stack/Stack.tsx`, `StackScene.tsx`, `Sisyphus.tsx`, 2 CSS modules | Sisyphus masks and an SVG boulder of 28 Simple Icons. Pinned GSAP scene (+420%) and CSS loops. |
| 3 | Experiência | `experiencia` | `experience/Experience.tsx`, `ExperienceReveal.tsx`, `RevealScene.tsx`, `FlightScene.tsx`, 2 CSS modules | Clouds and a 9-frame dove sprite. Pinned reveal (+400%); a dove crosses each of the 4 `<details>` cards. |
| 4 | Projetos | `projetos` | `projects/Projects.tsx`, `ProjectPull.tsx`, `projects.module.css` | Two 7-frame gladiator sprites. Pinned pull scene (+300%). 1 card. |
| 5 | Educação and Certificações | `educacao` | `education/Education.tsx`, `EducationArt.tsx`, 2 CSS modules | 6-frame owl sprite, diploma and stamp. Scroll-scrubbed. |
| 6 | Contato and footer | `contato` | `contact/Contact.tsx`, `ContactArt.tsx`, 2 CSS modules | 6-frame winged-letter sprite. Scroll-scrubbed. |

Every scene is off under `prefers-reduced-motion: reduce` and shows a static end state.

**Content** (`src/data/portfolio.ts`, pt-BR). Profile, nav (5 anchors), about (intro and 2 passages), stack (6 groups, 41 items), experience (4 jobs with results and tags), projects (1: Estúdio), education (1 degree), certifications (6), contact (email, phone, LinkedIn, GitHub, city). Résumé PDF in `public/`. No blog, no portrait, no project slugs.

**Styling today.** CSS Modules per component and no global tokens besides `--paper` and the paper texture. Each module redefines its palette: ink `#15130f` (hero `#201c18`), muted `#5c564d`, rule `#bdb5a5`, paper `#f4efe4` (hero and Sobre `#fef0d3`), engraving ink `#e84b08`, plus a dark set. One typeface (Bricolage Grotesque, variable), no mono, no micro-labels.

**Gaps against DESIGN.md.**
- Colour: black and grey inks everywhere; the hero and Sobre art in the retired `#e84b08`; three papers (`#f4efe4`, `#fef0d3`, dark `#161412`); a full dark theme; `color-mix` tints in Projetos and Experiência.
- Shading: halftone dots from `radial-gradient` (Experiência, Projetos, Contato, certification badge) and rotated SVG dot patterns (boulder) instead of a Bayer scale; one smooth gradient mask (`opening.module.css`); one `drop-shadow`; a continuous-tone paper texture.
- Edges: radii on the theme toggle and card toggle (50%), tags (999px) and résumé button (4px); 3px borders; tilted cards.
- Images: full-colour Estúdio screenshot and logo; grey gladiator rasters; soft-alpha engraving masks; pre-dithered masks scaled fractionally.
- Structure: no nav, no project detail page, no writing section, no OG image.

**Baseline** (production build, 2026-11-10). Lint, type-check and build pass. No horizontal scroll at 360, 390, 768, 1280, 1440 or 1920. No console errors. First load at 1440 wide with a cold cache: 6.9 MB (images 6.6 MB, JS 190 kB, fonts 132 kB, CSS 9 kB); the hero background alone is 2.7 MB. Lighthouse has not been run.

**Other branches.** `monochrome` holds an older black-and-cream halftone poster for the hero and Sobre only (`public/images/hero/{sky,rays,icarus*}.webp`); its other sections are unstyled. `twodesigns` holds a chooser between the collage and that poster (`src/components/monochrome/*`, `public/images/monochrome/*`). Reference only; neither matches DESIGN.md.

## Log
- 2026-11-10 — Iteration 1: audited routes, components, content, assets and baseline metrics (screenshots at 1440 in both themes and 390 in light). Owner fixed the palette (ink `#c43c00`, paper `#fef0d3`), dropped the dark theme and kept 22 unused images out of git. The owner's uncommitted work went into its own snapshot commit first. No UI changed. (DESIGN.md, PROGRESS.md, .git/info/exclude)
