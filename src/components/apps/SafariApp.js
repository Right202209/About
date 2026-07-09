import { contacts, links } from '../../info';

const BACKTICK_PATTERN = /`/g;

function contactUrl(labelPrefix) {
  const entry = contacts.find(c => c.label.toLowerCase().startsWith(labelPrefix));
  return entry ? entry.content.replace(BACKTICK_PATTERN, '').trim() : links.menu;
}

const FAVORITES = [
  { glyph: '🌐', name: 'Portfolio', url: links.menu },
  { glyph: '📄', name: 'Resume', url: links.resume },
  { glyph: '🎮', name: '2048', url: links.game2048 },
  { glyph: '🐙', name: 'GitHub', url: contactUrl('github') },
  { glyph: '🐦', name: 'Twitter', url: contactUrl('twitter') }
];

export default function SafariApp() {
  return (
    <div className="app-safari">
      <div className="app-safari__toolbar">
        <span className="app-safari__address">🔒 {links.menu}</span>
      </div>
      <p className="app-section-title">Favorites</p>
      <div className="app-grid">
        {FAVORITES.map(fav => (
          <a key={fav.name} className="app-tile" href={fav.url} target="_blank" rel="noreferrer">
            <span className="app-tile__glyph" aria-hidden="true">{fav.glyph}</span>
            <span className="app-tile__name">{fav.name}</span>
          </a>
        ))}
      </div>
    </div>
  );
}
