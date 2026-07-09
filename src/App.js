import { useState } from 'react';
import AppOverlay, { isLaunchableApp } from './components/apps';
import ClaudeWindow from './components/ClaudeWindow';
import DesktopBackground from './components/DesktopBackground';
import DesktopIcons from './components/DesktopIcons';
import Dock from './components/Dock';
import MenuBar from './components/MenuBar';
import useGooglyPointer from './hooks/useGooglyPointer';
import useTheme from './hooks/useTheme';

export default function App() {
  const { theme, setTheme, toggleTheme } = useTheme();
  const [openApp, setOpenApp] = useState(null);
  useGooglyPointer();

  /* Dock: Claude re-focuses the terminal (closes any page); others toggle. */
  const launchApp = key => setOpenApp(prev => {
    if (!isLaunchableApp(key)) {
      return null;
    }
    return prev === key ? null : key;
  });

  const closeApp = () => setOpenApp(null);

  return (
    <div className="desktop">
      <DesktopBackground />
      <MenuBar theme={theme} onToggleTheme={toggleTheme} />
      <div className="desktop__glow" aria-hidden="true" />
      <DesktopIcons />
      <Dock openApp={openApp} onLaunch={launchApp} />
      <div className="desktop__content">
        <ClaudeWindow theme={theme} onThemeChange={setTheme} />
        {openApp && (
          <AppOverlay appKey={openApp} onClose={closeApp} theme={theme} onThemeChange={setTheme} />
        )}
      </div>
    </div>
  );
}
