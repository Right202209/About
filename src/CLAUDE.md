# src/ — desktop UI

The terminal has its own guide at `src/terminal/CLAUDE.md`.

Personal content and Finder files live in `src/info.js`. System labels and app/menu registries may stay with their components.

- `App.js` composes the desktop, windows, Dock, menu bar, Spotlight, and context menu.
- `hooks/useWindowManager.js` owns window order, focus, visibility, and zoom. Minimized windows remain mounted to preserve app and terminal state.
- `hooks/useWindowFrame.js` owns bounded pointer dragging, edge resizing, and viewport fitting.
- `components/apps/registry.js` defines app labels, icons, and initial sizes. `components/apps/index.js` maps keys to content components.
- `components/apps/AppWindow.js` supplies shared native chrome and window controls.
- `components/icons/` contains SVG artwork. Every icon instance uses unique React `useId` prefixes for gradients and clipping.
- `DesktopBackground` uses the existing local wallpaper through `process.env.PUBLIC_URL`.
- `useTheme` persists appearance and sets the document theme. Import `DARK_THEME` / `LIGHT_THEME` for theme comparisons.
- `styles/` has component styles. Native windows use container queries for responsive content, including windows resized on desktop.
- Keep the Google Fonts import first in `index.css`; system UI and monospace fonts are the preferred font stacks.
- `useWindowManager.test.js` and `useWindowFrame.test.js` cover focus, minimize/restore, stacking, and reachable window bounds.

Use npm and preserve the case-sensitive GitHub Pages path `/About/`. UI assets must work under that subpath.
