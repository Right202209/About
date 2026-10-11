import { useEffect } from 'react';
import useWindowFrame from '../../hooks/useWindowFrame';
import WindowControls from '../WindowControls';
import DockGlyph from '../icons/DockGlyph';
import { APP_INFO } from './registry';

const RESIZE_EDGES = ['n', 'e', 's', 'w', 'ne', 'se', 'sw', 'nw'];

export default function AppWindow({ window, index, active, manager, children }) {
  const { key, minimized, maximized } = window;
  const app = APP_INFO[key];
  const frame = useWindowFrame({ preferred: app, index, maximized });
  useEffect(() => {
    const node = frame.ref.current;
    if (active && !minimized && !node?.contains(document.activeElement)) {
      const target = node?.querySelector('.terminal-app__input') || node;
      target?.focus({ preventScroll: true });
    }
  }, [active, minimized, window.focusVersion, frame.ref]);
  const toggleZoom = event => {
    if (!event.target.closest('button')) manager.zoom(key);
  };
  return (
    <section ref={frame.ref} role="dialog" aria-label={app.title} tabIndex={-1} hidden={minimized}
      data-app={key} className={`mac-window mac-window--${key}${active ? ' is-active' : ''}${frame.moving ? ' is-moving' : ''}${maximized ? ' is-maximized' : ''}`}
      style={{ ...frame.style, zIndex: index + 1 }} onPointerDownCapture={() => manager.focus(key)}
      onPointerDown={event => { if (event.target.closest('[data-window-drag]')) frame.begin(event); }}
      onPointerMove={frame.move} onPointerUp={frame.end} onPointerCancel={frame.end}>
      <header className="mac-window__titlebar" onPointerDown={frame.begin} onDoubleClick={toggleZoom}>
        <WindowControls title={app.label} maximized={maximized} onClose={() => manager.close(key)} onMinimize={() => manager.minimize(key)} onZoom={() => manager.zoom(key)} />
        <div className="mac-window__title"><DockGlyph type={app.icon} /><span>{app.title}</span></div>
        <span className="mac-window__title-spacer" />
      </header>
      <div className="mac-window__body">{children}</div>
      {!maximized && RESIZE_EDGES.map(edge => <div key={edge} className={`window-resize window-resize--${edge}`} aria-hidden="true" onPointerDown={event => frame.begin(event, edge)} />)}
    </section>
  );
}
