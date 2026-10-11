import { useState } from 'react';
import { TrafficLights } from './WindowChrome';

const KEYS = [
  ['AC', 'fn'], ['±', 'fn'], ['%', 'fn'], ['÷', 'op'],
  ['7'], ['8'], ['9'], ['×', 'op'],
  ['4'], ['5'], ['6'], ['−', 'op'],
  ['1'], ['2'], ['3'], ['+', 'op'],
  ['0', 'wide'], ['.'], ['=', 'op']
];
const KEYBOARD = { '/': '÷', '*': '×', '-': '−', '+': '+', Enter: '=', '=': '=', Escape: 'AC', Backspace: '⌫', '%': '%', '.': '.', ',': '.' };
const MAX_DIGITS = 9;
const OPERATIONS = { '+': (a, b) => a + b, '−': (a, b) => a - b, '×': (a, b) => a * b, '÷': (a, b) => (b === 0 ? NaN : a / b) };

function format(value) {
  if (!Number.isFinite(value)) return 'Error';
  const text = String(Number(value.toPrecision(MAX_DIGITS)));
  return text.length > MAX_DIGITS + 2 ? value.toExponential(4) : text;
}

export const START = { display: '0', stored: null, operator: null, fresh: true };

export function press(state, key) {
  const { display, stored, operator, fresh } = state;
  const value = parseFloat(display);
  if (/\d/.test(key)) return { ...state, display: fresh || display === '0' ? key : display.replace('-', '').length >= MAX_DIGITS ? display : display + key, fresh: false };
  if (key === '.') return { ...state, display: fresh ? '0.' : display.includes('.') ? display : `${display}.`, fresh: false };
  if (key === 'AC') return START;
  if (key === 'C') return { ...state, display: '0', fresh: true };
  if (key === '⌫') return { ...state, display: fresh || display.length < 2 ? '0' : display.slice(0, -1) };
  if (key === '±') return { ...state, display: display.startsWith('-') ? display.slice(1) : display === '0' ? display : `-${display}` };
  if (key === '%') return { ...state, display: format(value / 100), fresh: true };
  const result = operator && !fresh ? OPERATIONS[operator](stored, value) : stored ?? value;
  if (key === '=') return operator ? { display: format(operator && fresh ? stored : result), stored: null, operator: null, fresh: true } : state;
  return { display: format(result), stored: result, operator: key, fresh: true };
}

export default function CalculatorApp() {
  const [state, setState] = useState(START);
  const keyboard = event => {
    const key = /^\d$/.test(event.key) ? event.key : KEYBOARD[event.key];
    if (key && !(event.metaKey || event.ctrlKey)) { event.preventDefault(); setState(previous => press(previous, key)); }
  };
  const size = state.display.length > 7 ? 'is-small' : '';
  return <div className="app-calculator" tabIndex={0} data-autofocus onKeyDown={keyboard}>
    <div className="calculator-top" data-window-drag><TrafficLights /></div>
    <output className={`calculator-display ${size}`} aria-live="polite">{state.display}</output>
    <div className="calculator-keys">{KEYS.map(([label, kind = 'num']) => <button type="button" key={label}
      className={`calculator-key calculator-key--${kind}${state.operator === label && state.fresh ? ' is-armed' : ''}`}
      onClick={() => setState(previous => press(previous, label === 'AC' && previous.display !== '0' ? 'C' : label))}>
      {label === 'AC' && state.display !== '0' ? 'C' : label}
    </button>)}</div>
  </div>;
}
