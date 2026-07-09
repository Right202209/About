import DockGlyph from './icons/DockGlyph';

const TERMINAL_KEY = 'claude';

const DOCK_ITEMS = [
  { key: 'finder', label: 'Finder' },
  { key: 'safari', label: 'Safari' },
  { key: 'mail', label: 'Mail' },
  { key: 'music', label: 'Music' },
  { key: TERMINAL_KEY, label: 'Claude' },
  { key: 'code', label: 'Code' },
  { key: 'settings', label: 'Settings' },
  { key: 'trash', label: 'Trash' }
];

function DockItem({ item, active, onLaunch }) {
  const activeClass = active ? ' dock__item--active' : '';
  return (
    <button
      className={`dock__item dock__item--${item.key}${activeClass}`}
      type="button"
      onClick={() => onLaunch(item.key)}
      aria-label={`Open ${item.label}`}
    >
      <DockGlyph type={item.key} />
      <span className="dock__indicator" />
      <span className="dock__tooltip">{item.label}</span>
    </button>
  );
}

/* The terminal is always running; other items light up while their page is open. */
export default function Dock({ openApp, onLaunch }) {
  return (
    <div className="desktop__dock">
      <span className="dock__reflection" />
      <div className="dock__items">
        {DOCK_ITEMS.map(item => (
          <DockItem
            key={item.key}
            item={item}
            active={item.key === TERMINAL_KEY || item.key === openApp}
            onLaunch={onLaunch}
          />
        ))}
      </div>
    </div>
  );
}
