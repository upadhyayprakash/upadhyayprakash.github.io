# Architecture: Portfolio 2026

## Pieces

| Piece | Path | Purpose | Tech | Runs on |
|---|---|---|---|---|
| Site | `/` | Every page of the portfolio | Astro 7, MDX, plain CSS | GitHub Pages (static files) |

## How they talk

There is no backend. Pages are built to static HTML at build time; the few interactive bits (hero lens, nav tooltip, content filters) are small inline scripts. Email links open the visitor's mail app.

## Data

Articles are MDX files in `src/content/`. Lists such as work, timeline and content entries are typed data files in `src/data/`. No database and no visitor data.

## Design tokens

The tokens package (`src/styles/tokens.css`) is built from `../designs/TOKENS.md`. Every app reads colours, type, spacing, radius and shadow from it.
