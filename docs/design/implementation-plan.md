# ResearchStream Implementation Plan

> Implement inline with superpowers:executing-plans. User accepted the warm orange design and requested continuation on 2026-10-07.

**Goal:** A usable static research blog with Markdown publishing, bilingual controls, themes, search and offline reading.
**Architecture:** Astro builds Markdown collections to HTML. Small browser scripts handle filters and preferences. Build scripts generate search and service-worker assets; no server credentials or database.
**Tech stack:** Astro, TypeScript, CSS, remark/rehype, KaTeX, Shiki, Pagefind.
**Spec:** `docs/design/proposal-v1.md`; accepted image `researchstream-design-v2.png`.

## Constraints

- Four primary links: Overview / PaperPost / LearningWall / Misc.
- Cream #FEFAF5 and sunset orange #E07B3C; dark #1A1816 with #FF9F6E.
- Hero stays text-only. Abstract is a single truncated line on cards.
- No remote publishing until a deployment target is selected. No fabricated publishing/editor capability.
- Work directly in this new project directory (no existing repository or branch to isolate). Initialize local version history using an explicitly agent-owned commit identity if no user identity exists; do not change global Git settings.
- Protocol takes priority over elaborate skill ceremony: test core content behavior and browser workflows, not cosmetic implementation details.

## Review focus

- Drafts must be absent from pages, public assets and search.
- Mixed Chinese/English queries must search all content, independently of UI language.
- Imported images and internal article links must survive a configured deployment subpath.
- Navigation and cached article content must remain readable offline, with a clear uncached-page response.
- User-controlled Markdown must not execute embedded scripts.

## Task 1 — Content pipeline and routes

- [x] Configure Astro, lock dependencies, add content metadata validation and Markdown rendering.
- [x] Write and run failing tests for import validation, duplicate IDs, draft exclusion and image resolution; implement those paths and rerun.
- [x] Add marked sample Markdown for paper notes and learning notes; include math, tables, code, footnotes and a local image. Keep Misc. empty.
- [x] Build routes from published collections; verify article HTML and generated URLs.

Files: `astro.config.mjs`, `src/content.config.ts`, `src/lib/content.*`, `scripts/import-content.mjs`, `tests/content.test.mjs`, `content/**`.
Interface: published entries expose metadata, collection, slug, reading time and first image; article URLs use deployment base.

## Task 2 — Complete reading interface

- [x] Build shared shell, homepage cards/timeline, searchable archives, article body/TOC and empty Misc.
- [x] Add language/theme preferences, responsive layouts, keyboard navigation and copy-code controls.
- [x] Build and verify responsive navigation, card overflow, article anchors and preference persistence in browser.

Files: `src/layouts/**`, `src/components/**`, `src/pages/**`, `src/styles/**`, `src/scripts/**`.
Interface: static HTML provides semantic data attributes for preferences, search and filters; article metadata supplies shared navigation.

## Task 3 — Search, import and offline delivery

- [x] Generate a single multilingual search index using Pagefind custom records with language neutralized for shared lookup; verify actual CJK search behavior.
- [x] Preserve query/filter state in URL and render safe, highlighted search excerpts.
- [x] Generate versioned offline shell and resource cache; cache visited articles, handle uncached navigation and refresh on reconnect.
- [x] Provide honest writer-reserved page and downloadable Markdown templates. Document import command and automated build workflow.
- [x] Verify published output excludes drafts and unselected private content, import command round trip, search, theme/language, offline revisit and local assets.

Files: `scripts/postbuild.mjs`, `src/scripts/search.ts`, `public/**`, `.github/workflows/**`, `README.md`.

## Task 4 — Handoff

- [x] Run build, type checks, core tests and browser review. Fix material issues.
- [x] Update CHANGELOG and README with actual results and remaining integration TODOs.
- [x] Save local stage commits. Open local preview and give user URL. Keep deployment and real daily automation linkage explicit TODOs until target/sample are available.
