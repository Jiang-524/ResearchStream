import { readdirSync, readFileSync, existsSync } from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { validateMetadata, assertUniqueIds } from '../src/lib/content-tools.mjs';

export function walk(directory) {
  if (!existsSync(directory)) return [];
  return readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const full = path.join(directory, entry.name);
    return entry.isDirectory() ? walk(full) : [full];
  });
}
export function readSourceEntries(root = path.resolve('content')) {
  const entries = walk(root).filter(file => path.basename(file) === 'index.md').map(file => {
    const { data, content: body } = matter(readFileSync(file, 'utf8'));
    const relative = path.relative(root, file).split(path.sep);
    return { id: relative.slice(0, -1).join('/'), collection: relative[0], slug: relative.slice(1, -1).join('/'), file, data: validateMetadata(data), body };
  });
  assertUniqueIds(entries);
  return entries;
}
