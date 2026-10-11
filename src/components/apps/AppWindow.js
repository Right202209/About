import { useEffect } from 'react';
import useWindowFrame from '../../hooks/useWindowFrame';
import useMinimizeAnimation from '../../hooks/useMinimizeAnimation';
import WindowControls from '../WindowControls';
import DockGlyph from '../icons/DockGlyph';
import { WindowChromeContext } from './WindowChrome';
import { APP_INFO } from './registry';

const RESIZE_EDGES = ['n', 'e', 's', 'w', 'ne', 'se', 'sw', 'nw'];
const FOCUS_TARGETS = '.terminal-app__input, [data-autofocus]';

export default function AppWindow({ window, index, active, manager, children }) {
  const { key, minimized, maximized } = window;
  const app = APP_INFO[key];
  const frame = useWindowFrame({ preferred: app, index, maximized });
  const animating = useMinimizeAnimation(frame.ref, key, minimized);
  useEffect(() => {
    const node = frame.ref.current;
    if (active && !minimized && !node?.contains(document.activeElement)) {
      const target = node?.querySelector(FOCUS_TARGETS) || node;
      target?.focus({ preventScroll: true });
    }
  }, [active, minimized, window.focusVersion, frame.ref]);
  const zoom = () => { if (!app.fixed) manager.zoom(key); };
  const toggleZoom = event => {
    if (!event.target.closest('button, input, textarea, a, [data-no-zoom]') && event.target.closest('[data-window-drag], .mac-window__titlebar')) zoom();
  };
  const chrome = { title: app.label, maximized, onClose: () => manager.close(key), onMinimize: () => manager.minimize(key), onZoom: zoom, fixed: app.fixed };
  const classes = ['mac-window', `mac-window--${key}`, active && 'is-active', frame.moving && 'is-moving', maximized && 'is-maximized', app.chromeless && 'is-chromeless', animating && 'is-animating'].filter(Boolean).join(' ');
  return (
    <section ref={frame.ref} role="dialog" aria-label={app.title} tabIndex={-1} hidden={minimized && !animating}
      data-app={key} className={classes}
      style={{ ...frame.style, zIndex: index + 1 }} onPointerDownCapture={() => manager.focus(key)}
      onPointerDown={event => { if (event.target.closest('[data-window-drag]') && !event.target.closest('input, textarea, [data-no-drag]')) frame.begin(event); }}
      onDoubleClick={toggleZoom}
      onPointerMove={frame.move} onPointerUp={frame.end} onPointerCancel={frame.end}>
      {!app.chromeless && <header className="mac-window__titlebar" onPointerDown={frame.begin}>
        <WindowControls {...chrome} />
        <div className="mac-window__title"><DockGlyph type={app.icon} /><span>{app.title}</span></div>
        <span className="mac-window__title-spacer" />
      </header>}
      <WindowChromeContext.Provider value={chrome}>
        <div className="mac-window__body">{children}</div>
      </WindowChromeContext.Provider>
      {!maximized && !app.fixed && RESIZE_EDGES.map(edge => <div key={edge} className={`window-resize window-resize--${edge}`} aria-hidden="true" onPointerDown={event => frame.begin(event, edge)} />)}
    </section>
  );
}
