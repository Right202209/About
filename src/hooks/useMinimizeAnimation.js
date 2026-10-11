import { useLayoutEffect, useRef, useState } from 'react';

const DURATION = 480;
const EASING = 'cubic-bezier(.45, 0, .2, 1)';

function dockTarget(key) {
  return document.querySelector(`[data-dock-minimized="${key}"]`) || document.querySelector(`[data-dock-app="${key}"]`);
}

/* A genie-style squeeze: the window narrows toward its Dock tile, then drops into it. */
function genieFrames(node, key) {
  const from = node.getBoundingClientRect();
  const to = dockTarget(key)?.getBoundingClientRect();
  if (!to || !from.width) return null;
  const dx = to.left + to.width / 2 - (from.left + from.width / 2);
  const dy = to.top + to.height / 2 - (from.top + from.height / 2);
  const sx = to.width / from.width;
  const sy = to.height / from.height;
  return [
    { transform: 'none', opacity: 1, clipPath: 'inset(0 0 0 0 round 10px)', offset: 0 },
    { transform: `translate(${dx * .25}px, ${dy * .55}px) scale(${.7}, ${.55})`, opacity: .9, clipPath: 'inset(0 12% 0 12% round 10px)', offset: .45 },
    { transform: `translate(${dx}px, ${dy}px) scale(${sx}, ${sy})`, opacity: .15, clipPath: 'inset(0 0 0 0 round 10px)', offset: 1 }
  ];
}

export default function useMinimizeAnimation(ref, key, minimized) {
  const [animating, setAnimating] = useState(false);
  const previous = useRef(minimized);
  useLayoutEffect(() => {
    const node = ref.current;
    const was = previous.current;
    previous.current = minimized;
    if (was === minimized || !node?.animate || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    setAnimating(true);
    node.hidden = false;
    const frames = genieFrames(node, key);
    if (!frames) { setAnimating(false); return undefined; }
    const animation = node.animate(minimized ? frames : [...frames].reverse().map(frame => ({ ...frame, offset: 1 - frame.offset })), { duration: DURATION, easing: EASING });
    animation.onfinish = () => setAnimating(false);
    return () => animation.cancel();
  }, [ref, key, minimized]);
  return animating;
}
