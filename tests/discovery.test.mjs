import { test } from 'node:test';
import assert from 'node:assert/strict';
import * as discovery from '../src/lib/discovery.mjs';

test('recommendations are unique and prefer articles outside the previous batch', () => {
  const pool = Array.from({ length: 10 }, (_, id) => ({ id: String(id) }));
  const batch = discovery.recommend(pool, 4, ['0', '1', '2', '3'], () => 0.4);
  assert.equal(batch.length, 4);
  assert.equal(new Set(batch.map(e => e.id)).size, 4);
  assert.ok(batch.every(e => Number(e.id) >= 4));
  assert.equal(discovery.recommend([], 4).length, 0);
});

test('series group across sections, exclude drafts and preserve explicit learning order', () => {
  const entries = [
    { id: 'b', collection: 'paperpost', data: { series: 'RL for dexterous manipulation', order: 2, date: '2026-09-01' } },
    { id: 'a', collection: 'learningwall', data: { series: 'RL for dexterous manipulation', order: 1, date: '2026-09-02' } },
    { id: 'd', data: { series: 'RL for dexterous manipulation', draft: true } },
  ];
  const groups = discovery.groupSeries(entries);
  assert.equal(groups.length, 1);
  assert.deepEqual(groups[0].entries.map(e => e.id), ['a', 'b']);
  assert.match(groups[0].slug, /^rl-for-dexterous-manipulation-/);
  assert.notEqual(discovery.seriesSlug('A B'), discovery.seriesSlug('A-B'));
});
