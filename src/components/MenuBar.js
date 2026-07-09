import GooglyEyes from './GooglyEyes';
import ThemeGlyph from './icons/ThemeGlyph';
import useMenuClock from '../hooks/useMenuClock';
import { DARK_THEME } from '../hooks/useTheme';
import { claudeBrand } from '../info';

const MENU_ITEMS = ['File', 'Edit', 'View', 'Go', 'Window', 'Help'];
const BATTERY_LABEL = '92%';

function MenuLeft() {
  return (
    <div className="desktop__menu-left" aria-hidden="true">
      <span className="menu__apple" />
      <GooglyEyes />
      <span className="menu__app">{claudeBrand.app}</span>
      {MENU_ITEMS.map(item => (
        <span key={item} className="menu__item">
          {item}
        </span>
      ))}
    </div>
  );
}

function ThemeToggle({ theme, onToggleTheme }) {
  const dark = theme === DARK_THEME;
  return (
    <button
      type="button"
      className="menu__theme-toggle"
      onClick={onToggleTheme}
      aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={dark ? 'Light mode' : 'Dark mode'}
    >
      <ThemeGlyph theme={theme} />
    </button>
  );
}

function MenuRight({ theme, onToggleTheme }) {
  const clock = useMenuClock();
  return (
    <div className="desktop__menu-right">
      <span className="menu__status" aria-hidden="true">
        <span className="menu__dot" />
        Online
      </span>
      <span className="menu__wifi" aria-hidden="true">Wi-Fi</span>
      <span className="menu__battery" aria-hidden="true">
        <span className="battery">
          <span className="battery__level" />
        </span>
        {BATTERY_LABEL}
      </span>
      <span className="menu__clock" aria-hidden="true">{clock}</span>
      <ThemeToggle theme={theme} onToggleTheme={onToggleTheme} />
    </div>
  );
}

export default function MenuBar({ theme, onToggleTheme }) {
  return (
    <div className="desktop__menu">
      <MenuLeft />
      <MenuRight theme={theme} onToggleTheme={onToggleTheme} />
    </div>
  );
}
