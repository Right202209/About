export const APP_INFO = {
  terminal: { title: 'Terminal — zsh', label: 'Terminal', icon: 'terminal', width: 720, height: 460 },
  finder: { title: 'Finder', label: 'Finder', icon: 'finder', width: 800, height: 500 },
  safari: { title: 'Safari', label: 'Safari', icon: 'safari', width: 860, height: 540 },
  mail: { title: 'Mail', label: 'Mail', icon: 'mail', width: 760, height: 480 },
  music: { title: 'Music', label: 'Music', icon: 'music', width: 740, height: 540 },
  code: { title: 'hello.js — playground', label: 'Visual Studio Code', icon: 'code', width: 760, height: 560 },
  settings: { title: 'System Settings', label: 'System Settings', icon: 'settings', width: 760, height: 560 },
  trash: { title: 'Trash', label: 'Trash', icon: 'trash', width: 560, height: 380 },
  about: { title: 'About This Mac', label: 'About This Mac', icon: 'finder', width: 360, height: 440 }
};

export const DOCK_APPS = ['finder', 'safari', 'mail', 'music', 'code', 'terminal', 'settings', 'trash'];
export const isLaunchableApp = key => Boolean(APP_INFO[key]);
