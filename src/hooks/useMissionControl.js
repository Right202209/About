import { useLayoutEffect } from 'react';

const PADDING = 48;
const GAP = 36;
const MAX_SCALE = .8;

/* Mission Control: lay every visible window out in a grid, keeping each one's proportions. */
function layout(nodes, stage) {
  const columns = Math.ceil(Math.sqrt(nodes.length));
  const rows = Math.ceil(nodes.length / columns);
  const cellWidth = (stage.width - PADDING * 2 - GAP * (columns - 1)) / columns;
  const cellHeight = (stage.height - PADDING * 2 - GAP * (rows - 1)) / rows;
  return nodes.map((node, index) => {
    const rect = { left: node.offsetLeft, top: node.offsetTop, width: node.offsetWidth, height: node.offsetHeight };
    const scale = Math.min(cellWidth / rect.width, cellHeight / rect.height, MAX_SCALE);
    const column = index % columns;
    const row = Math.floor(index / columns);
    const rowCount = row === rows - 1 ? nodes.length - row * columns : columns;
    const rowOffset = (columns - rowCount) * (cellWidth + GAP) / 2;
    const cx = PADDING + rowOffset + column * (cellWidth + GAP) + cellWidth / 2;
    const cy = PADDING + row * (cellHeight + GAP) + cellHeight / 2;
    return `translate(${cx - (rect.left + rect.width / 2)}px, ${cy - (rect.top + rect.height / 2)}px) scale(${scale})`;
  });
}

export default function useMissionControl(open, stageRef, windowCount) {
  useLayoutEffect(() => {
    const stage = stageRef.current;
    if (!stage) return undefined;
    const nodes = [...stage.querySelectorAll(':scope > .mac-window:not([hidden])')].sort((a, b) => a.dataset.app.localeCompare(b.dataset.app));
    if (!open) { nodes.forEach(node => { node.style.transform = ''; }); return undefined; }
    const transforms = layout(nodes, { width: stage.clientWidth, height: stage.clientHeight });
    nodes.forEach((node, index) => { node.style.transform = transforms[index]; });
    return () => nodes.forEach(node => { node.style.transform = ''; });
  }, [open, stageRef, windowCount]);
}
