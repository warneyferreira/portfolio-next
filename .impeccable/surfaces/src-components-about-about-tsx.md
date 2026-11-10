---
version: 1
slug: "src-components-about-about-tsx"
primary_target: "src/components/about/About.tsx"
related_targets: ["src/components/about/about.module.css"]
---

# Sobre — portfolio

Mode: Experience. Scope: #sobre and the shared background joining it to #inicio; other sections stay unchanged.
Audience: visitors evaluating Warney Rego's full-stack and AI engineering work. `src/data/portfolio.ts` remains the source of factual copy.

## Direction contract

THESIS: Connect the interface people touch with the systems behind it through one expressive illustration, not a biography-card grid.

OWN-WORLD: Inherit the portfolio's black-ink collage, Bricolage Grotesque, warm paper and charcoal themes. Hero and About share one continuous Roman engraved background, generated from the approved htp.png reference. Ruins and ground extend down from the hero at the edges; the center remains quiet for text. The background fades into the site's paper only at the bottom of About, not at the hero boundary.

STORY: Title and introduction lead. An eye and hand peeking through torn paper sit on the left, with frontend/mobile and backend/AI passages on the right. The closing row groups role, location and experience beside the résumé download. At 800 px and below, content stacks in DOM reading order.

FORM: An open asymmetric grid, not cards. Palette: paper #f4efe4, ink #15130f, secondary #5c564d and rule #bdb5a5; dark paper #161412, ink #efe9df, secondary #b6afa4 and rule #514b43. Display type tops out at 6rem; body copy is 1.125rem with 1.7 line height. A single thin rule separates professional facts from the narrative. The filled résumé action has a visible keyboard outline and a contrasting hover state.

SIGNATURE: Original surreal eye-and-hand torn-paper collage, inspired by the user's uploaded reference and generated with GPT Images. `public/images/about/eye-paper-dither.webp` is a 1024×1536 ink mask with organic torn edges and sparse clouds. Ordered alpha dithering preserves a single orange ink in light mode and light ink in dark mode. No bust, full head, rectangular sky panel, animation or background tint. The illustration is decorative and hidden from assistive technology.

## Verification

Rendered and visually inspected at 1440 px and 390 px in both themes. Layout measurements at 320, 768, 810, 1024 and 1440 px found no overflowing section text. Verified the Sobre navigation anchor, keyboard-visible résumé focus, hover state, both mask responses and an actual résumé download (456491 bytes). TypeScript (`tsc --noEmit --incremental false`), targeted ESLint and the targeted Impeccable detector completed successfully.
