# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Branch layout — read this first

- **`main`** holds the source code (Create React App project under `src/`).
- **`gh-pages`** holds only built artifacts (`index.html`, `static/`, `asset-manifest.json`). Never edit files on this branch by hand.

The working directory may be checked out on `gh-pages`. Check `git branch` before making source changes; source edits belong on `main` (or a feature branch off it).

## What this is

A plain macOS-style web desktop (menu bar, Dock, desktop icons, Finder, Spotlight, draggable windows) built in React. It deliberately shows **no personal information**: no name, email, avatar, contacts, or portfolio content. The desktop opens empty; Terminal is a small zsh-style shell (`src/components/apps/TerminalApp.js`). Published to GitHub Pages at `https://right202209.github.io/About`.

## Commands

```bash
npm install --legacy-peer-deps
npm start        # dev server at http://localhost:3000
npm run build    # production build into build/
npm test         # react-scripts test (watch mode)
npm run deploy   # manual deploy: builds and pushes build/ to gh-pages branch
```

Deployment is normally automatic: `.github/workflows/static.yml` builds on every push to `main` and publishes via GitHub's artifact-based Pages deploy (`upload-pages-artifact`/`deploy-pages`) — this does **not** touch the `gh-pages` branch. `npm run deploy` (gh-pages package) is the manual/legacy path that pushes `build/` to the `gh-pages` branch, so that branch can be stale relative to the live site.

### Tooling notes

- **Package manager is npm** (CI runs `npm ci --legacy-peer-deps` on Node 20). Don't install with yarn.
- **The root `webpack.config.js` is stale and unused** (and broken: missing `HtmlWebpackPlugin` import, duplicate `mode` key, points at a non-existent `src/index.html`). The real build is Create React App / `react-scripts`; ignore this file.
- **Window regression tests** live in `src/hooks/useWindowManager.test.js` and `useWindowFrame.test.js`. Run `CI=true npm test -- --watchAll=false --runInBand` for a non-interactive check.
- `homepage` in `package.json` is `/About` (capital A) and must match the repo-path casing, or built asset URLs 404 on Pages (this was a recent fix).

## Architecture (on `main`)

Desktop content (Finder files, Safari favorites, sample code, About This Mac rows) lives in `src/content.js` — content changes happen there, never in components. Keep it neutral: never add personal details. Code hard limits: files ≤ 300 lines, functions ≤ 50, no magic numbers.

Detailed guides live next to the code (loaded automatically when working in those paths):

- `src/CLAUDE.md` — desktop UI: components, icons, hooks, styles
