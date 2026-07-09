import { DARK_THEME } from '../../hooks/useTheme';

const VIEW_BOX = '0 0 24 24';

function SunGlyph() {
  return (
    <svg className="menu__theme-icon" viewBox={VIEW_BOX} aria-hidden="true">
      <circle cx="12" cy="12" r="4.2" fill="currentColor" />
      <g stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
        <path d="M12 2.6v3M12 18.4v3M2.6 12h3M18.4 12h3M5.1 5.1l2.1 2.1M16.8 16.8l2.1 2.1M18.9 5.1l-2.1 2.1M7.2 16.8l-2.1 2.1" />
      </g>
    </svg>
  );
}

function MoonGlyph() {
  return (
    <svg className="menu__theme-icon" viewBox={VIEW_BOX} aria-hidden="true">
      <path d="M20.5 14.6A8.2 8.2 0 1 1 9.4 3.5a6.6 6.6 0 0 0 11.1 11.1z" fill="currentColor" />
      <circle cx="10.2" cy="10.6" r="1.1" fill="currentColor" opacity="0.35" />
      <circle cx="13.4" cy="14.8" r="0.8" fill="currentColor" opacity="0.3" />
    </svg>
  );
}

/* Shows a sun while dark (click → light) and a moon while light (click → dark). */
export default function ThemeGlyph({ theme }) {
  return theme === DARK_THEME ? <SunGlyph /> : <MoonGlyph />;
}
