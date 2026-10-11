import { useEffect, useRef, useState } from 'react';
import { finderItems, personalInfo } from '../../info';
import DesktopGlyph from '../icons/DesktopGlyph';
import SystemGlyph from '../icons/SystemGlyph';

const PLACES = [
  { name: 'Recents', icon: 'clock' }, { name: 'Desktop', icon: 'desktop' },
  { name: 'Documents', icon: 'document' }, { name: 'Downloads', icon: 'download' },
  { name: 'Projects', icon: 'folder' }
];
const FILE_KINDS = { folder: 'Folder', document: 'Document', code: 'JSON document', image: 'JPEG image' };

function useNavigation(payload) {
  const [history, setHistory] = useState([payload?.place || 'Home']);
  const [index, setIndex] = useState(0);
  useEffect(() => { if (payload?.place) { setHistory([payload.place]); setIndex(0); } }, [payload]);
  const navigate = place => {
    setHistory(previous => [...previous.slice(0, index + 1), place]);
    setIndex(previous => previous + 1);
  };
  return { place: history[index], navigate, back: () => setIndex(index - 1), forward: () => setIndex(index + 1), canBack: index > 0, canForward: index < history.length - 1 };
}

function FinderSidebar({ place, navigate }) {
  return <nav className="finder-sidebar" aria-label="Finder sidebar">
    <p>Favorites</p>
    {PLACES.map(item => <button type="button" key={item.name} className={place === item.name ? 'is-selected' : ''} onClick={() => navigate(item.name)} aria-current={place === item.name ? 'page' : undefined}><SystemGlyph name={item.icon} /><span>{item.name}</span></button>)}
    <p>Locations</p>
    <button type="button" className={place === 'Home' ? 'is-selected' : ''} onClick={() => navigate('Home')}><SystemGlyph name="desktop" /><span>Macintosh HD</span></button>
    <button type="button" className={place === 'Assets' ? 'is-selected' : ''} onClick={() => navigate('Assets')}><SystemGlyph name="folder" /><span>Assets</span></button>
    <p>Tags</p>
    <button type="button" onClick={() => navigate('Projects')}><span className="finder-tag finder-tag--green" /><span>Projects</span></button>
    <button type="button" onClick={() => navigate('Documents')}><span className="finder-tag finder-tag--orange" /><span>Personal</span></button>
  </nav>;
}

function FinderToolbar({ navigation, view, setView, query, setQuery }) {
  return <div className="finder-toolbar" data-window-drag>
    <div className="finder-toolbar__navigation">
      <button type="button" aria-label="Back" onClick={navigation.back} disabled={!navigation.canBack}><SystemGlyph name="chevronLeft" /></button>
      <button type="button" aria-label="Forward" onClick={navigation.forward} disabled={!navigation.canForward}><SystemGlyph name="chevronRight" /></button>
    </div>
    <h2>{navigation.place === 'Home' ? personalInfo.name : navigation.place}</h2>
    <div className="finder-toolbar__views">
      <button type="button" aria-label="Icon view" aria-pressed={view === 'grid'} onClick={() => setView('grid')}><SystemGlyph name="grid" /></button>
      <button type="button" aria-label="List view" aria-pressed={view === 'list'} onClick={() => setView('list')}><SystemGlyph name="list" /></button>
    </div>
    <label className="finder-search"><SystemGlyph name="search" /><input aria-label="Search Finder" value={query} onChange={event => setQuery(event.target.value)} placeholder="Search" /></label>
  </div>;
}

function FinderFiles({ files, selected, setSelected, openFile, view }) {
  const pointerType = useRef('mouse');
  return <div className={`finder-files finder-files--${view}`} aria-label="Files">
    {view === 'list' && <div className="finder-files__head"><span>Name</span><span>Kind</span></div>}
    {files.map(file => <button type="button" key={file.name} className={`finder-file${selected === file.name ? ' is-selected' : ''}`}
      onPointerDown={event => { pointerType.current = event.pointerType; }}
      onClick={event => { setSelected(file.name); if (event.detail === 0 || pointerType.current === 'touch') openFile(file); }}
      onDoubleClick={() => openFile(file)} aria-label={`Open ${file.name}`}>
      <span className="finder-file__icon">{file.type === 'image' ? <img src={file.url} alt="" draggable="false" /> : <DesktopGlyph type={file.type} />}</span>
      <span className="finder-file__name">{file.name}</span>
      {view === 'list' && <span className="finder-file__kind">{FILE_KINDS[file.type]}</span>}
    </button>)}
    {!files.length && <div className="finder-files__empty"><SystemGlyph name="search" /><p>No matching files</p></div>}
  </div>;
}

export default function FinderApp({ payload, onLaunch }) {
  const navigation = useNavigation(payload);
  const [view, setView] = useState('grid');
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(null);
  const files = finderItems.filter(file => (navigation.place === 'Recents' || file.locations.includes(navigation.place)) && file.name.toLowerCase().includes(query.toLowerCase()));
  const openFile = file => {
    if (file.place) { navigation.navigate(file.place); setSelected(null); setQuery(''); }
    else if (file.app) onLaunch(file.app);
    else if (file.url) window.open(file.url, '_blank', 'noopener,noreferrer');
  };
  return <div className="app-finder">
    <FinderSidebar place={navigation.place} navigate={place => { navigation.navigate(place); setQuery(''); setSelected(null); }} />
    <FinderToolbar navigation={navigation} view={view} setView={setView} query={query} setQuery={setQuery} />
    <FinderFiles files={files} selected={selected} setSelected={setSelected} openFile={openFile} view={view} />
    <footer className="finder-status"><span><SystemGlyph name="home" />{personalInfo.name}<SystemGlyph name="chevronRight" />{navigation.place}</span><span>{files.length} items</span></footer>
  </div>;
}
