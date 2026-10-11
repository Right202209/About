import SystemGlyph from '../icons/SystemGlyph';

export default function MusicApp() {
  return <div className="app-music">
    <aside className="music-sidebar"><p>Library</p><span className="is-selected"><SystemGlyph name="clock" />Recently Added</span><span><SystemGlyph name="music" />Songs</span></aside>
    <div className="music-content">
      <div className="music-hero"><div className="music-cover"><SystemGlyph name="music" /></div><div><small>LIBRARY</small><h2>Recently Added</h2><p>Music</p><span>0 songs</span></div></div>
      <div className="app-empty"><SystemGlyph name="music" /><h3>No Music Yet</h3><p>Songs you add will appear here.</p></div>
    </div>
  </div>;
}
