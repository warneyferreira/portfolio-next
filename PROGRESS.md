# Portfolio progress

## Status
Current focus: Replace the rejected art in Stack, Experiência, Projetos, Educação and Contato. Hero and Sobre are finished and stay unchanged. Implementer: existing herdr peer t10 in `portfolio / 1`; coordinator t6 owns direction, pipeline and acceptance checks.
Iteration count: 3

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
- **Dependencies.** `sharp` ^0.35.5 is now an explicit devDependency for `scripts/dither-art.mjs`: deterministic lossless 1-bit image preprocessing. It was already installed through Next; no new runtime library was added.
- **impeccable skill.** `impeccable context` reports NO_PRODUCT_MD and BUILD_INIT_REQUIRED. Owner answers and DESIGN.md pin the visual world; no new interview is needed. The Sobre surface brief now records the approved one-ink composition and the checks actually exercised.
- **Delegation (owner, 2026-11-10).** The owner wants the hands-on work done by the agent in the same herdr space, with less ceremony: batch the backlog items a section needs instead of one small task per iteration. `/mnt/c/Users/warney67/AppData/Local/Programs/herdr-core/hc.exe ls` lists terminals; the peer is the omp terminal whose `where` matches the coordinator's (`portfolio / 1`: coordinator t6, implementer t10 on 2026-11-10). `hc.exe send <t> "<text>"` gives it work, `hc.exe wait <t>` waits, `hc.exe read <t>` shows its screen. Put a long brief in a file and send the path. The coordinator owns PROGRESS.md and DESIGN.md, reviews screenshots, then logs. Remind the implementer that it can generate assets with GPT Images 2 (`generate_image` tool).
- **Asset rejection (owner, 2026-11-10).** Existing lower-section art is not approved. Replace Stack, Experiência, Projetos, Educação and Contato illustrations with new GPT Images 2 engravings, not recolours. Hero/Sobre stay. Real Estúdio imagery and factual copy must not be fabricated. t10 has this replacement task; use static art rather than retaining rejected sprite subjects merely to keep their old animation.

## Backlog
Listed in priority order. Split a task here before doing part of it.

- [ ] 2b. Finish shared spacing/type tokens and a reusable pixelated Dither class API. Ink/paper, 2px border, Bayer4/Bayer8, shadeTile and --shade-0…8 already landed with Hero/Sobre.
- [ ] 3a. Remove remaining dead dark-theme rules in lower-section CSS modules and the gladiator drop-shadow. Hero/Sobre, globals and layout are migrated; ThemeToggle, theme script and dark background assets are gone.
- [ ] 3b. Finish font migration and type scale in lower sections. Bricolage Grotesque --font-sans and Martian Mono --font-mono load in layout; Hero/Sobre use them. Remove remaining per-component next/font instances and add shared type tokens.
- [ ] 3c. Finish the one-ink cutover in lower sections: remove local palettes, muted greys, flat tints and grey rules. Globals already provide flat ivory paper, selection inversion and the 3px focus outline; Hero/Sobre use the shared palette.
- [ ] 4. Layout shell: nav, footer, page grid. `nav` in `portfolio.ts` is unused and no `<nav>` exists. The README records that nav links, monogram, intro and CTA were moved out of the hero on purpose: the hero holds the name and the art only, so the nav starts below it. Shared section frame with mono micro-labels in page order. Fix the landmarks: `#contato` renders outside `<main>` and the hero `<header>` inside it.
- [ ] 5b. New lower-section art: replace rejected Sisyphus, clouds/doves, gladiators, owl/diploma/stamp and winged-letter sprites with freshly generated line engravings. Process masks through scripts/dither-art.mjs --mode line. Dither the real Estúdio screenshot and reduce its logo to one ink without inventing project imagery. There is no portrait in the repo.
- [ ] 8. Stack. Replace Sisyphus with an exploded Renaissance mechanical instrument engraving; integrate the real stack data, global ink and Bayer shading. Rework old sprite-dependent motion rather than retaining rejected artwork.
- [ ] 9. Experiência. Replace clouds/doves with an architectural bridge/scaffold engraving. Keep the real timeline and accessible details. Use 1–2px hard edges, mono periods, Bayer depth and solid ink text; remove tilt, pills, flat-opacity title reveal and obsolete flight scenes.
- [ ] 10. Projetos. Replace gladiators with an engraved workbench/printing-frame composition; remove obsolete pull sprites. Retain the real Estúdio screenshot and content, with dithered depth and one-ink logo. Move project-specific alt/link labels into projects[].
- [ ] 11. Project detail page. `src/app/projetos/[slug]/page.tsx` with `generateStaticParams` (read the dynamic-routes doc first; `cacheComponents` is on); add `slug` to `projects[]`; content only from the data file; cards link to it.
- [ ] 12. Educação and Certificações. Replace owl/diploma/stamp with an open-atlas-and-compass engraving. Preserve the degree/certification content; global ink, hard edges, Bayer shading and no obsolete sprite scene.
- [ ] 13. Writing section. No articles exist in the repo. Build the list component and a `writing` array in `portfolio.ts` that renders nothing while empty, marked `TODO(content):`.
- [ ] 14. Contato and footer links. Replace the winged letter with an engraved hand sealing correspondence. Preserve working contact links and facts; Bayer depth, square edges and global ink.
- [ ] 15. Responsive pass (360 / 768 / 1280 / 1920).
- [ ] 16. Accessibility pass (contrast, keyboard nav, alt text, landmarks, reduced motion).
- [ ] 17. Performance pass (image sizes, canvas cost, fonts, bundle). Baseline first load: 6.9 MB.
- [ ] 18. Consistency pass: every surface uses the shade scale; remove leftover greys, tints, gradients, shadows, radii; delete tracked assets nothing references (`public/images/brand/*` if still unused).
- [ ] 19. SEO/meta: title, description, OG image (dithered; none today and `twitter:card` is `summary`), favicon (`favicon.ico` is the WR monogram on cream).
- [ ] 20. Final QA: build, lint, type-check, visual review of every page; update README (pt-BR; it still documents the collage design, the dark theme and the toggle).

