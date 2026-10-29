# Portfolio 2026

The personal site of Prakash Upadhyay, full-stack engineer: the 2026 rebuild of upadhyayprakash.github.io, a dark, monochrome, text-led personal site, built with Astro.

## Develop

Needs Node 22.23.4 and pnpm 9.

```bash
pnpm install        # install dependencies
pnpm dev            # local dev server at http://localhost:4321
pnpm build          # static build into dist/
pnpm preview        # serve the build
pnpm check          # Astro and TypeScript checks
```

## Layout

- `src/pages/`: one file per route.
- `src/layouts/`: the page shell (head, header, footer).
- `src/components/`: header, footer, page eyebrow, section label and the other shared pieces.
- `src/styles/`: design tokens and global styles.
- `public/`: images, the favicon and files served as they are.

## Docs

- `docs/ARCHITECTURE.md`: the pieces and how they talk.
- `docs/adr/README.md`: decisions and their status.
