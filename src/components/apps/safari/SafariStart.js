import { safariFavorites } from '../../../content';
import SystemGlyph from '../../icons/SystemGlyph';

export function SafariStart({ onOpen }) {
  return <div className="safari-start">
    <section>
      <h2>Favorites</h2>
      <div className="safari-favorites">{safariFavorites.map(favorite => <button type="button" key={favorite.name} className="safari-favorite" onClick={() => onOpen(favorite.url)}>
        <span className="safari-favorite__icon" style={{ background: favorite.color }}>{favorite.letter}</span><span>{favorite.name}</span>
      </button>)}</div>
    </section>
    <section className="safari-privacy"><SystemGlyph name="lock" /><div><strong>Privacy Report</strong><p>Pages open right here in this window. Nothing you browse is stored.</p></div></section>
  </div>;
}

export function SafariBlocked({ url, host }) {
  return <div className="safari-blocked">
    <SystemGlyph name="globe" />
    <h2>Safari Can’t Show This Page Here</h2>
    <p>{host} doesn’t allow itself to be displayed inside another page.</p>
    <a className="app-button" href={url} target="_blank" rel="noreferrer">Open in New Browser Tab</a>
  </div>;
}
