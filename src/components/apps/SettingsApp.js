import { useState } from 'react';
import { DARK_THEME, LIGHT_THEME } from '../../hooks/useTheme';
import { claudeBrand, personalInfo } from '../../info';
import SystemGlyph from '../icons/SystemGlyph';

const PANES = [{ name: 'Appearance', icon: 'sun' }, { name: 'Wallpaper', icon: 'desktop' }, { name: 'About', icon: 'info' }];
const THEMES = [{ value: LIGHT_THEME, label: 'Light' }, { value: DARK_THEME, label: 'Dark' }];
const ABOUT_ROWS = [{ label: 'Owner', value: personalInfo.name }, { label: 'Workspace', value: claudeBrand.cwd }, { label: 'Terminal', value: claudeBrand.app }, { label: 'Email', value: personalInfo.email }];

function Appearance({ theme, onThemeChange }) {
  return <><h2>Appearance</h2><div className="settings-card"><div className="settings-appearance">
    {THEMES.map(choice => <button key={choice.value} type="button" className={`appearance-choice${theme === choice.value ? ' is-selected' : ''}`} aria-pressed={theme === choice.value} onClick={() => onThemeChange(choice.value)}>
      <span className={`appearance-preview appearance-preview--${choice.value}`}><span className="appearance-preview__menu" /><span className="appearance-preview__window"><i /><i /><i /><span /></span><span className="appearance-preview__dock" /></span>
      <span>{choice.label}</span><span className="appearance-choice__check">{theme === choice.value && <SystemGlyph name="check" />}</span>
    </button>)}
  </div><p className="settings-card__note">Choose the appearance of windows, menus, and the Dock.</p></div>
  <div className="settings-card settings-row"><span>Accent color</span><span className="settings-accent" aria-label="Blue accent color" /></div></>;
}

function Wallpaper({ brightness, onBrightness }) {
  return <><h2>Wallpaper</h2><div className="settings-card"><img className="settings-wallpaper" src={`${process.env.PUBLIC_URL}/macos26-desktop.jpg`} alt="Sunlight through a redwood forest" /><div className="settings-wallpaper__name"><span>Redwood forest</span><SystemGlyph name="check" /></div></div>
    <div className="settings-card"><label className="settings-row" htmlFor="settings-brightness"><span>Wallpaper brightness</span><span>{brightness}%</span></label><input id="settings-brightness" className="settings-range" type="range" min="40" max="100" value={brightness} onChange={event => onBrightness(Number(event.target.value))} /></div></>;
}

export default function SettingsApp({ theme, onThemeChange, brightness, onBrightness }) {
  const [pane, setPane] = useState('Appearance');
  return <div className="app-settings">
    <nav className="settings-sidebar" aria-label="Settings categories">
      <div className="settings-profile"><img src={`${process.env.PUBLIC_URL}/droit.jpg`} alt="" /><div><strong>{personalInfo.name}</strong><small>Personal account</small></div></div>
      {PANES.map(item => <button key={item.name} type="button" className={pane === item.name ? 'is-selected' : ''} onClick={() => setPane(item.name)}><span className={`settings-sidebar__icon settings-sidebar__icon--${item.name.toLowerCase()}`}><SystemGlyph name={item.icon} /></span>{item.name}</button>)}
    </nav>
    <div className="settings-content">
      {pane === 'Appearance' && <Appearance theme={theme} onThemeChange={onThemeChange} />}
      {pane === 'Wallpaper' && <Wallpaper brightness={brightness} onBrightness={onBrightness} />}
      {pane === 'About' && <><h2>About</h2><div className="settings-card">{ABOUT_ROWS.map(row => <div className="settings-row" key={row.label}><span>{row.label}</span><span>{row.value}</span></div>)}</div></>}
    </div>
  </div>;
}
