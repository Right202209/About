import { useEffect, useRef } from 'react';
import SystemGlyph from './icons/SystemGlyph';

export default function MenuDropdown({ items, onClose, label }) {
  const ref = useRef(null);
  useEffect(() => { ref.current.querySelector('button:not(:disabled)')?.focus(); }, []);
  const navigate = event => {
    const buttons = [...ref.current.querySelectorAll('button:not(:disabled)')];
    const index = buttons.indexOf(document.activeElement);
    if (['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) {
      event.preventDefault();
      const next = event.key === 'Home' ? 0 : event.key === 'End' ? buttons.length - 1 : (index + (event.key === 'ArrowDown' ? 1 : -1) + buttons.length) % buttons.length;
      buttons[next]?.focus();
    }
    if (event.key === 'Tab') onClose();
  };
  return <div className="menu-dropdown" role="menu" aria-label={label} ref={ref} onKeyDown={navigate}>
    {items.map((item, index) => item.separator ? <div key={index} className="menu-dropdown__separator" role="separator" /> :
      <button type="button" role="menuitem" key={item.label} disabled={item.disabled} className="menu-dropdown__item" onClick={() => { onClose(); item.action(); }}>
        <span className="menu-dropdown__check">{item.checked && <SystemGlyph name="check" />}</span>
        <span>{item.label}</span>{item.shortcut && <span className="menu-dropdown__shortcut">{item.shortcut}</span>}
      </button>)}
  </div>;
}
