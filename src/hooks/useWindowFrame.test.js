import { fitFrame } from './useWindowFrame';

test('a viewport change keeps every edge of a large window reachable', () => {
  const frame = fitFrame({ x: 270, y: 90, width: 900, height: 620 }, { width: 375, height: 530 });
  expect(frame).toEqual({ x: 8, y: 8, width: 359, height: 514 });
});

test('dragging past the desktop edges preserves size and keeps the titlebar in view', () => {
  const bounds = { width: 1440, height: 772 };
  expect(fitFrame({ x: -200, y: -200, width: 800, height: 500 }, bounds)).toEqual({ x: 8, y: 8, width: 800, height: 500 });
  expect(fitFrame({ x: 2000, y: 2000, width: 800, height: 500 }, bounds)).toEqual({ x: 632, y: 264, width: 800, height: 500 });
});
