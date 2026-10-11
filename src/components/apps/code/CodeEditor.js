import { useMemo, useRef } from 'react';
import { tokenize } from './highlight';

const INDENT = '  ';

function caretPosition(text, offset) {
  const before = text.slice(0, offset).split('\n');
  return { line: before.length, column: before[before.length - 1].length + 1 };
}

/* A textarea laid exactly over a highlighted <pre>: real typing, selection and undo, with colours. */
export default function CodeEditor({ value, language, onChange, onCaret, onSave, onRun }) {
  const highlightRef = useRef(null);
  const gutterRef = useRef(null);
  const tokens = useMemo(() => tokenize(value, language), [value, language]);
  const lineCount = value.split('\n').length;
  const syncScroll = event => {
    highlightRef.current.scrollTop = event.target.scrollTop;
    highlightRef.current.scrollLeft = event.target.scrollLeft;
    gutterRef.current.scrollTop = event.target.scrollTop;
  };
  const report = event => onCaret(caretPosition(event.target.value, event.target.selectionStart));
  const replaceSelection = (node, text, caretOffset = text.length) => {
    const { selectionStart: start, selectionEnd: end } = node;
    if (document.queryCommandSupported?.('insertText') && document.execCommand('insertText', false, text)) return;
    const next = node.value.slice(0, start) + text + node.value.slice(end);
    onChange(next);
    requestAnimationFrame(() => { node.selectionStart = node.selectionEnd = start + caretOffset; });
  };
  const keys = event => {
    const node = event.target;
    const mod = event.metaKey || event.ctrlKey;
    if (mod && event.key.toLowerCase() === 's') { event.preventDefault(); onSave(); return; }
    if (mod && event.key === 'Enter') { event.preventDefault(); onRun(); return; }
    if (event.key === 'Tab') { event.preventDefault(); replaceSelection(node, INDENT); return; }
    if (event.key === 'Enter' && !mod) {
      event.preventDefault();
      const lineStart = node.value.lastIndexOf('\n', node.selectionStart - 1) + 1;
      const indent = node.value.slice(lineStart).match(/^\s*/)[0].replace(/\n[\s\S]*/, '');
      const opener = /[{[(>]$/.test(node.value.slice(lineStart, node.selectionStart).trimEnd());
      replaceSelection(node, `\n${indent}${opener ? INDENT : ''}`);
    }
  };
  return <div className="code-surface">
    <div className="code-gutter" ref={gutterRef} aria-hidden="true">{Array.from({ length: lineCount }, (_, index) => <span key={index}>{index + 1}</span>)}</div>
    <div className="code-area">
      <pre className="code-highlight" ref={highlightRef} aria-hidden="true"><code>{tokens.map(([kind, text], index) => kind ? <span key={index} className={`tok-${kind}`}>{text}</span> : text)}{'\n'}</code></pre>
      <textarea className="code-input" data-autofocus value={value} spellCheck="false" autoCapitalize="off" autoComplete="off" autoCorrect="off" aria-label="Code editor"
        onChange={event => { onChange(event.target.value); report(event); }} onScroll={syncScroll} onKeyDown={keys} onKeyUp={report} onClick={report} onSelect={report} />
    </div>
  </div>;
}
