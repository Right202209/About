# macOS Web Desktop

A plain macOS-style desktop that runs in the browser, built with React: a redwood wallpaper, translucent menu bar and Dock, native window chrome, and hand-drawn SVG app and file icons. It carries no personal information.

- Independent windows with dragging, edge resizing, zoom, minimize, and Dock restore.
- Finder with folder navigation, search, and icon/list views.
- Safari start page, Mail and Music with empty libraries, a code editor with a sample file, and a simple zsh-style Terminal.
- Spotlight app search, Control Center, calendar, and a desktop context menu.
- Persistent light/dark appearance, wallpaper brightness, responsive window layouts, and reduced-motion support.

## Run locally

Use Node.js 20 or newer and npm:

```sh
npm ci --legacy-peer-deps
npm start
```

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

In Terminal, type `help`. Try `ls`, `date`, or `open finder`; ↑ / ↓ browse history.

## Customize

Desktop content (Finder files, Safari favorites, the sample code file, About This Mac rows) lives in `src/content.js`. App metadata lives in `src/components/apps/registry.js`, SVG artwork in `src/components/icons/`, and window behavior in `src/hooks/useWindowManager.js` and `useWindowFrame.js`. Component styles live in `src/styles/`.

## GitHub Pages

The production base path is **/About/**. The GitHub Actions workflow builds and publishes on pushes to `main`. A manual `npm run deploy` command is also available.

The desktop runs entirely in the browser; no backend or credentials are required.
