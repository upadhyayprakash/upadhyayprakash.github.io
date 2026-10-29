// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://upadhyayprakash.github.io',
  trailingSlash: 'ignore',
  integrations: [mdx(), sitemap()],
  // CSS goes inside each page. GitHub Pages caches HTML for 10 minutes and every deploy replaces
  // the hashed asset files, so a cached page could otherwise point at a stylesheet that is gone.
  build: {
    inlineStylesheets: 'always',
  },
  // Old routes from the previous site, kept working as static redirect pages.
  redirects: {
    '/projects': '/work',
    '/visionai': '/work',
    '/publications': '/writing',
    '/competitions': '/#recognition',
  },
});
