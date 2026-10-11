import { useLayoutEffect, useRef, useState } from 'react';

const MARGIN = 8;
const MIN_WIDTH = 340;
const MIN_HEIGHT = 240;
const CASCADE = 22;
const clamp = (value, min, max) => Math.max(min, Math.min(value, max));

export function fitFrame(frame, bounds) {
  const width = Math.min(frame.width, Math.max(0, bounds.width - MARGIN * 2));
  const height = Math.min(frame.height, Math.max(0, bounds.height - MARGIN * 2));
  return { width, height, x: clamp(frame.x, MARGIN, bounds.width - width - MARGIN), y: clamp(frame.y, MARGIN, bounds.height - height - MARGIN) };
}

function resizeFrame(start, edge, dx, dy, bounds) {
  let { x, y, width, height } = start;
  const minWidth = Math.min(MIN_WIDTH, bounds.width - MARGIN * 2);
  const minHeight = Math.min(MIN_HEIGHT, bounds.height - MARGIN * 2);
  if (edge.includes('e')) width = clamp(width + dx, minWidth, bounds.width - x - MARGIN);
  if (edge.includes('s')) height = clamp(height + dy, minHeight, bounds.height - y - MARGIN);
  if (edge.includes('w')) {
    x = clamp(x + dx, MARGIN, start.x + start.width - minWidth);
    width = start.x + start.width - x;
  }
  if (edge.includes('n')) {
    y = clamp(y + dy, MARGIN, start.y + start.height - minHeight);
    height = start.y + start.height - y;
  }
  return { x, y, width, height };
}

function useStageSize(windowRef, preferred, index, setFrame) {
  const [bounds, setBounds] = useState({ width: 0, height: 0 });
  const initialized = useRef(false);
  useLayoutEffect(() => {
    const stage = windowRef.current.parentElement;
    const measure = () => {
      const next = { width: stage.clientWidth, height: stage.clientHeight };
      setBounds(next);
      if (initialized.current) {
        setFrame(previous => fitFrame(previous, next));
      } else {
        initialized.current = true;
        const width = Math.min(preferred.width, next.width - MARGIN * 2);
        const height = Math.min(preferred.height, next.height - MARGIN * 2);
        setFrame(fitFrame({ width, height, x: (next.width - width) / 2 + index * CASCADE, y: (next.height - height) / 2 + index * CASCADE }, next));
      }
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(stage);
    return () => observer.disconnect();
  }, [windowRef, preferred, index, setFrame]);
  return bounds;
}

export default function useWindowFrame({ preferred, index, maximized }) {
  const ref = useRef(null);
  const gesture = useRef(null);
  const initialIndex = useRef(index);
  const [frame, setFrame] = useState({ x: 0, y: 0, width: preferred.width, height: preferred.height });
  const [moving, setMoving] = useState(false);
  const bounds = useStageSize(ref, preferred, initialIndex.current, setFrame);
  const begin = (event, edge = 'move') => {
    if (maximized || event.button !== 0 || (edge === 'move' && event.target.closest('button, input, a'))) return;
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    gesture.current = { edge, frame, x: event.clientX, y: event.clientY, target: event.currentTarget, pointerId: event.pointerId };
    setMoving(true);
  };
  const move = event => {
    const start = gesture.current;
    if (!start || event.pointerId !== start.pointerId) return;
    const dx = event.clientX - start.x;
    const dy = event.clientY - start.y;
    setFrame(start.edge === 'move' ? fitFrame({ ...start.frame, x: start.frame.x + dx, y: start.frame.y + dy }, bounds) : resizeFrame(start.frame, start.edge, dx, dy, bounds));
  };
  const end = () => {
    const start = gesture.current;
    gesture.current = null;
    if (start?.target.hasPointerCapture(start.pointerId)) start.target.releasePointerCapture(start.pointerId);
    setMoving(false);
  };
  const visible = maximized ? { x: MARGIN, y: MARGIN, width: bounds.width - MARGIN * 2, height: bounds.height - MARGIN * 2 } : frame;
  return { ref, moving, begin, move, end, style: { left: visible.x, top: visible.y, width: visible.width, height: visible.height } };
}
