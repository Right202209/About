import { useEffect, useRef, useState } from 'react';
import { APP_INFO } from './registry';

const PROMPT = 'guest@Mac ~ %';
const FOLDERS = ['Desktop', 'Documents', 'Downloads', 'Pictures', 'Projects'];
const HELP = [
  'help            show this list',
  'ls              list folders',
  'open <app>      open an app (finder, safari, music, notes, calculator, code…)',
  'open <url>      open a website in Safari',
  'date            print the date and time',
  'echo <text>     print text',
  'whoami / pwd / uname',
  'clear           clear the screen'
];

function welcome() {
  return [{ kind: 'muted', text: `Last login: ${new Date().toLocaleString('en-US')} on ttys000` }];
}

function run(input, onLaunch) {
  const [command, ...args] = input.trim().split(/\s+/);
  const rest = args.join(' ');
  if (!command) return [];
  if (command === 'help') return HELP;
  if (command === 'ls') return [FOLDERS.join('    ')];
  if (command === 'pwd') return ['/Users/guest'];
  if (command === 'whoami') return ['guest'];
  if (command === 'uname') return ['Darwin'];
  if (command === 'date') return [new Date().toString()];
  if (command === 'echo') return [rest];
  if (command === 'open') {
    const key = rest.toLowerCase();
    if (/^https?:\/\//.test(rest) || /^[\w.-]+\.(com|org|net|io|dev|so|ch|co|app|cn)(\/\S*)?$/i.test(rest)) { onLaunch('safari', { url: /^https?:/.test(rest) ? rest : `https://${rest}` }); return []; }
    if (APP_INFO[key] && key !== 'terminal') { onLaunch(key); return []; }
    return [`open: unable to find application named '${rest}'`];
  }
  return [`zsh: command not found: ${command}`];
}

export default function TerminalApp({ onLaunch, active }) {
  const [lines, setLines] = useState(welcome);
  const [value, setValue] = useState('');
  const [history, setHistory] = useState([]);
  const [cursor, setCursor] = useState(0);
  const inputRef = useRef(null);
  const endRef = useRef(null);
  useEffect(() => { endRef.current?.scrollIntoView({ block: 'end' }); }, [lines]);
  useEffect(() => { if (active) inputRef.current?.focus({ preventScroll: true }); }, [active]);
  const submit = event => {
    event.preventDefault();
    const entry = { kind: 'input', text: value };
    if (value.trim() === 'clear') setLines([]);
    else setLines(previous => [...previous, entry, ...run(value, onLaunch).map(text => ({ kind: 'text', text }))]);
    if (value.trim()) setHistory(previous => [...previous, value]);
    setCursor(history.length + (value.trim() ? 1 : 0));
    setValue('');
  };
  const browse = event => {
    if (!['ArrowUp', 'ArrowDown'].includes(event.key) || !history.length) return;
    event.preventDefault();
    const next = Math.max(0, Math.min(history.length, cursor + (event.key === 'ArrowUp' ? -1 : 1)));
    setCursor(next);
    setValue(history[next] || '');
  };
  return <div className="terminal-app" onPointerUp={() => { if (!window.getSelection()?.toString()) inputRef.current?.focus(); }}>
    {lines.map((line, index) => <p key={index} className={`terminal-app__line terminal-app__line--${line.kind}`}>
      {line.kind === 'input' && <span className="terminal-app__prompt">{PROMPT} </span>}{line.text}
    </p>)}
    <form className="terminal-app__row" onSubmit={submit} ref={endRef}>
      <span className="terminal-app__prompt">{PROMPT}</span>
      <input ref={inputRef} className="terminal-app__input" aria-label="Terminal input" value={value} onChange={event => setValue(event.target.value)} onKeyDown={browse} autoComplete="off" autoCapitalize="off" spellCheck="false" />
    </form>
  </div>;
}
