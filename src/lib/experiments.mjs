import { readFileSync, existsSync, realpathSync, statSync } from 'node:fs';
import path from 'node:path';
import { parse } from 'yaml';
import { mediaUrl, basePath } from './content-tools.mjs';
import { parseCsv, metricPoints } from './experiment-data.mjs';

export const experimentKinds = ['reproduction', 'improvement'];
export const experimentStatuses = ['planned', 'running', 'completed', 'blocked'];
const requiredText = (value, name) => { if (typeof value !== 'string' || !value.trim()) throw new Error(`Missing ${name}`); return value; };
const stableId = value => { if (typeof value !== 'string' || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value)) throw new Error(`Invalid stable id: ${value}`); return value; };
function numbered(items, name) {
  const ids = new Set(), numbers = new Set();
  for (const item of items) {
    stableId(item.id);
    if (ids.has(item.id)) throw new Error(`Duplicate ${name} id: ${item.id}`);
    if (!Number.isInteger(item.number) || item.number < 1 || numbers.has(item.number)) throw new Error(`Invalid or duplicate ${name} number: ${item.number}`);
    ids.add(item.id); numbers.add(item.number);
  }
}

export function projectAsset(directory, relative) {
  if (typeof relative !== 'string' || !relative || /[\\?#\x00-\x1f]/.test(relative) || path.isAbsolute(relative) || relative.split('/').some(part => part === '..' || part === '') || /^[a-z][\w+.-]*:/i.test(relative)) throw new Error(`Invalid project asset path: ${relative}`);
  const root = realpathSync(directory), file = path.resolve(directory, relative);
  if (!existsSync(file)) throw new Error(`Missing attachment: ${relative}`);
  const resolved = realpathSync(file);
  if (!resolved.startsWith(root + path.sep) || !statSync(resolved).isFile()) throw new Error(`Attachment must stay inside project directory: ${relative}`);
  return { file: resolved, relative };
}

export function readExperimentProject(entry, base = '/') {
  const slug = entry.slug ?? entry.id;
  const directory = path.dirname(entry.file ?? path.resolve('content/experimentrecord',slug,'index.md'));
  const manifestFile = path.join(directory,'experiments.yaml');
  const attachments = new Map();
  const asset = relative => {
    const record = projectAsset(directory,relative);
    const result = {...record,url:mediaUrl('experimentrecord',slug,relative,base)};
    attachments.set(relative,result); return result.url;
  };
  const axis = (source, isX = false) => {
    if (!source || typeof source !== 'object') throw new Error('Missing axis mapping');
    requiredText(source.label,'axis label'); requiredText(source.quantity,'axis quantity');
    if (typeof source.unit !== 'string') throw new Error('Axis unit must be a string (empty for unitless)');
    if ([source.column !== undefined,source.columnIndex !== undefined,source.rowNumber === true].filter(Boolean).length !== 1 || (!isX && source.rowNumber)) throw new Error('Select exactly one column mapping');
    return {...source};
  };
  try {
    const manifest = existsSync(manifestFile) ? parse(readFileSync(manifestFile,'utf8')) : {experiments:[]};
    if (!Array.isArray(manifest?.experiments)) throw new Error('experiments.yaml must contain an experiments array');
    numbered(manifest.experiments,'experiment');
    const experiments = manifest.experiments.map(run => {
      requiredText(run.title,'experiment title');
      if (!experimentKinds.includes(run.kind)) throw new Error(`Invalid experiment kind: ${run.kind}`);
      if (!experimentStatuses.includes(run.status)) throw new Error(`Invalid experiment status: ${run.status}`);
      if (typeof run.date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(run.date) || Number.isNaN(Date.parse(run.date)) || new Date(run.date).toISOString().slice(0,10) !== run.date) throw new Error('Experiment date must be a quoted YYYY-MM-DD');
      const csvs = run.csvs ?? [];
      if (!Array.isArray(csvs)) throw new Error('csvs must be an array');
      numbered(csvs,'CSV');
      const normalized = csvs.map(csv => {
        requiredText(csv.title,'CSV title');
        const url = asset(csv.path);
        try {
          if (!Array.isArray(csv.metrics) || !csv.metrics.length) throw new Error('CSV must declare at least one metric');
          const metricIds = new Set();
          const metrics = csv.metrics.map(metric => {
            stableId(metric.id);
            if (metricIds.has(metric.id)) throw new Error(`Duplicate metric id: ${metric.id}`);
            metricIds.add(metric.id); return {...axis(metric),id:metric.id};
          });
          const normalizedCsv = {...csv,x:axis(csv.x,true),metrics,url};
          const parsed = parseCsv(readFileSync(attachments.get(csv.path).file,'utf8'),normalizedCsv);
          metrics.forEach(metric => metricPoints(parsed,normalizedCsv,metric));
          return normalizedCsv;
        } catch(error) { throw new Error(`${csv.path}: ${error.message}`); }
      });
      const videos = (run.videos ?? []).map(video => {
        requiredText(video.title,'video title'); requiredText(video.src,'video src');
        const external = /^https?:\/\//.test(video.src);
        if (external) new URL(video.src);
        return {...video,url:external ? video.src : asset(video.src),posterUrl:video.poster ? asset(video.poster) : undefined};
      });
      return {...run,csvs:normalized,videos,configUrl:run.config ? asset(run.config) : undefined};
    });
    return {id:entry.data.id,slug,title:entry.data.title,demo:!!entry.data.demo,url:`${basePath(base)}experimentrecord/${slug}/`,experiments,attachments:[...attachments.values()]};
  } catch(error) { throw new Error(`experimentRecord ${slug}: ${error.message}`); }
}

export function readExperimentProjects(entries, base = '/') {
  return entries.filter(entry => entry.collection === 'experimentrecord' && !entry.data.draft).map(entry => readExperimentProject(entry,base));
}

export function experimentSearchText(project) {
  return project.experiments.map(run => [run.title,run.id,run.number,run.kind,run.status,run.summary,
    ...run.csvs.flatMap(csv => [csv.title,csv.id,csv.number,...csv.metrics.map(metric => metric.label)])].join(' ')).join('\n');
}
