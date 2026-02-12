import { useEffect, useMemo, useState } from 'react'
import Terminal from './components/TerminalShell'

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
      <svg className="dock__glyph" viewBox="0 0 64 64" aria-hidden="true">
        <defs>
          <linearGradient id="finder-l" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#9fe4ff" />
            <stop offset="100%" stopColor="#3fa7ff" />
          </linearGradient>
          <linearGradient id="finder-r" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#c8f0ff" />
            <stop offset="100%" stopColor="#7bc6ff" />
          </linearGradient>
        </defs>
        <rect x="8" y="8" width="48" height="48" rx="12" fill="url(#finder-l)" />
        <path d="M32 8h12a12 12 0 0 1 12 12v24a12 12 0 0 1-12 12H32z" fill="url(#finder-r)" />
        <path d="M32 8v48" stroke="#2a6aa0" strokeWidth="2.2" />
        <circle cx="24" cy="27" r="2.1" fill="#1b4f82" />
        <circle cx="40" cy="27" r="2.1" fill="#1b4f82" />
        <path d="M22 38c3.7 4.2 8.3 4.2 12 0" fill="none" stroke="#1b4f82" strokeWidth="2.2" strokeLinecap="round" />
        <path d="M34 38c2.3 1.9 4.8 2.1 8 0" fill="none" stroke="#1b4f82" strokeWidth="2.2" strokeLinecap="round" />
        <rect x="8" y="8" width="48" height="48" rx="12" fill="none" stroke="rgba(255,255,255,0.55)" strokeWidth="1.2" />
      </svg>
    )
  }

  if (type === 'safari') {
    return (
      <svg className="dock__glyph" viewBox="0 0 64 64" aria-hidden="true">
        <defs>
          <radialGradient id="safari-bg" cx="50%" cy="38%" r="60%">
            <stop offset="0%" stopColor="#6fe6ff" />
            <stop offset="100%" stopColor="#2388ff" />
          </radialGradient>
        </defs>
        <rect x="8" y="8" width="48" height="48" rx="12" fill="url(#safari-bg)" />
        <circle cx="32" cy="32" r="16" fill="none" stroke="#f3f8ff" strokeWidth="2.6" />
        <circle cx="32" cy="32" r="11.5" fill="none" stroke="rgba(243,248,255,0.65)" strokeWidth="1.2" />
        <path d="M32 32l11-9-6.3 14.8z" fill="#ff4f5e" />
        <path d="M32 32l-11 9 6.2-14.8z" fill="#ffffff" />
        <circle cx="32" cy="32" r="2.3" fill="#f6fbff" />
        <rect x="8" y="8" width="48" height="48" rx="12" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="1.2" />
      </svg>
    )
  }

  if (type === 'mail') {
    return (
      <svg className="dock__glyph" viewBox="0 0 64 64" aria-hidden="true">
        <defs>
          <linearGradient id="mail-bg" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#7fd2ff" />
            <stop offset="100%" stopColor="#367bff" />
          </linearGradient>
        </defs>
        <rect x="8" y="8" width="48" height="48" rx="12" fill="url(#mail-bg)" />
        <rect x="14" y="18" width="36" height="28" rx="5.4" fill="#f8fcff" />
        <path d="M14 20l18 14L50 20" fill="none" stroke="#9cb9e8" strokeWidth="2.1" />
        <path d="M14 43l11-10M50 43L39 33" fill="none" stroke="#d6e5fb" strokeWidth="1.8" />
        <rect x="8" y="8" width="48" height="48" rx="12" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="1.2" />
      </svg>
    )
  }

  if (type === 'music') {
    return (
      <svg className="dock__glyph" viewBox="0 0 64 64" aria-hidden="true">
        <defs>
          <linearGradient id="music-bg" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stopColor="#ff78bf" />
            <stop offset="100%" stopColor="#ff3f78" />
          </linearGradient>
        </defs>
        <rect x="8" y="8" width="48" height="48" rx="12" fill="url(#music-bg)" />
        <circle cx="42.5" cy="40.5" r="4.8" fill="#ffffff" />
        <circle cx="27.8" cy="44.2" r="4.8" fill="#ffffff" />
        <path d="M32.6 22.2v18.5a6 6 0 0 1-4.8 5.8c1.8-1.3 2.4-2.7 2.4-4.2V26.7l17-4.6v14.7a5.6 5.6 0 0 1-4.7 5.7c1.7-1.4 2.3-2.8 2.3-4.2V24.7z" fill="#ffffff" />
        <rect x="8" y="8" width="48" height="48" rx="12" fill="none" stroke="rgba(255,255,255,0.48)" strokeWidth="1.2" />
      </svg>
    )
  }

  if (type === 'code') {
    return (
      <svg className="dock__glyph" viewBox="0 0 64 64" aria-hidden="true">
        <defs>
          <linearGradient id="code-bg" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stopColor="#46a5ff" />
            <stop offset="100%" stopColor="#256dff" />
          </linearGradient>
        </defs>
        <rect x="8" y="8" width="48" height="48" rx="12" fill="url(#code-bg)" />
        <path d="M41.5 19.5L29 29.3l-7.3-4.8-6.4 5.7 7.4 4.9-7.4 4.8 6.4 5.8 7.3-4.8 12.5 9.7z" fill="#e8f5ff" fillOpacity="0.92" />
        <path d="M41.5 19.5v34.8l7.2-3.7V23.2z" fill="#cde9ff" />
        <rect x="8" y="8" width="48" height="48" rx="12" fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth="1.2" />
      </svg>
    )
  }

  if (type === 'settings') {
    return (
      <svg className="dock__glyph" viewBox="0 0 64 64" aria-hidden="true">
        <defs>
          <linearGradient id="set-bg" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stopColor="#cfd8e8" />
            <stop offset="100%" stopColor="#8f9db8" />
          </linearGradient>
        </defs>
        <rect x="8" y="8" width="48" height="48" rx="12" fill="url(#set-bg)" />
        <g fill="none" stroke="#485976" strokeWidth="2.6" strokeLinecap="round">
          <circle cx="32" cy="32" r="8.2" fill="#dfe6f2" />
          <path d="M32 18v4M32 42v4M18 32h4M42 32h4M22.6 22.6l2.8 2.8M38.6 38.6l2.8 2.8M41.4 22.6l-2.8 2.8M25.4 38.6l-2.8 2.8" />
        </g>
        <rect x="8" y="8" width="48" height="48" rx="12" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="1.2" />
      </svg>
    )
  }

  return (
    <svg className="dock__glyph" viewBox="0 0 64 64" aria-hidden="true">
      <defs>
        <linearGradient id="trash-bg" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#f5f8ff" />
          <stop offset="100%" stopColor="#ccd8ec" />
        </linearGradient>
      </defs>
      <rect x="8" y="8" width="48" height="48" rx="12" fill="url(#trash-bg)" />
      <path d="M22 22h20l-1.8 24H23.8z" fill="#dfe8f8" stroke="#7e90ad" strokeWidth="1.8" />
      <path d="M19.5 22h25" stroke="#7186a8" strokeWidth="2.1" />
      <path d="M26 22v-3.3a1.8 1.8 0 0 1 1.8-1.8h8.4a1.8 1.8 0 0 1 1.8 1.8V22" fill="none" stroke="#7186a8" strokeWidth="1.8" />
      <path d="M27.8 27.5v13.3M32 27.5v13.3M36.2 27.5v13.3" stroke="#7d90af" strokeWidth="1.4" />
      <rect x="8" y="8" width="48" height="48" rx="12" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="1.2" />
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

  useEffect(() => {
    let rafId = 0
    const root = document.documentElement

    const setPupilPosition = (x, y) => {
      const offsetX = Math.max(-5, Math.min(5, ((x / window.innerWidth) - 0.5) * 12))
      const offsetY = Math.max(-5, Math.min(5, ((y / window.innerHeight) - 0.5) * 12))
      root.style.setProperty('--googly-pupil-x', `${offsetX}px`)
      root.style.setProperty('--googly-pupil-y', `${offsetY}px`)
    }

    const handlePointerMove = event => {
      if (rafId) {
        cancelAnimationFrame(rafId)
      }
      rafId = requestAnimationFrame(() => {
        setPupilPosition(event.clientX, event.clientY)
      })
    }

    setPupilPosition(window.innerWidth / 2, window.innerHeight / 2)
    window.addEventListener('pointermove', handlePointerMove, { passive: true })

    return () => {
      window.removeEventListener('pointermove', handlePointerMove)
      if (rafId) {
        cancelAnimationFrame(rafId)
      }
      root.style.removeProperty('--googly-pupil-x')
      root.style.removeProperty('--googly-pupil-y')
    }
  }, [])

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
          <div className="googly-eyes googly-eyes--menu">
            <span className="googly-eye">
              <span className="googly-pupil" />
            </span>
            <span className="googly-eye">
              <span className="googly-pupil" />
            </span>
          </div>
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
