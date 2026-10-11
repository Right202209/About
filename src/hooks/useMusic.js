import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { musicSongs } from '../content';

const MusicContext = createContext(null);
const RESTART_THRESHOLD = 3;
const DEFAULT_VOLUME = .7;
const REPEAT_MODES = ['off', 'all', 'one'];
const ALL_IDS = musicSongs.map(song => song.id);

export const songById = id => musicSongs.find(song => song.id === id);

function shuffled(ids, first) {
  const rest = ids.filter(id => id !== first).sort(() => Math.random() - .5);
  return first ? [first, ...rest] : rest;
}

function useAudioEvents(audio, setState, onEnded) {
  useEffect(() => {
    const node = audio.current;
    const sync = () => setState(previous => ({ ...previous, time: node.currentTime, duration: node.duration || previous.duration, playing: !node.paused, buffering: node.readyState < 3 && !node.paused }));
    const fail = () => setState(previous => ({ ...previous, playing: false, buffering: false, error: 'This song couldn’t be loaded. Check your connection.' }));
    const events = ['timeupdate', 'loadedmetadata', 'play', 'pause', 'waiting', 'playing', 'canplay'];
    events.forEach(name => node.addEventListener(name, sync));
    node.addEventListener('ended', onEnded);
    node.addEventListener('error', fail);
    return () => { events.forEach(name => node.removeEventListener(name, sync)); node.removeEventListener('ended', onEnded); node.removeEventListener('error', fail); };
  }, [audio, setState, onEnded]);
}

/* One player for the whole desktop: it keeps playing when the Music window closes. */
export function MusicProvider({ children }) {
  const audio = useRef(null);
  if (!audio.current) { audio.current = typeof Audio === 'undefined' ? null : new Audio(); if (audio.current) { audio.current.preload = 'metadata'; audio.current.volume = DEFAULT_VOLUME; } }
  const [state, setState] = useState({ queue: ALL_IDS, index: -1, playing: false, time: 0, duration: 0, volume: DEFAULT_VOLUME, shuffle: false, repeat: 'off', buffering: false, error: '' });
  const load = useCallback((queue, index, autoplay = true) => {
    const song = songById(queue[index]);
    if (!song || !audio.current) return;
    audio.current.src = song.src;
    setState(previous => ({ ...previous, queue, index, time: 0, duration: song.duration, error: '' }));
    if (autoplay) audio.current.play().catch(() => {});
  }, []);
  const stateRef = useRef(state);
  stateRef.current = state;
  const step = useCallback((delta, fromEnd = false) => {
    const { queue, index, repeat } = stateRef.current;
    if (fromEnd && repeat === 'one') { audio.current.currentTime = 0; audio.current.play().catch(() => {}); return; }
    const next = index + delta;
    if (fromEnd && next >= queue.length && repeat !== 'all') { setState(previous => ({ ...previous, playing: false })); return; }
    load(queue, (next + queue.length) % queue.length);
  }, [load]);
  const onEnded = useCallback(() => step(1, true), [step]);
  useAudioEvents(audio, setState, onEnded);
  const api = useMemo(() => ({
    play: (id, ids = ALL_IDS) => { const queue = state.shuffle ? shuffled(ids, id) : ids; load(queue, queue.indexOf(id)); },
    toggle: () => {
      if (state.index < 0) { api.play(state.shuffle ? shuffled(ALL_IDS)[0] : ALL_IDS[0]); return; }
      if (audio.current.paused) audio.current.play().catch(() => {}); else audio.current.pause();
    },
    next: () => step(1),
    previous: () => { if (audio.current.currentTime > RESTART_THRESHOLD) audio.current.currentTime = 0; else step(-1); },
    seek: seconds => { audio.current.currentTime = seconds; setState(previous => ({ ...previous, time: seconds })); },
    setVolume: volume => { audio.current.volume = volume; setState(previous => ({ ...previous, volume })); },
    toggleShuffle: () => setState(previous => ({ ...previous, shuffle: !previous.shuffle })),
    cycleRepeat: () => setState(previous => ({ ...previous, repeat: REPEAT_MODES[(REPEAT_MODES.indexOf(previous.repeat) + 1) % REPEAT_MODES.length] }))
  }), [state.index, state.shuffle, load, step]);
  const value = useMemo(() => ({ ...state, current: songById(state.queue[state.index]), ...api }), [state, api]);
  return <MusicContext.Provider value={value}>{children}</MusicContext.Provider>;
}

export default function useMusic() {
  return useContext(MusicContext);
}

export function formatTime(seconds) {
  if (!Number.isFinite(seconds)) return '--:--';
  const whole = Math.max(0, Math.floor(seconds));
  return `${Math.floor(whole / 60)}:${String(whole % 60).padStart(2, '0')}`;
}
