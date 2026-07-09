import IconTile, { DiagonalFade, VerticalFade } from './IconTile';

const FINDER_INK = '#17466f';
const FINDER_SPLIT = '#2a6aa0';

function FinderGlyph() {
  const defs = (
    <>
      <VerticalFade id="finder-left" from="#9fe4ff" to="#3fa7ff" />
      <VerticalFade id="finder-right" from="#cff2ff" to="#7bc6ff" />
    </>
  );
  return (
    <IconTile id="finder" fill="url(#finder-left)" defs={defs}>
      <path d="M32 8h12a12 12 0 0 1 12 12v24a12 12 0 0 1-12 12H32z" fill="url(#finder-right)" />
      <path d="M32 8v48" stroke={FINDER_SPLIT} strokeWidth="2" />
      <path d="M23.5 24v6M40.5 24v6" stroke={FINDER_INK} strokeWidth="2.6" strokeLinecap="round" />
      <path d="M20 37c8 8.4 16 8.4 24 0" fill="none" stroke={FINDER_INK} strokeWidth="2.4" strokeLinecap="round" />
    </IconTile>
  );
}

function SafariGlyph() {
  const defs = (
    <radialGradient id="safari-dial" cx="50%" cy="38%" r="62%">
      <stop offset="0%" stopColor="#6fe6ff" />
      <stop offset="100%" stopColor="#2388ff" />
    </radialGradient>
  );
  return (
    <IconTile id="safari" fill="url(#safari-dial)" defs={defs}>
      <circle cx="32" cy="32" r="16.5" fill="none" stroke="#f3f8ff" strokeWidth="2.4" />
      <g stroke="rgba(243, 248, 255, 0.85)" strokeWidth="1.3" strokeLinecap="round">
        <path d="M32 17.2v2.6M32 44.2v2.6M17.2 32h2.6M44.2 32h2.6" />
        <path d="M41.9 22.1l-1.8 1.8M23.9 40.1l-1.8 1.8M22.1 22.1l1.8 1.8M40.1 40.1l1.8 1.8" />
      </g>
      <path d="M32 32l10.4-8.6-5.9 14z" fill="#ff4f5e" />
      <path d="M32 32l-10.4 8.6 5.9-14z" fill="#ffffff" />
      <circle cx="32" cy="32" r="2" fill="#f6fbff" />
    </IconTile>
  );
}

function MailGlyph() {
  return (
    <IconTile id="mail" fill="url(#mail-sky)" defs={<VerticalFade id="mail-sky" from="#7fd2ff" to="#367bff" />}>
      <rect x="14" y="18" width="36" height="28" rx="5" fill="#f8fcff" />
      <path
        d="M15.5 20.5L32 33.5l16.5-13"
        fill="none"
        stroke="#9cb9e8"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M15.5 43.5L26 34M48.5 43.5L38 34" fill="none" stroke="#c9dcf7" strokeWidth="1.8" strokeLinecap="round" />
    </IconTile>
  );
}

function MusicGlyph() {
  return (
    <IconTile id="music" fill="url(#music-pink)" defs={<DiagonalFade id="music-pink" from="#ff78bf" to="#ff3f78" />}>
      <path
        d="M27.4 42.8V24.2a2 2 0 0 1 1.6-2l14-3.1a2 2 0 0 1 2.4 2v18"
        fill="none"
        stroke="#ffffff"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <ellipse cx="23.2" cy="42.8" rx="4.6" ry="3.7" fill="#ffffff" />
      <ellipse cx="41.2" cy="39.1" rx="4.6" ry="3.7" fill="#ffffff" />
    </IconTile>
  );
}

const CLAUDE_RAYS = [
  'M32 16.8V29.2',
  'M32 34.8v12.4',
  'M16.8 32h12.4',
  'M34.8 32h12.4',
  'M21.6 21.6l8.2 8.2',
  'M34.2 34.2l8.2 8.2',
  'M42.4 21.6l-8.2 8.2',
  'M29.8 34.2l-8.2 8.2'
];

