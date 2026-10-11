# experimentRecord verification

Implementation date: 2026-10-12. Development branch: `agent_dev`. This report concerns the implementation and local production preview, not a deployment of `main`.

## Automated checks

- `pnpm check`: 49 files, 0 errors, 0 warnings, 0 hints.
- `BASE_PATH=/ResearchStream/ SITE_URL=https://jiang-524.github.io pnpm build`: 28 pages and 15 indexed entries.
- `pnpm test`: 28 passing tests, 0 failures.
- `git diff --check`: no whitespace errors.
- Covered column names/indices, duplicate headers, logical CSV records, missing values, EMA, different axis semantics/units, six 100k-row parsing/smoothing cases, stable numbering, confined attachments, draft exclusion, declared-only import, updated month filtering, and existing article/daily import behavior.
- Service-worker behavioral test verifies loaded CSV retrieval offline and that video/Range requests bypass the cache. Browser network-disconnection emulation was not available; no claim of a separate physical disconnect test.

## Browser checks

Production preview under `/ResearchStream/`, desktop and 390 × 844 viewport:

- Notebook/results tabs, shared navigation, Series, metadata search and combined type/status/month filters.
- Two default curves; adding another project's curve produced 3 curves / 1 axis group. Adding elapsed time produced 4 curves / 2 axis groups.
- No-header CSV 02 selected correctly; individual hide/remove and clear worked.
- EMA 0.80 with original overlay, light/dark themes, Chinese/English controls, expanded mobile chart.
- Temporary synthetic project with six independent 100,000-point CSVs: all six loaded and displayed; EMA, expand, wheel zoom, tooltip and reset to the complete x range worked. This fixture was removed before final build/commit. Node tests retain the repeatable numeric case.
- Dense curves without missing Y use ECharts min/max display sampling, explicitly disclosed below the chart. CSV downloads and EMA calculation use all points. Curves with gaps are not sampled so gaps remain visible.
- PNG generation produced a Blob-backed download link. The embedded browser did not expose a download event, so filesystem delivery was not independently confirmed. A persistent download link remains available after export. TODO: confirm the final save dialog/file in the user's ordinary browser.
- The initial H.264 demonstration caused the embedded browser page to crash during playback. The committed WebM demonstration loaded and played to `currentTime = duration = 3`, `ended = true`, without a media error. This does not establish universal codec compatibility for future uploads.

## Independent review

A separate reviewer checked the change against the approved design and found three P2 issues. All were corrected and re-reviewed:

1. Clear during loading could start a later default curve: initialization now checks its original selection epoch before each default addition.
2. Matching display names could link unrelated legend entries: internal chart identities now use full project/run/CSV/metric keys, duplicate project labels show their ID, and visibility is controlled by individual checkboxes.
3. Month options used creation dates while rows used updated dates: both now use the same effective project date.

README and copyable templates document method diagrams, every actual operation and its reason, immutable experiment/CSV numbering, custom column mappings, video/offline boundaries, and local AI publication. Demonstrations are explicitly synthetic. No cloud automation configuration was changed.
