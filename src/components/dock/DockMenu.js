import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import MenuDropdown from '../MenuDropdown';

const MENU_OFFSET = 14;

/* The small menu a Dock icon shows on right-click or long press. */
export default function DockMenu({ menu, onClose }) {
  const ref = useRef(null);
  useEffect(() => {
    const dismiss = event => {
      if (event.key === 'Escape' || (event.type === 'pointerdown' && !ref.current?.contains(event.target))) onClose();
    };
    document.addEventListener('pointerdown', dismiss);
    document.addEventListener('keydown', dismiss);
    return () => { document.removeEventListener('pointerdown', dismiss); document.removeEventListener('keydown', dismiss); };
  }, [onClose]);
  return createPortal(<div className="dock-menu" ref={ref} style={{ left: menu.x, bottom: window.innerHeight - menu.y + MENU_OFFSET }}>
    <MenuDropdown label={menu.label} items={menu.items} onClose={onClose} />
  </div>, document.body);
}
