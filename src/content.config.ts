import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    image: z.string().optional(),
    imageAlt: z.string().default(''),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
    lang: z.enum(['es', 'en']).default('es'),
  }),
});

const portfolio = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/portfolio' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    category: z.enum(['web', 'design', 'photo-video', 'marketing']),
    client: z.string().optional(),
    date: z.coerce.date(),
    image: z.string(),
    imageAlt: z.string().default(''),
    gallery: z.array(z.string()).default([]),
    tags: z.array(z.string()).default([]),
    featured: z.boolean().default(false),
    url: z.string().optional(),
    lang: z.enum(['es', 'en']).default('es'),
  }),
});

export const collections = { blog, portfolio };
