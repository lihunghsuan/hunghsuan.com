import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const articles = defineCollection({
	loader: glob({ base: './src/content/articles', pattern: '**/*.{md,mdx}' }),
	schema: z.object({
		title: z.string(),
		description: z.string(),
		lang: z.enum(['zh', 'en']),
		articleSlug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
		translationKey: z.string(),
		category: z.string(),
		publishedAt: z.coerce.date(),
		updatedAt: z.coerce.date().optional(),
		draft: z.boolean().default(false),
		featured: z.boolean().default(false),
		videoUrl: z.string().url().optional(),
	}),
});

export const collections = { articles };
