import { useEffect, useState } from 'react';
import { defaultNotes } from '../../content';
import SystemGlyph from '../icons/SystemGlyph';
import { TrafficLights } from './WindowChrome';

const STORAGE_KEY = 'notes';

function loadNotes() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (Array.isArray(saved) && saved.length) return saved;
  } catch { /* use the starter notes */ }
  return defaultNotes;
}

const titleOf = note => note.text.split('\n').find(line => line.trim())?.trim() || 'New Note';
const previewOf = note => note.text.split('\n').filter(line => line.trim()).slice(1).join(' ') || 'No additional text';
const stamp = note => (note.updated ? new Date(note.updated).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'Welcome');

export default function NotesApp() {
  const [notes, setNotes] = useState(loadNotes);
  const [selected, setSelected] = useState(notes[0]?.id);
  const [query, setQuery] = useState('');
  useEffect(() => { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(notes)); } catch { /* storage may be unavailable */ } }, [notes]);
  const current = notes.find(note => note.id === selected);
  const visible = notes.filter(note => note.text.toLowerCase().includes(query.toLowerCase()));
  const create = () => { const note = { id: `note-${Date.now()}`, text: '', updated: Date.now() }; setNotes(previous => [note, ...previous]); setSelected(note.id); setQuery(''); };
  const remove = () => {
    const remaining = notes.filter(note => note.id !== selected);
    setNotes(remaining);
    setSelected(remaining[0]?.id);
  };
  const edit = text => setNotes(previous => [{ ...current, text, updated: Date.now() }, ...previous.filter(note => note.id !== current.id)]);
  return <div className="app-notes">
    <aside className="notes-list">
      <div className="notes-list__top" data-window-drag><TrafficLights />
        <button type="button" aria-label="Delete note" onClick={remove} disabled={!current}><SystemGlyph name="trash" /></button>
      </div>
      <label className="notes-search"><SystemGlyph name="search" /><input placeholder="Search" aria-label="Search notes" value={query} onChange={event => setQuery(event.target.value)} /></label>
      <p className="notes-list__group">Notes</p>
      {visible.map(note => <button type="button" key={note.id} className={`notes-item${note.id === selected ? ' is-selected' : ''}`} onClick={() => setSelected(note.id)}>
        <strong>{titleOf(note)}</strong><span><b>{stamp(note)}</b> {previewOf(note)}</span>
      </button>)}
    </aside>
    <section className="notes-editor">
      <div className="notes-editor__bar" data-window-drag><button type="button" aria-label="New note" onClick={create}><SystemGlyph name="edit" /></button></div>
      {current ? <textarea key={current.id} data-autofocus value={current.text} onChange={event => edit(event.target.value)} aria-label="Note text" placeholder="Start typing…" />
        : <div className="app-empty"><SystemGlyph name="document" /><h3>No Note Selected</h3></div>}
    </section>
  </div>;
}
