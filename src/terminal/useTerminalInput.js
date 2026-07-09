import { useState } from 'react';
import { COMMAND_NAMES } from './commands';

const HISTORY_REST_INDEX = -1;

function findSuggestion(value) {
  const query = value.toLowerCase();
  if (!query.trim()) {
    return '';
  }
  const match = COMMAND_NAMES.find(name => name.startsWith(query) && name !== query);
  return match ? match.slice(query.length) : '';
}

/* Manages the entry value, ghost-text suggestion and history navigation. */
export default function useTerminalInput(engine) {
  const [value, setValue] = useState('');
  const [suggestion, setSuggestion] = useState('');
  const [historyIndex, setHistoryIndex] = useState(HISTORY_REST_INDEX);

  function reset() {
    setValue('');
    setSuggestion('');
    setHistoryIndex(HISTORY_REST_INDEX);
  }

  function handleChange(event) {
    const next = event.target.value;
    setValue(next);
    setSuggestion(findSuggestion(next));
  }

  function acceptSuggestion() {
    setValue(prev => prev + suggestion);
    setSuggestion('');
  }

  function navigateHistory(step) {
    const nextIndex = historyIndex + step;
    if (nextIndex >= engine.history.length) {
      return;
    }
    setSuggestion('');
    if (nextIndex <= HISTORY_REST_INDEX) {
      setHistoryIndex(HISTORY_REST_INDEX);
      setValue('');
      return;
    }
    setHistoryIndex(nextIndex);
    setValue(engine.history[nextIndex]);
  }

  function submit() {
    engine.submit(value);
    reset();
  }

  function interrupt() {
    engine.interrupt(value);
    reset();
  }

  return { value, suggestion, handleChange, acceptSuggestion, navigateHistory, submit, interrupt };
}
