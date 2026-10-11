import { useEffect, useRef, useState } from 'react';
import DockGlyph from './icons/DockGlyph';
import { APP_INFO, DOCK_APPS } from './apps/registry';

const MAGNIFICATION_RADIUS = 150;
const MAGNIFICATION_AMOUNT = .42;
const BOUNCE_DURATION = 540;

export default function Dock({ windows, onLaunch }) {
  const itemsRef = useRef(null);
  const [launching, setLaunching] = useState(null);
  useEffect(() => {
    if (!launching) return undefined;
    const timeout = setTimeout(() => setLaunching(null), BOUNCE_DURATION);
    return () => clearTimeout(timeout);
  }, [launching]);
  const magnify = event => {
    if (event.pointerType === 'touch' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const items = [...itemsRef.current.querySelectorAll('.dock__item')];
    const scales = items.map(item => {
      const rect = item.getBoundingClientRect();
      const distance = Math.min(Math.abs(event.clientX - rect.left - rect.width / 2) / MAGNIFICATION_RADIUS, 1);
      return 1 + MAGNIFICATION_AMOUNT * Math.cos(distance * Math.PI / 2) ** 2;
    });
    items.forEach((item, index) => item.style.setProperty('--dock-scale', scales[index]));
  };
  const reset = () => itemsRef.current.querySelectorAll('.dock__item').forEach(item => item.style.setProperty('--dock-scale', 1));
  const launch = key => { setLaunching(key); onLaunch(key); };
  return <nav className="desktop__dock" aria-label="Dock" onPointerMove={magnify} onPointerLeave={reset}>
    <div className="dock__items" ref={itemsRef}>
      {DOCK_APPS.map(key => {
        const app = APP_INFO[key];
        const running = key === 'finder' || windows.some(window => window.key === key);
        return <div className={`dock__slot${key === 'trash' ? ' dock__slot--separated' : ''}`} key={key}>
          <button type="button" className={`dock__item${running ? ' is-running' : ''}${launching === key ? ' is-launching' : ''}`} aria-label={`Open ${app.label}`} onClick={() => launch(key)}>
            <span className="dock__icon"><DockGlyph type={app.icon} /></span>
            <span className="dock__indicator" />
            <span className="dock__tooltip">{app.label}</span>
          </button>
        </div>;
      })}
    </div>
  </nav>;
}
