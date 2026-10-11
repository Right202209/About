import useMusic, { formatTime } from '../../../hooks/useMusic';
import SystemGlyph from '../../icons/SystemGlyph';
import AlbumArt, { albumById } from './AlbumArt';
import { TrafficLights } from '../WindowChrome';

function Transport({ music }) {
  return <div className="music-transport">
    <button type="button" className={music.shuffle ? 'is-on' : ''} aria-pressed={music.shuffle} aria-label="Shuffle" onClick={music.toggleShuffle}><SystemGlyph name="shuffle" /></button>
    <button type="button" aria-label="Previous" onClick={music.previous}><SystemGlyph name="backward" /></button>
    <button type="button" className="music-transport__play" aria-label={music.playing ? 'Pause' : 'Play'} onClick={music.toggle}><SystemGlyph name={music.playing ? 'pause' : 'play'} /></button>
    <button type="button" aria-label="Next" onClick={music.next}><SystemGlyph name="forward" /></button>
    <button type="button" className={music.repeat !== 'off' ? 'is-on' : ''} aria-label={`Repeat ${music.repeat}`} onClick={music.cycleRepeat}><SystemGlyph name={music.repeat === 'one' ? 'repeatOne' : 'repeat'} /></button>
  </div>;
}

function NowPlaying({ music }) {
  const song = music.current;
  if (!song) return <div className="music-lcd music-lcd--idle"><SystemGlyph name="appleMusic" /></div>;
  const progress = music.duration ? music.time / music.duration : 0;
  return <div className="music-lcd">
    <AlbumArt albumId={song.album} size="xs" />
    <div className="music-lcd__info">
      <strong>{song.title}</strong>
      <span>{music.error || (music.buffering ? 'Loading…' : `${song.artist} — ${albumById(song.album)?.title}`)}</span>
      <div className="music-lcd__scrub">
        <small>{formatTime(music.time)}</small>
        <input type="range" min="0" max={music.duration || 0} step="0.5" value={music.time} aria-label="Playback position" onChange={event => music.seek(Number(event.target.value))} style={{ '--progress': `${progress * 100}%` }} />
        <small>-{formatTime(Math.max(0, music.duration - music.time))}</small>
      </div>
    </div>
  </div>;
}

export default function MusicToolbar() {
  const music = useMusic();
  return <div className="music-toolbar" data-window-drag>
    <span className="music-toolbar__lights"><TrafficLights /></span>
    <Transport music={music} />
    <NowPlaying music={music} />
    <div className="music-volume"><SystemGlyph name="volumeLow" />
      <input type="range" min="0" max="1" step="0.01" value={music.volume} aria-label="Volume" onChange={event => music.setVolume(Number(event.target.value))} style={{ '--progress': `${music.volume * 100}%` }} />
      <SystemGlyph name="volume" />
    </div>
  </div>;
}
