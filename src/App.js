import { useCallback, useEffect, useState } from 'react';
import AppContent from './components/apps';
import AppWindow from './components/apps/AppWindow';
import DesktopBackground from './components/DesktopBackground';
import DesktopContextMenu from './components/DesktopContextMenu';
import DesktopIcons from './components/DesktopIcons';
import Dock from './components/Dock';
import MenuBar from './components/MenuBar';
import Spotlight from './components/Spotlight';
import useDesktopShortcuts from './hooks/useDesktopShortcuts';
import useTheme from './hooks/useTheme';
import useWindowManager from './hooks/useWindowManager';
import { personalInfo } from './info';

const NOTICE_DURATION = 2600;

function useDesktopState() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [context, setContext] = useState(null);
  const [brightness, setBrightness] = useState(100);
  const [selectionReset, setSelectionReset] = useState(0);
  const [notice, setNotice] = useState('');
  const openSearch = useCallback(() => setSearchOpen(true), []);
  const closeContext = useCallback(() => setContext(null), []);
  useEffect(() => {
    if (!notice) return undefined;
    const timeout = setTimeout(() => setNotice(''), NOTICE_DURATION);
    return () => clearTimeout(timeout);
  }, [notice]);
  const copyEmail = async () => {
    try { await navigator.clipboard.writeText(personalInfo.email); setNotice('Email address copied'); }
    catch { setNotice(`Copy unavailable · ${personalInfo.email}`); }
  };
  return { searchOpen, setSearchOpen, openSearch, context, setContext, closeContext, brightness, setBrightness, selectionReset, setSelectionReset, notice, copyEmail };
}

export default function App() {
  const { theme, setTheme, toggleTheme } = useTheme();
  const manager = useWindowManager();
  const desktop = useDesktopState();
  useDesktopShortcuts(manager, desktop.openSearch);
  const clearSelection = event => {
    if (event.target !== event.currentTarget) return;
    manager.blur();
    desktop.closeContext();
    desktop.setSelectionReset(value => value + 1);
  };
  const contextMenu = event => {
    if (event.target.closest('.mac-window, .desktop__dock, .desktop__menu, .spotlight')) return;
    event.preventDefault();
    desktop.setContext({ x: event.clientX, y: event.clientY });
  };
  return <div className="desktop" onPointerDown={clearSelection} onContextMenu={contextMenu}>
    <DesktopBackground brightness={desktop.brightness} />
    <MenuBar manager={manager} theme={theme} onToggleTheme={toggleTheme} onSearch={desktop.openSearch} brightness={desktop.brightness} onBrightness={desktop.setBrightness} onCopyEmail={desktop.copyEmail} />
    <DesktopIcons onLaunch={manager.launch} onSelect={manager.blur} selectionReset={desktop.selectionReset} />
    <main className="desktop__content" aria-label="Application windows">
      {[...manager.windows].sort((a, b) => a.key.localeCompare(b.key)).map(window => <AppWindow key={window.key} window={window} index={manager.windows.findIndex(item => item.key === window.key)} active={manager.activeKey === window.key} manager={manager}>
        <AppContent appKey={window.key} payload={window.payload} theme={theme} onThemeChange={setTheme} onLaunch={manager.launch} active={manager.activeKey === window.key && !window.minimized && !desktop.searchOpen} brightness={desktop.brightness} onBrightness={desktop.setBrightness} />
      </AppWindow>)}
    </main>
    <Dock windows={manager.windows} onLaunch={manager.launch} />
    <button type="button" className="desktop__show" aria-label="Show desktop" onClick={manager.toggleDesktop} />
    {manager.windows.every(window => window.minimized) && <div className="desktop__hint">Click an app in the Dock to get started.</div>}
    {desktop.context && <DesktopContextMenu position={desktop.context} manager={manager} onClose={desktop.closeContext} />}
    {desktop.searchOpen && <Spotlight onClose={() => desktop.setSearchOpen(false)} onLaunch={manager.launch} />}
    {desktop.notice && <div className="system-toast" role="status">{desktop.notice}</div>}
  </div>;
}
