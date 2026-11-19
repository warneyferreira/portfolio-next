# DESIGN.md — monochrome dithered shade

Source of truth for the look of this portfolio. Seeded from §2 of the loop prompt on 2026-11-10. Owner decisions that changed §2 are applied in place and listed under [Refinements](#refinements). Follow it strictly; change it only with a logged reason.

The portfolio has two designs, chosen at the entrance (`/`). Everything from Palette to Quality bars describes **Gravura** (`/gravura`, components in `src/components/gravura/`). **Luxúria** (`/luxuria`, `src/components/luxuria/`) and the chooser have their own sections at the end; Gravura's rules do not apply to them. Each design is its own root layout (`src/app/gravura/`, `src/app/luxuria/`, `src/app/(escolha)/`), so moving between them reloads the document and never carries the other design's global CSS. Content is shared: `src/data/portfolio.ts`.

## Palette (strictly monochrome: one ink, one paper)

- `--ink: #c43c00` (burnt orange) · `--paper: #fef0d3` (warm ivory). Contrast 4.66:1 in both directions.
- Nothing else exists: no black, no grey, no second colour. Text, borders, controls, icons, illustrations, photos and shading are all printed in `--ink`.
- Intermediate tones are **never flat greys or flat tints** — they are produced by dither patterns of ink on paper.
- No dark mode: one light theme, no theme toggle. Inversion (paper on ink, same patterns) is a local device for plates, hover and emphasis.
- Optional single accent is **not allowed**. Hierarchy comes from scale, weight, density and pattern.

## Dithering — the core visual language

- Use **ordered Bayer dithering** (4×4 and 8×8 matrices) as the main shading method; Floyd–Steinberg style only for pre-processed images.
- Build a reusable tone scale `--shade-0` … `--shade-8` (0 = paper, 8 = ink), each a tiling pattern (SVG data-URI or CSS `background-image`) with `image-rendering: pixelated`.
- Shading is used for: section backgrounds, card depth/shadows (offset dithered block instead of blur shadows), gradients (stepped dither ramps, never smooth gradients), hover states (density shift), dividers.
- **Images**: project thumbnails and portrait are rendered 1-bit dithered (preprocess with a script in `scripts/`, or a `<canvas>` component that dithers at runtime). The full-colour original is never shown, not even on hover or focus.
- **Illustrations**: printed 1-bit in `--ink`. Line engravings are thresholded at about twice their display width and never re-dithered: they already carry their own stipple and hatching. The ordered Bayer dither is for interface shades and continuous-tone images. Hero and Sobre retain their approved composition; the lower sections share that engraving language as lateral wings (see Layout). Never a square plate beside the content: art is isolated on blank paper, cut only by the page edge. Stack is intentionally asset-free until the owner supplies artwork.
- **Hero**: one signature piece. Here it is the Lady Justice and Colosseum engraving, redrawn in black line from the owner-approved composition and printed 1-bit in `--ink`. It is static. Any motion added later must respect `prefers-reduced-motion` (static frame) and stay under ~5 ms/frame.
- Pixel crispness: align patterns to device pixels; avoid patterns scaled by fractional values.

## Typography

- One grotesk/sans for body, one mono for labels, metadata, nav, tags. Large, tight display headings.
- Uppercase mono micro-labels (`01 / SOBRE`) as structural markers. Interface copy is Brazilian Portuguese.
- Grotesk: Bricolage Grotesque (variable `opsz` and `wdth`), set as `--font-sans`. Mono: Martian Mono (variable), set as `--font-mono`. Both load once in `layout.tsx`.

## Brand

- **Mark** (`src/components/gravura/brand/BrandMark.tsx`, `src/app/icon.svg`): a 14×14 ink plate on a 16-unit grid, a pixel W knocked out (evenodd), and the site's dithered shadow — a 1-unit checker offset 2 units right and down. Print it at multiples of 16 px (32 px in the nav) so every checker cell is a whole pixel; `shape-rendering: crispEdges`, one colour, `currentColor`. No other mark, no gradient, no second colour.
- **Lockup**: mark + `WARNEY REGO` in Martian Mono 11 px, uppercase, 0.1em tracking. The hero carries the name at display size; nothing else repeats it.
- **Navbar** (`src/components/gravura/nav/`): one paper plate with a 2 px ink border, centred at the top (16 px from the top, 52 px tall, hugging its content). The mark opens the bar at the left, the name signs beside it, the five anchors follow, and a last cell, Trocar design, behind a 2 px ink rule, returns to the chooser. Hover and focus invert the cell (ink plate, paper text). ≤860 px: the mark, the name, Contato and Trocar design; ≤480 px the name leaves and the mark signs alone.
- **Opening** (`src/components/gravura/intro/`): the glass reveal plays once over a paper veil, then the mark glides into the navbar. Monochrome: dispersion and colour bleed are zero, so the glass bends the mark without splitting it into colour. Skippable (button, Escape); reduced motion, missing WebGL or no JS skip it, and a 7 s failsafe ends it.
- **Favicon**: the same mark, ink on paper, at 16 units.

## Layout & components

- Grid-based, generous whitespace, hard edges, 1–2px ink borders, no border-radius (or ≤2px).
- Components: nav, hero, about, stack, project cards + project detail page, experience/timeline, education + certifications, writing/blog list, contact, footer. All share the shade scale.
- Interaction: hover = pattern density step or inversion; focus states clearly visible (thick ink outline), never removed.
- **Stack**: an open typographic index, not a card grid. A sticky title rail on desktop accompanies six ruled rows: category and description beside a mono technology list. Tablet moves the title above the index; mobile stacks each category above its list. Use only global ink/paper, 2px rules and a native 8px Bayer divider. No illustration, empty artwork slot, intro slogan, fake proficiency meter or interactive-looking technology chips.
- **Lateral wings** (`src/components/gravura/wings/`): Experiência, Projetos, Educação and Contato sit between two engravings at the page edges, like the hero's statue and Colosseum. Content lives in a centred column (`--column: 920px`); wings fill the margins (`--gutter`, 15vw minimum from 861 px) with 32 px clearance, are cut by the page edge and anchored top or bottom, alternating so the page zig-zags. ≤860 px they become a headpiece above the title: the top of each wing, dissolving downward through the stepped `--ramp` instead of a hard crop. Wings are `aria-hidden` and painted with `--wing-ink`. All are static except Mercury's two helmet wings, which beat very slowly (±6°, one cycle ≈5.5 s) through `LiveWing`: a WebGL warp of the same mask about the wing roots (`rig.ts`, `contact/mercury-rig.ts`), 30 fps cap, paused offscreen, static under reduced motion or without WebGL. A full-figure rig (lift, cloth, every wing) was rejected by the owner as too busy.
- **Experiência**: the site's negative plate, full-bleed ink with paper type and white-line engravings (spiral column of builders, treadwheel crane) printed in paper. It enters and leaves the paper through `--ramp` edges. Jobs form a timeline: mono period on a right-aligned rail, a 16 px square paper marker on an 8 px `--shade-3` spine, then company, role, summary and a ruled results ledger always visible; details and technologies open in a disclosure with a square 2 px toggle that inverts on hover. No cards, pills, round controls or halftone shadows.

## Quality bars

- WCAG AA contrast for all text — text never sits directly on dense mid-tone dither; put it on a solid paper/ink plate.
- Responsive from 360px to wide desktop; no horizontal scroll.
- Lighthouse targets: Performance ≥ 90, Accessibility ≥ 95.
- Dithered textures must not cause moiré at common zoom levels; test at 100% and 200%.

## Luxúria

Owner, 2026-11-19: a second design, "Luxúria", from the cover of the track "Luxúria" (Xamã part. Matuê, 2018) and its album "Pecado Capital". Only the header exists so far; sections come later.

- **Palette** (`src/app/luxuria/globals.css`): `--carmim: #871c21` (the cover's field), `--vinho: #4b0f13` (the panel inside the frame), `--creme: #e4cfb4` (the only ink: type, frame, hover plates). Cream on carmim 6.3:1, on vinho 10:1. `frame.svg` repeats the carmim and cream hex values because an SVG image cannot read CSS variables.
- **Type** (`src/components/luxuria/fonts.ts`): UnifrakturCook 700, `--font-gotica`, the heavy textura of "Pecado Capital", for the name and display; IM Fell English SC, `--font-romana`, old-press small caps like the "XAMÃ" above the cover title, for links and short text.
- **Frame** (`src/components/luxuria/frame/`): the covers' border as a `border-image` (slice 16, `round`): a carmim band with cream drops (round end out, point in) held in V chevrons, a dot between each pair of Vs, and a larger diagonal drop in each corner. `--band` sets the thickness (18 px default); the panel inside is vinho. It is the one ornament: no gradients, shadows, glows or radii.
- **Header** (`src/components/luxuria/header/`): a full-width framed panel, sticky 16 px from the top and sides of the carmim page. The name in gótica on the left; the five anchors, a single cream drop and Trocar design on the right, in romana. Hover and focus invert the link (cream plate, vinho text); focus also draws a 2 px cream outline. ≤1100 px the links tighten; ≤860 px the name and Trocar design only, until Luxúria has sections to link.

## Chooser

`/` (`src/app/(escolha)/`): the screen split down the middle, each half printed in its own design and a single link. Gravura on the left: WARNEY REGO on a paper plate with a 2 px ink border and a 2 px checker shadow offset 8 px. Luxúria on the right: the name in gótica inside the frame. The heading crosses the seam, "Escolha o" in Gravura's grotesk, "design" in Luxúria's gótica. ≤760 px the halves stack and the whole heading sits on the paper. Hover inverts the half's Entrar box. The chooser copies the five colours of both designs because it loads neither design's global CSS.

A global 404 (`src/app/global-not-found.tsx`, `experimental.globalNotFound`) covers unmatched URLs, since no single root layout wraps all three documents: Gravura's ink and paper, pt-BR copy, a link back to the chooser.

## Refinements

| Date | §2 of the loop prompt said | Now | Reason |
|---|---|---|---|
| 2026-11-10 | `--ink: #0a0a0a`, `--paper: #f2f0eb` | `--ink: #c43c00`, `--paper: #fef0d3` | Owner, iteration 1: "everything must use orange", no black ink; paper is the hero's ivory; one orange for everything, art included, dark enough for AA. `#e84b08`, the earlier engraving orange, is retired: 3.42:1 on ivory fails AA for body text. |
| 2026-11-10 | Dark mode = inverted (paper on ink), same patterns | No dark mode, no toggle | Owner, iteration 1: "No dark theme: remove the toggle, light only". |
| 2026-11-10 | Original image on hover/focus is optional | Never shown | Follows from the one-ink rule: an original brings other colours back. |
| 2026-11-10 | Illustrations not mentioned | Printed 1-bit in `--ink` | Owner: art included in the one ink. Soft-alpha masks would print flat tints. |
| 2026-11-10 | Hero: e.g. a dithered gradient, threshold field or 3D/noise shape | The Lady Justice and Colosseum engraving, redrawn in black line with GPT Images 2 from the approved composition, static | The owner approved this composition and allowed GPT Images for assets. The old raster had orange baked in and a soft upscale; a black-on-white source prints cleanly. |
| 2026-11-10 | Ordered Bayer for all shading, images included | Line engravings are thresholded 1-bit at about 2× display width; Bayer stays for interface shades and continuous-tone images | Reviewed at 1:1 in iteration 2: the ordered dither turned the hero engraving into checkerboard blocks and moiré and left dust on blank paper. |
| 2026-11-10 | Mono left open | Martian Mono | Sturdy at small uppercase sizes in the orange ink; variable weight. |
| 2026-11-10 | Component list; label example `01 / PROJECTS` | Adds stack and education + certifications; labels in pt-BR | Both sections exist in the repo; all site copy is pt-BR. |
| 2026-11-10 | Existing lower-section illustrations retained | New GPT Images 2 engravings for Stack, Experiência, Projetos, Educação and Contato; Hero and Sobre stay | Owner rejected all of the lower-section assets. Replace the subjects and compositions while preserving factual content, the one-ink palette and crisp line treatment. Real project screenshots remain truthful, not generated substitutes. |
| 2026-11-10 | Stack opened with an illustration and an intro slogan | Asset-free technical index with a sticky title rail, ruled categories and mono lists | Owner specifically requested the coordinator's Stack redesign and will add artwork later. The Stack, Experiência and Contato intros were removed; the closing invitation is direct, without the comic-strip metaphor. |
| 2026-11-11 | Lower-section art as square plates beside headings; Experiência opened with a bridge frieze and closed cards | Lateral wings at the page edges for Experiência, Projetos, Educação and Contato; Experiência as a timeline ledger | Owner: square art "placed beside" read as too simple; wanted art "on the sides of the page, like the hero and Sobre, part of everything", and better Experiência cards. Eight new GPT Images 2 engravings; bridge, workbench, atlas and sealing-hand assets removed. |
| 2026-11-19 | One design at `/` | Chooser at `/`; Gravura at `/gravura`; Luxúria at `/luxuria`; navbar gains Trocar design; ≤480 px the navbar name leaves | Owner: split the portfolio in two, the visitor chooses the design on entry. The switch cell keeps the mobile bar inside 360 px. |
