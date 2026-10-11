import { useEffect, useRef } from 'react';
import MenuDropdown from './MenuDropdown';

const MENU_WIDTH = 235;
const MENU_HEIGHT = 172;
const SCREEN_MARGIN = 8;

export default function DesktopContextMenu({ position, manager, onClose }) {
  const ref = useRef(null);
  useEffect(() => {
    const dismiss = event => {
      if (event.key === 'Escape' || (event.type === 'pointerdown' && !ref.current.contains(event.target))) onClose();
    };
    document.addEventListener('pointerdown', dismiss);
    document.addEventListener('keydown', dismiss);
    return () => { document.removeEventListener('pointerdown', dismiss); document.removeEventListener('keydown', dismiss); };
  }, [onClose]);
  const items = [
    { label: 'New Finder Window', action: () => manager.launch('finder') }, { separator: true },
    { label: 'Get Info', action: () => manager.launch('about') },
    { label: 'Change Appearance…', action: () => manager.launch('settings') }, { separator: true },
    { label: 'Show Desktop', action: manager.toggleDesktop }
  ];
  return <div className="desktop-context" ref={ref} style={{ left: Math.max(SCREEN_MARGIN, Math.min(position.x, window.innerWidth - MENU_WIDTH)), top: Math.max(SCREEN_MARGIN, Math.min(position.y, window.innerHeight - MENU_HEIGHT)) }}>
    <MenuDropdown items={items} onClose={onClose} label="Desktop" />
  </div>;
}
