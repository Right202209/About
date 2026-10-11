import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import SystemGlyph from '../../icons/SystemGlyph';
import { TrafficLights } from '../WindowChrome';
import { SafariBlocked, SafariStart } from './SafariStart';
import useTabs from './useTabs';
import { START_PAGE, displayAddress, hostOf, isBlocked, resolveInput, titleFor } from './urls';

const FRAME_SANDBOX = 'allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox allow-modals allow-downloads';

function AddressBar({ tab, onSubmit, onReload, inputRef }) {
  const url = tab.history[tab.index];
  const [draft, setDraft] = useState(null);
  const editing = draft !== null;
  useLayoutEffect(() => { if (editing) inputRef.current?.select(); }, [editing, inputRef]);
  return <form className={`safari-address${editing ? ' is-editing' : ''}`} onSubmit={event => { event.preventDefault(); onSubmit(resolveInput(draft ?? '')); setDraft(null); inputRef.current.blur(); }}>
    {!editing && url !== START_PAGE && <SystemGlyph name="lock" />}
    <input ref={inputRef} aria-label="Search or enter website name" placeholder="Search or enter website name" spellCheck="false" autoComplete="off"
      value={editing ? draft : displayAddress(url)} onChange={event => setDraft(event.target.value)}
      onFocus={() => setDraft(url === START_PAGE ? '' : url)}
      onBlur={() => setDraft(null)} onKeyDown={event => { if (event.key === 'Escape') event.currentTarget.blur(); }} />
    {!editing && url !== START_PAGE && <button type="button" className="safari-address__reload" aria-label="Reload page" onClick={onReload}><SystemGlyph name="refresh" /></button>}
    {tab.loading && <span className="safari-progress" />}
  </form>;
}

function Toolbar({ tabs, inputRef }) {
  const url = tabs.active.history[tabs.active.index];
  return <div className="safari-toolbar" data-window-drag>
    <TrafficLights />
    <div className="safari-nav">
      <button type="button" aria-label="Back" onClick={tabs.back} disabled={!tabs.canBack}><SystemGlyph name="chevronLeft" /></button>
      <button type="button" aria-label="Forward" onClick={tabs.forward} disabled={!tabs.canForward}><SystemGlyph name="chevronRight" /></button>
    </div>
    <AddressBar key={tabs.active.id} tab={tabs.active} inputRef={inputRef} onSubmit={tabs.navigate} onReload={tabs.reload} />
    <div className="safari-actions">
      <button type="button" aria-label="Open in a new browser tab" disabled={url === START_PAGE} onClick={() => window.open(url, '_blank', 'noopener,noreferrer')}><SystemGlyph name="share" /></button>
      <button type="button" aria-label="New tab" onClick={() => tabs.open()}><SystemGlyph name="plus" /></button>
    </div>
  </div>;
}

function TabStrip({ tabs }) {
  if (tabs.tabs.length < 2) return null;
  return <div className="safari-tabs" role="tablist">
    {tabs.tabs.map(tab => <div key={tab.id} role="tab" aria-selected={tab.id === tabs.active.id} className={`safari-tab${tab.id === tabs.active.id ? ' is-active' : ''}`} onClick={() => tabs.setActiveId(tab.id)}>
      <button type="button" className="safari-tab__close" aria-label="Close tab" onClick={event => { event.stopPropagation(); tabs.close(tab.id); }}><SystemGlyph name="close" /></button>
      <span>{titleFor(tab.history[tab.index])}</span>
    </div>)}
  </div>;
}

function TabPage({ tab, visible, onOpen, onLoaded }) {
  const url = tab.history[tab.index];
  let content;
  if (url === START_PAGE) content = <SafariStart onOpen={onOpen} />;
  else if (isBlocked(url)) content = <SafariBlocked url={url} host={hostOf(url)} />;
  else content = <iframe key={`${url}-${tab.reload}`} className="safari-frame" src={url} title={titleFor(url)} sandbox={FRAME_SANDBOX} referrerPolicy="no-referrer" allow="fullscreen; clipboard-write" onLoad={() => onLoaded(tab.id)} />;
  return <div className="safari-page" hidden={!visible}>{content}</div>;
}

export default function SafariApp({ payload }) {
  const tabs = useTabs(payload?.url);
  const inputRef = useRef(null);
  const firstPayload = useRef(payload);
  useEffect(() => { if (payload?.url && payload !== firstPayload.current) tabs.open(payload.url); }, [payload]); // eslint-disable-line react-hooks/exhaustive-deps
  const shortcuts = event => {
    if (!(event.metaKey || event.ctrlKey)) return;
    const key = event.key.toLowerCase();
    if (key === 'l') { event.preventDefault(); inputRef.current?.focus(); }
    if (key === 't') { event.preventDefault(); tabs.open(); }
    if (key === 'r') { event.preventDefault(); tabs.reload(); }
  };
  return <div className="app-safari" onKeyDown={shortcuts}>
    <Toolbar tabs={tabs} inputRef={inputRef} />
    <TabStrip tabs={tabs} />
    <div className="safari-pages">
      {tabs.tabs.map(tab => <TabPage key={tab.id} tab={tab} visible={tab.id === tabs.active.id} onOpen={tabs.navigate} onLoaded={tabs.loaded} />)}
    </div>
  </div>;
}
