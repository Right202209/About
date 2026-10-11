/*
 * Magnification curve ported from CatsJuice/dockbar (the "macos" style on dock.oooo.so).
 * Each icon's scale is the average slope of a sine bump over the icon's own width, so
 * neighbours swell smoothly and the hovered icon peaks at `maxScale`.
 */
export const DOCK_SIZE = 50;
export const DOCK_GAP = 6;
export const DOCK_PADDING = 7;
export const DOCK_MAX_SCALE = 1.85;
export const DOCK_RANGE = 230;
export const SEPARATOR_WIDTH = 17;

export function hoverScale(pointer, center, size = DOCK_SIZE, range = DOCK_RANGE, maxScale = DOCK_MAX_SCALE) {
  if (Math.abs(pointer - center) >= range || size <= 0 || maxScale <= 1) return 1;
  const d1 = center - size / 2 - pointer;
  const d2 = center + size / 2 - pointer;
  const angle = Math.PI / (2 * range);
  const normalization = 2 * Math.sin(angle * size / 2);
  const slope = (Math.sin(angle * d2) - Math.sin(angle * d1)) / (d2 - d1);
  const scale = 1 + (size * maxScale - size) / normalization * slope;
  return Math.min(Math.max(scale, 1), maxScale);
}

/* Centers of every slot in the un-magnified layout, so the curve never chases itself. */
export function restingCenters(slots, dockCenter, size = DOCK_SIZE) {
  const widths = slots.map(slot => slot === 'separator' ? SEPARATOR_WIDTH : size);
  const total = widths.reduce((sum, width) => sum + width, 0) + DOCK_GAP * (widths.length - 1);
  let cursor = dockCenter - total / 2;
  return widths.map(width => {
    const center = cursor + width / 2;
    cursor += width + DOCK_GAP;
    return center;
  });
}
