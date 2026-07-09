import { cartoons } from '../../info';

const PLAYLIST_SIZE = 8;
const BASE_MINUTES = 3;
const SECONDS_STEP = 17;
const SECONDS_PER_MINUTE = 60;
const PAD_WIDTH = 2;

/* Deterministic fake durations so the list is stable between renders. */
function trackDuration(index) {
  const seconds = (index * SECONDS_STEP) % SECONDS_PER_MINUTE;
  return `${BASE_MINUTES + (index % 2)}:${String(seconds).padStart(PAD_WIDTH, '0')}`;
}

const TRACKS = cartoons.slice(0, PLAYLIST_SIZE).map(title => title.trim());

export default function MusicApp() {
  return (
    <div className="app-music">
      <div className="app-music__hero">
        <span className="app-music__cover" aria-hidden="true">♫</span>
        <div className="app-music__meta">
          <p className="app-music__album">Anime OST Collection</p>
          <p className="app-music__artist">Droit's watch list · {cartoons.length} shows</p>
        </div>
      </div>
      <p className="app-section-title">Up next</p>
      {TRACKS.map((title, index) => (
        <div key={title} className="app-row">
          <span className="app-row__glyph app-music__index" aria-hidden="true">{index + 1}</span>
          <span className="app-row__name">{title}</span>
          <span className="app-row__meta">{trackDuration(index)}</span>
        </div>
      ))}
    </div>
  );
}
