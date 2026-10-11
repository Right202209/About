import { useEffect, useRef, useState } from 'react';
import DesktopGlyph from './icons/DesktopGlyph';

const DESKTOP_ICONS = [
  { key: 'drive', label: 'Macintosh HD', place: 'Home' },
  { key: 'projects', label: 'Projects', place: 'Projects' },
  { key: 'notes', label: 'Notes', place: 'Documents' },
  { key: 'pictures', label: 'Pictures', place: 'Pictures' }
];

export default function DesktopIcons({ onLaunch, onSelect, selectionReset }) {
  const [selected, setSelected] = useState(null);
  const pointerType = useRef('mouse');
  useEffect(() => setSelected(null), [selectionReset]);
  const open = icon => onLaunch('finder', { place: icon.place });
  return <nav className="desktop__icons" aria-label="Desktop files">
    {DESKTOP_ICONS.map(icon => <button key={icon.key} type="button"
      className={`desktop-icon${selected === icon.key ? ' is-selected' : ''}`}
      aria-label={`Open ${icon.label}`} onPointerDown={event => { pointerType.current = event.pointerType; }}
      onClick={event => { setSelected(icon.key); onSelect(); if (event.detail === 0 || pointerType.current === 'touch') open(icon); }}
      onDoubleClick={() => open(icon)}>
      <span className="desktop-icon__art"><DesktopGlyph type={icon.key === 'drive' ? 'drive' : 'folder'} /></span>
      <span className="desktop-icon__label">{icon.label}</span>
    </button>)}
  </nav>;
}
