interface RecordData { key: string; title: string; abstract: string; body: string; tags: string[]; authors: string[]; paper: string; }
const archive = document.querySelector<HTMLElement>('[data-archive]');
if (archive) {
  const input = archive.querySelector<HTMLInputElement>('#query')!;
  const selects = [...archive.querySelectorAll<HTMLSelectElement>('select[name]')];
  const items = [...archive.querySelectorAll<HTMLElement>('[data-key]')];
  const list = archive.querySelector<HTMLElement>('.result-list')!;
  const status = archive.querySelector<HTMLElement>('#search-status')!;
  const base = document.body.dataset.base!;
  let searchEngine: any;
  let records: RecordData[];
  let sequence = 0;
  let timer: ReturnType<typeof setTimeout>;
  const message = (en: string, zh: string) => document.documentElement.dataset.lang === 'en' ? en : zh;
  const parameters = () => {
    const params = new URLSearchParams();
    if (input.value.trim()) params.set('q', input.value.trim());
    selects.forEach(select => { if (select.value && !(select.name === 'sort' && select.value === 'relevance')) params.set(select.name, select.value); });
    return params;
  };
  function restore() {
    const params = new URLSearchParams(location.search);
    input.value = params.get('q') || '';
    selects.forEach(select => { select.value = params.get(select.name) || (select.name === 'sort' ? 'relevance' : ''); });
  }
  function safeExcerpt(target: HTMLElement, excerpt: string) {
    // Only Pagefind's mark tags become elements; all other text stays literal.
    target.replaceChildren();
    excerpt.split(/(<mark>|<\/mark>)/g).reduce<HTMLElement>((parent, text) => {
      if (text === '<mark>') { const mark = document.createElement('mark'); target.append(mark); return mark; }
      if (text === '</mark>') return target;
      parent.append(document.createTextNode(text.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&').replace(/&quot;/g, '"'))); return parent;
    }, target);
  }
  async function run(updateUrl = true) {
    const request = ++sequence;
    const params = parameters();
    if (updateUrl) history.replaceState(null, '', location.pathname + (params.size ? '?' + params.toString() : ''));
    status.hidden = true;
    let matches: Map<string, { rank: number; excerpt: string }> | null = null;
    const query = params.get('q');
    if (query) {
      status.textContent = message('Searching…', '正在搜索…'); status.hidden = false;
      try {
        if (archive!.dataset.dev === 'true') {
          records ||= await fetch(`${base}entries.json`).then(r => r.json());
          const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
          const results = records.filter(r => terms.every(term => [r.title,r.abstract,r.body,r.tags.join(' '),r.authors.join(' '),r.paper].join(' ').toLowerCase().includes(term)));
          matches = new Map(results.map((r, rank) => [r.key, { rank, excerpt: '' }]));
        } else {
          searchEngine ||= await import(/* @vite-ignore */ `${base}pagefind/pagefind.js`);
          await searchEngine.options({ baseUrl: base });
          const found = await searchEngine.search(query);
          const data = await Promise.all(found.results.map((r: any) => r.data()));
          matches = new Map(data.map((r: any, rank: number) => [r.meta.key, { rank, excerpt: r.excerpt }]));
        }
        if (request !== sequence) return;
        status.hidden = true;
      } catch {
        if (request !== sequence) return;
        status.textContent = message('Search is unavailable. If offline, reconnect to load the index. Filters remain available.', '搜索暂不可用；若处于离线状态，请联网加载索引。仍可使用筛选。'); status.hidden = false;
        matches = new Map();
      }
    }
    if (request !== sequence) return;
    let count = 0;
    const ordered = [...items].sort((a,b) => {
      if (params.get('sort') === 'oldest') return a.dataset.date!.localeCompare(b.dataset.date!);
      if (matches && !params.get('sort')) return (matches.get(a.dataset.key!)?.rank ?? Infinity) - (matches.get(b.dataset.key!)?.rank ?? Infinity);
      return b.dataset.date!.localeCompare(a.dataset.date!);
    });
    for (const item of ordered) {
      const match = matches?.get(item.dataset.key!);
      const visible = (!matches || !!match) && ['topic','month','lang','section','series','tag'].every(filter => {
        const selected = params.get(filter); if (!selected) return true;
        if (filter === 'month') return item.dataset.date!.startsWith(selected);
        if (filter === 'tag') return JSON.parse(item.dataset.tags!).includes(selected);
        return item.dataset[filter] === selected;
      });
      item.hidden = !visible; if (visible) count++;
      const excerpt = item.querySelector<HTMLElement>('.search-excerpt')!;
      excerpt.hidden = !visible || !match?.excerpt;
      if (match?.excerpt) safeExcerpt(excerpt, match.excerpt);
      list.append(item);
    }
    archive!.querySelector('#result-count')!.textContent = String(count);
    (archive!.querySelector('#no-results') as HTMLElement).hidden = count > 0 || !status.hidden;
    archive!.querySelectorAll<HTMLElement>('[data-topic]').forEach(button => button.classList.toggle('selected', button.dataset.topic === (params.get('topic') || '')));
  }
  archive.querySelector('form')?.addEventListener('submit', event => { event.preventDefault(); clearTimeout(timer); run(); });
  input.addEventListener('input', () => { clearTimeout(timer); timer = setTimeout(() => run(), 180); });
  selects.forEach(select => select.addEventListener('change', () => run()));
  archive.querySelectorAll<HTMLButtonElement>('button[data-topic]').forEach(button => button.addEventListener('click', () => { archive.querySelector<HTMLSelectElement>('[name=topic]')!.value = button.dataset.topic || ''; run(); }));
  archive.querySelectorAll('.clear-filters').forEach(button => button.addEventListener('click', () => { input.value = ''; selects.forEach(select => select.value = select.name === 'sort' ? 'relevance' : ''); run(); }));
  addEventListener('popstate', () => { restore(); run(false); });
  document.addEventListener('languagechange', () => { if (!status.hidden) run(false); });
  restore(); run(false);
}
