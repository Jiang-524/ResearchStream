import { readFileSync, writeFileSync, existsSync, mkdirSync, copyFileSync, readdirSync } from 'node:fs';
import { createHash } from 'node:crypto';
import path from 'node:path';
import matter from 'gray-matter';
import { validateMetadata, markdownImages } from '../src/lib/content-tools.mjs';
import { readSourceEntries } from './source-content.mjs';

const args = process.argv.slice(2);
const option = name => { const index = args.indexOf(name); return index < 0 ? undefined : args[index + 1]; };
const source = path.resolve(option('--source') || 'inbox/paperinsight');
const single = option('--file');
const dryRun = args.includes('--dry-run');
const plain = text => text.replace(/\[([^\]]+)\]\([^)]*\)/g, '$1').replace(/[*_`]/g, '').trim();

function convert(file) {
  const raw = readFileSync(file, 'utf8');
  const { data, content } = matter(raw);
  const filename = path.basename(file);
  const date = data.date || filename.match(/^\d{4}-\d{2}-\d{2}/)?.[0];
  const heading = content.match(/^#\s+(.+)$/m);
  const summary = content.split('\n').find(line => /今日一句话判断/.test(line));
  const abstract = data.abstract || (summary && plain(summary.replace(/^.*?今日一句话判断[*：:\s]*/, '')).split(/(?<=。)/)[0]);
  const id = data.id || `paperinsight-${date}-${createHash('sha256').update(filename).digest('hex').slice(0, 8)}`;
  const slug = id.toLowerCase().replace(/[^a-z0-9-]/g, '-');
  const metadata = validateMetadata({
    id, title: plain(data.title || heading?.[1]?.replace(/^\d{4}-\d{2}-\d{2}[｜|\s]+/, '') || ''), abstract, date,
    lang: 'zh', topic: 'Robotics', tags: ['robot-manipulation', 'paper-insight'],
    series: 'Robot Manipulation Daily', ...data,
    source: filename, sourceHash: createHash('sha256').update(raw).digest('hex'),
  });
  let body = content;
  if (heading && content.trimStart().startsWith(heading[0])) body = content.replace(heading[0], '').trimStart();
  // Work exports sometimes use TeX delimiters. Keep fenced/inline code untouched.
  body = body.split(/(```[\s\S]*?```|~~~[\s\S]*?~~~|`[^`\n]*`)/g).map((part, index) => index % 2 ? part : part.replace(/\\\[\s*([\s\S]*?)\s*\\\]/g, (_, formula) => `\n$$\n${formula}\n$$\n`).replace(/\\\((.*?)\\\)/g, (_, formula) => `$${formula}$`)).join('');
  const assets = markdownImages(body).filter(image => !/^(https?:|data:|\/)/.test(image)).map(image => {
    const relative = image.replace(/^\.\//, '');
    if (relative.split('/').includes('..')) throw new Error(`${filename}: images must stay in the source directory`);
    const assetFile = path.resolve(path.dirname(file), relative);
    return { file: assetFile, relative };
  });
  return { metadata, slug, body, assets };
}

try {
  let files = single ? [path.resolve(single)] : readdirSync(source).filter(name => name.endsWith('.md')).sort().map(name => path.join(source, name));
  if (args.includes('--latest')) files = files.slice(-1);
  const entries = readSourceEntries();
  const planned = [];
  let unchanged = 0;
  for (const file of files) {
    const item = convert(file);
    const destination = path.resolve('content/paperpost', item.slug);
    const prior = entries.find(entry => entry.data.id === item.metadata.id);
    if (prior) {
      if (prior.data.sourceHash === item.metadata.sourceHash) { unchanged++; continue; }
      if (!args.includes('--update') || path.dirname(prior.file) !== destination || prior.data.source !== path.basename(file)) throw new Error(`${path.basename(file)}: existing article differs; review it and use --update explicitly.`);
    } else if (existsSync(destination) || planned.some(entry => entry.destination === destination || entry.metadata.id === item.metadata.id)) throw new Error(`Duplicate destination or id: ${item.slug}`);
    for (const asset of item.assets) if (!existsSync(asset.file)) throw new Error(`Missing image: ${asset.file}`);
    planned.push({ ...item, destination });
  }
  // Validate the entire batch before writing any article.
  for (const item of planned) {
    if (!dryRun) {
      mkdirSync(item.destination, { recursive: true });
      writeFileSync(path.join(item.destination, 'index.md'), matter.stringify(item.body, item.metadata));
      for (const asset of item.assets) { const target = path.join(item.destination, asset.relative); mkdirSync(path.dirname(target), { recursive: true }); copyFileSync(asset.file, target); }
    }
    console.log(`${dryRun ? 'Validated' : 'Imported'}: ${item.metadata.title} → content/paperpost/${item.slug}/`);
  }
  console.log(`${planned.length} ${dryRun ? 'ready' : 'imported'}, ${unchanged} unchanged.`);
} catch (error) { console.error(error.message); process.exitCode = 1; }
