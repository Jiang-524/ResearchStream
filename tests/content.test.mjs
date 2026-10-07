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
}
