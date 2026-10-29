# 0001. Scaffold: shape, tooling and stack

Status: Accepted (2026-10-29). Signed off by: Prakash Upadhyay, 2026-10-29

## Context

Portfolio 2026 replaces the current Vite + React site at upadhyayprakash.github.io. The v1 scope (eight routes: home, writing, how I build, work, two case studies, about, content) is a mostly static, content-led site with a little interaction: a cursor lens on the home hero, a nav tooltip, content filters and icon micro-animations. It must keep the old article and resume URLs working, ship with placeholders for photos and links, and cost nothing to host.

## Decision

### Shape

A single app, not a monorepo. The design tokens live in `src/styles/tokens.css` (CSS custom properties) with a typed mirror in `src/styles/tokens.ts`, so no separate package is needed until a second app exists.

### Stack (cost first)

Prices and limits were checked on the date shown; they change, so check again before relying on a limit.

| Layer | Choice | Free tier and limits (checked) | Alternatives considered | Why |
|---|---|---|---|---|
| Runtime | Node 22.23.4 | Free | Node 24 | Prakash's choice; meets every dependency's engine range |
| Framework | Astro 7.3.8 (static output) | Open source | Vite + React (the old stack), Next.js static export | Ships HTML with zero JavaScript by default; islands only where interaction is needed; MDX for articles |
| Content | Astro content collections with MDX (@astrojs/mdx 8.0.3) | Open source | Plain Markdown, a headless CMS | Articles stay as files in the repo, with frontmatter checked by a schema |
| Styling | Plain CSS with custom properties from the tokens | n/a | Tailwind | The design system is already expressed as tokens; no build step or class soup needed |
| Fonts | Google Fonts: Open Sans, Caveat | Free | Self-hosted fonts | Matches the mock-up; can be self-hosted later for speed |
| Hosting | GitHub Pages, user site `upadhyayprakash/upadhyayprakash.github.io` (checked 2026-10-29) | Free for public repos; 1 GB site size, 100 GB a month soft bandwidth, 10 builds an hour | Cloudflare Pages (Launchpad default), Netlify | The domain and old URLs already live there; switching hosts would change the address |
| Build and deploy | GitHub Actions, official Astro Pages workflow | Free minutes for public repos | Manual push of `dist/` | Builds on push to main |
| Analytics | None in v1 | n/a | Cloudflare Web Analytics, Plausible | Not asked for; can be added later |
| Sitemap | @astrojs/sitemap 3.7.4 | Open source | Hand-written | Generated from the routes |

## Consequences

- Node 22.23.4 (pinned in `.nvmrc` and `engines`, chosen by Prakash for the fix released after the 21 Oct 2026 incident). Astro is pinned to 7.3.8 rather than 7.4.x because every 7.4 release was under two weeks old on 2026-10-29; dependencies are pinned to exact versions.
- The repo becomes the user site only at switch-over; until then it builds and runs locally. The old repo and its 90 uncommitted files are not touched.
- GitHub Pages has no server-side redirects: old routes (`/projects`, `/competitions`, `/publications`, `/venom`, `/visionai`) get static redirect pages; targets to confirm.
- The limit most likely to bite first: none for a personal site; GitHub Pages bandwidth is far above the expected traffic.
