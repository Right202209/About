import { useEffect } from 'react';

const ESCAPE_KEY = 'Escape';

/* Shared macOS-style chrome for dock-launched app pages. Esc or ✕ closes. */
export default function AppWindow({ title, onClose, children }) {
  useEffect(() => {
    const handleKey = event => {
      if (event.key === ESCAPE_KEY) {
        onClose();
      }
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onClose]);

  return (
    <section className="app-window" role="dialog" aria-label={title}>
      <header className="app-window__titlebar">
        <span className="app-window__traffic">
          <button
            type="button"
            className="app-window__dot app-window__dot--close"
            onClick={onClose}
            aria-label={`Close ${title}`}
          />
          <i className="app-window__dot app-window__dot--min" aria-hidden="true" />
          <i className="app-window__dot app-window__dot--max" aria-hidden="true" />
        </span>
        <span className="app-window__title">{title}</span>
        <span className="app-window__spacer" aria-hidden="true" />
      </header>
      <div className="app-window__body">{children}</div>
    </section>
  );
}
