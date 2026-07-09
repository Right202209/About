import { useEffect, useRef, useState } from 'react';
import { runCommand } from './commands';
import { BOOT_COMMAND, HISTORY_LIMIT, INTERRUPT_NOTICE } from './constants';
import {
  cancelledError,
  createProcess,
  createTerminalIO,
  isCancelled,
  makeLine
} from './runtime';

const YES_ANSWERS = ['y', 'yes'];

/* Owns the line buffer, command lifecycle, history and y/N confirmations. */
export default function useTerminalEngine({ theme, onThemeChange }) {
  const [lines, setLines] = useState([]);
  const [history, setHistory] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [pendingConfirm, setPendingConfirm] = useState(null);
  const processRef = useRef(null);
  const historyRef = useRef([]);
  const themeRef = useRef(theme);
  const sessionRef = useRef({ tokensUsed: 0 });
  const bootedRef = useRef(false);

  themeRef.current = theme;

  const appendLine = line => setLines(prev => [...prev, line]);
  const patchLine = (id, patch) => setLines(
    prev => prev.map(line => (line.id === id ? { ...line, ...patch } : line))
  );
  const clearLines = () => setLines([]);

  function askUser(proc) {
    return message => new Promise((resolve, reject) => {
      appendLine(makeLine('system', message));
      proc.abort = () => reject(cancelledError());
      setPendingConfirm({ resolve });
    });
  }

  function buildEngine() {
    return {
      get theme() { return themeRef.current; },
      setTheme: onThemeChange,
      getHistory: () => historyRef.current,
      clearLines,
      restart
    };
  }

  async function run(rawInput, options = {}) {
    const proc = createProcess();
    processRef.current = proc;
    setIsRunning(true);
    const io = createTerminalIO({
      proc,
      appendLine,
      patchLine,
      session: sessionRef.current,
      askUser: askUser(proc)
    });
    try {
      await runCommand({ io, rawInput, engine: buildEngine(), isBoot: Boolean(options.isBoot) });
    } catch (error) {
      if (!isCancelled(error)) {
        io.print('error', `Unexpected error: ${error.message}`);
      }
    } finally {
      if (processRef.current === proc) {
        processRef.current = null;
      }
      setIsRunning(false);
    }
  }

  function restart() {
    clearLines();
    run(BOOT_COMMAND, { isBoot: true });
  }

  function recordHistory(entry) {
    const next = [entry, ...historyRef.current.filter(cmd => cmd !== entry)].slice(0, HISTORY_LIMIT);
    historyRef.current = next;
    setHistory(next);
  }

  function answerConfirm(rawAnswer) {
    appendLine(makeLine('text', rawAnswer));
    const pending = pendingConfirm;
    setPendingConfirm(null);
    pending.resolve(YES_ANSWERS.includes(rawAnswer.trim().toLowerCase()));
  }

  function submit(rawText) {
    if (pendingConfirm) {
      answerConfirm(rawText);
      return;
    }
    const trimmed = rawText.trim();
    appendLine(makeLine('input', trimmed));
    if (!trimmed) {
      return;
    }
    recordHistory(trimmed);
    run(trimmed);
  }

  /* Running: abort the command. Idle: echo the current entry like a shell ^C. */
  function interrupt(echoText) {
    if (isRunning || pendingConfirm) {
      if (processRef.current) {
        processRef.current.cancel();
      }
      setPendingConfirm(null);
      appendLine(makeLine('system', INTERRUPT_NOTICE));
      return;
    }
    appendLine(makeLine('input', echoText));
  }

  useEffect(() => {
    if (bootedRef.current) {
      return;
    }
    bootedRef.current = true;
    run(BOOT_COMMAND, { isBoot: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { lines, history, isRunning, pendingConfirm, submit, interrupt };
}
