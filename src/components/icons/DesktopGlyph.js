const VIEW_BOX = '0 0 24 24';
const INK = '#2e3f66';

function ProjectsGlyph() {
  return (
    <svg className="desktop-icon__glyph" viewBox={VIEW_BOX} aria-hidden="true">
      <path
        d="M3.6 6.8a1.5 1.5 0 0 1 1.5-1.5h4.4l1.4 1.7h7.6a1.5 1.5 0 0 1 1.5 1.5v1H3.6z"
        fill="currentColor"
        fillOpacity="0.72"
      />
      <rect x="3.6" y="9" width="16.8" height="9.6" rx="1.6" fill="currentColor" fillOpacity="0.95" />
      <path d="M3.6 10.6h16.8" stroke="rgba(255, 255, 255, 0.35)" strokeWidth="0.8" />
    </svg>
  );
}

function NotesGlyph() {
  return (
    <svg className="desktop-icon__glyph" viewBox={VIEW_BOX} aria-hidden="true">
      <path
        d="M6.2 4.4h7.9l4.2 4.2v9.6a1.5 1.5 0 0 1-1.5 1.5H6.2a1.5 1.5 0 0 1-1.5-1.5V5.9a1.5 1.5 0 0 1 1.5-1.5z"
        fill="currentColor"
        fillOpacity="0.92"
      />
      <path d="M14.1 4.4v3.1a1.1 1.1 0 0 0 1.1 1.1h3.1z" fill={INK} fillOpacity="0.35" />
      <path d="M8.1 11h7.8M8.1 13.8h7.8M8.1 16.6h5.2" fill="none" stroke={INK} strokeWidth="1.1" strokeLinecap="round" />
    </svg>
  );
}

function AssetsGlyph() {
  return (
    <svg className="desktop-icon__glyph" viewBox={VIEW_BOX} aria-hidden="true">
      <rect x="3.8" y="5.4" width="16.4" height="13.2" rx="1.8" fill="currentColor" fillOpacity="0.92" />
      <circle cx="9" cy="10" r="1.8" fill={INK} fillOpacity="0.75" />
      <path d="M6.4 16.2l3.9-4.3 2.9 3.1 2-2.2 2.4 3.4z" fill={INK} fillOpacity="0.8" />
    </svg>
  );
}

const GLYPHS = {
  projects: ProjectsGlyph,
  notes: NotesGlyph,
  assets: AssetsGlyph
};

export default function DesktopGlyph({ type }) {
  const Glyph = GLYPHS[type] || AssetsGlyph;
  return <Glyph />;
}
