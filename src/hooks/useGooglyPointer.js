import { useEffect } from 'react';

const PUPIL_MAX_OFFSET_PX = 5;
const POINTER_TRAVEL_PX = 12;
const CENTER_RATIO = 0.5;

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function pupilOffset(position, extent) {
  const drift = (position / extent - CENTER_RATIO) * POINTER_TRAVEL_PX;
  return clamp(drift, -PUPIL_MAX_OFFSET_PX, PUPIL_MAX_OFFSET_PX);
}

/* Tracks the pointer and drives the menu-bar googly eyes via CSS custom properties. */
export default function useGooglyPointer() {
  useEffect(() => {
    let rafId = 0;
    const root = document.documentElement;

    const setPupil = (x, y) => {
      root.style.setProperty('--googly-pupil-x', `${pupilOffset(x, window.innerWidth)}px`);
      root.style.setProperty('--googly-pupil-y', `${pupilOffset(y, window.innerHeight)}px`);
    };

    const handlePointerMove = event => {
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
      rafId = requestAnimationFrame(() => setPupil(event.clientX, event.clientY));
    };

    setPupil(window.innerWidth * CENTER_RATIO, window.innerHeight * CENTER_RATIO);
    window.addEventListener('pointermove', handlePointerMove, { passive: true });

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
      root.style.removeProperty('--googly-pupil-x');
      root.style.removeProperty('--googly-pupil-y');
    };
  }, []);
}
