---
version: 1
slug: "src-components-about-about-tsx"
primary_target: "src/components/about/About.tsx"
related_targets: ["src/components/about/about.module.css"]
---

# Sobre — portfolio

Mode: Experience. Scope: the existing #sobre section, not the hero or other sections.
Audience: visitors evaluating Warney Rego's full-stack and AI engineering work. Existing portfolio data remains the source of factual copy.

## Direction contract

THESIS: Show the connection between the interface and the system behind it, rather than a generic biography card grid.

OWN-WORLD: Extend the incumbent black-ink-on-paper world, Bricolage Grotesque typography, warm paper in light mode and charcoal stock in dark mode. Preserve the hero unchanged.

STORY: Read the existing introduction, see Sisyphus on one knee holding up a boulder made of the whole stack, then read frontend/mobile and backend/AI capabilities. Finish with role, location, experience and the real résumé download.

FIRST VIEWPORT: Large Sobre heading opposite the introduction. Below, a single wide illustration on the left and two stacked text passages on the right. Mobile stacks heading, introduction, illustration, passages and facts in reading order.

FORM: Open editorial composition without cards. Sisyphus (pose from the user's Atlas reference, loincloth) generated with GPT Images (gpt-image-2-codex) in the hero portrait's hand: bold black ink comic linework, solid black hair, halftone photodots for the muscle shading, hand-cut sticker silhouette. The image has no boulder; it ships as alpha masks split into body, raised arm and hair (public/images/about/sisyphus-{ink,shape}-*.webp) painted in CSS with the theme tokens. The boulder is SVG in Sisyphus.tsx, sharing the drawing's 846×1470 coordinates: a circle resting on the left palm and behind the right fingers, two halftone crescents for shadow, and the official Simple Icons glyph of each `stack` item from src/data/portfolio.ts in concentric rings (items without a published glyph stay out of the boulder but remain in the figure's accessible description). Theme rule as in the hero portrait: light puts ink straight on the paper; dark turns figure and boulder into light stickers (--ink) with dark linework (--paper). Motion, all on one 4.2s effort cycle and off under prefers-reduced-motion: the body gives from the feet, the raised arm bends at the shoulder, the boulder sinks with them and trembles at the bottom, the hair sways and ripples (turbulence displacement like the hero portrait), strain marks flash at the hands; the boulder also rolls once every 140s. No sweat drop. Never color, realistic rendering, clean icons in place of the drawing, or isometric renders.

SIGNATURE: Sisyphus holding the stack as his boulder, in the same hand as the hero portrait. Seed: user reference of Atlas holding a sphere.

Verification: rendered at 1440px and 390px in both themes; image loading, section navigation and résumé download checked. TypeScript, ESLint and Impeccable detector pass.
