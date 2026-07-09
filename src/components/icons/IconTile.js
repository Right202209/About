/* Shared building blocks for the 64×64 dock icon set. */

export const DOCK_VIEW_BOX = '0 0 64 64';

const TILE_RECT = { x: 8, y: 8, width: 48, height: 48, rx: 12 };
const TILE_EDGE_COLOR = 'rgba(255, 255, 255, 0.5)';
const TILE_EDGE_WIDTH = 1.2;
const GLOSS_PATH = 'M8 20a12 12 0 0 1 12-12h24a12 12 0 0 1 12 12v7H8z';
const GLOSS_TOP_OPACITY = 0.28;

export function VerticalFade({ id, from, to }) {
  return (
    <linearGradient id={id} x1="0" x2="0" y1="0" y2="1">
      <stop offset="0%" stopColor={from} />
      <stop offset="100%" stopColor={to} />
    </linearGradient>
  );
}

export function DiagonalFade({ id, from, to }) {
  return (
    <linearGradient id={id} x1="0" x2="1" y1="0" y2="1">
      <stop offset="0%" stopColor={from} />
      <stop offset="100%" stopColor={to} />
    </linearGradient>
  );
}

/*
 * Rounded macOS-style tile: base fill, artwork (children), then a top gloss
 * sheen and a hairline edge. `id` namespaces the per-icon gradient defs so
 * multiple tiles can coexist in one document.
 */
export default function IconTile({ id, fill, defs, children }) {
  const glossId = `${id}-tile-gloss`;
  return (
    <svg className="dock__glyph" viewBox={DOCK_VIEW_BOX} aria-hidden="true">
      <defs>
        <linearGradient id={glossId} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity={GLOSS_TOP_OPACITY} />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
        {defs}
      </defs>
      <rect {...TILE_RECT} fill={fill} />
      {children}
      <path d={GLOSS_PATH} fill={`url(#${glossId})`} />
      <rect {...TILE_RECT} fill="none" stroke={TILE_EDGE_COLOR} strokeWidth={TILE_EDGE_WIDTH} />
    </svg>
  );
}
