import AboutApp from './AboutApp';
import CodeApp from './CodeApp';
import FinderApp from './FinderApp';
import MailApp from './MailApp';
import MusicApp from './MusicApp';
import SafariApp from './SafariApp';
import SettingsApp from './SettingsApp';
import TerminalApp from './TerminalApp';
import TrashApp from './TrashApp';

const COMPONENTS = { terminal: TerminalApp, finder: FinderApp, safari: SafariApp, mail: MailApp, music: MusicApp, code: CodeApp, settings: SettingsApp, trash: TrashApp, about: AboutApp };

export { isLaunchableApp } from './registry';

export default function AppContent({ appKey, ...props }) {
  const Component = COMPONENTS[appKey];
  return Component ? <Component {...props} /> : null;
}
