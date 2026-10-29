# CLAUDE.md

Portfolio 2026: the 2026 rebuild of upadhyayprakash.github.io, a dark, monochrome, text-led personal site, built with Astro.

Planning notes, brand and designs live in the idea folder one level up, outside this repo (Launchpad D13). Start every session at `../README.md`, section "Resume here".

## Commands

```bash
pnpm install        # install dependencies
pnpm dev            # local dev server at http://localhost:4321
pnpm build          # static build into dist/
pnpm preview        # serve the build
pnpm check          # Astro and TypeScript checks
```

Node 22.23.4 (see `.nvmrc`). Package manager: pnpm.

## Rules

- Decisions go in `docs/adr/`: `NNNN-slug.md`, four digits, listed with their status in `docs/adr/README.md`.
- Colours, type, spacing, radius and shadow come from the tokens package (`src/styles/tokens.css`, mirrored in `src/styles/tokens.ts`); never hardcode them. Its source is `../designs/TOKENS.md`, signed off at stage 3.
- Secrets never go in the repo: env files are gitignored, and the example env file lists variable names only.
- This repo may become public: no personal paths, idea-folder notes or private decisions in it.
- No em dashes anywhere: copy, code, comments, docs and commit messages.
- Only real facts; anything missing is a visible placeholder in square brackets.
- Decorative motion (the hero lens, icon animations) stops under `prefers-reduced-motion` and never carries meaning.
