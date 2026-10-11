import { useState } from 'react';
import { musicAlbums, musicPlaylists, musicSongs } from '../../../content';
import SystemGlyph from '../../icons/SystemGlyph';
import { TrafficLights } from '../WindowChrome';
import MusicToolbar from './MusicToolbar';
import { AlbumDetail, AlbumGrid, Collection, PlaylistDetail, SongTable } from './MusicViews';

const LIBRARY = [
  { id: 'recent', label: 'Recently Added', icon: 'clock' }, { id: 'artists', label: 'Artists', icon: 'mic' },
  { id: 'albums', label: 'Albums', icon: 'album' }, { id: 'songs', label: 'Songs', icon: 'music' }
];
const APPLE_MUSIC = [{ id: 'home', label: 'Home', icon: 'home' }, { id: 'radio', label: 'Radio', icon: 'radio' }];

function Sidebar({ view, setView, query, setQuery }) {
  const item = entry => <button type="button" key={entry.id} className={view.id === entry.id ? 'is-selected' : ''} onClick={() => setView({ id: entry.id })}><SystemGlyph name={entry.icon} />{entry.label}</button>;
  return <nav className="music-sidebar" aria-label="Music sidebar">
    <div className="music-sidebar__top" data-window-drag><TrafficLights /></div>
    <label className="music-search"><SystemGlyph name="search" /><input placeholder="Search" aria-label="Search songs" value={query} onChange={event => { setQuery(event.target.value); setView({ id: 'songs' }); }} /></label>
    <p>Apple Music</p>{APPLE_MUSIC.map(item)}
    <p>Library</p>{LIBRARY.map(item)}
    <p>Playlists</p>
    {musicPlaylists.map(playlist => <button type="button" key={playlist.id} className={view.id === playlist.id ? 'is-selected' : ''} onClick={() => setView({ id: playlist.id })}><SystemGlyph name="playlist" />{playlist.title}</button>)}
  </nav>;
}

function Home({ open }) {
  return <div className="music-page"><h1>Home</h1>
    <h3>Top Picks for You</h3><AlbumGrid onOpen={open} />
    <h3>Made for You</h3>
    <div className="music-grid">{musicPlaylists.map(playlist => <div key={playlist.id} className="music-card music-card--static"><span className="album-art album-art--lg music-mix" /><strong>{playlist.title} Mix</strong><span>Updated today</span></div>)}</div>
  </div>;
}

function Radio() {
  return <div className="music-page"><h1>Radio</h1><div className="music-radio"><SystemGlyph name="radio" /><div><strong>Live radio needs Apple Music</strong><p>Your library still plays right here.</p></div></div></div>;
}

function Content({ view, setView, query }) {
  const open = albumId => setView({ id: 'album', albumId });
  const playlist = musicPlaylists.find(item => item.id === view.id);
  if (playlist) return <PlaylistDetail playlist={playlist} />;
  if (view.id === 'album') return <AlbumDetail albumId={view.albumId} />;
  if (view.id === 'home') return <Home open={open} />;
  if (view.id === 'radio') return <Radio />;
  if (view.id === 'artists') return <Collection title="T. Schürger" subtitle="Artist · SoundHelix" art={<span className="music-artist"><SystemGlyph name="mic" /></span>} songs={musicSongs} />;
  if (view.id === 'albums' || view.id === 'recent') return <div className="music-page"><h1>{view.id === 'albums' ? 'Albums' : 'Recently Added'}</h1><AlbumGrid albums={view.id === 'recent' ? [...musicAlbums].reverse() : musicAlbums} onOpen={open} /></div>;
  const needle = query.trim().toLowerCase();
  const songs = musicSongs.filter(song => `${song.title} ${song.artist} ${song.album}`.toLowerCase().includes(needle));
  return <div className="music-page"><h1>Songs</h1>{songs.length ? <SongTable songs={songs} /> : <div className="app-empty"><SystemGlyph name="search" /><h3>No Results</h3><p>Try a different search.</p></div>}</div>;
}

export default function MusicApp() {
  const [view, setView] = useState({ id: 'recent' });
  const [query, setQuery] = useState('');
  return <div className="app-music">
    <Sidebar view={view} setView={setView} query={query} setQuery={setQuery} />
    <div className="music-main">
      <MusicToolbar />
      <div className="music-content"><Content view={view} setView={setView} query={query} /></div>
    </div>
  </div>;
}

