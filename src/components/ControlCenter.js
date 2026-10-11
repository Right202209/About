import SystemGlyph from './icons/SystemGlyph';
import { DARK_THEME } from '../hooks/useTheme';
import useMusic from '../hooks/useMusic';
import AlbumArt from './apps/music/AlbumArt';

function NowPlaying({ onOpen }) {
  const music = useMusic();
  const song = music.current;
  return <div className="control-center__music">
    <button type="button" className="control-center__music-art" aria-label="Open Music" onClick={onOpen}>{song ? <AlbumArt albumId={song.album} size="xs" /> : <span className="album-art album-art--xs album-art--empty"><SystemGlyph name="music" /></span>}</button>
    <div className="control-center__music-info"><strong>{song ? song.title : 'Not Playing'}</strong><small>{song ? song.artist : 'Music'}</small></div>
    <button type="button" aria-label="Previous" onClick={music.previous} disabled={!song}><SystemGlyph name="backward" /></button>
    <button type="button" aria-label={music.playing ? 'Pause' : 'Play'} onClick={music.toggle}><SystemGlyph name={music.playing ? 'pause' : 'play'} /></button>
    <button type="button" aria-label="Next" onClick={music.next} disabled={!song}><SystemGlyph name="forward" /></button>
  </div>;
}

export default function ControlCenter({ theme, brightness, onBrightness, onToggleTheme, onDesktop, onSettings, onMusic }) {
  const dark = theme === DARK_THEME;
  return <div className="control-center" role="dialog" aria-label="Control Center">
    <div className="control-center__top">
      <div className="control-center__connections">
        <div className="control-center__connection"><span className="control-center__symbol"><SystemGlyph name="wifi" /></span><span>Wi-Fi<small>Connected</small></span></div>
        <div className="control-center__connection"><span className="control-center__symbol"><SystemGlyph name="bluetooth" /></span><span>Bluetooth<small>On</small></span></div>
      </div>
      <div className="control-center__actions">
        <button type="button" className="control-center__tile" onClick={onToggleTheme} aria-pressed={dark}><SystemGlyph name={dark ? 'moon' : 'sun'} /><span>Dark Mode<small>{dark ? 'On' : 'Off'}</small></span></button>
        <button type="button" className="control-center__tile" onClick={onDesktop}><SystemGlyph name="desktop" /><span>Show Desktop</span></button>
      </div>
    </div>
    <div className="control-center__display">
      <label htmlFor="display-brightness">Display</label>
      <div className="control-center__slider"><SystemGlyph name="sun" /><input id="display-brightness" type="range" min="40" max="100" value={brightness} onChange={event => onBrightness(Number(event.target.value))} aria-label="Wallpaper brightness" /></div>
    </div>
    <NowPlaying onOpen={onMusic} />
    <button type="button" className="control-center__settings" onClick={onSettings}>System Settings…<SystemGlyph name="chevronRight" /></button>
  </div>;
}
