# PyAnalytics — Learn Python for Data Science

An interactive, in-browser Python learning platform for aspiring Data Analysts / Data Scientists. Runs entirely client-side (Pyodide + Monaco), no backend, deployable free on GitHub Pages.

**Status: early scaffold.** The architecture is proven end-to-end (Pyodide execution, Monaco editor, layered validation, progress/XP tracking, routing) and **Module 1 (Variables — Amazon Order Calculator)** is fully built as a real, working lesson. Modules 2–12 from the original curriculum are not yet authored — see "Adding a module" below.

## Quick start

```bash
npm install
npm run dev       # http://localhost:5173
```

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Local dev server |
| `npm run build` | Type-checks (`tsc -b`) then builds to `dist/` |
| `npm run preview` | Serves the production build locally |
| `npm run lint` | oxlint |
| `npm test` | Vitest (unit tests) |

All four have been run against this codebase: build passes, lint passes with 0 errors, 14/14 tests pass.

## How it works

- **Python execution**: `src/services/pyodide.worker.ts` runs in a dedicated Web Worker and loads Pyodide from the jsDelivr CDN at runtime (not bundled — keeps the repo small and avoids committing ~200MB of wasm assets). `src/hooks/usePyodide.ts` wraps it in a promise-based `run()` API.
- **Editor**: Monaco via `@monaco-editor/react`, wrapped in `src/components/editor/CodeEditor.tsx`.
- **Content**: Lessons are data, not code. See `src/types/content.ts` for the schema and `src/data/modules/module-01.json` for a real example. Adding a lesson means writing JSON, not components.
- **Validation** (`src/utils/validateChallenge.ts`): a layered validator — stdout matching (with numeric tolerance), variable-state inspection, function test-cases, and AST pattern checks (`src/utils/astCheck.ts`) — so multiple correct solutions all pass, not just one exact string.
- **Progress**: `src/hooks/useProgress.tsx` + `src/utils/progressStore.ts`, persisted to `localStorage`. The storage mechanism is isolated behind `loadProgress`/`saveProgress` so it can be swapped for a real backend later without touching components.
- **Routing**: `HashRouter`, deliberately — GitHub Pages has no server-side history-mode fallback, so `BrowserRouter` would 404 on refresh/direct links.

## Adding a module

1. Create `src/data/modules/module-0N.json` following the `Module` type in `src/types/content.ts`.
2. Import and append it in `src/data/moduleRegistry.ts`'s `MODULES` array.
3. If the module needs a dataset (Pandas modules), add the CSV to `src/datasets/` and reference it via `challenge.datasetIds`, then load it inside the student's Python via a fetch-into-Pyodide step (not yet wired up — Module 1 doesn't need a dataset; this is the next piece to build for Module 9+).

## Deploying to GitHub Pages

1. Push this repo to GitHub.
2. In `vite.config.ts`, the `base` is already relative (`./`) so it works from a project subpath automatically — no changes needed for a standard `https://<user>.github.io/<repo>/` deployment.
3. Add a GitHub Actions workflow (`.github/workflows/deploy.yml`) that runs `npm ci && npm run build` and publishes `dist/` — or simply run `npm run build` locally and push the `dist/` folder's contents to a `gh-pages` branch via `npx gh-pages -d dist` (`gh-pages` package not yet added as a dependency).
4. In the repo's Settings → Pages, set the source to the `gh-pages` branch (or the Actions workflow, if used).

## What's not built yet

- Modules 2–12 (Data Types through the Capstone) — content authoring, following the Module 1 pattern
- Dataset loading into Pyodide (CSV → Pandas DataFrame inside the worker)
- "Explain This" rule-based AST explainer (design is in the architecture plan; not implemented)
- Debugging challenges, Predict-the-Output, flash cards, end-of-module randomized quizzes
- Badge unlock logic (types exist in `src/types/progress.ts`, no badges defined yet)
- Component tests (React Testing Library) and Playwright e2e — only Vitest unit tests exist so far
- GitHub Actions deploy workflow file itself
