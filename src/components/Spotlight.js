import { useEffect, useRef, useState } from 'react';
import { APP_INFO } from './apps/registry';
import DockGlyph from './icons/DockGlyph';
import SystemGlyph from './icons/SystemGlyph';

const SEARCH_APPS = Object.entries(APP_INFO).map(([key, app]) => ({ key, ...app }));
const SEARCH_LIMIT = 7;

function useSearchFocus(inputRef, onClose) {
  useEffect(() => {
    const previous = document.activeElement;
    inputRef.current.focus();
    return () => { if (previous?.isConnected) previous.focus({ preventScroll: true }); };
  }, [inputRef]);
  return event => {
    if (event.key === 'Escape') { event.preventDefault(); event.stopPropagation(); onClose(); }
    if (event.key === 'Tab') { event.preventDefault(); inputRef.current.focus(); }
  };
}

export default function Spotlight({ onClose, onLaunch }) {
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(0);
  const inputRef = useRef(null);
  const handleFocus = useSearchFocus(inputRef, onClose);
  const results = SEARCH_APPS.filter(app => `${app.label} ${app.title} ${app.key}`.toLowerCase().includes(query.toLowerCase().trim())).slice(0, SEARCH_LIMIT);
  const selectedKey = results[selected]?.key;
  useEffect(() => { document.getElementById(`spotlight-${selectedKey}`)?.scrollIntoView({ block: 'nearest' }); }, [selectedKey]);
  const launch = key => { onClose(); onLaunch(key); };
  const handleKeys = event => {
    handleFocus(event);
    if (['ArrowDown', 'ArrowUp'].includes(event.key)) {
      event.preventDefault();
      setSelected(index => (index + (event.key === 'ArrowDown' ? 1 : -1) + results.length) % (results.length || 1));
    }
    if (event.key === 'Enter' && results[selected]) { event.preventDefault(); launch(results[selected].key); }
  };
  return <div className="spotlight-backdrop" onPointerDown={event => { if (event.target === event.currentTarget) onClose(); }}>
    <section className="spotlight" role="dialog" aria-modal="true" aria-label="Spotlight Search" onKeyDown={handleKeys}>
      <div className="spotlight__search"><SystemGlyph name="search" />
        <input ref={inputRef} value={query} onChange={event => { setQuery(event.target.value); setSelected(0); }} placeholder="Spotlight Search" aria-label="Search applications" role="combobox" aria-expanded="true" aria-controls="spotlight-results" aria-activedescendant={results[selected] ? `spotlight-${results[selected].key}` : undefined} autoComplete="off" spellCheck="false" />
        <button type="button" className="spotlight__close" aria-label="Close Spotlight" onClick={onClose}><span>esc</span></button>
      </div>
      <div className="spotlight__results" id="spotlight-results" role="listbox" aria-label="Applications">
        <p className="spotlight__category">Applications</p>
        {results.map((app, index) => <div key={app.key} id={`spotlight-${app.key}`} role="option" aria-selected={selected === index} className={`spotlight__result${selected === index ? ' is-selected' : ''}`} onPointerMove={() => setSelected(index)} onClick={() => launch(app.key)}>
          <DockGlyph type={app.icon} /><span>{app.label}</span><small>Application</small>{selected === index && <SystemGlyph name="return" className="spotlight__enter" />}
        </div>)}
        {!results.length && <p className="spotlight__empty">No results for “{query}”</p>}
      </div>
      <footer className="spotlight__footer"><span>↑ ↓ to navigate</span><span><SystemGlyph name="return" /> to open</span></footer>
    </section>
  </div>;
}
