import { useEffect } from 'react';

export default function useDesktopShortcuts(manager, onSearch) {
  const { launch, activeKey, minimize, toggleDesktop } = manager;
  useEffect(() => {
    const handleKey = event => {
      if (!(event.metaKey || event.ctrlKey) || event.altKey || event.defaultPrevented) return;
      const key = event.key.toLowerCase();
      if (key === 'k' || key === ' ') { event.preventDefault(); onSearch(); }
      if (key === 'n') { event.preventDefault(); launch('finder'); }
      if (key === 'm' && activeKey) { event.preventDefault(); minimize(activeKey); }
      if (key === 'd' && event.shiftKey) { event.preventDefault(); toggleDesktop(); }
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [launch, activeKey, minimize, toggleDesktop, onSearch]);
}
