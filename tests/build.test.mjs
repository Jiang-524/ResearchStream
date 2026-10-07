import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { walk } from '../scripts/source-content.mjs';

test('production pages and offline search resources are built', () => {
  for (const file of ['index.html', 'paperpost/index.html', 'learningwall/index.html', 'misc/index.html', 'search/index.html', 'write/index.html', 'offline/index.html', 'sw.js', 'pagefind/pagefind.js']) assert.ok(existsSync(path.join('dist', file)), file);
});
test('drafts are absent from public output, including assets and the search source', () => {
  const files = walk('dist');
  assert.ok(files.length > 0);
  assert.ok(!files.some(f => /sample-draft|private\.svg/.test(f)));
  for (const file of files.filter(f => /\.(html|json|svg)$/.test(f))) assert.doesNotMatch(readFileSync(file, 'utf8'), /PRIVATE_DRAFT_SENTINEL_RS|PRIVATE_DRAFT_IMAGE_RS/);
});
test('article renders math, code, tables and heading anchors that exist', () => {
  const html = readFileSync('dist/paperpost/attention-revisited/index.html', 'utf8');
  assert.match(html, /class="katex/); assert.match(html, /<table/); assert.match(html, /astro-code/);
  for (const anchor of [...html.matchAll(/href="#([^"]+)"/g)].map(m => m[1]).filter(a => a !== 'main')) assert.ok(html.includes(`id="${anchor}"`), `missing heading anchor ${anchor}`);
});
test('published note first image points to a copied asset', () => {
  const html = readFileSync('dist/learningwall/gradient-descent/index.html', 'utf8');
  assert.match(html, /media\/learningwall\/gradient-descent\/descent.svg/);
  assert.ok(existsSync('dist/media/learningwall/gradient-descent/descent.svg'));
});
