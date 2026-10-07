import { getCollection, type CollectionEntry } from 'astro:content';
import { assertUniqueIds, publishedEntries, firstContentImage, mediaUrl, readingMinutes } from './content-tools.mjs';
export type Entry = CollectionEntry<'paperpost' | 'learningwall' | 'misc'>;
export const base = import.meta.env.BASE_URL.replace(/\/$/, '') + '/';
export const url = (path = '') => base + path.replace(/^\//, '');
export const sectionNames = { paperpost: 'PaperPost', learningwall: 'LearningWall', misc: 'Misc.' };
export const entryUrl = (entry: Entry) => url(`${entry.collection}/${entry.id}/`);
export const thumbnail = (entry: Entry) => {
  const image = firstContentImage(entry.body || '');
  return image ? mediaUrl(entry.collection, entry.id, image, base) : null;
};
export const minutes = (entry: Entry) => readingMinutes(entry.body || '');
export async function allEntries(): Promise<Entry[]> {
  const entries = (await Promise.all([getCollection('paperpost'), getCollection('learningwall'), getCollection('misc')])).flat();
  assertUniqueIds(entries);
  return publishedEntries(entries);
}
