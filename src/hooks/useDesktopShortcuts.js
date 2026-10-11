import { useEffect } from 'react';

/* Global shortcuts: ⌘K Spotlight, ⌘N Finder, ⌘M minimize, ⇧⌘D desktop, F3 / Ctrl+↑ Mission Control, F4 Launchpad. */
export default function useDesktopShortcuts(manager, desktop) {
  const { launch, activeKey, minimize, toggleDesktop } = manager;
  const { openSearch, toggleMission, toggleLaunchpad, mission, setMission } = desktop;
  useEffect(() => {
    const handleKey = event => {
      if (event.defaultPrevented) return;
      if (event.key === 'F3' || (event.ctrlKey && event.key === 'ArrowUp')) { event.preventDefault(); toggleMission(); return; }
      if (event.key === 'F4') { event.preventDefault(); toggleLaunchpad(); return; }
      if (event.key === 'Escape' && mission) { event.preventDefault(); setMission(false); return; }
      if (!(event.metaKey || event.ctrlKey) || event.altKey) return;
      const key = event.key.toLowerCase();
      if (key === 'k' || key === ' ') { event.preventDefault(); openSearch(); }
      if (key === 'n' && !event.target.closest?.('textarea, input')) { event.preventDefault(); launch('finder'); }
      if (key === 'm' && activeKey) { event.preventDefault(); minimize(activeKey); }
      if (key === 'd' && event.shiftKey) { event.preventDefault(); toggleDesktop(); }
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [launch, activeKey, minimize, toggleDesktop, openSearch, toggleMission, toggleLaunchpad, mission, setMission]);
}
