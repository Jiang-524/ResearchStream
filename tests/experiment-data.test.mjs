import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseCsv, metricPoints, smoothPoints, comparisonGroup } from '../src/lib/experiment-data.mjs';

const csv = { x: { column: 'iteration', quantity: 'iteration', unit: 'count' }, metrics: [{ id: 'score', column: 'measurement', quantity: 'score', unit: 'fraction' }] };
test('custom column mappings preserve actual x and missing values', () => {
  const parsed = parseCsv('\uFEFFiteration,measurement\r\n4,2e-1\r\n2,\r\nwrong,9\r\n6,0\r\n', csv);
  assert.deepEqual(metricPoints(parsed, csv, csv.metrics[0]), { points: [[2,null],[4,.2],[6,0]], skippedX: 1, missingY: 1 });
});
test('numbered columns and logical CSV records work without headers', () => {
  const config = { headerRow: null, dataStartRow: 2, delimiter: ';', x: { rowNumber: true } };
  const parsed = parseCsv('"intro\ntext";ignored\n7;3\n8;5', config);
  assert.deepEqual(metricPoints(parsed, config, { columnIndex: 2 }).points, [[1,3],[2,5]]);
});
test('ambiguous headers and nonexistent columns are not silently accepted', () => {
  const parsed = parseCsv('x,y,y\n1,2,3', {});
  assert.throws(() => metricPoints(parsed, { x: { column: 'x' } }, { column: 'y' }), /ambiguous/i);
  assert.throws(() => metricPoints(parsed, { x: { columnIndex: 1 } }, { columnIndex: 4 }), /column/i);
  assert.deepEqual(metricPoints(parsed, { x: { columnIndex: 1 } }, { columnIndex: 3 }).points, [[1,3]]);
});
test('EMA keeps gaps and restarts after them without mutating data', () => {
  const points = [[1,2],[2,4],[3,null],[4,10]];
  assert.deepEqual(smoothPoints(points, .5), [[1,2],[2,3],[3,null],[4,10]]);
  assert.deepEqual(smoothPoints(points, 0), points);
  assert.equal(points[1][1],4);
});
test('comparison groups respect both x and y units and semantics', () => {
  assert.notEqual(comparisonGroup(csv, csv.metrics[0]), comparisonGroup(csv, { ...csv.metrics[0], unit: '%' }));
  assert.notEqual(comparisonGroup(csv, csv.metrics[0]), comparisonGroup({ x: { ...csv.x, quantity: 'time' } }, csv.metrics[0]));
});
test('six 100k-row curves preserve final values', () => {
  const text = 'iteration,measurement\n' + Array.from({length:100000}, (_,i) => `${i},${i % 17}`).join('\n');
  for (let i=0;i<6;i++) {
    const result = metricPoints(parseCsv(text,csv),csv,csv.metrics[0]);
    assert.equal(result.points.length,100000);
    assert.deepEqual(result.points.at(-1),[99999,5]);
    assert.equal(smoothPoints(result.points,.9).length,100000);
  }
});
