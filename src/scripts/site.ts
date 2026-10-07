const root = document.documentElement;
const languageButton = document.querySelector<HTMLButtonElement>('#language-toggle');
const themeButton = document.querySelector<HTMLButtonElement>('#theme-toggle');
const media = matchMedia('(prefers-color-scheme: dark)');
let preference = 'system';
try { preference = localStorage.getItem('rs-theme') || 'system'; } catch {}
function applyTheme() {
  root.dataset.theme = preference === 'system' ? (media.matches ? 'dark' : 'light') : preference;
  themeButton?.setAttribute('aria-label', `Theme: ${preference}. Click: light / dark / system · 主题切换`);
  const auto = document.querySelector<HTMLElement>('.theme-auto');
  if (auto) auto.hidden = preference !== 'system';
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', root.dataset.theme === 'dark' ? '#1a1816' : '#fefaf5');
}
function applyLanguage() {
  const lang = root.dataset.lang || 'zh';
  root.lang = lang === 'zh' ? 'zh-CN' : 'en';
  document.querySelectorAll<HTMLElement>('[data-en][data-zh]').forEach(el => { el.textContent = el.dataset[lang] || ''; });
  document.querySelectorAll<HTMLInputElement>('[data-placeholder-en]').forEach(el => { el.placeholder = el.dataset[lang === 'en' ? 'placeholderEn' : 'placeholderZh'] || ''; });
  document.dispatchEvent(new Event('languagechange'));
}
themeButton?.addEventListener('click', () => {
  preference = preference === 'system' ? 'light' : preference === 'light' ? 'dark' : 'system';
  try { localStorage.setItem('rs-theme', preference); } catch {}
  applyTheme();
});
media.addEventListener('change', applyTheme);
languageButton?.addEventListener('click', () => {
  const lang = root.dataset.lang === 'en' ? 'zh' : 'en';
  root.dataset.lang = lang;
  try { localStorage.setItem('rs-language', lang); } catch {}
  const translation = document.querySelector<HTMLAnchorElement>(`[data-translation="${lang}"]`);
  if (translation) { location.href = translation.href; return; }
  applyLanguage();
});
applyTheme(); applyLanguage();

import './recommendations';

document.querySelectorAll<HTMLPreElement>('.prose pre').forEach(pre => {
  const button = document.createElement('button'); button.type = 'button'; button.className = 'copy-code';
  const label = () => { button.textContent = root.dataset.lang === 'zh' ? '复制' : 'Copy'; };
  label(); document.addEventListener('languagechange', label);
  button.addEventListener('click', async () => {
    try { await navigator.clipboard.writeText(pre.querySelector('code')?.textContent || ''); button.textContent = root.dataset.lang === 'zh' ? '已复制' : 'Copied'; }
    catch { button.textContent = root.dataset.lang === 'zh' ? '请手动选择复制' : 'Select to copy'; }
    setTimeout(label, 1800);
  });
  pre.append(button);
});
document.querySelectorAll('.prose table').forEach(table => { const wrapper = document.createElement('div'); wrapper.className = 'table-wrap'; wrapper.tabIndex = 0; table.before(wrapper); wrapper.append(table); });

const article = document.querySelector<HTMLElement>('[data-article]');
if (article) {
  const headings = [...article.querySelectorAll<HTMLElement>('h2[id], h3[id]')];
  const tocLinks = [...document.querySelectorAll<HTMLAnchorElement>('.desktop-toc nav a')];
  const progress = document.querySelector<HTMLElement>('#reading-progress');
  const update = () => {
    const current = [...headings].reverse().find(h => h.getBoundingClientRect().top <= 160) || headings[0];
    tocLinks.forEach(a => a.classList.toggle('selected', decodeURIComponent(a.hash.slice(1)) === current?.id));
    if (progress) progress.style.width = `${Math.min(100, Math.max(0, (scrollY - article.offsetTop) / Math.max(1, article.offsetHeight - innerHeight) * 100))}%`;
  };
  addEventListener('scroll', update, { passive: true }); update();
}
document.querySelectorAll('.archive-nav a').forEach(link => link.addEventListener('click', () => { document.querySelectorAll('.archive-nav a').forEach(a => a.classList.toggle('selected', a === link)); }));
addEventListener('keydown', event => {
  if (event.key === '/' && !(event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement || event.target instanceof HTMLSelectElement)) {
    event.preventDefault();
    const input = document.querySelector<HTMLInputElement>('#query');
    if (input) input.focus(); else location.href = `${document.body.dataset.base}search/`;
  }
});
function updateNetworkStatus() { const status = document.querySelector<HTMLElement>('#offline-status'); if (status) status.hidden = navigator.onLine; }
addEventListener('online', updateNetworkStatus); addEventListener('offline', updateNetworkStatus); updateNetworkStatus();
if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  navigator.serviceWorker.register(`${document.body.dataset.base}sw.js`, { scope: document.body.dataset.base }).then(async () => {
    const registration = await navigator.serviceWorker.ready;
    registration.active?.postMessage({ type: 'CACHE_READING', urls: [location.href, ...[...document.querySelectorAll<HTMLImageElement>('.prose img')].map(img => img.src)] });
  }).catch(error => console.warn('Offline cache unavailable:', error));
}
