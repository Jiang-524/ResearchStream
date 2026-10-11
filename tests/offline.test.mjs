import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

test('worker update refreshes saved published articles and excludes removed drafts', async () => {
  const script = readFileSync('dist/sw.js', 'utf8');
  const cacheName = JSON.parse(script.match(/const CACHE = ("[^"]+")/)[1]);
  const prefix = JSON.parse(script.match(/const PREFIX = ("[^"]+")/)[1]);
  const base = JSON.parse(script.match(/const BASE = ("[^"]+")/)[1]);
  const origin = 'http://localhost';
  const article = origin + base + 'learningwall/gradient-descent/';
  const secret = origin + base + 'learningwall/removed-draft/';
  const normalize = request => new URL(typeof request === 'string' ? request : request.url, origin).href;
  const stores = new Map();
  const caches = {
    keys: async () => [...stores.keys()],
    delete: async name => stores.delete(name),
    open: async name => {
      if (!stores.has(name)) stores.set(name, new Map());
      const store = stores.get(name);
      return {
        keys: async () => [...store.keys()].map(url => new Request(url)),
        match: async request => store.get(normalize(request))?.clone(),
        put: async (request, response) => store.set(normalize(request), response.clone()),
        addAll: async urls => { for (const url of urls) store.set(normalize(url), new Response(`fresh ${normalize(url)}`)); },
      };
    },
  };
  const old = await caches.open(prefix + 'old');
  await old.put(article, new Response('old published content'));
  await old.put(secret, new Response('old private content'));
  const handlers = {};
  const self = { location: { origin }, clients: { claim: async () => {} }, skipWaiting: async () => {}, addEventListener: (type, handler) => handlers[type] = handler };
  let offline = false;
  vm.runInNewContext(script, { self, caches, URL, Response, fetch: async url => { if (offline) throw new Error('offline'); return new Response(`fresh ${normalize(url)}`); } });
  for (const event of ['install', 'activate']) { let done; handlers[event]({ waitUntil: task => done = task }); await done; }
  const updated = await caches.open(cacheName);
  const saved = await updated.match(article);
  assert.ok(saved, 'previously saved article must survive a new deployment');
  assert.equal(await saved.text(), `fresh ${article}`);
  assert.equal(await updated.match(secret), undefined, 'removed/draft content must not be migrated');
  const csvUrl=origin+base+'media/experimentrecord/curve-lab/runs/baseline/evaluation.csv';
  let csvResponse;
  handlers.fetch({request:new Request(csvUrl),respondWith:task=>csvResponse=task});
  assert.equal((await csvResponse).status,200);
  let videoIntercepted=false;
  handlers.fetch({request:new Request(origin+base+'media/experimentrecord/curve-lab/videos/demo.mp4'),respondWith:()=>videoIntercepted=true});
  assert.equal(videoIntercepted,false,'video requests must use browser networking, not cache');
  let rangeIntercepted=false;
  handlers.fetch({request:new Request(csvUrl,{headers:{Range:'bytes=0-10'}}),respondWith:()=>rangeIntercepted=true});
  assert.equal(rangeIntercepted,false,'partial responses must not corrupt full-file caches');
  offline = true;
  handlers.fetch({request:new Request(csvUrl),respondWith:task=>csvResponse=task});
  assert.equal((await csvResponse).status,200,'loaded CSV must remain readable offline');
  let response;
  handlers.fetch({ request: new Request(origin + base + 'pagefind/pagefind-entry.json?ts=123456'), respondWith: task => response = task });
  assert.equal((await response).status, 200, 'Pagefind timestamp queries must use the precached index offline');
});
