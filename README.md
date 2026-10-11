# Droit's Personal Desktop

A React portfolio inspired by macOS: a redwood wallpaper, translucent menu bar and Dock, native window chrome, and hand-drawn SVG app and file icons.

- Independent windows with dragging, edge resizing, zoom, minimize, and Dock restore.
- Finder with folder navigation, search, icon/list views, and working portfolio shortcuts.
- Safari favorites, contact links in Mail, a personal collection in Music, and a skills editor.
- Spotlight app search, Control Center, calendar, and a desktop context menu.
- Persistent light/dark appearance, wallpaper brightness, responsive window layouts, and reduced-motion support.
- The existing Claude Code-style terminal, including commands, history, autocomplete, and interrupt.

## Run locally

Use Node.js 20 or newer and npm:

```sh
npm ci --legacy-peer-deps
npm start
```

The legacy peer flag is needed by the existing `react-terminal-app` dependency, which is no longer used by the application.

```sh
CI=true npm test -- --watchAll=false --runInBand
npm run build
```

## Desktop controls

Double-click a desktop folder to open it; on touch devices, tap once. Drag the title bar to move a window, double-click it to zoom, or drag an edge to resize. The red, yellow, and green controls close, minimize, and zoom. Click a Dock icon to open or restore an app.

| Shortcut | Action |
| --- | --- |
| ⌘ / Ctrl + K | Spotlight search |
| ⌘ / Ctrl + N | Open Finder |
| ⌘ / Ctrl + M | Minimize the active window |
| ⇧ + ⌘ / Ctrl + D | Show / restore the desktop |
| Escape | Dismiss menus and Spotlight |

In Terminal, type `help`. Arrow keys browse command history; Tab completes a command; Ctrl+C interrupts it.

## Customize

Personal content and Finder shortcuts live in `src/info.js`. App metadata lives in `src/components/apps/registry.js`, SVG artwork in `src/components/icons/`, and window behavior in `src/hooks/useWindowManager.js` and `useWindowFrame.js`. Component styles live in `src/styles/`.

## GitHub Pages

The production base path is **/About/**. The existing GitHub Actions workflow builds and publishes on pushes to `main`. A manual `npm run deploy` command is also available.

The desktop runs entirely in the browser; no backend or credentials are required.
