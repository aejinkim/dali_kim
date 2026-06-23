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
Each component = 4 files:
```
ui/Button/
├── Button.tsx
├── Button.stories.tsx
├── Button.test.tsx
└── index.ts
```
