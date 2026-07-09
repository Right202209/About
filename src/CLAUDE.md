# src/ — desktop UI

Scope: this file covers the desktop chrome under `src/`; the terminal has its own guide at `src/terminal/CLAUDE.md`.

All displayed content comes from `src/info.js` (plain exports: `personalInfo`, `claudeBrand`, `links`, `contacts`, `skills`, `cartoons`, `books`) — never hardcode content in components.

- `App.js` — thin composition of the desktop; `index.js` — CRA entry point.
- `components/` — desktop chrome: `MenuBar`, `Dock`, `DesktopIcons`, `DesktopBackground` (pure-CSS wallpaper), `GooglyEyes` (pointer-driven via `--googly-pupil-x/y`), `ClaudeWindow` (titlebar + banner, hosts the terminal). Item lists (menu entries, dock apps, desktop icons) are local constants in their component files.
- `components/icons/` — SVG glyphs: `DockGlyph.js` (registry of dock icons), `DesktopGlyph.js`, `ThemeGlyph.js`. Dock icons draw on the shared rounded-tile base in `IconTile.js`; per-icon gradient/def ids must stay unique across the document (namespace them with the icon key).
- `hooks/` — `useTheme` (localStorage + `data-theme` attribute; exports `DARK_THEME`/`LIGHT_THEME` — import these instead of writing `'dark'`/`'light'` literals), `useMenuClock`, `useGooglyPointer`.
- `styles/` — one stylesheet per component, imported in order by `src/index.css`; the Google Fonts `@import` must stay on line 1 of `index.css`. Dark-mode overrides live next to their component's rules as `[data-theme="dark"]` selectors.
