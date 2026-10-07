import { readFileSync, writeFileSync, mkdirSync, copyFileSync } from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import * as pagefind from 'pagefind';
import { readSourceEntries, walk } from './source-content.mjs';
import { markdownImages, mediaUrl, basePath } from '../src/lib/content-tools.mjs';

const output = path.resolve('dist');
const base = basePath(process.env.BASE_PATH);
const records = JSON.parse(readFileSync(path.join(output, 'entries.json'), 'utf8'));
// Put Chinese and English in one CJK-aware index, independent of UI language.
const { index, errors } = await pagefind.createIndex({ forceLanguage: 'zh' });
if (errors.length || !index) throw new Error(errors.join('\n'));
for (const record of records) {
  const result = await index.addCustomRecord({
    url: record.url, language: 'zh',
    content: [record.title, record.abstract, record.body, record.tags.join(' '), record.authors.join(' '), record.paper].join('\n'),
    meta: { title: record.title, key: record.key },
  });
  if (result.errors.length) throw new Error(result.errors.join('\n'));
}
const written = await index.writeFiles({ outputPath: path.join(output, 'pagefind') });
if (written.errors.length) throw new Error(written.errors.join('\n'));
await pagefind.close();

for (const entry of readSourceEntries().filter(e => !e.data.draft)) {
  for (const image of markdownImages(entry.body).filter(image => !/^(https?:|data:|\/)/.test(image))) {
    const targetUrl = mediaUrl(entry.collection, entry.slug, image, '/');
    const target = path.join(output, decodeURIComponent(targetUrl));
    mkdirSync(path.dirname(target), { recursive: true });
    copyFileSync(path.resolve(path.dirname(entry.file), image), target);
  }
}

const files = walk(output);
const version = createHash('sha256');
for (const file of files) version.update(path.relative(output, file)).update(readFileSync(file));
const cacheName = `researchstream-${createHash('sha256').update(base).digest('hex').slice(0,6)}-${version.digest('hex').slice(0, 12)}`;
const prefix = cacheName.slice(0, -12);
const core = ['', 'paperpost/', 'learningwall/', 'misc/', 'search/', 'write/', 'offline/', 'entries.json', 'favicon.svg'].map(p => base + p);
for (const file of files) {
  const relative = path.relative(output, file).split(path.sep).join('/');
  if (relative.startsWith('_astro/') || relative.startsWith('pagefind/')) core.push(base + relative);
}
const worker = `const CACHE = ${JSON.stringify(cacheName)};
const PREFIX = ${JSON.stringify(prefix)};
const BASE = ${JSON.stringify(base)};
const CORE = ${JSON.stringify(core)};
self.addEventListener('install', event => event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(CORE)).then(() => self.skipWaiting())));
self.addEventListener('activate', event => event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key.startsWith(PREFIX) && key !== CACHE).map(key => caches.delete(key)))).then(() => self.clients.claim())));
self.addEventListener('message', event => {
  if (event.data?.type !== 'CACHE_READING') return;
  event.waitUntil(caches.open(CACHE).then(cache => Promise.all(event.data.urls.map(async raw => {
    const url = new URL(raw, self.location.origin);
    if (url.origin !== self.location.origin || !url.pathname.startsWith(BASE)) return;
    url.search = ''; url.hash = '';
    try { const response = await fetch(url); if (response.ok) await cache.put(url, response); } catch {}
  }))));
});
self.addEventListener('fetch', event => {
  const request = event.request, url = new URL(request.url);
  if (request.method !== 'GET' || url.origin !== self.location.origin || !url.pathname.startsWith(BASE) || url.pathname.endsWith('/sw.js')) return;
  event.respondWith((async () => {
    const cache = await caches.open(CACHE);
    const key = request.mode === 'navigate' ? new URL(url.pathname, url.origin).href : request;
    try {
      const response = await fetch(request);
      if (response.ok) await cache.put(key, response.clone());
      return response;
    } catch {
      const saved = await cache.match(key);
      if (saved) return saved;
      if (request.mode === 'navigate') return await cache.match(BASE + 'offline/');
      return new Response('Unavailable offline', { status: 503 });
    }
  })());
});\n`;
writeFileSync(path.join(output, 'sw.js'), worker);
console.log(`Indexed ${records.length} entries; prepared ${core.length} offline resources (${cacheName}).`);
