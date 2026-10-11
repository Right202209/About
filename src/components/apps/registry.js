export const APP_INFO = {
  terminal: { title: 'Terminal — zsh', label: 'Terminal', icon: 'terminal', width: 720, height: 460 },
  finder: { title: 'Finder', label: 'Finder', icon: 'finder', width: 800, height: 500 },
  safari: { title: 'Safari', label: 'Safari', icon: 'safari', width: 1000, height: 640, chromeless: true },
  mail: { title: 'Mail', label: 'Mail', icon: 'mail', width: 760, height: 480 },
  music: { title: 'Music', label: 'Music', icon: 'music', width: 980, height: 620, chromeless: true },
  notes: { title: 'Notes', label: 'Notes', icon: 'notes', width: 760, height: 480, chromeless: true },
  calculator: { title: 'Calculator', label: 'Calculator', icon: 'calculator', width: 232, height: 352, fixed: true, chromeless: true },
  code: { title: 'playground — Visual Studio Code', label: 'Visual Studio Code', icon: 'code', width: 980, height: 620 },
  settings: { title: 'System Settings', label: 'System Settings', icon: 'settings', width: 760, height: 560 },
  trash: { title: 'Trash', label: 'Trash', icon: 'trash', width: 560, height: 380 },
  about: { title: 'About This Mac', label: 'About This Mac', icon: 'finder', width: 360, height: 440 }
};

/* Launchpad is a full-screen overlay rather than a window, so it is listed separately. */
export const LAUNCHPAD = { key: 'launchpad', label: 'Launchpad', icon: 'launchpad' };
export const DOCK_APPS = ['finder', 'launchpad', 'safari', 'mail', 'music', 'notes', 'calculator', 'code', 'terminal', 'settings'];
export const LAUNCHPAD_APPS = ['safari', 'mail', 'music', 'notes', 'calculator', 'code', 'terminal', 'finder', 'settings'];
export const isLaunchableApp = key => Boolean(APP_INFO[key]);
