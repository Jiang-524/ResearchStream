import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, writeFileSync, rmSync, symlinkSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { readExperimentProject, readExperimentProjects } from '../src/lib/experiments.mjs';

function fixture(run) {
  const dir = mkdtempSync(path.join(os.tmpdir(),'rs-experiment-'));
  writeFileSync(path.join(dir,'data.csv'),'round,value\n1,4\n2,5');
  const entry = {collection:'experimentrecord',slug:'project-a',id:'project-a',file:path.join(dir,'index.md'),data:{id:'a',title:'A',experimentKinds:['reproduction'],status:'running'},body:''};
  const manifest = {experiments:[{id:'run-a',number:3,title:'Trial',date:'2026-10-12',kind:'reproduction',status:'completed',csvs:[{id:'eval',number:2,title:'Eval',path:'data.csv',x:{column:'round',label:'Rounds',quantity:'round',unit:'count'},metrics:[{id:'value',column:'value',label:'Value',quantity:'value',unit:'points'}]}]}]};
  try { run({dir,entry,manifest,save:()=>writeFileSync(path.join(dir,'experiments.yaml'),JSON.stringify(manifest))}); } finally {rmSync(dir,{recursive:true,force:true});}
}
test('manifest publishes stable numbers and base-aware attachment URLs',()=>fixture(({entry,manifest,save})=>{
  save(); const project=readExperimentProject(entry,'/ResearchStream/');
  assert.equal(project.experiments[0].number,3);
  assert.equal(project.experiments[0].csvs[0].number,2);
  assert.equal(project.experiments[0].csvs[0].url,'/ResearchStream/media/experimentrecord/project-a/data.csv');
  assert.equal(project.id,'a');
  assert.equal(project.attachments.length,1);
}));
test('duplicate numbers and missing columns fail with source context',()=>fixture(({entry,manifest,save})=>{
  manifest.experiments.push({...manifest.experiments[0],id:'another'});save();
  assert.throws(()=>readExperimentProject(entry),/number/i);
  manifest.experiments.pop();manifest.experiments[0].csvs[0].x.column='absent';save();
  assert.throws(()=>readExperimentProject(entry),/data.csv.*column/i);
}));
test('attachments cannot escape the project directory, including symlinks',()=>fixture(({entry,manifest,dir,save})=>{
  manifest.experiments[0].csvs[0].path='../private.csv';save();
  assert.throws(()=>readExperimentProject(entry),/path|directory/i);
  symlinkSync('/etc/hosts',path.join(dir,'escape.csv'));
  manifest.experiments[0].csvs[0].path='escape.csv';save();
  assert.throws(()=>readExperimentProject(entry),/directory/i);
}));
test('draft projects are absent from public comparison sources',()=>fixture(({entry,save})=>{
  save();entry.data.draft=true;
  assert.deepEqual(readExperimentProjects([entry]),[]);
}));
