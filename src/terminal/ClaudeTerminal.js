import { useEffect, useRef } from 'react';
import { claudeBrand } from '../info';
import TerminalLine, { isRunningToolLine } from './TerminalLines';
import useTerminalEngine from './useTerminalEngine';
import useTerminalInput from './useTerminalInput';

/* Focusing the input must not let the browser scroll-shift the desktop. */
function resetDesktopScroll() {
  const desktop = document.querySelector('.desktop');
  if (desktop) {
    desktop.scrollTop = 0;
  }
}

function makeKeyHandler(entry) {
  return event => {
    if (event.ctrlKey && event.key === 'c') {
      event.preventDefault();
      entry.interrupt();
      return;
    }
    if ((event.key === 'Tab' || event.key === 'ArrowRight') && entry.suggestion) {
      event.preventDefault();
      entry.acceptSuggestion();
      return;
    }
    if (event.key === 'Enter') {
      event.preventDefault();
      entry.submit();
      return;
    }
    if (event.key === 'ArrowUp') {
      event.preventDefault();
      entry.navigateHistory(1);
    }
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      entry.navigateHistory(-1);
    }
  };
}

/* Ctrl+C must work while the input is disabled, so listen document-wide. */
function useGlobalInterrupt({ active, interruptRef }) {
  useEffect(() => {
    if (!active) {
      return undefined;
    }
    const handleKey = event => {
      if (event.defaultPrevented) {
        return;
      }
      if (event.ctrlKey && event.key === 'c') {
        event.preventDefault();
        interruptRef.current();
      }
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [active, interruptRef]);
}

function OutputView({ lines, showThinking, endRef }) {
  return (
    <div className="claude-terminal__output">
      {lines.map(line => (
        <TerminalLine key={line.id} line={line} />
      ))}
      {showThinking && (
        <p className="claude-terminal__thinking">
          Thinking<span className="dots" />
        </p>
      )}
      <div ref={endRef} />
    </div>
  );
}

function InputRow({ entry, onKeyDown, disabled, inputRef }) {
  return (
    <div className="claude-terminal__input-row">
      <span className="claude-terminal__prompt">{claudeBrand.cwd} &gt;</span>
      <div className="claude-terminal__input-wrapper">
        <div className="claude-terminal__suggestion-overlay">
          <span className="suggestion-overlay__typed">{entry.value}</span>
          <span className="suggestion-overlay__ghost">{entry.suggestion}</span>
        </div>
        <input
          ref={inputRef}
          type="text"
          className="claude-terminal__input"
          value={entry.value}
          onChange={entry.handleChange}
          onKeyDown={onKeyDown}
          onFocus={resetDesktopScroll}
          disabled={disabled}
          autoFocus
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck="false"
        />
      </div>
    </div>
  );
}

export default function ClaudeTerminal({ theme, onThemeChange }) {
  const engine = useTerminalEngine({ theme, onThemeChange });
  const entry = useTerminalInput(engine);
  const inputRef = useRef(null);
  const endRef = useRef(null);
  const interruptRef = useRef(entry.interrupt);
  interruptRef.current = entry.interrupt;

  const busy = engine.isRunning && !engine.pendingConfirm;
  const showThinking = busy && !engine.lines.some(isRunningToolLine);

  useEffect(() => {
    if (endRef.current) {
      endRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [engine.lines]);

  useEffect(() => {
    if (!busy && inputRef.current) {
      inputRef.current.focus();
    }
  }, [busy]);

  useGlobalInterrupt({ active: engine.isRunning, interruptRef });

  const focusInput = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
    resetDesktopScroll();
  };

  return (
    <div className="claude-terminal" onClick={focusInput}>
      <OutputView lines={engine.lines} showThinking={showThinking} endRef={endRef} />
      <InputRow entry={entry} onKeyDown={makeKeyHandler(entry)} disabled={busy} inputRef={inputRef} />
    </div>
  );
}