## Done
- [x] 1. Audit the current portfolio: pages, components, content, gaps. Findings are under Audit.
- [x] 2a. Shared ink/paper/border tokens, Bayer4/Bayer8 and shadeTile, --shade-0…8; global light-only foundation.
- [x] 5a. Image pipeline: scripts/dither-art.mjs supports line thresholding and Bayer photos; hero source/provenance retained, deployed 3344×2229 binary mask is 164 KiB.
- [x] 6. Hero: new GPT Images 2 line engraving from the approved composition, static name-only layout, crisp desktop art and bordered mobile paper plate with Bayer offset.
- [x] 7. Sobre: restored two-column composition, one ink, global fonts, mono labels, dither divider, square résumé inversion and updated surface brief.

## Needs owner input
- Writing/blog: the repo has no articles or external posts. Send titles, links and dates, or the section stays empty and hidden (task 13).
- Projects: only Estúdio has data. Each further project needs a name, description, link and screenshot.
- Portrait: none in the repo (the animated head was removed; Sobre uses the eye-and-hand engraving). Send a photo only if a dithered portrait is wanted.

## Found issues
- `portfolio.ts`: `nav`, `profile.headline` and `profile.highlightStack` remain unused. About now uses hero.resumeLabel for the résumé action.
- `Projects.tsx`: the Estúdio `alt` text and "Visitar o Estúdio" are hard-coded inside `projects.map` (task 10).
- Landmarks: no `<nav>`; `#contato` sits outside `<main>`; the hero `<header>` sits inside it (tasks 4 and 16).
- The older reference provenance sidecar at `scripts/sources/hero-reference-orange.webp.json` still contains an absolute local source path; newly generated sidecars must use portable paths.
- Lower-section README art notes must follow the replacement assets; t10 owns this update.
- Peer-reported reduced-motion issue at 1920: Experiência GSAP pin-spacer can use innerWidth instead of clientWidth, causing 15px horizontal overflow. Check while replacing that scene (task 9).

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
- 2026-11-10 — Iteration 2: t10 shipped Hero/Sobre and the shared one-ink foundation (104c38e, 8ab2dea); coordinator reviewed 1:1 engraving detail, the restored Sobre grid and the mobile plate. Lint, type-check and production build passed; desktop 1440/1920 and mobile 390/DPR 2 were visually reviewed. (globals/layout, hero/about, dither utility/pipeline, sources/masks, DESIGN.md, Sobre surface brief)
- 2026-11-10 — Iteration 3 started: owner rejected the lower-section artwork; t10 directed to generate and integrate replacements for Stack, Experiência, Projetos, Educação and Contato using GPT Images 2. Hero/Sobre and factual project content are preserved. (DESIGN.md, PROGRESS.md)
- 2026-11-10 — Corrected Bayer photo polarity (black prints ink, white stays paper). An isolated seven-tone smoke verified exact Bayer coverage, the line threshold boundary and binary alpha in both modes. Mobile Sobre résumé focus is a visible 3px ink outline, with download semantics and no horizontal overflow at 390px. (scripts/dither-art.mjs, Sobre surface brief)
