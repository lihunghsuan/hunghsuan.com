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

const reviews = defineCollection({
	loader: glob({ base: './src/content/reviews', pattern: '**/*.{md,mdx}' }),
	schema: z.object({
		title: z.string(),
		originalTitle: z.string(),
		description: z.string(),
		lang: z.enum(['zh', 'en']),
		reviewSlug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
		translationKey: z.string(),
		format: z.enum(['movie', 'series']),
		season: z.number().int().positive().optional(),
		year: z.number().int().min(1888),
		status: z.enum(['watching', 'finished']),
		rating: z.number().min(0).max(10).optional(),
		latestEpisode: z
			.object({
				number: z.number().int().positive(),
				title: z.string(),
				rating: z.number().min(0).max(10).optional(),
			})
			.optional(),
		publishedAt: z.coerce.date(),
		updatedAt: z.coerce.date().optional(),
		draft: z.boolean().default(false),
		sample: z.boolean().default(false),
		spoiler: z.boolean().default(false),
		officialUrl: z.string().url().optional(),
		externalReviews: z
			.array(
				z.object({
					platform: z.string(),
					url: z.string().url(),
				}),
			)
			.default([]),
	}),
});

export const collections = { articles, reviews };
