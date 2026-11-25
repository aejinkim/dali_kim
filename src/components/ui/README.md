# components/ui

Shared atomic components — used across multiple pages or sections.

## What goes here
- Buttons, tags, badges, pills
- Cards (generic, not page-specific)
- Icons, dividers, loaders
- Any component used in 2+ different sections

## What goes in `components/main/` instead
- Page-specific sections (HeroSection, BioSection, etc.)
- Components that only appear once in the app

## Component structure (per CLAUDE.md)
Each component = 2 files (no Storybook or unit tests):
```
ui/Button/
├── Button.tsx
└── index.ts
```

When a component lands here, add its raw-element equivalent to `ds/no-raw-element`
in `eslint-rules/design-system.mjs` (e.g. `<button>` → `<Button>`), and document
when to use it in docs/DESIGN.md.
