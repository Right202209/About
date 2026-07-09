import AppWindow from './AppWindow';
import CodeApp from './CodeApp';
import FinderApp from './FinderApp';
import MailApp from './MailApp';
import MusicApp from './MusicApp';
import SafariApp from './SafariApp';
import SettingsApp from './SettingsApp';
import TrashApp from './TrashApp';

const APPS = {
  finder: { title: 'Finder', Component: FinderApp },
  safari: { title: 'Safari', Component: SafariApp },
  mail: { title: 'Mail', Component: MailApp },
  music: { title: 'Music', Component: MusicApp },
  code: { title: 'Code — Droit', Component: CodeApp },
  settings: { title: 'System Settings', Component: SettingsApp },
  trash: { title: 'Trash', Component: TrashApp }
};

/* The Claude dock item is not here on purpose: it re-focuses the terminal. */
export const isLaunchableApp = key => Boolean(APPS[key]);

export default function AppOverlay({ appKey, onClose, theme, onThemeChange }) {
  const app = APPS[appKey];
  if (!app) {
    return null;
  }
  const { title, Component } = app;
  return (
    <div className="app-overlay">
      <AppWindow title={title} onClose={onClose}>
        <Component theme={theme} onThemeChange={onThemeChange} />
      </AppWindow>
    </div>
  );
}
