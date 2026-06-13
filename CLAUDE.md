# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Branch layout — read this first

- **`main`** holds the source code (Create React App project under `src/`).
- **`gh-pages`** holds only built artifacts (`index.html`, `static/`, `asset-manifest.json`). Never edit files on this branch by hand.

The working directory may be checked out on `gh-pages`. Check `git branch` before making source changes; source edits belong on `main` (or a feature branch off it).

## What this is

A terminal-style personal portfolio page ("About Me" for Droit), rendered inside a macOS-like desktop UI (menu bar, dock, desktop icons) built in React. The terminal itself comes from the `react-terminal-app` package; it boots with the `intro` command. Published to GitHub Pages at `https://right202209.github.io/About`.

## Commands

```bash
npm install      # may hit a React 18 peer conflict with react-terminal-app; use --legacy-peer-deps if so
npm start        # dev server at http://localhost:3000
npm run build    # production build into build/
npm test         # react-scripts test (watch mode)
npm run deploy   # manual deploy: builds and pushes build/ to gh-pages branch
```

Deployment is normally automatic: `.github/workflows/static.yml` builds on every push to `main` and publishes via GitHub's artifact-based Pages deploy (`upload-pages-artifact`/`deploy-pages`) — this does **not** touch the `gh-pages` branch. `npm run deploy` (gh-pages package) is the manual/legacy path that pushes `build/` to the `gh-pages` branch, so that branch can be stale relative to the live site.

Note: the unmerged branch `fix/react18-terminal-peer-conflict` replaces `react-terminal-app` with a custom React 18 terminal shell, addressing the peer-dependency conflict.

### Tooling notes

- **Package manager is npm** (CI runs `npm ci --legacy-peer-deps` on Node 20). A `yarn.lock` is also checked in but unused — don't install with yarn.
- **The root `webpack.config.js` is stale and unused** (and broken: missing `HtmlWebpackPlugin` import, duplicate `mode` key, points at a non-existent `src/index.html`). The real build is Create React App / `react-scripts`; ignore this file.
- **No tests exist** — `npm test` starts the react-scripts watcher, but `src/` contains no `*.test.js` files.
- `homepage` in `package.json` is `/About` (capital A) and must match the repo-path casing, or built asset URLs 404 on Pages (this was a recent fix).

## Architecture (on `main`)

Six files under `src/`; data and presentation are deliberately separated:

- `src/info.js` — **central config**: all content as plain exports — `personalInfo`, `claudeBrand` (banner/menu labels), `links`, `contacts`, `skills`, `cartoons`, `books`. Content changes happen here, not in the command files.
- `src/static.js` — static commands (`contact`, `skill`, `cartoon`, `book`, and `ascii`/`name`, which share one ASCII-art block): each maps to a list of lines rendered by the terminal, mostly built from `info.js` data.
- `src/dynamic.js` — interactive commands using callbacks/Promises: `intro` (the boot command; prints line-by-line on a timer), `echo`, and the link openers `open`/`menu`/`resume`/`2048` (all call `window.open`).
- `src/App.js` — wires `staticList`/`dynamicList` into the `<Terminal>` config (prompt, `bootCmd: 'intro'`), renders the banner/menu bar from `info.js`, and contains the macOS desktop chrome: inline SVG glyph components (`DockGlyph`, `DesktopGlyph`), a menu-bar clock, and a pointer-tracking "googly eyes" effect driven by CSS custom properties (`--googly-pupil-x/y`).
- `src/index.css` — all styling for the desktop/dock/terminal chrome; the desktop background is pure CSS (gradients/beams/orbs), not an image.
- `src/index.js` — CRA entry point; renders `<App />` into `#root`.

To add a terminal command: put any data in `info.js`, then register it in `static.js` (plain list output) or `dynamic.js` (interactive behavior). Command shape follows `react-terminal-app` conventions (see https://github.com/Tomotoes/react-terminal).
