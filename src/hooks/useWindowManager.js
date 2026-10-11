import { useCallback, useReducer } from 'react';
import { isLaunchableApp } from '../components/apps/registry';

export const INITIAL_DESKTOP = {
  windows: [],
  activeKey: null,
  hiddenWindows: []
};

const frontmost = windows => [...windows].reverse().find(window => !window.minimized)?.key || null;

function launchWindow(state, action) {
  if (!isLaunchableApp(action.key)) return state;
  const existing = state.windows.find(window => window.key === action.key);
  const next = { maximized: false, ...existing, key: action.key, minimized: false, focusVersion: (existing?.focusVersion || 0) + 1 };
  if (action.type === 'launch') next.payload = action.payload;
  return {
    windows: [...state.windows.filter(window => window.key !== action.key), next],
    activeKey: action.key,
    hiddenWindows: []
  };
}

function showDesktop(state) {
  const restoring = state.hiddenWindows.length > 0;
  const hiddenWindows = state.windows.filter(window => !window.minimized).map(window => window.key);
  const windows = state.windows.map(window => ({
    ...window,
    minimized: restoring ? !state.hiddenWindows.includes(window.key) : true
  }));
  return { windows, activeKey: restoring ? frontmost(windows) : null, hiddenWindows: restoring ? [] : hiddenWindows };
}

export function desktopReducer(state, action) {
  if (action.type === 'launch') return launchWindow(state, action);
  if (action.type === 'desktop') return showDesktop(state);
  if (action.type === 'blur') return { ...state, activeKey: null };
  if (action.type === 'focus') {
    if (state.activeKey === action.key) return state;
    return launchWindow(state, action);
  }
  if (action.type === 'zoom') {
    return { ...state, windows: state.windows.map(window => window.key === action.key ? { ...window, maximized: !window.maximized } : window) };
  }
  if (action.type === 'close' || action.type === 'minimize') {
    const windows = action.type === 'close'
      ? state.windows.filter(window => window.key !== action.key)
      : state.windows.map(window => window.key === action.key ? { ...window, minimized: true } : window);
    return { windows, activeKey: state.activeKey === action.key ? frontmost(windows) : state.activeKey, hiddenWindows: [] };
  }
  return state;
}

export default function useWindowManager() {
  const [state, dispatch] = useReducer(desktopReducer, INITIAL_DESKTOP);
  const launch = useCallback((key, payload) => dispatch({ type: 'launch', key, payload }), []);
  const focus = useCallback(key => dispatch({ type: 'focus', key }), []);
  const close = useCallback(key => dispatch({ type: 'close', key }), []);
  const minimize = useCallback(key => dispatch({ type: 'minimize', key }), []);
  const zoom = useCallback(key => dispatch({ type: 'zoom', key }), []);
  const toggleDesktop = useCallback(() => dispatch({ type: 'desktop' }), []);
  const blur = useCallback(() => dispatch({ type: 'blur' }), []);
  return { ...state, launch, focus, close, minimize, zoom, toggleDesktop, blur };
}
