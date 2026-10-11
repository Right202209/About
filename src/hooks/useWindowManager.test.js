import { act, renderHook } from '@testing-library/react';
import useWindowManager from './useWindowManager';

test('minimized apps restore their zoom state without creating another window', () => {
  const { result } = renderHook(useWindowManager);
  act(() => result.current.launch('finder'));
  act(() => result.current.zoom('finder'));
  act(() => result.current.minimize('finder'));
  expect(result.current.activeKey).toBe('claude');
  act(() => result.current.launch('finder'));
  expect(result.current.windows.filter(window => window.key === 'finder')).toEqual([
    expect.objectContaining({ minimized: false, maximized: true })
  ]);
  expect(result.current.activeKey).toBe('finder');
});

test('closing the front window activates the next visible app', () => {
  const { result } = renderHook(useWindowManager);
  act(() => result.current.launch('finder'));
  act(() => result.current.launch('code'));
  act(() => result.current.minimize('code'));
  act(() => result.current.close('finder'));
  expect(result.current.activeKey).toBe('claude');
  expect(result.current.windows.map(window => window.key)).toEqual(['claude', 'code']);
  expect(result.current.windows.find(window => window.key === 'code').minimized).toBe(true);
});

test('show desktop restores the previously visible windows while keeping other apps minimized', () => {
  const { result } = renderHook(useWindowManager);
  act(() => result.current.launch('finder'));
  act(() => result.current.minimize('finder'));
  act(() => result.current.launch('mail'));
  act(() => result.current.toggleDesktop());
  expect(result.current.windows.every(window => window.minimized)).toBe(true);
  expect(result.current.activeKey).toBeNull();
  act(() => result.current.toggleDesktop());
  expect(result.current.windows.filter(window => !window.minimized).map(window => window.key)).toEqual(['claude', 'mail']);
  expect(result.current.activeKey).toBe('mail');
});

test('focusing an existing app preserves its folder and raises it above other windows', () => {
  const { result } = renderHook(useWindowManager);
  act(() => result.current.launch('finder', { place: 'Projects' }));
  act(() => result.current.launch('mail'));
  act(() => result.current.focus('finder'));
  expect(result.current.windows.at(-1)).toEqual(expect.objectContaining({ key: 'finder', payload: { place: 'Projects' } }));
  expect(result.current.windows).toHaveLength(3);
});