function ClaudeGlyph() {
  return (
    <IconTile id="claude" fill="url(#claude-clay)" defs={<DiagonalFade id="claude-clay" from="#e8916f" to="#c9603f" />}>
      <g stroke="#fdf5ee" strokeWidth="3.4" strokeLinecap="round">
        {CLAUDE_RAYS.map(ray => <path key={ray} d={ray} />)}
      </g>
      <circle cx="32" cy="32" r="3" fill="#fdf5ee" />
    </IconTile>
  );
}

function CodeGlyph() {
  return (
    <IconTile id="code" fill="url(#code-blue)" defs={<DiagonalFade id="code-blue" from="#46a5ff" to="#256dff" />}>
      <path
        d="M41.5 19.5L29 29.3l-7.3-4.8-6.4 5.7 7.4 4.9-7.4 4.8 6.4 5.8 7.3-4.8 12.5 9.7z"
        fill="#e8f5ff"
        fillOpacity="0.94"
      />
      <path d="M41.5 19.5v34.8l7.2-3.7V23.2z" fill="#cde9ff" />
    </IconTile>
  );
}

const GEAR_TOOTH_COUNT = 8;
const FULL_TURN_DEG = 360;
const GEAR_TOOTH_ANGLES = Array.from(
  { length: GEAR_TOOTH_COUNT },
  (_, index) => index * (FULL_TURN_DEG / GEAR_TOOTH_COUNT)
);
const GEAR_INK = '#5a6b88';

function SettingsGlyph() {
  const defs = <DiagonalFade id="settings-steel" from="#cfd8e8" to="#8f9db8" />;
  return (
    <IconTile id="settings" fill="url(#settings-steel)" defs={defs}>
      <g fill={GEAR_INK}>
        {GEAR_TOOTH_ANGLES.map(angle => (
          <rect key={angle} x="29.7" y="12.5" width="4.6" height="8" rx="2.2" transform={`rotate(${angle} 32 32)`} />
        ))}
      </g>
      <circle cx="32" cy="32" r="13.5" fill={GEAR_INK} />
      <circle cx="32" cy="32" r="12" fill="#e3e9f4" />
      <circle cx="32" cy="32" r="5.2" fill={GEAR_INK} />
      <circle cx="32" cy="32" r="3.4" fill="#c3cdde" />
    </IconTile>
  );
}

function TrashGlyph() {
  const defs = (
    <>
      <VerticalFade id="trash-fog" from="#f5f8ff" to="#ccd8ec" />
      <VerticalFade id="trash-steel" from="#eef3fb" to="#c8d5e8" />
    </>
  );
  return (
    <IconTile id="trash" fill="url(#trash-fog)" defs={defs}>
      <path d="M26 20v-2.6a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2V20" fill="none" stroke="#7186a8" strokeWidth="1.8" />
      <path
        d="M22.2 22.5h19.6l-1.9 22.4a2 2 0 0 1-2 1.8H26.1a2 2 0 0 1-2-1.8z"
        fill="url(#trash-steel)"
        stroke="#7e90ad"
        strokeWidth="1.6"
      />
      <rect x="19.5" y="19.8" width="25" height="2.8" rx="1.4" fill="#8fa3c2" />
      <path d="M27.6 27v13.6M32 27v13.6M36.4 27v13.6" stroke="#7d90af" strokeWidth="1.4" strokeLinecap="round" />
    </IconTile>
  );
}

const GLYPHS = {
  finder: FinderGlyph,
  safari: SafariGlyph,
  mail: MailGlyph,
  music: MusicGlyph,
  claude: ClaudeGlyph,
  code: CodeGlyph,
  settings: SettingsGlyph,
  trash: TrashGlyph
};

export default function DockGlyph({ type }) {
  const Glyph = GLYPHS[type] || TrashGlyph;
  return <Glyph />;
}
