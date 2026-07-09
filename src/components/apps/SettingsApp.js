import { DARK_THEME, LIGHT_THEME } from '../../hooks/useTheme';
import { claudeBrand, personalInfo } from '../../info';

const THEME_CHOICES = [
  { value: LIGHT_THEME, label: '☀️ Light' },
  { value: DARK_THEME, label: '🌙 Dark' }
];

const ABOUT_ROWS = [
  { label: 'Owner', value: personalInfo.name },
  { label: 'App', value: `${claudeBrand.app} ${claudeBrand.version}` },
  { label: 'Model', value: claudeBrand.model },
  { label: 'Email', value: personalInfo.email }
];

export default function SettingsApp({ theme, onThemeChange }) {
  return (
    <div className="app-settings">
      <p className="app-section-title">Appearance</p>
      <div className="app-settings__choices">
        {THEME_CHOICES.map(choice => (
          <button
            key={choice.value}
            type="button"
            className={`app-settings__choice${theme === choice.value ? ' app-settings__choice--active' : ''}`}
            onClick={() => onThemeChange(choice.value)}
          >
            {choice.label}
          </button>
        ))}
      </div>
      <p className="app-section-title">About</p>
      {ABOUT_ROWS.map(row => (
        <div key={row.label} className="app-row">
          <span className="app-row__name">{row.label}</span>
          <span className="app-row__meta">{row.value}</span>
        </div>
      ))}
    </div>
  );
}
