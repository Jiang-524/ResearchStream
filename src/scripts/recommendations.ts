import { recommend } from '../lib/discovery.mjs';

const track = document.querySelector<HTMLElement>('#recent-track');
const template = document.querySelector<HTMLTemplateElement>('#recommendation-pool');
if (track && template) {
  const pool = [...template.content.querySelectorAll<HTMLAnchorElement>('.entry-card')].map(node => ({ id: node.href, node }));
  const refresh = document.querySelector<HTMLButtonElement>('#refresh-recommendations')!;
  const pause = document.querySelector<HTMLButtonElement>('#pause-recommendations')!;
  const buttons = [...document.querySelectorAll<HTMLButtonElement>('[data-scroll]')];
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  let previous: string[] = [], paused = false, hovered = false, focused = false;
  let direction = 1, position = 0, lastFrame = 0, resumeAt = 0;
  const label = () => {
    const stopped = paused || reducedMotion.matches;
    pause.textContent = document.documentElement.dataset.lang === 'en' ? (stopped ? 'Paused' : 'Pause') : (stopped ? '已暂停' : '暂停');
    pause.setAttribute('aria-pressed', String(stopped));
    pause.disabled = reducedMotion.matches || pool.length < 2;
  };
  const update = () => buttons.forEach(button => {
    button.disabled = button.dataset.scroll === '-1' ? track.scrollLeft <= 2 : track.scrollLeft + track.clientWidth >= track.scrollWidth - 2;
  });
  function shuffle(announce = false) {
    const batch = recommend(pool, 4, previous) as typeof pool;
    previous = batch.map(item => item.id);
    track!.replaceChildren(...batch.map(item => item.node.cloneNode(true)));
    const lang = document.documentElement.dataset.lang || 'zh';
    track!.querySelectorAll<HTMLElement>('[data-en][data-zh]').forEach(node => node.textContent = node.dataset[lang] || '');
    track!.scrollLeft = 0; position = 0; direction = 1; resumeAt = performance.now() + 1800;
    if (announce) document.querySelector('#recommendation-status')!.textContent = lang === 'en' ? 'New reading recommendations.' : '已更换推荐文章。';
    update();
  }
  refresh.disabled = pool.length < 2;
  refresh.addEventListener('click', () => shuffle(true));
  pause.addEventListener('click', () => { paused = !paused; label(); });
  document.addEventListener('languagechange', label);
  reducedMotion.addEventListener('change', label);
  track.addEventListener('pointerenter', () => hovered = true);
  track.addEventListener('pointerleave', () => hovered = false);
  track.addEventListener('focusin', () => focused = true);
  track.addEventListener('focusout', () => { focused = track.contains(document.activeElement); });
  for (const type of ['pointerdown', 'wheel', 'keydown']) track.addEventListener(type, () => { resumeAt = performance.now() + 6000; }, { passive: true });
  buttons.forEach(button => button.addEventListener('click', () => {
    resumeAt = performance.now() + 6000;
    track.scrollBy({ left: Number(button.dataset.scroll) * track.clientWidth * .85, behavior: reducedMotion.matches ? 'instant' : 'smooth' });
  }));
  track.addEventListener('scroll', update, { passive: true });
  new ResizeObserver(update).observe(track);
  // A slow back-and-forth drift avoids duplicating focusable cards or snapping at the end.
  function tick(now: number) {
    const elapsed = Math.min(now - lastFrame, 50); lastFrame = now;
    const max = track!.scrollWidth - track!.clientWidth;
    if (!paused && !hovered && !focused && !document.hidden && !reducedMotion.matches && now >= resumeAt && max > 1) {
      position = Math.max(0, Math.min(max, position + direction * elapsed * .018));
      track!.scrollLeft = position;
      if (position >= max || position <= 0) { direction *= -1; resumeAt = now + 1600; }
    } else position = track!.scrollLeft;
    requestAnimationFrame(tick);
  }
  shuffle(); label(); requestAnimationFrame(tick);
}
