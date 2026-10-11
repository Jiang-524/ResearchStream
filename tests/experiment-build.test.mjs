import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';

test('experiments are navigable, searchable and expose only declared sources',()=>{
  assert.ok(existsSync('dist/experimentrecord/index.html'));
  const projects=JSON.parse(readFileSync('dist/experiments.json','utf8'));
  assert.ok(projects.length>=2);
  assert.ok(projects.every(p=>!('attachments' in p)),'internal file paths must not be published');
  const project=projects.find(p=>p.slug==='curve-lab');
  assert.equal(project.experiments[1].number,3);
  const csv=project.experiments[0].csvs[0];
  assert.match(csv.url,/media\/experimentrecord\/curve-lab\/runs\/baseline\/evaluation.csv$/);
  assert.ok(existsSync('dist/media/experimentrecord/curve-lab/runs/baseline/evaluation.csv'));
  const archive=readFileSync('dist/experimentrecord/index.html','utf8');
  assert.match(archive,/option value="2026-10"/);
  assert.match(archive,/data-date="2026-10-12"/);
  assert.ok(existsSync('dist/templates/experiment-record/index.md'));
  assert.ok(existsSync('dist/templates/experiment-record/experiments.yaml'));
  const records=JSON.parse(readFileSync('dist/entries.json','utf8'));
  assert.match(records.find(r=>r.key==='experimentrecord/curve-lab').body,/baseline|基线/);
  const html=readFileSync('dist/experimentrecord/curve-lab/index.html','utf8');
  assert.match(html,/experimentRecord/);
  assert.match(html,/data-experiment-results/);
  assert.match(html,/<video[^>]*controls/);
});
