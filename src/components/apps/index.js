import AboutApp from './AboutApp';
import CalculatorApp from './CalculatorApp';
import CodeApp from './code/CodeApp';
import FinderApp from './FinderApp';
import MailApp from './MailApp';
import MusicApp from './music/MusicApp';
import NotesApp from './NotesApp';
import SafariApp from './safari/SafariApp';
import SettingsApp from './SettingsApp';
import TerminalApp from './TerminalApp';
import TrashApp from './TrashApp';

const COMPONENTS = { terminal: TerminalApp, finder: FinderApp, safari: SafariApp, mail: MailApp, music: MusicApp, notes: NotesApp, calculator: CalculatorApp, code: CodeApp, settings: SettingsApp, trash: TrashApp, about: AboutApp };

export { isLaunchableApp } from './registry';

export default function AppContent({ appKey, ...props }) {
  const Component = COMPONENTS[appKey];
  return Component ? <Component {...props} /> : null;
}
