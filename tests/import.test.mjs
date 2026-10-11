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

test('experiment import preserves the manifest and only declared assets', () => {
  const directory = mkdtempSync(path.join(tmpdir(), 'rs-experiment-import-'));
  try {
    const source = path.join(directory, 'input'); mkdirSync(source);
    writeFileSync(path.join(source,'index.md'),'---\nid: test-project\ntitle: Test project\nabstract: Import real mapped CSV\ndate: "2026-10-12"\nlang: zh\nexperimentKinds: [reproduction]\nstatus: completed\n---\nMethod and reasons.');
    writeFileSync(path.join(source,'data.csv'),'iteration,result\n1,3\n2,5');
    writeFileSync(path.join(source,'config.yaml'),'seed: 42');
    writeFileSync(path.join(source,'unreferenced.txt'),'DO NOT PUBLISH');
    const manifest={experiments:[{id:'baseline',number:3,title:'Baseline',date:'2026-10-12',kind:'reproduction',status:'completed',config:'config.yaml',csvs:[{id:'evaluation',number:2,title:'Evaluation',path:'data.csv',x:{column:'iteration',label:'Iteration',quantity:'iteration',unit:'count'},metrics:[{id:'result',column:'result',label:'Result',quantity:'score',unit:''}]}]}]};
    writeFileSync(path.join(source,'experiments.yaml'),JSON.stringify(manifest));
    const args=[script,'--source',path.join(source,'index.md'),'--collection','experimentrecord','--slug','test-project'];
    const result=spawnSync(process.execPath,args,{cwd:directory,encoding:'utf8'});
    assert.equal(result.status,0,result.stderr);
    const target=path.join(directory,'content/experimentrecord/test-project');
    assert.equal(readFileSync(path.join(target,'data.csv'),'utf8'),'iteration,result\n1,3\n2,5');
    assert.ok(existsSync(path.join(target,'config.yaml')));
    assert.deepEqual(JSON.parse(readFileSync(path.join(target,'experiments.yaml'),'utf8')),manifest);
    assert.equal(existsSync(path.join(target,'unreferenced.txt')),false);
  } finally { rmSync(directory,{recursive:true,force:true}); }
});
