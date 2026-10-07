import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';

// These exercise the content contract, rather than a copy of its implementation.
const modulePath = new URL('../src/lib/content-tools.mjs', import.meta.url);
test('content pipeline exists', () => assert.ok(existsSync(modulePath), 'content pipeline must be implemented'));
if (existsSync(modulePath)) {
  const { validateMetadata, firstContentImage, publishedEntries, assertUniqueIds } = await import(modulePath.href);
  const metadata = { id: 'a', title: 'Attention', abstract: '一句摘要', date: '2026-10-07', lang: 'zh' };
  test('requires abstract and a real date for imported Markdown', () => {
    assert.equal(validateMetadata(metadata).id, 'a');
    assert.throws(() => validateMetadata({ ...metadata, abstract: '' }), /abstract/);
    assert.throws(() => validateMetadata({ ...metadata, date: '2026-02-31' }), /date/);
    assert.throws(() => validateMetadata({ ...metadata, draft: 'false' }), /draft/);
    assert.throws(() => validateMetadata({ ...metadata, paper: { url: 'javascript:alert(1)' } }), /paper.url/);
  });
  test('drafts never enter published entries and same-day ordering is stable', () => {
    const data = [{ id: 'b', data: { ...metadata, id: 'b' } }, { id: 'secret', data: { ...metadata, draft: true } }, { id: 'a', data: metadata }];
    assert.deepEqual(publishedEntries(data).map(e => e.id), ['a', 'b']);
  });
  test('first thumbnail skips badges and resolves local markdown image syntax', () => {
    assert.equal(firstContentImage('![badge](https://img.shields.io/a)\n![A figure](./figure.png "Diagram")'), './figure.png');
    assert.equal(firstContentImage('No images here'), null);
  });
  test('duplicate stable IDs are rejected before publication', () => {
    assert.throws(() => assertUniqueIds([{ id: 'one', data: metadata }, { id: 'two', data: metadata }]), /Duplicate/);
  });
  test('reference-style images are imported and used as first thumbnails', () => {
    const markdown = '![Diagram][figure]\n\n[figure]: ./diagram.png "A diagram"';
    assert.equal(firstContentImage(markdown), './diagram.png');
  });
  test('article links preserve the deployment subpath', async () => {
    const module = await import(modulePath.href);
    assert.equal(typeof module.articleLink, 'function');
    assert.equal(module.articleLink('/learningwall/markdown-notebook/', 'learningwall', 'gradient-descent', '/research/'), '/research/learningwall/markdown-notebook/');
    assert.equal(module.articleLink('../markdown-notebook/index.md#一个小模板', 'learningwall', 'gradient-descent', '/research/'), '/research/learningwall/markdown-notebook/#一个小模板');
    assert.equal(module.articleLink('https://example.org/paper', 'paperpost', 'note', '/research/'), 'https://example.org/paper');
    assert.equal(module.articleLink('#section', 'paperpost', 'note', '/research/'), '#section');
  });
}
