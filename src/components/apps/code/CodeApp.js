import { useEffect, useRef, useState } from 'react';
import { codeWorkspace } from '../../../content';
import SystemGlyph from '../../icons/SystemGlyph';
import CodeEditor from './CodeEditor';
import { LANGUAGE_LABELS, languageOf } from './highlight';
import { buildPreview, runJavaScript } from './runner';
import useCodeFiles from './useCodeFiles';

const FILE_BADGES = { javascript: ['JS', '#e8d44d'], html: ['<>', '#e44d26'], css: ['#', '#42a5f5'], markdown: ['M↓', '#519aba'], plaintext: ['≡', '#9aa0a6'] };

function FileBadge({ name }) {
  const [text, color] = FILE_BADGES[languageOf(name)];
  return <span className="code-badge" style={{ color }}>{text}</span>;
}

function Explorer({ workspace }) {
  const [naming, setNaming] = useState(false);
  const [draft, setDraft] = useState('');
  const commit = () => { if (workspace.create(draft)) { setNaming(false); setDraft(''); } else if (!draft.trim()) setNaming(false); };
  return <aside className="code-explorer">
    <div className="code-explorer__head"><span>EXPLORER</span>
      <button type="button" aria-label="New file" title="New File…" onClick={() => setNaming(true)}><SystemGlyph name="newFile" /></button>
      <button type="button" aria-label="Reset sample files" title="Reset Workspace" onClick={workspace.reset}><SystemGlyph name="refresh" /></button>
    </div>
    <strong><SystemGlyph name="chevronDown" />{codeWorkspace.toUpperCase()}</strong>
    {workspace.files.map(file => <div key={file.name} className={`code-file${workspace.active === file.name ? ' is-active' : ''}`} onClick={() => workspace.open(file.name)}>
      <FileBadge name={file.name} /><span>{file.name}</span>{workspace.dirty(file.name) && <i className="code-dot" />}
      <button type="button" aria-label={`Delete ${file.name}`} onClick={event => { event.stopPropagation(); workspace.remove(file.name); }}><SystemGlyph name="trash" /></button>
    </div>)}
    {naming && <input className="code-newfile" autoFocus value={draft} placeholder="name.js" aria-label="New file name" onChange={event => setDraft(event.target.value)} onBlur={commit} onKeyDown={event => { if (event.key === 'Enter') commit(); if (event.key === 'Escape') setNaming(false); }} />}
  </aside>;
}

function Tabs({ workspace, onRun }) {
  return <div className="code-tabs">
    <div className="code-tabs__list">{workspace.tabs.map(name => <div key={name} className={`code-tab${workspace.active === name ? ' is-active' : ''}`} onClick={() => workspace.setActive(name)}>
      <FileBadge name={name} /><span>{name}</span>
      <button type="button" className={workspace.dirty(name) ? 'is-dirty' : ''} aria-label={`Close ${name}`} onClick={event => { event.stopPropagation(); workspace.closeTab(name); }}><SystemGlyph name="close" /></button>
    </div>)}</div>
    {workspace.active && <button type="button" className="code-run" aria-label="Run" title="Run (⌘/Ctrl + Enter)" onClick={onRun}><SystemGlyph name="run" /></button>}
  </div>;
}

function Panel({ output, onClear, onClose }) {
  const endRef = useRef(null);
  useEffect(() => { endRef.current?.scrollIntoView({ block: 'end' }); }, [output]);
  return <section className="code-panel">
    <div className="code-panel__head"><span className="is-active">OUTPUT</span><span>TERMINAL</span><span>PROBLEMS</span>
      <button type="button" aria-label="Clear output" onClick={onClear}><SystemGlyph name="trash" /></button>
      <button type="button" aria-label="Close panel" onClick={onClose}><SystemGlyph name="close" /></button>
    </div>
    <div className="code-panel__body">{output.map((line, index) => <div key={index} className={`code-out code-out--${line.level}`}>{line.text}</div>)}<span ref={endRef} /></div>
  </section>;
}

