import ClaudeWindow from './components/ClaudeWindow';
import DesktopBackground from './components/DesktopBackground';
import DesktopIcons from './components/DesktopIcons';
import Dock from './components/Dock';
import MenuBar from './components/MenuBar';
import useGooglyPointer from './hooks/useGooglyPointer';
import useTheme from './hooks/useTheme';

export default function App() {
  const { theme, setTheme, toggleTheme } = useTheme();
  useGooglyPointer();

  return (
    <div className="desktop">
      <DesktopBackground />
      <MenuBar theme={theme} onToggleTheme={toggleTheme} />
      <div className="desktop__glow" aria-hidden="true" />
      <DesktopIcons />
      <Dock />
      <div className="desktop__content">
        <ClaudeWindow theme={theme} onThemeChange={setTheme} />
      </div>
    </div>
  );
}
