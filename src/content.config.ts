import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

// Articles live as MDX files; the slug in the frontmatter is the URL (/blog/<slug>), as on the old site.
const blog = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    slug: z.string(),
    tags: z.array(z.string()),
    description: z.string(),
    heroImage: z.string().optional(),
    // Use the hero image as the link-preview (Open Graph) image; others keep the site image. Size is 2560x1440.
    ogHero: z.boolean().optional(),
    // Where the article first appeared (for example LinkedIn); the page links back to it.
    original: z.url().optional(),
  }),
});

export const collections = { blog };
