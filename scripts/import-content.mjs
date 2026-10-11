import { readFileSync, existsSync, mkdirSync, copyFileSync } from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { validateMetadata } from '../src/lib/content-tools.mjs';
import { readSourceEntries } from './source-content.mjs';
import { entryAssets } from './entry-assets.mjs';

const args = process.argv.slice(2);
const option = name => { const i = args.indexOf(name); return i < 0 ? undefined : args[i + 1]; };
const source = option('--source');
const collection = option('--collection');
const slug = option('--slug');
if (!source || !['paperpost', 'learningwall', 'experimentrecord', 'misc'].includes(collection) || !slug || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
  console.error('Usage: pnpm import --source /path/to/note.md --collection paperpost|learningwall|experimentrecord|misc --slug stable-url-name [--dry-run]');
  process.exit(1);
}
try {
  const { data, content } = matter(readFileSync(source, 'utf8'));
  const metadata = validateMetadata(data);
  const existing = readSourceEntries();
  if (existing.some(e => e.data.id === metadata.id)) throw new Error(`Duplicate content id: ${metadata.id}`);
  const destination = path.resolve('content', collection, slug);
  if (existsSync(destination)) throw new Error(`Destination already exists: ${destination}. Edit the existing note explicitly.`);
  const assets = entryAssets({file:path.resolve(source),collection,slug,id:slug,data:metadata,body:content});
  const manifest = path.resolve(path.dirname(source),'experiments.yaml');
  if (collection==='experimentrecord' && existsSync(manifest)) assets.push({file:manifest,relative:'experiments.yaml'});
  if (!args.includes('--dry-run')) {
    mkdirSync(destination, { recursive: true });
    copyFileSync(source, path.join(destination, 'index.md'));
    for (const asset of assets) { const target = path.join(destination, asset.relative); mkdirSync(path.dirname(target), { recursive: true }); copyFileSync(asset.file, target); }
  }
  console.log(`${args.includes('--dry-run') ? 'Validated' : 'Imported'}: ${metadata.title} → content/${collection}/${slug}/ (${assets.length} assets, ${data.draft ? 'draft' : 'published on next build'})`);
} catch (error) { console.error(error.message); process.exit(1); }
