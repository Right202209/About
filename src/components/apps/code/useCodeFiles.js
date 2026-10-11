import { useCallback, useEffect, useState } from 'react';
import { codeFiles } from '../../../content';

const STORAGE_KEY = 'code-workspace';

function loadSaved() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (Array.isArray(saved) && saved.every(file => typeof file.name === 'string' && typeof file.content === 'string')) return saved;
  } catch { /* fall back to the sample workspace */ }
  return codeFiles;
}

/* Saved files live in localStorage; unsaved edits stay in `drafts` until Save. */
export default function useCodeFiles(initialFile) {
  const [files, setFiles] = useState(loadSaved);
  const [drafts, setDrafts] = useState({});
  const [tabs, setTabs] = useState(() => [initialFile || codeFiles[0].name]);
  const [active, setActive] = useState(tabs[0]);
  useEffect(() => { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(files)); } catch { /* storage may be unavailable */ } }, [files]);
  const contentOf = useCallback(name => drafts[name] ?? files.find(file => file.name === name)?.content ?? '', [drafts, files]);
  const open = useCallback(name => { setTabs(previous => previous.includes(name) ? previous : [...previous, name]); setActive(name); }, []);
  const edit = (name, content) => setDrafts(previous => ({ ...previous, [name]: content }));
  const save = name => {
    if (drafts[name] === undefined) return;
    setFiles(previous => previous.map(file => file.name === name ? { ...file, content: drafts[name] } : file));
    setDrafts(({ [name]: _saved, ...rest }) => rest);
  };
  const closeTab = name => {
    const remaining = tabs.filter(tab => tab !== name);
    setTabs(remaining);
    if (active === name) setActive(remaining[remaining.length - 1] || null);
  };
  const create = name => {
    const clean = name.trim();
    if (!clean || files.some(file => file.name === clean)) return false;
    setFiles(previous => [...previous, { name: clean, content: '' }]);
    open(clean);
    return true;
  };
  const remove = name => { setFiles(previous => previous.filter(file => file.name !== name)); setDrafts(({ [name]: _removed, ...rest }) => rest); closeTab(name); };
  const reset = () => { setFiles(codeFiles); setDrafts({}); setTabs([codeFiles[0].name]); setActive(codeFiles[0].name); };
  return { files, drafts, tabs, active, setActive, contentOf, open, edit, save, closeTab, create, remove, reset, dirty: name => drafts[name] !== undefined };
}
