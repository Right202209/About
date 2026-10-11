import { musicAlbums, musicSongs } from '../../../content';
import useMusic, { formatTime, songById } from '../../../hooks/useMusic';
import SystemGlyph from '../../icons/SystemGlyph';
import AlbumArt, { albumById } from './AlbumArt';

const totalMinutes = songs => Math.round(songs.reduce((sum, song) => sum + song.duration, 0) / 60);

function PlayingBars() {
  return <span className="music-bars" aria-label="Now playing"><i /><i /><i /></span>;
}

export function SongTable({ songs, showAlbum = true, numbered = false }) {
  const music = useMusic();
  const ids = songs.map(song => song.id);
  return <div className={`music-table${showAlbum ? '' : ' music-table--compact'}`} role="table">
    <div className="music-table__head" role="row"><span>{numbered ? '#' : ''}</span><span>Title</span><span>Artist</span>{showAlbum && <span>Album</span>}<span>Time</span></div>
    {songs.map((song, index) => {
      const current = music.current?.id === song.id;
      return <div role="row" key={song.id} tabIndex={0} className={`music-table__row${current ? ' is-current' : ''}`}
        onDoubleClick={() => music.play(song.id, ids)} onKeyDown={event => { if (event.key === 'Enter') music.play(song.id, ids); }}>
        <span className="music-table__lead">
          {current && music.playing ? <PlayingBars /> : <span className="music-table__number">{numbered ? index + 1 : <AlbumArt albumId={song.album} size="xs" />}</span>}
          <button type="button" className="music-table__play" aria-label={`Play ${song.title}`} onClick={() => (current ? music.toggle() : music.play(song.id, ids))}><SystemGlyph name={current && music.playing ? 'pause' : 'play'} /></button>
        </span>
        <span className="music-table__title">{song.title}</span><span>{song.artist}</span>
        {showAlbum && <span>{albumById(song.album).title}</span>}<span>{formatTime(song.duration)}</span>
      </div>;
    })}
  </div>;
}

export function AlbumGrid({ albums = musicAlbums, onOpen }) {
  return <div className="music-grid">{albums.map(album => <button type="button" key={album.id} className="music-card" onClick={() => onOpen(album.id)}>
    <AlbumArt albumId={album.id} size="lg" /><strong>{album.title}</strong><span>{album.artist}</span>
  </button>)}</div>;
}

export function Collection({ title, subtitle, art, songs, numbered }) {
  const music = useMusic();
  const ids = songs.map(song => song.id);
  return <div className="music-collection">
    <header className="music-collection__head">{art}
      <div><h2>{title}</h2><p className="music-accent">{subtitle}</p><small>{songs.length} songs, {totalMinutes(songs)} minutes</small>
        <div className="music-collection__actions">
          <button type="button" className="music-pill" onClick={() => music.play(ids[0], ids)}><SystemGlyph name="play" />Play</button>
          <button type="button" className="music-pill" onClick={() => { if (!music.shuffle) music.toggleShuffle(); music.play(ids[Math.floor(Math.random() * ids.length)], ids); }}><SystemGlyph name="shuffle" />Shuffle</button>
        </div>
      </div>
    </header>
    <SongTable songs={songs} showAlbum={!numbered} numbered={numbered} />
  </div>;
}

export function AlbumDetail({ albumId }) {
  const album = albumById(albumId);
  return <Collection title={album.title} subtitle={album.artist} art={<AlbumArt albumId={album.id} size="xl" />} songs={musicSongs.filter(song => song.album === album.id)} numbered />;
}

export function PlaylistDetail({ playlist }) {
  const songs = playlist.songs.map(songById);
  const art = <span className="music-playlist-art">{songs.slice(0, 4).map(song => <AlbumArt key={song.id} albumId={song.album} size="xs" />)}</span>;
  return <Collection title={playlist.title} subtitle="Playlist" art={art} songs={songs} />;
}
