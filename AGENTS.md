# AGENTS.md — Portfolio2 (Sanket Gadge)

Fully static portfolio for an AI/ML engineer in Berlin. Vite + React 19 + TypeScript, typed bilingual content in `lib/gt/content.ts`, no backend. Per README, Vercel deploys from `main` — treat pushes as deploys.

## Commands

- `npm run dev` — dev server on `http://localhost:3000` (host `0.0.0.0`). The site itself needs no env vars.
- `npm run build` — Vite only, does **not** typecheck. Typecheck with `npx tsc --noEmit` when needed. No lint/format config exists.
- `npm run test:e2e` — Playwright; starts or reuses the dev server itself, so don't start one manually first. Projects: `chromium-desktop` (1440×900) and `chromium-mobile` (390×844).
- Focus a test: `npx playwright test tests/smoke.spec.ts` · `npx playwright test -g "hero"` · add `--project=chromium-mobile`.
- Concept pages (design-lab): `npx playwright test --config=design-lab/playwright.config.ts` (testMatch: `design-lab/qa.spec.ts`).
- Visual baselines: `npm run test:e2e:update` **only** for intentional design changes; snapshots are git-tracked and platform-bound (`*-chromium-<project>-linux.png`). Review diffs — never update to silence a red run.
- `npm run og` — regenerates `public/og.png` (the social card) with the dev server running; `scripts/make-og.mjs` renders it at 1200×630.

## Testing facts that will bite you

- Canvases are frozen for screenshots by emulating `prefers-reduced-motion: reduce` (`page.emulateMedia`) — the bench and track honour `reducedMotion` and stop on a deterministic frame. There is no `__freezeFourierCanvas` hook anymore; `components/visuals/` was deleted with the old site.
- Tests pin the theme via `localStorage['portfolio-theme']='dark'`; `maxDiffPixelRatio` is 0.05; retries are 0.
- `tests/smoke.spec.ts` covers: zero console errors, no horizontal overflow, every stage section present and in document order, stage navigation, EN/DE switching, the skill cross-filter lighting evidence rows, bench controls driving the scene, résumé links (`/assets/Sanket-Gadge-Resume.pdf` with `download`), hiring facts, broken images, failed requests, and every `#topnav` control sitting inside the viewport (guards a regression where the fixed nav pushed the language/theme tools past 1440px).

## Architecture (the non-obvious wiring)

