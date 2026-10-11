import { useCallback, useEffect, useRef, useState } from 'react';
import AppContent from './components/apps';
import AppWindow from './components/apps/AppWindow';
import DesktopBackground from './components/DesktopBackground';
import DesktopContextMenu from './components/DesktopContextMenu';
import DesktopIcons from './components/DesktopIcons';
import Dock from './components/Dock';
import Launchpad from './components/Launchpad';
import MenuBar from './components/MenuBar';
import Spotlight from './components/Spotlight';
import useDesktopShortcuts from './hooks/useDesktopShortcuts';
import useMissionControl from './hooks/useMissionControl';
import { MusicProvider } from './hooks/useMusic';
import useTheme from './hooks/useTheme';
import useWindowManager from './hooks/useWindowManager';

const NOTICE_DURATION = 2600;

function useDesktopState() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [launchpad, setLaunchpad] = useState(false);
  const [mission, setMission] = useState(false);
  const [context, setContext] = useState(null);
  const [brightness, setBrightness] = useState(100);
  const [selectionReset, setSelectionReset] = useState(0);
  const [notice, setNotice] = useState('');
  const openSearch = useCallback(() => setSearchOpen(true), []);
  const toggleLaunchpad = useCallback(() => setLaunchpad(value => !value), []);
  const toggleMission = useCallback(() => setMission(value => !value), []);
  const closeContext = useCallback(() => setContext(null), []);
  useEffect(() => {
    if (!notice) return undefined;
    const timeout = setTimeout(() => setNotice(''), NOTICE_DURATION);
    return () => clearTimeout(timeout);
  }, [notice]);
  return { searchOpen, setSearchOpen, openSearch, launchpad, setLaunchpad, toggleLaunchpad, mission, setMission, toggleMission, context, setContext, closeContext, brightness, setBrightness, selectionReset, setSelectionReset, notice, setNotice };
}

function Windows({ manager, desktop, theme, setTheme }) {
  const stageRef = useRef(null);
  const visible = manager.windows.filter(window => !window.minimized).length;
  useMissionControl(desktop.mission, stageRef, visible);
  const pickWindow = event => {
    if (!desktop.mission) return;
    event.preventDefault();
    event.stopPropagation();
    const key = event.target.closest('.mac-window')?.dataset.app;
    desktop.setMission(false);
    if (key) manager.launch(key);
  };
  return <main ref={stageRef} className={`desktop__content${desktop.mission ? ' is-mission' : ''}`} aria-label="Application windows" onPointerDownCapture={pickWindow} onClickCapture={event => { if (desktop.mission) event.stopPropagation(); }}>
    {[...manager.windows].sort((a, b) => a.key.localeCompare(b.key)).map(window => <AppWindow key={window.key} window={window} index={manager.windows.findIndex(item => item.key === window.key)} active={manager.activeKey === window.key} manager={manager}>
      <AppContent appKey={window.key} payload={window.payload} theme={theme} onThemeChange={setTheme} onLaunch={manager.launch} active={manager.activeKey === window.key && !window.minimized && !desktop.searchOpen} brightness={desktop.brightness} onBrightness={desktop.setBrightness} />
    </AppWindow>)}
  </main>;
}

function Desktop() {
  const { theme, setTheme, toggleTheme } = useTheme();
  const manager = useWindowManager();
  const desktop = useDesktopState();
  useDesktopShortcuts(manager, desktop);
  const clearSelection = event => {
    if (desktop.mission && !event.target.closest('.mac-window, .desktop__dock, .desktop__menu')) desktop.setMission(false);
    if (event.target !== event.currentTarget) return;
    manager.blur();
    desktop.closeContext();
    desktop.setSelectionReset(value => value + 1);
  };
  const contextMenu = event => {
    if (event.target.closest('.mac-window, .desktop__dock, .desktop__menu, .spotlight, .launchpad, .dock-menu')) return;
    event.preventDefault();
    desktop.setContext({ x: event.clientX, y: event.clientY });
  };
  return <div className={`desktop${desktop.mission ? ' is-mission' : ''}${desktop.launchpad ? ' is-launchpad' : ''}`} onPointerDown={clearSelection} onContextMenu={contextMenu}>
    <DesktopBackground brightness={desktop.brightness} />
    <MenuBar manager={manager} theme={theme} onToggleTheme={toggleTheme} onSearch={desktop.openSearch} brightness={desktop.brightness} onBrightness={desktop.setBrightness} onMission={desktop.toggleMission} onLaunchpad={desktop.toggleLaunchpad} />
    <DesktopIcons onLaunch={manager.launch} onSelect={manager.blur} selectionReset={desktop.selectionReset} />
    <Windows manager={manager} desktop={desktop} theme={theme} setTheme={setTheme} />
    <Dock windows={manager.windows} activeKey={manager.activeKey} onLaunch={key => { desktop.setMission(false); manager.launch(key); }} onQuit={manager.close} onLaunchpad={desktop.toggleLaunchpad} />
    <button type="button" className="desktop__show" aria-label="Show desktop" onClick={manager.toggleDesktop} />
    {manager.windows.every(window => window.minimized) && !desktop.launchpad && <div className="desktop__hint">Click an app in the Dock to get started.</div>}
    {desktop.mission && !manager.windows.some(window => !window.minimized) && <div className="desktop__hint desktop__hint--mission">No open windows</div>}
    {desktop.context && <DesktopContextMenu position={desktop.context} manager={manager} onClose={desktop.closeContext} />}
    {desktop.launchpad && <Launchpad onClose={() => desktop.setLaunchpad(false)} onLaunch={manager.launch} />}
    {desktop.searchOpen && <Spotlight onClose={() => desktop.setSearchOpen(false)} onLaunch={manager.launch} />}
    {desktop.notice && <div className="system-toast" role="status">{desktop.notice}</div>}
  </div>;
}

export default function App() {
  return <MusicProvider><Desktop /></MusicProvider>;
}
