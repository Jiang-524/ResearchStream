import { allEntries, entryUrl } from '../lib/content';
export async function GET() {
  const entries = await allEntries();
  return Response.json(entries.map(e => ({ key: `${e.collection}/${e.id}`, url: entryUrl(e), title: e.data.title, abstract: e.data.abstract, body: e.body || '', tags: e.data.tags, authors: e.data.paper?.authors || [], paper: e.data.paper?.url || '', lang: e.data.lang })));
}
