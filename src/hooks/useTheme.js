import { useEffect, useState } from 'react';

export const DARK_THEME = 'dark';
export const LIGHT_THEME = 'light';

const THEME_STORAGE_KEY = 'about:theme';
const META_THEME_COLOR = { [DARK_THEME]: '#03040b', [LIGHT_THEME]: '#0b111a' };

function readSavedTheme() {
  try {
    const saved = window.localStorage.getItem(THEME_STORAGE_KEY);
    return saved === DARK_THEME || saved === LIGHT_THEME ? saved : null;
  } catch (error) {
    return null; /* localStorage may be unavailable (private mode) */
  }
}

function getInitialTheme() {
  if (typeof window === 'undefined') {
    return LIGHT_THEME;
  }
  const saved = readSavedTheme();
  if (saved) {
    return saved;
  }
  const prefersDark = window.matchMedia
    && window.matchMedia('(prefers-color-scheme: dark)').matches;
  return prefersDark ? DARK_THEME : LIGHT_THEME;
}

function persistTheme(theme) {
  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch (error) {
    /* ignore persistence failures */
  }
}

function applyThemeToDocument(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) {
    meta.setAttribute('content', META_THEME_COLOR[theme]);
  }
}

export default function useTheme() {
  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    applyThemeToDocument(theme);
    persistTheme(theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => (prev === DARK_THEME ? LIGHT_THEME : DARK_THEME));

  return { theme, setTheme, toggleTheme };
}
