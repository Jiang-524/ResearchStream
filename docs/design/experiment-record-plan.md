# experimentRecord Implementation Plan

> **For agentic workers:** Use superpowers:executing-plans task by task. The user approved the design and requested implementation on 2026-10-12; execute inline, with a final independent review.

**Goal:** Add method notebooks, experiment records, and cross-project CSV comparisons to the existing static journal.

**Architecture:** Keep Markdown projects in the existing collection system. Read and validate per-project YAML manifests at build time; publish only declared attachments and a small experiment index. Browser-only CSV parsing and ECharts plotting serve the comparison interface.

**Tech Stack:** Astro, TypeScript/JavaScript, YAML, Papa Parse, ECharts modular Canvas renderer, Node test runner.

**Spec:** `docs/design/experiment-record.md`

## Global constraints

- Navigation `experimentRecord`, route `/experimentrecord/`, repository-relative assets and GitHub Pages base support.
- Stable explicit experiment/CSV numbers; full project/experiment/CSV/metric identities.
- Custom name or 1-based column mapping, optional row-number x; no implicit interpolation or unit conversion.
- EMA 0–0.99, default 0; missing y produces gaps and resets smoothing.
- Reuse search, Series, themes and language controls; exclude drafts and unreferenced files.
- No cloud automation changes; README and templates document local AI recording and publication.

## Review focus

- Duplicate headers must require column indices (Task 1).
- Cross-project IDs and misleading unit combinations must remain distinct (Tasks 1, 3).
- Missing points must not become zeros or smooth across gaps (Task 1).
- Paths and draft assets must not expose unrelated files; videos must bypass cache (Task 2).
- Async chart selection changes must not resurrect removed curves (Task 3 browser verification).

## Task 1: Experiment manifest and CSV data

Files: create `src/lib/experiments.mjs`, `src/lib/experiment-data.mjs`, `tests/experiments.test.mjs`, `tests/experiment-data.test.mjs`; modify dependencies.

Interfaces: `readExperimentProject(entry, base)` returns normalized project and attachments; `readExperimentProjects(entries, base)` returns published projects. `parseCsv(text, csv)` returns `{headers, rows}`; `metricPoints(parsed, csv, metric)` returns `{points, skippedX, missingY}`; `smoothPoints(points, weight)` preserves x and nulls; `comparisonGroup(csv, metric)` identifies compatible axes.

- [x] Add tests asserting named/numbered mappings, quoted multiline CSV, logical header/data rows, scientific notation, duplicate headers, missing y, invalid x, and exact EMA `[2,4,null,10]` at .5 → `[2,3,null,10]`.
- [x] Run tests and observe missing-module failures before creating the modules.
- [x] Implement CSV parsing, validation, stable IDs/numbers and confined attachment resolution, with original errors identifying the project/file.
- [x] Run both test files; include six 100,000-row series processing and manifest rejection tests for duplicate IDs and traversal.
- [x] Commit tested data layer.

## Task 2: Static content, search and attachments

Files: modify content config/helpers, Archive/Card/Base, article route, entries endpoint, Astro dev middleware, import script, postbuild/cache, search script; create experiment archive, public experiment index and attachment utilities; extend build/offline tests.

Interfaces: consumes normalized projects from Task 1. `/experiments.json` lists public project/experiment/CSV/metric mappings with base-aware asset URLs; no raw CSV in the index. Article layout passes current project and all public projects to the result component.

- [x] Add failing integration assertions for navigation, experiment routes, indexed metadata and published attachments.
- [x] Register collection/schema and discovery filters, using updated date for experiment sorting.
- [x] Copy only referenced attachments, serve them in development, validate CSV mappings during build; extend local import support.
- [x] Keep viewed CSVs available offline while excluding video and Range requests from caching. Add behavioral offline test.
- [x] Build with `/ResearchStream/` and run check/tests; commit the integrated content layer.

## Task 3: Results and cross-project comparisons

Files: create `src/components/ExperimentResults.astro`, `src/scripts/experiments.ts`, `src/scripts/experiment-chart.ts`, `src/styles/experiments.css`.

Interfaces: consumes experiment index and Task 1 data functions. Each selected curve keeps project, experiment, CSV and metric identities; chart panels group by x quantity/unit and y quantity/unit. Tab controls use `#results`/`#notes`; no hidden content when JavaScript is unavailable.

- [x] Implement experiment overview cards, metadata, downloadable CSV/config and video gallery with native controls.
- [x] Add cascading project/experiment/CSV/metric selectors and searchable sources, selected-curve list, independent visibility/removal and full labels.
- [x] Lazy-load charts and CSVs, cancel stale render results; add EMA, raw overlay, zoom, reset, range sliders, tooltip, expand and PNG export.
- [x] Verify real browser behavior: cross-project selection, incompatible-unit panels, smoothing and reset, rapid selection/removal, theme/language changes and mobile layout.
- [x] Run production check/build/tests, inspect browser output and commit UI.

## Task 4: Templates, documentation and full validation

Files: README, CHANGELOG, public templates, two clearly labeled experiment demonstration projects with deterministic CSVs and a small demonstration video; verification report.

- [x] Provide copyable Markdown/YAML templates and document coordinate mapping, stable IDs/numbers, video, offline boundaries and local AI workflow.
- [x] Label all demonstration data as synthetic, keep actual user experiments empty; add two projects each with two experiments/multiple CSVs for verification.
- [x] Run check, production build with project base, entire suite, browser interaction/mobile/offline/video checks and 100k-row comparison test.
- [x] Request one independent whole-change review; address material findings and rerun affected checks.
- [x] Prepare final verified commits on `agent_dev`. Delivery checks push and Actions status under repository authorization; report the branch and preview without claiming main has deployed.

Execution note: Tasks 2 and 3 were integrated in commit 92750f2 because the route, result component, index and browser controls are mutually dependent. Demonstration fixtures and templates were included there to keep the feature independently buildable; Task 4 contains documentation and final verification.
