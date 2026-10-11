import { useEffect, useRef, useState } from 'react';
import useMenuClock from '../hooks/useMenuClock';
import SystemGlyph from './icons/SystemGlyph';
import { APP_INFO } from './apps/registry';
import MenuDropdown from './MenuDropdown';
import getMenuItems from './menuItems';
import ControlCenter from './ControlCenter';
import CalendarPanel from './CalendarPanel';
import useMusic from '../hooks/useMusic';

const DEFAULT_MENUS = ['File', 'Edit', 'View', 'Go', 'Window', 'Help'];
const APP_MENUS = {
  terminal: ['Shell', 'Edit', 'View', 'Window', 'Help'],
  safari: ['File', 'Edit', 'View', 'History', 'Bookmarks', 'Window', 'Help'],
  music: ['File', 'Edit', 'Song', 'View', 'Controls', 'Window', 'Help'],
  code: ['File', 'Edit', 'Selection', 'View', 'Go', 'Run', 'Terminal', 'Window', 'Help'],
  notes: ['File', 'Edit', 'Format', 'View', 'Window', 'Help'],
  calculator: ['File', 'Edit', 'View', 'Convert', 'Window', 'Help']
};

function useOpenMenu() {
  const ref = useRef(null);
  const [open, setOpen] = useState(null);
  useEffect(() => {
    if (!open) return undefined;
    const dismiss = event => {
      if (event.type === 'pointerdown' && !ref.current.contains(event.target)) setOpen(null);
      if (event.key === 'Escape') {
        event.preventDefault();
        setOpen(null);
        ref.current.querySelector(`[data-menu="${open}"]`)?.focus();
      }
    };
    document.addEventListener('pointerdown', dismiss);
    document.addEventListener('keydown', dismiss);
    return () => { document.removeEventListener('pointerdown', dismiss); document.removeEventListener('keydown', dismiss); };
  }, [open]);
  return { ref, open, setOpen, close: () => setOpen(null) };
}

function MenuLeft({ menu, manager, items }) {
  const app = APP_INFO[manager.activeKey]?.label || 'Finder';
  const names = APP_MENUS[manager.activeKey] || DEFAULT_MENUS;
  return <div className="desktop__menu-left">
    {['apple', 'app', ...names].map(name => <div className="menu__group" key={name} onPointerEnter={() => { if (menu.open && items[menu.open]) menu.setOpen(name); }}>
      <button type="button" data-menu={name} aria-haspopup="menu" aria-expanded={menu.open === name} aria-label={name === 'apple' ? 'Apple menu' : undefined}
        className={`menu__trigger${name === 'app' ? ' menu__app' : ''}${menu.open === name ? ' is-open' : ''}`}
        onClick={() => menu.setOpen(menu.open === name ? null : name)}
        onKeyDown={event => { if (event.key === 'ArrowDown') { event.preventDefault(); menu.setOpen(name); } }}>
        {name === 'apple' ? <SystemGlyph name="apple" /> : <span>{name === 'app' ? app : name}</span>}
      </button>
      {menu.open === name && <MenuDropdown label={name === 'app' ? app : name} items={items[name] || items.fallback} onClose={menu.close} />}
    </div>)}
  </div>;
}

function MenuRight({ menu, clock, onSearch, controlProps }) {
  return <div className="desktop__menu-right">
    <span className="menu__battery" aria-label="Battery 92%"><span>92%</span><SystemGlyph name="battery" /></span>
    <span className="menu__wifi" aria-label="Wi-Fi connected"><SystemGlyph name="wifi" /></span>
    <button type="button" className="menu__status-button" aria-label="Spotlight Search" onClick={() => { menu.close(); onSearch(); }}><SystemGlyph name="search" /></button>
    <div className="menu__group">
      <button type="button" data-menu="control" className={`menu__status-button${menu.open === 'control' ? ' is-open' : ''}`} aria-label="Control Center" aria-expanded={menu.open === 'control'} onClick={() => menu.setOpen(menu.open === 'control' ? null : 'control')}><SystemGlyph name="control" /></button>
      {menu.open === 'control' && <ControlCenter {...controlProps} onSettings={() => { menu.close(); controlProps.onSettings(); }} onDesktop={() => { menu.close(); controlProps.onDesktop(); }} />}
    </div>
    <div className="menu__group">
      <button type="button" data-menu="calendar" className={`menu__clock${menu.open === 'calendar' ? ' is-open' : ''}`} aria-label={clock.label} aria-expanded={menu.open === 'calendar'} onClick={() => menu.setOpen(menu.open === 'calendar' ? null : 'calendar')}>
        <span className="menu__clock-date">{clock.now.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }).replace(/,/g, '')}</span>
        <span>{clock.now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}</span>
      </button>
      {menu.open === 'calendar' && <CalendarPanel now={clock.now} />}
    </div>
  </div>;
}

export default function MenuBar({ manager, theme, onToggleTheme, onSearch, brightness, onBrightness, onMission, onLaunchpad }) {
  const menu = useOpenMenu();
  const clock = useMenuClock();
  const music = useMusic();
  const items = getMenuItems({ manager, theme, onToggleTheme, onSearch, onMission, onLaunchpad, music });
  const controlProps = { theme, brightness, onBrightness, onToggleTheme, onDesktop: manager.toggleDesktop, onSettings: () => manager.launch('settings'), onMusic: () => manager.launch('music') };
  return <header className="desktop__menu" ref={menu.ref}>
    <MenuLeft menu={menu} manager={manager} items={items} />
    <MenuRight menu={menu} clock={clock} onSearch={onSearch} controlProps={controlProps} />
  </header>;
}
