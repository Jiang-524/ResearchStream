import { allEntries, entryUrl, base } from '../lib/content';
import { readExperimentProject, experimentSearchText } from '../lib/experiments.mjs';
export async function GET() {
  const entries = await allEntries();
  return Response.json(entries.map(e => ({ key: `${e.collection}/${e.id}`, url: entryUrl(e), title: e.data.title, abstract: e.data.abstract, body: (e.body || '') + (e.collection === 'experimentrecord' ? '\n' + experimentSearchText(readExperimentProject(e,base)) : ''), tags: [...e.data.tags,...(e.data.experimentKinds || [])], authors: e.data.paper?.authors || [], paper: e.data.paper?.url || '', lang: e.data.lang })));
}
