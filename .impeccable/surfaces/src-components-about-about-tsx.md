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

OWN-WORLD: One burnt-orange ink #c43c00 on ivory #fef0d3, Bricolage Grotesque and Martian Mono. No dark theme, grey tints or paper raster. The approved Lady Justice and Colosseum composition is redrawn as a crisp line engraving for the hero; its ground ends before the Sobre text. Separate Roman fragments frame Sobre without crossing the reading area.

STORY: Title and introduction lead. An eye and hand peeking through torn paper sit on the left, with frontend/mobile and backend/AI passages on the right. The closing row groups role, location and experience beside the résumé download. At 800 px and below, content stacks in DOM reading order.

FORM: An open asymmetric grid, not cards. Title and introduction share the top row; eye-and-hand artwork and narrative share the bottom row. The grid stacks in that DOM order at 800 px. Text stays solid ink on paper. Facts use mono labels and an 8 px Bayer divider. The square résumé action inverts ink/paper on hover and inherits the global 3 px keyboard outline.

SIGNATURE: The existing eye-and-hand torn-paper engraving and Roman fragments are binary masks painted with var(--ink). No original-colour preview, bust, full head, rectangular sky panel, animation or background tint. The illustration is decorative and hidden from assistive technology. Hero line art uses scripts/dither-art.mjs --mode line; already-hatched engravings are never re-dithered.

## Verification

Hero and Sobre reviewed at 1440 px desktop and 390 px mobile, with additional 1920 px and DPR 2 hero captures. The desktop grid has title/intro above artwork/story; mobile preserves reading order. The hero engraving is clean at 1:1 and the mobile name has a bordered paper plate with an offset Bayer block. At 390 px, the résumé action resolves to /curriculo-warney-rego.pdf with download semantics and a visible 3 px ink focus outline, without horizontal overflow. Lint, tsc --noEmit and production build passed for commits 104c38e and 8ab2dea. Formal 200% zoom and Lighthouse checks remain in the portfolio backlog.
