import { useCallback, useState } from 'react';
import { START_PAGE, isBlocked } from './urls';

const needsLoad = url => url !== START_PAGE && !isBlocked(url);

let nextId = 1;
const createTab = (url = START_PAGE) => ({ id: nextId++, history: [url], index: 0, loading: needsLoad(url), reload: 0 });

/* Each tab keeps its own back/forward history, like a real browser tab. */
export default function useTabs(initialUrl) {
  const [tabs, setTabs] = useState(() => [createTab(initialUrl || START_PAGE)]);
  const [activeId, setActiveId] = useState(tabs[0].id);
  const active = tabs.find(tab => tab.id === activeId) || tabs[0];
  const update = useCallback((id, change) => setTabs(previous => previous.map(tab => tab.id === id ? { ...tab, ...change(tab) } : tab)), []);
  const navigate = url => update(active.id, tab => ({ history: [...tab.history.slice(0, tab.index + 1), url], index: tab.index + 1, loading: needsLoad(url) }));
  const step = delta => update(active.id, tab => ({ index: tab.index + delta, loading: needsLoad(tab.history[tab.index + delta]) }));
  const open = (url = START_PAGE) => { const tab = createTab(url); setTabs(previous => [...previous, tab]); setActiveId(tab.id); };
  const close = id => {
    setTabs(previous => {
      if (previous.length === 1) return [createTab()];
      const position = previous.findIndex(tab => tab.id === id);
      const remaining = previous.filter(tab => tab.id !== id);
      if (id === activeId) setActiveId(remaining[Math.min(position, remaining.length - 1)].id);
      return remaining;
    });
  };
  return {
    tabs, active, setActiveId, navigate, open, close,
    back: () => step(-1), forward: () => step(1),
    canBack: active.index > 0, canForward: active.index < active.history.length - 1,
    reload: () => update(active.id, tab => ({ reload: tab.reload + 1, loading: needsLoad(tab.history[tab.index]) })),
    loaded: id => update(id, () => ({ loading: false }))
  };
}
