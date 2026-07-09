import DockGlyph from './icons/DockGlyph';

const DOCK_ITEMS = [
  { key: 'finder', label: 'Finder', active: true },
  { key: 'safari', label: 'Safari' },
  { key: 'mail', label: 'Mail' },
  { key: 'music', label: 'Music' },
  { key: 'claude', label: 'Claude', active: true },
  { key: 'code', label: 'Code' },
  { key: 'settings', label: 'Settings' },
  { key: 'trash', label: 'Trash' }
];

function DockItem({ item }) {
  const activeClass = item.active ? ' dock__item--active' : '';
  return (
    <button
      className={`dock__item dock__item--${item.key}${activeClass}`}
      type="button"
      tabIndex={-1}
    >
      <DockGlyph type={item.key} />
      <span className="dock__indicator" />
      <span className="dock__tooltip">{item.label}</span>
    </button>
  );
}

export default function Dock() {
  return (
    <div className="desktop__dock" aria-hidden="true">
      <span className="dock__reflection" />
      <div className="dock__items">
        {DOCK_ITEMS.map(item => (
          <DockItem key={item.key} item={item} />
        ))}
      </div>
    </div>
  );
}
