import { defineConfig } from 'astro/config';
import remarkMath from 'remark-math';
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize';
import rehypeKatex from 'rehype-katex';
import remarkImages from './src/lib/remark-images.mjs';
import { unified, rehypeShiki } from '@astrojs/markdown-remark';
import { readSourceEntries } from './scripts/source-content.mjs';
import { createReadStream } from 'node:fs';
import path from 'node:path';
import { entryAssets } from './scripts/entry-assets.mjs';

const highlighting = { themes: { light: 'github-light', dark: 'github-dark' }, defaultColor: false };

export default defineConfig({
  site: process.env.SITE_URL || 'http://localhost:4321',
  base: process.env.BASE_PATH || '/',
  trailingSlash: 'always',
  output: 'static',
  vite: { plugins: [{ name: 'local-note-images', configureServer(server) {
    server.middlewares.use((req, res, next) => {
      const pathname = new URL(req.url || '/', 'http://localhost').pathname;
      if (!pathname.includes('/media/')) return next();
      for (const entry of readSourceEntries().filter(e => !e.data.draft)) {
        for (const asset of entryAssets(entry,process.env.BASE_PATH)) {
          if (asset.url !== pathname) continue;
          const file = asset.file;
          const types = { '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.gif': 'image/gif', '.csv':'text/csv; charset=utf-8', '.mp4':'video/mp4', '.webm':'video/webm', '.yaml':'text/plain; charset=utf-8' };
          res.setHeader('Content-Type', types[path.extname(file)] || 'application/octet-stream');
          createReadStream(file).on('error', () => { res.statusCode = 404; res.end(); }).pipe(res); return;
        }
      }
      next();
    });
  } }] },
  markdown: {
    // Sanitize user content first, then add trusted KaTeX/Shiki markup.
    syntaxHighlight: false,
    processor: unified({ remarkPlugins: [remarkMath, remarkImages],
    rehypePlugins: [[rehypeSanitize, {
      ...defaultSchema,
      clobberPrefix: '',
      attributes: {
        ...defaultSchema.attributes,
        code: [...(defaultSchema.attributes.code || []), ['className', /^language-./, 'math-inline', 'math-display']],
      },
    }], rehypeKatex, [rehypeShiki, highlighting]], }),
  },
});
