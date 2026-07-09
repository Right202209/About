import DesktopGlyph from './icons/DesktopGlyph';

const DESKTOP_ICONS = [
  { key: 'projects', label: 'Projects' },
  { key: 'notes', label: 'Notes' },
  { key: 'assets', label: 'Assets' }
];

export default function DesktopIcons() {
  return (
    <div className="desktop__icons" aria-hidden="true">
      {DESKTOP_ICONS.map(icon => (
        <button
          key={icon.key}
          className={`desktop-icon desktop-icon--${icon.key}`}
          type="button"
          tabIndex={-1}
        >
          <span className="desktop-icon__tile">
            <DesktopGlyph type={icon.key} />
          </span>
          <span className="desktop-icon__label">{icon.label}</span>
        </button>
      ))}
    </div>
  );
}
