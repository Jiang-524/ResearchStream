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

const readingAssets = {};
for (const entry of readSourceEntries().filter(e => !e.data.draft)) {
  const page = `${base}${entry.collection}/${entry.slug}/`;
  readingAssets[page] = [];
  for (const image of markdownImages(entry.body).filter(image => !/^(https?:|data:|\/)/.test(image))) {
    const targetUrl = mediaUrl(entry.collection, entry.slug, image, '/');
    const target = path.join(output, decodeURIComponent(targetUrl));
    mkdirSync(path.dirname(target), { recursive: true });
    copyFileSync(path.resolve(path.dirname(entry.file), image), target);
    readingAssets[page].push(mediaUrl(entry.collection, entry.slug, image, base));
  }
}

const files = walk(output);
const version = createHash('sha256');
version.update(readFileSync(new URL(import.meta.url)));
for (const file of files) version.update(path.relative(output, file)).update(readFileSync(file));
const cacheName = `researchstream-${createHash('sha256').update(base).digest('hex').slice(0,6)}-${version.digest('hex').slice(0, 12)}`;
const prefix = cacheName.slice(0, -12);
const core = ['', 'paperpost/', 'learningwall/', 'misc/', 'search/', 'series/', 'write/', 'offline/', 'entries.json', 'favicon.svg'].map(p => base + p);
for (const file of files) {
  const relative = path.relative(output, file).split(path.sep).join('/');
  if (relative.startsWith('_astro/') || relative.startsWith('pagefind/')) core.push(base + relative);
  if (relative.startsWith('series/') && relative !== 'series/index.html' && relative.endsWith('/index.html')) core.push(base + relative.replace(/index\.html$/, ''));
}
const worker = `const CACHE = ${JSON.stringify(cacheName)};
const PREFIX = ${JSON.stringify(prefix)};
const BASE = ${JSON.stringify(base)};
const CORE = ${JSON.stringify(core)};
const READING_ASSETS = ${JSON.stringify(readingAssets)};
self.addEventListener('install', event => event.waitUntil((async () => {
  const savedPages = new Set();
  for (const name of await caches.keys()) {
    if (!name.startsWith(PREFIX) || name === CACHE) continue;
    for (const request of await (await caches.open(name)).keys()) {
      const path = new URL(request.url).pathname;
      if (Object.hasOwn(READING_ASSETS, path)) savedPages.add(path);
    }
  }
  const urls = new Set(CORE);
  for (const page of savedPages) { urls.add(page); READING_ASSETS[page].forEach(url => urls.add(url)); }
  const cache = await caches.open(CACHE);
  // Refresh current public versions before activating; failed downloads retain the old worker.
  await cache.addAll([...urls]);
  await self.skipWaiting();
})()));
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
    // Pagefind adds a timestamp to its manifest URL; its cached content is path-based.
    const key = request.mode === 'navigate' || url.pathname === BASE + 'pagefind/pagefind-entry.json' ? new URL(url.pathname, url.origin).href : request;
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
