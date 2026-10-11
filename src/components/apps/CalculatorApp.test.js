import { press, START } from './CalculatorApp';

const run = keys => keys.reduce(press, START).display;

test('chains operations left to right', () => {
  expect(run(['1', '2', '+', '3', '0', '='])).toBe('42');
  expect(run(['2', '+', '3', '×', '4', '='])).toBe('20');
});

test('handles percent, sign and division by zero', () => {
  expect(run(['5', '0', '%'])).toBe('0.5');
  expect(run(['8', '±'])).toBe('-8');
  expect(run(['1', '÷', '0', '='])).toBe('Error');
});
