import SystemGlyph from './icons/SystemGlyph';

export default function WindowControls({ title, maximized, onClose, onMinimize, onZoom, fixed }) {
  return <div className="window-controls" aria-label="Window controls" data-no-drag>
    <button type="button" className="window-control window-control--close" aria-label={`Close ${title}`} onClick={onClose}><SystemGlyph name="close" /></button>
    <button type="button" className="window-control window-control--minimize" aria-label={`Minimize ${title}`} onClick={onMinimize}><SystemGlyph name="minimize" /></button>
    <button type="button" className="window-control window-control--zoom" aria-label={`${maximized ? 'Restore' : 'Maximize'} ${title}`} onClick={onZoom} disabled={fixed}><SystemGlyph name="maximize" /></button>
  </div>;
}