- Entry: `index.tsx` → `App.tsx` — ThemeProvider wrapping `components/gt/GtSite.tsx` (the whole page) plus the Impressum/Datenschutz sections; there is no router. `index.css` is imported **before** `App` so the design system in `styles/gt/` wins the cascade against the legacy Tailwind token aliases.
- The live design is `design-lab/18-ground-truth`, ported to React: `components/gt/*` sections, `lib/gt/*` logic (bench, scenes, timeline, arch overlay) and `styles/gt/*` CSS (the concept's own files, plus `extras.css` for the surfaces the concept lacked). Editing the concept page does nothing to the live site and vice versa — edit the port.
- Content: `lib/gt/content.ts` — one typed `GtContent` object with an `en` and a `de` copy of every string and fact (MSc AI 08/2026, immediate start 40 h/week, 18-month post-study permit § 20 AufenthG filed at LEA Berlin, German B1). Both languages must be edited together. Root JSON files (`skills.json`, `experience.json`, `education.json`, `blogs.json`, `sections.json`) and `lib/projects.ts` are the provenance record the rendered copy cites; project claims stay traceable to `.agents/github-project-inventory.md` / `.agents/local-agent-evidence-inventory.md`.
- i18n: `i18n/` now holds only `ThemeContext.tsx`; language lives in `GtContext` (`lib/gt/content.ts`) and also sets `document.documentElement.lang`, `document.title` and the description meta.
- Theming: `ThemeContext` toggles a `light` class on `<html>` and persists `portfolio-theme`; `index.html` bootstraps it from `public/theme-init.js` before first paint — keep that script first-party, the production CSP allows `script-src 'self'` only.
- Visuals: Canvas 2D only, in `lib/gt/scenes.js` + `lib/gt/bench.ts` (inference bench, telemetry) and `lib/gt/timeline.ts` (tracking view). WebGL/Three.js was explicitly rejected by the owner; do not reintroduce it. Fonts are self-hosted in `public/fonts/gt/`.
- Removed in the 2026-10 port (git history has them): `firebase/`, `auth/`, `pages/Admin*`, `pages/BlogPost.tsx`, `components/admin/`, `components/Blogs.tsx`, all old sections (`About`, `Experience`, `Education`, `Skills`, `Projects`, `Contact`, `Writing`, `Header`, `Hero`, `Footer`, `ScrollReveal`, `icons.tsx`), `components/visuals/*`, `lib/generateCV.ts`, `lib/dataLoader.ts`, `i18n/en.ts`/`de.ts`/`LanguageContext.tsx`, and the `jspdf`/`framer-motion` dependencies. Uncommitted work from those files is archived as patches in `.agents/archive/`.

## design-lab/ — concept waves

- Standalone, dependency-free concept pages: `design-lab/<NN>-<name>/index.html`, one self-contained file each (inline CSS/SVG/JS, no npm deps, no imports from the app). Gallery: `design-lab/index.html`; batch notes + selection lenses: `design-lab/README.md`. Kept **untracked on purpose — don't commit it**.
- Concept house rules: Canvas 2D/CSS only (no WebGL), scroll states fully reversible, reduced-motion parity, WCAG basics, text never over moving machinery, nothing that reads as generic gradient/matrix/neon filler.
- These are large single-file documents; after chunked writes, verify: balanced `<script>` tags, `node --check` on the extracted JS, and that every referenced global is actually defined (a silently skipped chunk once shipped an undefined global).
- `archive/wave*-hero-designs/` and `archive/rankings/` hold the rated hero experiments and the owner's star ratings — taste evidence, don't delete.

## Code navigation

Use **CodeGraph first** (`codegraph_explore`) for architecture, code flow, symbol lookup, and implementation questions. Treat its results as the source of truth; don't re-grep or re-read files it already returned. Fall back to direct reads only for configs/docs, files edited since the last index sync, or projects without a `.codegraph/` index — and never run `codegraph init` yourself; mention it to the owner instead.

CodeGraph is already initialized here (`.codegraph/`, v1.6.2) and indexes the TS/TSX/JS, including `design-lab/18-ground-truth/_src/parts/js`. Run `codegraph sync` (sub-second, incremental) after a pull or a batch of edits — the daemon does not always stay up, so the index can be days stale. It does not parse HTML/CSS, which is most of the concept pages: `node scripts/index-parts.mjs` regenerates `.agents/code-map.18-ground-truth.md` (include order, sections, JS exports/functions, CSS class ownership) for that layer.

## Browser QA loop (all UI work)

1. Dev server running → `browser_navigate` to `http://localhost:3000`.
2. `browser_take_screenshot` at desktop size, then `browser_resize` to 390 wide and shoot again; check `browser_console_messages` is clean; read `browser_snapshot` for the accessibility tree.
3. Exercise the real flow (scroll, nav, theme toggle, résumé link). Older full-page reference captures live in `test-screenshots/`.
4. `npm run test:e2e`; fix and repeat until clean.
5. Never call a UI change done from code alone — confirm with a screenshot plus DOM measurements (`browser_evaluate` → `getBoundingClientRect()`, computed styles). Save owner-review screenshots under `.agents/qa/`.
6. Can't judge images yourself? Dispatch the `visual-qa` (qwen3-vl:4b) or `visual-qa-lfm2` (LFM2.5-VL-3B) subagents — but treat VL findings as advisory: they have returned false positives and empty completions; verify factual claims via DOM/computed styles.

## Design bar (owner's taste)

- Craft every element individually; each concept must differ structurally from the last. Past verdicts live in `archive/rankings/`, `./docs/brain/`, and `design-lab/README.md`.
- The classic rejection is "Does it do anything???" — mechanisms must visibly *do* something (scroll- or input-driven), never decoration. No mascots; take cues from nature, not UI templates.
- Missing an asset or tool? Search for it or build it from scratch rather than shipping a generic placeholder.

## Session conventions

- Log non-trivial thinking — decisions, dead ends, error resolutions — to `.agents/thinking/YYYY-MM-DD-<topic>.md`, tagged with the session. Read `./docs/brain/hot.md` before re-deciding anything; the vault is only reachable via the `docs/brain` symlink (recreate with `brain-init "$PWD"` if missing).
- Owner work-style: explore → present options → execute; don't ask what you can find yourself; hates busywork (`BABE-PREFS.md` has more, but its tech facts are dated — this file wins). `CLAUDE.md` (Claude Code) expects UI work to consult the Open Design MCP when available.
- Git: start sessions with `git status` / `git log` / current branch and keep them in context. The tree regularly holds uncommitted owner WIP (theme system, tests, design-lab) — **never commit, stash, reset, or switch branches unless asked**, and don't push.
