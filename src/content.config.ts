import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { validateMetadata } from './lib/content-tools.mjs';

const dateString = z.preprocess(value => value instanceof Date ? value.toISOString().slice(0, 10) : value, z.string());
const schema = z.object({
  id: z.string(), title: z.string(), abstract: z.string(),
  date: dateString, updated: dateString.optional(), lang: z.enum(['zh', 'en']),
  topic: z.string().default('Notes'), tags: z.array(z.string()).default([]),
  draft: z.boolean().default(false), demo: z.boolean().default(false),
  series: z.string().optional(), order: z.number().optional(),
  translationKey: z.string().optional(), source: z.string().optional(),
  paper: z.object({ title: z.string().optional(), authors: z.array(z.string()).optional(), url: z.url().optional() }).optional(),
}).superRefine((data, ctx) => {
  try { validateMetadata(data); } catch (error) { ctx.addIssue({ code: 'custom', message: (error as Error).message }); }
});

const collection = (name: string) => defineCollection({
  loader: glob({ pattern: '**/index.md', base: `./content/${name}`, generateId: ({ entry }) => entry.replace(/\/index\.md$/, '') }),
  schema,
});
export const collections = { paperpost: collection('paperpost'), learningwall: collection('learningwall'), misc: collection('misc') };
