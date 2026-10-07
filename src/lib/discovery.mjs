// Content discovery helpers shared by the homepage and series pages.
export function recommend(entries, count = 4, previous = [], random = Math.random) {
  const shuffle = list => {
    const result = [...list];
    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(random() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  };
  const seen = new Set(previous);
  return [...shuffle(entries.filter(e => !seen.has(e.id))), ...shuffle(entries.filter(e => seen.has(e.id)))].slice(0, count);
}

export function seriesSlug(name) {
  // Stable suffix keeps names such as “A B” and “A-B” distinct.
  let hash = 2166136261;
  for (const char of name) hash = Math.imul(hash ^ char.codePointAt(0), 16777619);
  return `${name.normalize('NFKC').toLowerCase().replace(/[^\p{L}\p{N}]+/gu, '-').replace(/^-|-$/g, '') || 'series'}-${(hash >>> 0).toString(36)}`;
}

export function groupSeries(entries) {
  const names = [...new Set(entries.filter(e => !e.data.draft).map(e => e.data.series).filter(Boolean))];
  return names.sort((a,b) => a.localeCompare(b)).map(name => ({
    name, slug: seriesSlug(name),
    entries: entries.filter(e => !e.data.draft && e.data.series === name).sort((a,b) =>
      (a.data.order ?? Infinity) - (b.data.order ?? Infinity) || String(a.data.date).localeCompare(String(b.data.date)) || a.id.localeCompare(b.id)),
  }));
}
