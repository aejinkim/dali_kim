<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

---

# Portfolio — Agent Rules

## Layout & Structure

- **Section heights are fixed**: Hero `150vh` / zIndex `10`, Bio `350vh` / marginTop `-150vh` / zIndex `1`. Do not change these — the scroll math depends on them.
- **Scroll interaction model**: Hero inner content slides UP (`translateY`), Bio is stationary behind it. Never reverse this.
- **Bio SLIDE_END = 0.2, REVEAL_WINDOW = 0.16** — derived from scroll math (50vh / 250vh). Do not adjust without recalculating.
- **Max-width container**: always use `.content-width` class (1920px, centered).
- **Horizontal padding**: always use `var(--page-gutter)` — never hardcode side padding. All sections (nav, bio, projects) share this value.

## Components

- **ProjectsSection**: only the thumbnail `<a>` is clickable. The outer card wrapper is a `<div>`. Do not wrap the whole card in a link.
- **BioSection image stack**: cards accumulate and are never removed once shown. `visibleKeys` is a Set that only grows.
- **FixedHeader INDEX button**: positioned at `right: var(--page-gutter)`, `top: 33px` — intentionally aligned with nav's right `+` icon center.
- **Nav fade**: fades out between 20–50% of viewport scroll height. INDEX button appears after 50%.

## Typography

- **Font**: Google Sans Flex variable font only — `var(--font-google-sans-flex)`. No other fonts on main portfolio pages.
- **ProjectCard title**: `56px / weight 500 / line-height 1.1 / letter-spacing -2.24px`
- **ProjectCard subtitle**: `40px / weight 300 / line-height 1.1 / letter-spacing -1.6px`
- **ProjectCard summary**: `22px / weight 400 / line-height 1.3 / letter-spacing -0.22px`
- **Hero headline**: mixed weights — "I design where" 300, "complexity" 900 (animated), "consequence" 100 (animated)

## Colors

- Hero background: `#d9d7d0`
- Project card themes (in order): `#f5f4f0` → `#1B4EFD` → `#0d0d0d` → repeat
- Dark section text: white; light section text: `#0a0a0a`

## Interactions

- `complexity` uses a pixel/block character scramble on load and on hover. `steps(14, end)` timing for font-weight animation — keep it stepped, not smooth.
- `consequence` animates weight 900 → 100 on load (smooth, no scramble).
- Project card image: scale `1.2` on hover, "View Project Details" overlay appears.

## Code style

- No comments unless the WHY is non-obvious.
- Edit existing files — do not create new component files without asking.
- CSS variables over hardcoded values for any measurement used in more than one place.