function useRunner(workspace) {
  const [output, setOutput] = useState([{ level: 'info', text: 'Press Run (⌘/Ctrl + Enter) to run the current file.' }]);
  const [panel, setPanel] = useState(true);
  const [preview, setPreview] = useState(null);
  const stopRef = useRef(null);
  useEffect(() => () => stopRef.current?.(), []);
  const run = () => {
    const name = workspace.active;
    const language = languageOf(name);
    const files = workspace.files.map(file => ({ ...file, content: workspace.contentOf(file.name) }));
    if (language === 'html' || language === 'css') {
      const page = language === 'html' ? name : files.find(file => languageOf(file.name) === 'html')?.name;
      if (page) setPreview(page);
      return;
    }
    if (language !== 'javascript') { setPanel(true); setOutput(previous => [...previous, { level: 'warn', text: `${LANGUAGE_LABELS[language]} files can’t be run.` }]); return; }
    stopRef.current?.();
    setPanel(true);
    setOutput(previous => [...previous, { level: 'command', text: `$ node ${name}` }]);
    stopRef.current = runJavaScript(workspace.contentOf(name), line => setOutput(previous => [...previous, line]));
  };
  return { output, setOutput, panel, setPanel, preview, setPreview, run };
}

export default function CodeApp({ payload }) {
  const workspace = useCodeFiles(payload?.file);
  const runner = useRunner(workspace);
  const [caret, setCaret] = useState({ line: 1, column: 1 });
  const [sidebar, setSidebar] = useState(true);
  useEffect(() => { if (payload?.file) workspace.open(payload.file); }, [payload, workspace.open]); // eslint-disable-line react-hooks/exhaustive-deps
  const language = workspace.active ? languageOf(workspace.active) : 'plaintext';
  return <div className={`app-code${sidebar ? '' : ' is-collapsed'}`}>
    <aside className="code-activity">
      <button type="button" className={sidebar ? 'is-active' : ''} aria-label="Explorer" onClick={() => setSidebar(value => !value)}><SystemGlyph name="files" /></button>
      <button type="button" aria-label="Search"><SystemGlyph name="search" /></button>
      <button type="button" aria-label="Source Control"><SystemGlyph name="branch" /></button>
      <button type="button" aria-label="Run and Debug" onClick={runner.run}><SystemGlyph name="play" /></button>
      <button type="button" aria-label="Extensions"><SystemGlyph name="extensions" /></button>
    </aside>
    {sidebar && <Explorer workspace={workspace} />}
    <div className="code-main">
      <Tabs workspace={workspace} onRun={runner.run} />
      {workspace.active ? <>
        <div className="code-breadcrumb">{codeWorkspace}<SystemGlyph name="chevronRight" /><FileBadge name={workspace.active} />{workspace.active}</div>
        <div className="code-split">
          <CodeEditor key={workspace.active} value={workspace.contentOf(workspace.active)} language={language} onChange={value => workspace.edit(workspace.active, value)} onCaret={setCaret} onSave={() => workspace.save(workspace.active)} onRun={runner.run} />
          {runner.preview && <div className="code-preview"><div className="code-preview__head"><SystemGlyph name="globe" />Preview {runner.preview}<button type="button" aria-label="Close preview" onClick={() => runner.setPreview(null)}><SystemGlyph name="close" /></button></div><iframe title="HTML preview" sandbox="allow-scripts allow-modals" srcDoc={buildPreview(workspace.contentOf(runner.preview), workspace.files.map(file => ({ ...file, content: workspace.contentOf(file.name) })))} /></div>}
        </div>
      </> : <div className="code-welcome"><SystemGlyph name="code" /><p>Open a file from the Explorer</p></div>}
      {runner.panel && <Panel output={runner.output} onClear={() => runner.setOutput([])} onClose={() => runner.setPanel(false)} />}
    </div>
    <footer className="code-status">
      <span><SystemGlyph name="branch" />main</span><span>⊗ 0 ⚠ 0</span>
      <span className="code-status__right">Ln {caret.line}, Col {caret.column}</span><span>Spaces: 2</span><span>UTF-8</span><span>{LANGUAGE_LABELS[language]}</span>
      <button type="button" aria-label="Toggle panel" onClick={() => runner.setPanel(value => !value)}><SystemGlyph name="layout" /></button>
    </footer>
  </div>;
}
