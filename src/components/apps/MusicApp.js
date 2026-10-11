import { cartoons, personalInfo } from '../../info';
import SystemGlyph from '../icons/SystemGlyph';

const PLAYLIST_SIZE = 8;

export default function MusicApp() {
  return <div className="app-music">
    <aside className="music-sidebar"><p>Library</p><span className="is-selected"><SystemGlyph name="clock" />Recently Added</span><span><SystemGlyph name="music" />Personal Collection</span></aside>
    <div className="music-content">
      <div className="music-hero"><div className="music-cover"><SystemGlyph name="music" /></div><div><small>PERSONAL COLLECTION</small><h2>Anime Collection</h2><p>{personalInfo.name}'s watch list</p><span>{cartoons.length} shows</span></div></div>
      <div className="music-tracks">{cartoons.slice(0, PLAYLIST_SIZE).map((title, index) => <div className="music-track" key={title}><span>{index + 1}</span><strong>{title.replace(/[《》]/g, '').trim()}</strong><SystemGlyph name="music" /></div>)}</div>
    </div>
  </div>;
}
