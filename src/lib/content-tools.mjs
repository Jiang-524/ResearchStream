export function validateMetadata(data) {
  for (const key of ['id', 'title', 'abstract', 'lang']) {
    if (typeof data[key] !== 'string' || !data[key].trim()) throw new Error(`Missing or empty ${key}`);
  }
  if (!['zh', 'en'].includes(data.lang)) throw new Error('lang must be zh or en');
  for (const key of ['draft', 'demo']) {
    if (data[key] !== undefined && typeof data[key] !== 'boolean') throw new Error(`${key} must be a boolean`);
  }
  if (data.paper?.url !== undefined) {
    let url;
    try { url = new URL(data.paper.url); } catch { throw new Error('paper.url must be an HTTP(S) URL'); }
    if (!['http:', 'https:'].includes(url.protocol)) throw new Error('paper.url must be an HTTP(S) URL');
  }
  const date = data.date instanceof Date ? data.date.toISOString().slice(0, 10) : String(data.date);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || isNaN(Date.parse(date)) || new Date(date).toISOString().slice(0, 10) !== date) {
    throw new Error('date must be a real YYYY-MM-DD date');
  }
  return { ...data, date };
}

export function publishedEntries(entries) {
  return entries.filter(e => !e.data.draft).sort((a, b) =>
    String(b.data.date).localeCompare(String(a.data.date)) || a.id.localeCompare(b.id));
}

export function assertUniqueIds(entries) {
  const ids = new Set();
  for (const entry of entries) {
    if (ids.has(entry.data.id)) throw new Error(`Duplicate content id: ${entry.data.id}`);
    ids.add(entry.data.id);
  }
}

export function markdownImages(body) {
  const nodes = [];
  const visit = node => { nodes.push(node); node.children?.forEach(visit); };
  visit(fromMarkdown(body));
  const definitions = new Map(nodes.filter(node => node.type === 'definition').map(node => [node.identifier, node.url]));
  return [...new Set(nodes.filter(node => node.type === 'image' || node.type === 'imageReference').map(node => node.url || definitions.get(node.identifier)).filter(Boolean))];
}

export function firstContentImage(body) {
  return markdownImages(body).find(url => !/shields\.io|badge|^data:/i.test(url)) || null;
}

export function readingMinutes(body) {
  const chinese = (body.match(/[\u3400-\u9fff]/g) || []).length;
  const words = (body.replace(/[\u3400-\u9fff]/g, '').match(/\b\w+\b/g) || []).length;
  return Math.max(1, Math.ceil(chinese / 400 + words / 220));
}

export function basePath(base = '/') {
  return '/' + base.split('/').filter(Boolean).join('/') + (base.split('/').filter(Boolean).length ? '/' : '');
}

export function mediaUrl(collection, slug, image, base = '/') {
  if (/^https?:\/\//.test(image) || image.startsWith('/')) return image;
  const relative = image.replace(/^\.\//, '');
  if (relative.split('/').includes('..')) throw new Error('Article images must stay in their article directory');
  return `${basePath(base)}media/${collection}/${slug}/${relative.split('/').map(encodeURIComponent).join('/')}`;
}

export function articleLink(href, collection, slug, base = '/') {
  if (/^(?:[a-z][\w+.-]*:|#|\/\/)/i.test(href)) return href;
  const prefix = basePath(base);
  if (href.startsWith('/')) return href.startsWith(prefix) ? href : prefix + href.slice(1);
  const [pathname, hash] = href.split('#');
  if (!pathname.endsWith('.md')) return href;
  const route = path.posix.resolve('/', collection, slug, pathname).replace(/\/index\.md$/, '/').replace(/\.md$/, '/');
  return prefix + route.slice(1) + (hash ? '#' + hash : '');
}
import { fromMarkdown } from 'mdast-util-from-markdown';
import path from 'node:path';
