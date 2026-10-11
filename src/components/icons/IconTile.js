import { useId } from 'react';

export const TILE_PATH = 'M40 8h48c22 0 32 10 32 32v48c0 22-10 32-32 32H40C18 120 8 110 8 88V40C8 18 18 8 40 8Z';

/* Definitions are unique even when the same icon appears in several windows. */
export default function IconTile({ from, to, children, tile = true }) {
  const id = useId().replace(/:/g, '');
  return (
    <svg className="app-icon" viewBox="0 0 128 128" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id={`${id}-base`} x2="0" y2="1">
          <stop stopColor={from} /><stop offset="1" stopColor={to || from} />
        </linearGradient>
        <linearGradient id={`${id}-shine`} x2="0" y2="1">
          <stop stopColor="white" stopOpacity=".6" /><stop offset="1" stopColor="white" stopOpacity="0" />
        </linearGradient>
        <clipPath id={`${id}-clip`}><path d={TILE_PATH} /></clipPath>
      </defs>
      {tile && <path d={TILE_PATH} fill={`url(#${id}-base)`} />}
      {typeof children === 'function' ? children(id) : children}
      {tile && <path d={TILE_PATH} stroke={`url(#${id}-shine)`} strokeWidth="1.5" />}
    </svg>
  );
}
