const PLACES = ['Recents', 'Desktop', 'Documents', 'Downloads'];
const ACTIVE_PLACE = 'Recents';

const FILES = [
  { glyph: '📁', name: 'Projects' },
  { glyph: '📁', name: 'Notes' },
  { glyph: '📁', name: 'Assets' },
  { glyph: '📄', name: 'resume.pdf' },
  { glyph: '🧩', name: 'info.js' },
  { glyph: '🎮', name: '2048' },
  { glyph: '🖼️', name: 'wallpaper.css' },
  { glyph: '🤖', name: 'claude.txt' }
];

export default function FinderApp() {
  return (
    <div className="app-finder">
      <nav className="app-finder__sidebar">
        <p className="app-section-title">Favorites</p>
        {PLACES.map(place => (
          <span
            key={place}
            className={`app-finder__place${place === ACTIVE_PLACE ? ' app-finder__place--active' : ''}`}
          >
            {place}
          </span>
        ))}
      </nav>
      <div className="app-finder__files">
        <p className="app-section-title">{ACTIVE_PLACE}</p>
        <div className="app-grid">
          {FILES.map(file => (
            <span key={file.name} className="app-tile">
              <span className="app-tile__glyph" aria-hidden="true">{file.glyph}</span>
              <span className="app-tile__name">{file.name}</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
