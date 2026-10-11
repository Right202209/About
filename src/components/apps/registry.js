import { claudeBrand, personalInfo } from '../../info';

export const APP_INFO = {
  claude: { title: `${personalInfo.name} — ${claudeBrand.app} — zsh`, label: 'Terminal', icon: 'terminal', width: 900, height: 620 },
  finder: { title: 'Finder', label: 'Finder', icon: 'finder', width: 800, height: 500 },
  safari: { title: 'Safari', label: 'Safari', icon: 'safari', width: 860, height: 540 },
  mail: { title: 'Mail', label: 'Mail', icon: 'mail', width: 760, height: 480 },
  music: { title: 'Music', label: 'Music', icon: 'music', width: 740, height: 540 },
  code: { title: `skills.json — ${personalInfo.name}`, label: 'Visual Studio Code', icon: 'code', width: 760, height: 560 },
  settings: { title: 'System Settings', label: 'System Settings', icon: 'settings', width: 760, height: 560 },
  trash: { title: 'Trash', label: 'Trash', icon: 'trash', width: 560, height: 380 },
  about: { title: 'About This Mac', label: 'About This Mac', icon: 'finder', width: 360, height: 440 }
};

export const DOCK_APPS = ['finder', 'safari', 'mail', 'music', 'code', 'claude', 'settings', 'trash'];
export const isLaunchableApp = key => Boolean(APP_INFO[key]);
