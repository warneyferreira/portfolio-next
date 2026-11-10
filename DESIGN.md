# DESIGN.md — monochrome dithered shade

Source of truth for the look of this portfolio. Seeded from §2 of the loop prompt on 2026-11-10. Owner decisions that changed §2 are applied in place and listed under [Refinements](#refinements). Follow it strictly; change it only with a logged reason.

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
- **Illustrations**: the engravings (hero, Sobre, Sisyphus, clouds and doves, gladiator, owl, diploma and stamp, winged letter) are printed 1-bit in `--ink` like any other image.
- **Hero**: one signature piece. Here it is the owner-approved Lady Justice and Colosseum engraving, dithered in `--ink`; any motion is a slowly shifting threshold on its shading. Must respect `prefers-reduced-motion` (static frame) and stay under ~5 ms/frame.
- Pixel crispness: align patterns to device pixels; avoid patterns scaled by fractional values.

## Typography

- One grotesk/sans for body, one mono for labels, metadata, nav, tags. Large, tight display headings.
- Uppercase mono micro-labels (`01 / SOBRE`) as structural markers. Interface copy is Brazilian Portuguese.
- Grotesk: Bricolage Grotesque (already in the repo, variable `opsz` and `wdth`). Mono: chosen in the fonts task and recorded here.

## Layout & components

- Grid-based, generous whitespace, hard edges, 1–2px ink borders, no border-radius (or ≤2px).
- Components: nav, hero, about, stack, project cards + project detail page, experience/timeline, education + certifications, writing/blog list, contact, footer. All share the shade scale.
- Interaction: hover = pattern density step or inversion; focus states clearly visible (thick ink outline), never removed.

## Quality bars

- WCAG AA contrast for all text — text never sits directly on dense mid-tone dither; put it on a solid paper/ink plate.
- Responsive from 360px to wide desktop; no horizontal scroll.
- Lighthouse targets: Performance ≥ 90, Accessibility ≥ 95.
- Dithered textures must not cause moiré at common zoom levels; test at 100% and 200%.

## Refinements

| Date | §2 of the loop prompt said | Now | Reason |
|---|---|---|---|
| 2026-11-10 | `--ink: #0a0a0a`, `--paper: #f2f0eb` | `--ink: #c43c00`, `--paper: #fef0d3` | Owner, iteration 1: "everything must use orange", no black ink; paper is the hero's ivory; one orange for everything, art included, dark enough for AA. `#e84b08`, the earlier engraving orange, is retired: 3.42:1 on ivory fails AA for body text. |
| 2026-11-10 | Dark mode = inverted (paper on ink), same patterns | No dark mode, no toggle | Owner, iteration 1: "No dark theme: remove the toggle, light only". |
| 2026-11-10 | Original image on hover/focus is optional | Never shown | Follows from the one-ink rule: an original brings other colours back. |
| 2026-11-10 | Illustrations not mentioned | Printed 1-bit in `--ink` | Owner: art included in the one ink. Soft-alpha masks would print flat tints. |
| 2026-11-10 | Hero: e.g. a dithered gradient, threshold field or 3D/noise shape | The existing Lady Justice and Colosseum engraving, dithered | The owner approved this art, drawn from their own reference; the loop forbids re-architecting what works. |
| 2026-11-10 | Component list; label example `01 / PROJECTS` | Adds stack and education + certifications; labels in pt-BR | Both sections exist in the repo; all site copy is pt-BR. |
