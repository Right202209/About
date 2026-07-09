# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Branch layout — read this first

- **`main`** holds the source code (Create React App project under `src/`).
- **`gh-pages`** holds only built artifacts (`index.html`, `static/`, `asset-manifest.json`). Never edit files on this branch by hand.

The working directory may be checked out on `gh-pages`. Check `git branch` before making source changes; source edits belong on `main` (or a feature branch off it).

## What this is

A terminal-style personal portfolio page ("About Me" for Droit), rendered inside a macOS-like desktop UI (menu bar, dock, desktop icons) built in React. The terminal is a custom React 18 component (`src/terminal/`) that simulates a Claude Code CLI session — typed output, tool-call boxes (`Read`/`Grep`/`Bash`/`WebSearch`), y/N permission prompts, token/context usage lines — and boots with the `intro` command. Published to GitHub Pages at `https://right202209.github.io/About`.

## Commands

```bash
npm install      # may hit a React 18 peer conflict with react-terminal-app; use --legacy-peer-deps if so
npm start        # dev server at http://localhost:3000
npm run build    # production build into build/
npm test         # react-scripts test (watch mode)
npm run deploy   # manual deploy: builds and pushes build/ to gh-pages branch
```

Deployment is normally automatic: `.github/workflows/static.yml` builds on every push to `main` and publishes via GitHub's artifact-based Pages deploy (`upload-pages-artifact`/`deploy-pages`) — this does **not** touch the `gh-pages` branch. `npm run deploy` (gh-pages package) is the manual/legacy path that pushes `build/` to the `gh-pages` branch, so that branch can be stale relative to the live site.

Note: the branch `fix/react18-terminal-peer-conflict` (unmerged) was the first pass at replacing `react-terminal-app`; `main` now ships its own custom terminal under `src/terminal/`, superseding it.

### Tooling notes

- **Package manager is npm** (CI runs `npm ci --legacy-peer-deps` on Node 20). A `yarn.lock` is also checked in but unused — don't install with yarn.
- **`react-terminal-app` is no longer used at runtime** (the custom terminal replaced it) but is still listed in `package.json`, so installs may still hit the React 18 peer conflict — use `--legacy-peer-deps`. Removing the dependency (and regenerating the lockfile) is a safe future cleanup.
- **The root `webpack.config.js` is stale and unused** (and broken: missing `HtmlWebpackPlugin` import, duplicate `mode` key, points at a non-existent `src/index.html`). The real build is Create React App / `react-scripts`; ignore this file.
- **No tests exist** — `npm test` starts the react-scripts watcher, but `src/` contains no `*.test.js` files.
- `homepage` in `package.json` is `/About` (capital A) and must match the repo-path casing, or built asset URLs 404 on Pages (this was a recent fix).

## Architecture (on `main`)

All portfolio content lives in `src/info.js` — content changes happen there, never in components. Code hard limits: files ≤ 300 lines, functions ≤ 50, no magic numbers.

Detailed guides live next to the code (loaded automatically when working in those paths):

- `src/CLAUDE.md` — desktop UI: components, icons, hooks, styles
- `src/terminal/CLAUDE.md` — the simulated CLI: engine, commands, how to add a command
