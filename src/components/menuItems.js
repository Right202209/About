import { APP_INFO } from './apps/registry';
import { DARK_THEME } from '../hooks/useTheme';

const SEPARATOR = { separator: true };

export default function menuItems({ manager, theme, onToggleTheme, onSearch, onMission, onLaunchpad, music }) {
  const { activeKey, windows, launch, close, minimize, zoom, toggleDesktop } = manager;
  const app = APP_INFO[activeKey];
  const closeItem = { label: 'Close Window', action: () => close(activeKey), disabled: !activeKey };
  const controls = [
    { label: music.playing ? 'Pause' : 'Play', shortcut: 'Space', action: music.toggle },
    { label: 'Next', shortcut: '⌘→', action: music.next }, { label: 'Previous', shortcut: '⌘←', action: music.previous }, SEPARATOR,
    { label: 'Shuffle', checked: music.shuffle, action: music.toggleShuffle }, { label: `Repeat: ${music.repeat}`, action: music.cycleRepeat }
  ];
  const fileItems = [{ label: 'New Finder Window', shortcut: '⌘N', action: () => launch('finder') }, { label: 'Open…', shortcut: '⌘K', action: onSearch }, SEPARATOR, closeItem];
  return {
    Shell: fileItems,
    Controls: controls,
    Song: controls.slice(0, 3),
    fallback: [{ label: 'Show All Windows', shortcut: 'F3', action: onMission }, { label: 'Launchpad', shortcut: 'F4', action: onLaunchpad }, SEPARATOR, closeItem],
    apple: [
      { label: 'About This Mac', action: () => launch('about') }, SEPARATOR,
      { label: 'System Settings…', action: () => launch('settings') }, SEPARATOR,
      { label: 'Show Desktop', shortcut: '⇧⌘D', action: toggleDesktop }, SEPARATOR, closeItem
    ],
    app: [
      { label: `About ${app?.label || 'Finder'}`, action: () => launch('about') }, SEPARATOR,
      { label: `Hide ${app?.label || 'Finder'}`, shortcut: '⌘M', action: () => minimize(activeKey), disabled: !activeKey }
    ],
    File: fileItems,
    Edit: [{ label: 'Find…', shortcut: '⌘K', action: onSearch }],
    View: [
      { label: 'Show Desktop', shortcut: '⇧⌘D', action: toggleDesktop },
      { label: 'Zoom Window', action: () => zoom(activeKey), disabled: !activeKey },
      { label: 'Mission Control', shortcut: 'F3', action: onMission },
      { label: 'Launchpad', shortcut: 'F4', action: onLaunchpad }, SEPARATOR,
      { label: 'Dark Appearance', checked: theme === DARK_THEME, action: onToggleTheme }
    ],
    Go: [
      { label: 'Home', action: () => launch('finder', { place: 'Home' }) },
      { label: 'Applications', action: onSearch }, { label: 'Utilities', action: () => launch('terminal') }, SEPARATOR,
      ...['Desktop', 'Documents', 'Downloads', 'Pictures', 'Projects'].map(place => ({ label: place, action: () => launch('finder', { place }) }))
    ],
    Window: [
      { label: 'Minimize', shortcut: '⌘M', action: () => minimize(activeKey), disabled: !activeKey },
      { label: 'Zoom', action: () => zoom(activeKey), disabled: !activeKey },
      { label: 'Mission Control', shortcut: 'F3', action: onMission }, SEPARATOR,
      ...windows.map(window => ({ label: APP_INFO[window.key].label, checked: window.key === activeKey, action: () => launch(window.key) }))
    ],
    Help: [{ label: 'Desktop Help', action: () => launch('about', { help: true }) }, { label: 'Search Applications', shortcut: '⌘K', action: onSearch }]
  };
}
