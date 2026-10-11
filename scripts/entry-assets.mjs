import path from 'node:path';
import { markdownImages, mediaUrl } from '../src/lib/content-tools.mjs';
import { readExperimentProject, projectAsset } from '../src/lib/experiments.mjs';

export function entryAssets(entry, base = '/') {
  const directory = path.dirname(entry.file);
  const images = markdownImages(entry.body).filter(src=>!/^(https?:|data:|\/)/.test(src)).map(relative=>({
    ...projectAsset(directory,relative),url:mediaUrl(entry.collection,entry.slug,relative,base),
  }));
  const extra = entry.collection==='experimentrecord' ? readExperimentProject(entry,base).attachments : [];
  return [...new Map([...images,...extra].map(asset=>[asset.url,asset])).values()];
}
