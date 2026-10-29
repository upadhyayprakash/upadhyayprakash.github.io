// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://upadhyayprakash.github.io',
  trailingSlash: 'ignore',
  integrations: [mdx(), sitemap()],
  // Old routes from the previous site, kept working as static redirect pages.
  redirects: {
    '/projects': '/work',
    '/venom': '/work',
    '/visionai': '/work',
    '/publications': '/writing',
    '/competitions': '/#recognition',
  },
});
