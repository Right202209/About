# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Branch layout — read this first

- **`main`** holds the source code (Create React App project under `src/`).
- **`gh-pages`** holds only built artifacts (`index.html`, `static/`, `asset-manifest.json`). Never edit files on this branch by hand.

The working directory may be checked out on `gh-pages`. Check `git branch` before making source changes; source edits belong on `main` (or a feature branch off it).

## What this is

A terminal-style personal portfolio page ("About Me" for Droit), rendered inside a macOS-like desktop UI (menu bar, dock, desktop icons) built in React. The terminal itself comes from the `react-terminal-app` package; it boots with the `intro` command. Published to GitHub Pages at `https://right202209.github.io/about`.

## Commands

```bash
npm install      # may hit a React 18 peer conflict with react-terminal-app; use --legacy-peer-deps if so
npm start        # dev server at http://localhost:3000
npm run build    # production build into build/
npm test         # react-scripts test (watch mode)
npm run deploy   # manual deploy: builds and pushes build/ to gh-pages branch
```

Deployment is normally automatic: `.github/workflows/static.yml` builds and deploys to GitHub Pages on every push to `main`. `npm run deploy` (gh-pages package) is the manual/legacy path that produces the `gh-pages` branch.

Note: the unmerged branch `fix/react18-terminal-peer-conflict` replaces `react-terminal-app` with a custom React 18 terminal shell, addressing the peer-dependency conflict.

## Architecture (on `main`)

All source is in five files under `src/`; data and presentation are deliberately separated:

- `src/info.js` — **central config**: all personal data (name, contacts, skills, links, cartoons, books). Content changes happen here, not in the command files.
- `src/static.js` — static commands (`contact`, `skill`, `cartoon`, `book`, `ascii`/`name`): each maps to a list of lines rendered by the terminal, mostly built from `info.js` data.
- `src/dynamic.js` — interactive commands (e.g. `intro`, link-opening commands) using callbacks/Promises, also driven by `info.js`.
- `src/App.js` — wires `staticList`/`dynamicList` into the `<Terminal>` config (prompt, `bootCmd: 'intro'`) and contains the macOS desktop chrome: inline SVG glyph components (`DockGlyph`, `DesktopGlyph`), menu-bar clock, and a pointer-tracking "googly eyes" effect driven by CSS custom properties.
- `src/index.css` — all styling for the desktop/dock/terminal chrome.

To add a terminal command: put any data in `info.js`, then register it in `static.js` (plain list output) or `dynamic.js` (interactive behavior). Command shape follows `react-terminal-app` conventions (see https://github.com/Tomotoes/react-terminal).
