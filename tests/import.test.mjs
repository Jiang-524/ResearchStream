import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, existsSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const script = path.resolve('scripts/import-content.mjs');
test('import round trip copies Markdown + referenced image and refuses duplicate IDs', () => {
  const directory = mkdtempSync(path.join(tmpdir(), 'rs-import-'));
  try {
    const source = path.join(directory, 'input'); mkdirSync(source);
    const markdown = '---\nid: import-example\ntitle: 导入测试\nabstract: 测试图片和摘要\ndate: "2026-10-07"\nlang: zh\n---\n![图](./figure.png)\n![引用式图][ref]\n\n[ref]: ./reference.svg';
    writeFileSync(path.join(source, 'note.md'), markdown);
    writeFileSync(path.join(source, 'figure.png'), 'image fixture');
    writeFileSync(path.join(source, 'reference.svg'), '<svg/>');
    const args = [script, '--source', path.join(source, 'note.md'), '--collection', 'paperpost', '--slug', 'import-example'];
    const dry = spawnSync(process.execPath, [...args, '--dry-run'], { cwd: directory, encoding: 'utf8' });
    assert.equal(dry.status, 0, dry.stderr); assert.equal(existsSync(path.join(directory, 'content')), false);
    const result = spawnSync(process.execPath, args, { cwd: directory, encoding: 'utf8' });
    assert.equal(result.status, 0, result.stderr);
    assert.equal(readFileSync(path.join(directory, 'content/paperpost/import-example/index.md'), 'utf8'), markdown);
    assert.equal(readFileSync(path.join(directory, 'content/paperpost/import-example/figure.png'), 'utf8'), 'image fixture');
    assert.equal(readFileSync(path.join(directory, 'content/paperpost/import-example/reference.svg'), 'utf8'), '<svg/>');
    const duplicate = spawnSync(process.execPath, [...args.slice(0, -1), 'second-url'], { cwd: directory, encoding: 'utf8' });
    assert.equal(duplicate.status, 1); assert.match(duplicate.stderr, /Duplicate/);
  } finally { rmSync(directory, { recursive: true, force: true }); }
});
