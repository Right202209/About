import { useEffect, useRef, useState } from 'react';
import DockGlyph from './icons/DockGlyph';
import SystemGlyph from './icons/SystemGlyph';
import { APP_INFO, LAUNCHPAD_APPS } from './apps/registry';

const CLOSE_DURATION = 180;

/* Full-screen app grid with search, opened from the Dock or with F4. */
export default function Launchpad({ onClose, onLaunch }) {
  const [query, setQuery] = useState('');
  const [closing, setClosing] = useState(false);
  const inputRef = useRef(null);
  const apps = LAUNCHPAD_APPS.filter(key => APP_INFO[key].label.toLowerCase().includes(query.trim().toLowerCase()));
  const dismiss = (key) => {
    setClosing(true);
    setTimeout(() => { onClose(); if (key) onLaunch(key); }, CLOSE_DURATION);
  };
  useEffect(() => { inputRef.current?.focus(); }, []);
  const keys = event => {
    if (event.key === 'Escape') { event.preventDefault(); dismiss(); }
    if (event.key === 'Enter' && apps[0]) dismiss(apps[0]);
  };
  return <div className={`launchpad${closing ? ' is-closing' : ''}`} role="dialog" aria-label="Launchpad" onKeyDown={keys} onPointerDown={event => { if (event.target === event.currentTarget || event.target.classList.contains('launchpad__grid')) dismiss(); }}>
    <label className="launchpad__search"><SystemGlyph name="search" /><input ref={inputRef} value={query} placeholder="Search" aria-label="Search apps" onChange={event => setQuery(event.target.value)} /></label>
    <div className="launchpad__grid">
      {apps.map(key => <button type="button" key={key} className="launchpad__app" onClick={() => dismiss(key)}>
        <span className="launchpad__icon"><DockGlyph type={APP_INFO[key].icon} /></span><span>{APP_INFO[key].label}</span>
      </button>)}
    </div>
    <div className="launchpad__dots" aria-hidden="true"><i className="is-active" /><i /></div>
  </div>;
}
