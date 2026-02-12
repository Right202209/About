import { useEffect, useMemo, useState } from 'react'
import Terminal from 'react-terminal-app'

// 可参考: https://github.com/Tomotoes/react-terminal/blob/master/demo/src/commands
import staticList from './static'
import dynamicList from './dynamic'

const cmd = {
  dynamicList,
  staticList
}

const config = {
  prompt: '➜  ~ ',
  version: '1.0.0',
  initialDirectory: 'Droit',
  bootCmd: 'intro'
}

const menuItems = ['File', 'Edit', 'View', 'Go', 'Window', 'Help']

const dockItems = [
  { key: 'finder', label: 'Finder', active: true },
  { key: 'safari', label: 'Safari' },
  { key: 'mail', label: 'Mail' },
  { key: 'music', label: 'Music' },
  { key: 'code', label: 'Code', active: true },
  { key: 'settings', label: 'Settings' },
  { key: 'trash', label: 'Trash' }
]

const desktopIcons = [
  { key: 'projects', label: 'Projects' },
  { key: 'notes', label: 'Notes' },
  { key: 'assets', label: 'Assets' }
]

function DockGlyph({ type }) {
  if (type === 'finder') {
    return (
      <svg className="dock__glyph" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4 4h16v16H4z" fill="none" stroke="currentColor" strokeWidth="1.6" />
        <path d="M12 4v16" stroke="currentColor" strokeWidth="1.4" />
        <circle cx="8.4" cy="10" r="1" fill="currentColor" />
        <circle cx="15.6" cy="10" r="1" fill="currentColor" />
        <path d="M8.3 14.2c1.2 1.6 3.1 1.6 4.2 0" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      </svg>
    )
  }

  if (type === 'safari') {
    return (
      <svg className="dock__glyph" viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="7.5" fill="none" stroke="currentColor" strokeWidth="1.6" />
        <path d="M12 12l4.4-3.8-2.8 5.7z" fill="currentColor" />
      </svg>
    )
  }

  if (type === 'mail') {
    return (
      <svg className="dock__glyph" viewBox="0 0 24 24" aria-hidden="true">
        <rect x="4.2" y="6.2" width="15.6" height="11.6" rx="1.8" fill="none" stroke="currentColor" strokeWidth="1.6" />
        <path d="M4.8 7.1L12 12.5l7.2-5.4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    )
  }

  if (type === 'music') {
    return (
      <svg className="dock__glyph" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M14.7 5.2v9.2a2.4 2.4 0 1 1-1.4-2.2V7.5l5.4-1.5v7.1a2.4 2.4 0 1 1-1.4-2.2V4.1z" fill="currentColor" />
      </svg>
    )
  }

  if (type === 'code') {
    return (
      <svg className="dock__glyph" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M9.6 7.1L5.4 12l4.2 4.9" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M14.4 7.1l4.2 4.9-4.2 4.9" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M13.2 5.3l-2.4 13.4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    )
  }

  if (type === 'settings') {
    return (
      <svg className="dock__glyph" viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="2.8" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <path
          d="M12 4.6v2.1M12 17.3v2.1M4.6 12h2.1M17.3 12h2.1M6.8 6.8l1.5 1.5M15.7 15.7l1.5 1.5M17.2 6.8l-1.5 1.5M8.3 15.7l-1.5 1.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
      </svg>
    )
  }

  return (
    <svg className="dock__glyph" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M7.1 7.1h9.8l-1 11.1H8.1z" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <path d="M9.2 7.1V5.6a2.8 2.8 0 0 1 5.6 0v1.5" fill="none" stroke="currentColor" strokeWidth="1.4" />
      <path d="M10.2 10.1v5.7M12 10.1v5.7M13.8 10.1v5.7" fill="none" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  )
}

function DesktopGlyph({ type }) {
  if (type === 'projects') {
    return (
      <svg className="desktop-icon__glyph" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M3.8 7.6h6.1l1.3 1.6h9v7.5a2 2 0 0 1-2 2H5.8a2 2 0 0 1-2-2z" fill="currentColor" fillOpacity="0.9" />
        <path d="M3.8 7.6h6.1l1.3 1.6h9" fill="none" stroke="currentColor" strokeWidth="1.2" />
      </svg>
    )
  }

  if (type === 'notes') {
    return (
      <svg className="desktop-icon__glyph" viewBox="0 0 24 24" aria-hidden="true">
        <rect x="5.3" y="4.8" width="13.4" height="14.4" rx="1.6" fill="currentColor" fillOpacity="0.88" />
        <path d="M8.3 9.1h7.4M8.3 12h7.4M8.3 14.9h5.1" fill="none" stroke="#2e3f66" strokeWidth="1.1" strokeLinecap="round" />
      </svg>
    )
  }

  return (
    <svg className="desktop-icon__glyph" viewBox="0 0 24 24" aria-hidden="true">
      <rect x="5" y="6.3" width="9.2" height="9.2" rx="1.6" fill="currentColor" fillOpacity="0.9" />
      <rect x="9.8" y="9.3" width="9.2" height="9.2" rx="1.6" fill="currentColor" fillOpacity="0.65" />
    </svg>
  )
}

function App() {
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000 * 20)
    return () => clearInterval(timer)
  }, [])

  const menuClock = useMemo(
    () =>
      new Intl.DateTimeFormat('en-US', {
        weekday: 'short',
        hour: '2-digit',
        minute: '2-digit'
      }).format(now),
    [now]
  )

  return (
    <div className="desktop">
      <div className="desktop__bg" aria-hidden="true">
        <div className="desktop__grain" />
        <div className="desktop__beam desktop__beam--one" />
        <div className="desktop__beam desktop__beam--two" />
        <div className="desktop__orb desktop__orb--one" />
        <div className="desktop__orb desktop__orb--two" />
        <div className="desktop__orb desktop__orb--three" />
      </div>
      <div className="desktop__menu" aria-hidden="true">
        <div className="desktop__menu-left">
          <span className="menu__apple" />
          <span className="menu__app">Terminal</span>
          {menuItems.map(item => (
            <span key={item} className="menu__item">
              {item}
            </span>
          ))}
        </div>
        <div className="desktop__menu-right">
          <span className="menu__status">
            <span className="menu__dot" />
            Online
          </span>
          <span className="menu__wifi">Wi-Fi</span>
          <span className="menu__battery">
            <span className="battery">
              <span className="battery__level" />
            </span>
            92%
          </span>
          <span className="menu__clock">{menuClock}</span>
        </div>
      </div>
      <div className="desktop__glow" aria-hidden="true" />
      <div className="desktop__icons" aria-hidden="true">
        {desktopIcons.map(icon => (
          <button key={icon.key} className={`desktop-icon desktop-icon--${icon.key}`} type="button" tabIndex={-1}>
            <span className="desktop-icon__tile">
              <DesktopGlyph type={icon.key} />
            </span>
            <span className="desktop-icon__label">{icon.label}</span>
          </button>
        ))}
      </div>
      <div className="desktop__dock" aria-hidden="true">
        <span className="dock__reflection" />
        <div className="dock__items">
          {dockItems.map(item => (
            <button
              key={item.key}
              className={`dock__item dock__item--${item.key}${item.active ? ' dock__item--active' : ''}`}
              type="button"
              tabIndex={-1}
            >
              <DockGlyph type={item.key} />
              <span className="dock__indicator" />
              <span className="dock__tooltip">{item.label}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="desktop__content">
        <Terminal className="terminal terminal--robbyrussell" cmd={cmd} config={config} />
      </div>
    </div>
  )
}

export default App;
