import { useCallback, useEffect, useRef, useState } from 'react';
import DockGlyph from './icons/DockGlyph';
import DockMenu from './dock/DockMenu';
import { hoverScale, restingCenters } from './dock/magnify';
import { APP_INFO, DOCK_APPS, LAUNCHPAD } from './apps/registry';

const BOUNCE_DURATION = 1300;
const MAGNIFY_QUERY = '(hover: hover) and (min-width: 601px) and (min-height: 501px)';
const SEPARATOR = 'separator';

function dockSlots(windows) {
  const extras = windows.filter(window => !DOCK_APPS.includes(window.key) && window.key !== 'trash').map(window => window.key);
  const minimized = windows.filter(window => window.minimized).map(window => `min:${window.key}`);
  return [...DOCK_APPS, ...extras, SEPARATOR, ...minimized, 'trash'];
}

function describe(slot) {
  if (slot === LAUNCHPAD.key) return { label: LAUNCHPAD.label, icon: LAUNCHPAD.icon };
  const key = slot.replace(/^min:/, '');
  return { key, label: APP_INFO[key].label, icon: APP_INFO[key].icon, minimized: slot !== key };
}

function useMagnify(slots) {
  const itemsRef = useRef(null);
  const setScales = useCallback(pointer => {
    const nodes = [...(itemsRef.current?.children || [])];
    const centers = restingCenters(slots, window.innerWidth / 2);
    nodes.forEach((node, index) => node.style.setProperty('--s', pointer === null ? 1 : hoverScale(pointer, centers[index]).toFixed(4)));
  }, [slots]);
  const onPointerMove = event => {
    if (event.pointerType === 'touch' || !window.matchMedia(MAGNIFY_QUERY).matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    setScales(event.clientX);
  };
  return { itemsRef, onPointerMove, onPointerLeave: () => setScales(null) };
}

function menuFor(info, slot, { windows, onLaunch, onQuit, onLaunchpad }) {
  if (slot === LAUNCHPAD.key) return [{ label: 'Open Launchpad', action: onLaunchpad }];
  const running = windows.some(window => window.key === info.key);
  const items = [{ label: running ? 'Show' : 'Open', action: () => onLaunch(info.key) }];
  if (info.key === 'trash') return [{ label: 'Open', action: () => onLaunch('trash') }, { separator: true }, { label: 'Empty Trash', disabled: true, action: () => {} }];
  items.push({ separator: true }, { label: 'Keep in Dock', checked: DOCK_APPS.includes(info.key), disabled: true, action: () => {} });
  if (running) items.push({ separator: true }, { label: 'Quit', action: () => onQuit(info.key) });
  return items;
}

function DockItem({ slot, windows, activeKey, launching, onActivate, onMenu }) {
  const info = describe(slot);
  const running = info.key === 'finder' || windows.some(window => window.key === info.key);
  const classes = ['dock__item', running && !info.minimized ? 'is-running' : '', launching === slot ? 'is-launching' : '', info.minimized ? 'is-minimized' : '', activeKey === info.key ? 'is-active' : ''].join(' ');
  return <div className="dock__slot" data-dock-app={info.minimized ? undefined : slot} data-dock-minimized={info.minimized ? info.key : undefined}>
    <button type="button" className={classes} aria-label={info.minimized ? `Restore ${info.label}` : `Open ${info.label}`}
      onClick={() => onActivate(slot, info, running)}
      onContextMenu={event => { event.preventDefault(); onMenu(event, slot, info); }}>
      <span className="dock__icon"><DockGlyph type={info.icon} />{info.minimized && <span className="dock__mini-badge"><DockGlyph type={info.icon} /></span>}</span>
      <span className="dock__tooltip">{info.label}</span>
    </button>
    <span className="dock__indicator" aria-hidden="true" />
  </div>;
}

export default function Dock({ windows, activeKey, onLaunch, onQuit, onLaunchpad }) {
  const slots = dockSlots(windows);
  const magnify = useMagnify(slots);
  const [launching, setLaunching] = useState(null);
  const [menu, setMenu] = useState(null);
  useEffect(() => {
    if (!launching) return undefined;
    const timeout = setTimeout(() => setLaunching(null), BOUNCE_DURATION);
    return () => clearTimeout(timeout);
  }, [launching]);
  const activate = (slot, info, running) => {
    if (slot === LAUNCHPAD.key) { onLaunchpad(); return; }
    if (!running && !info.minimized) setLaunching(slot);
    onLaunch(info.key);
  };
  const openMenu = (event, slot, info) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setMenu({ x: rect.left + rect.width / 2, y: rect.top, label: info.label, items: menuFor(info, slot, { windows, onLaunch, onQuit, onLaunchpad }) });
  };
  return <nav className="desktop__dock" aria-label="Dock" onPointerMove={magnify.onPointerMove} onPointerLeave={magnify.onPointerLeave}>
    <div className="dock__items" ref={magnify.itemsRef}>
      {slots.map(slot => slot === SEPARATOR ? <div key={slot} className="dock__separator" aria-hidden="true" /> :
        <DockItem key={slot} slot={slot} windows={windows} activeKey={activeKey} launching={launching} onActivate={activate} onMenu={openMenu} />)}
    </div>
    {menu && <DockMenu menu={menu} onClose={() => setMenu(null)} />}
  </nav>;
}
