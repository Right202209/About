import { macSpecs } from '../../content';
import SystemGlyph from '../icons/SystemGlyph';

const SHORTCUTS = [
  ['Search applications', '⌘ / Ctrl K'],
  ['Show desktop', '⇧ ⌘ / Ctrl D'],
  ['New Finder window', '⌘ / Ctrl N'],
  ['Minimize window', '⌘ / Ctrl M']
];

export default function AboutApp({ payload }) {
  if (payload?.help) return <div className="about-help">
    <SystemGlyph name="desktop" /><h2>Make yourself at home.</h2>
    <p>Open apps from the Dock. Double-click a folder to explore it.</p>
    <p>Drag a window by its title bar. Double-click the title bar to zoom, or drag an edge to resize.</p>
    <div className="about-help__shortcuts">{SHORTCUTS.map(([label, key]) => <div key={label}><span>{label}</span><kbd>{key}</kbd></div>)}</div>
    <p>In Terminal, type <code>help</code> to see what it understands.</p>
  </div>;
  return <div className="about-mac">
    <div className="about-mac__computer"><div className="about-mac__screen"><img src={`${process.env.PUBLIC_URL}/macos26-desktop.jpg`} alt="" /><SystemGlyph name="apple" /></div><div className="about-mac__stand" /></div>
    <h1>Mac</h1>
    <p className="about-mac__subtitle">Web desktop</p>
    <dl>{macSpecs.map(row => <div key={row.label}><dt>{row.label}</dt><dd>{row.value}</dd></div>)}</dl>
    <p className="about-mac__footer">Runs entirely in your browser.</p>
  </div>;
}
