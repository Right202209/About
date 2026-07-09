import { links } from '../../info';
import { SHORT_PAUSE_MS, WINDOW_TARGET } from '../constants';

const OPEN_TOOL_MS = 700;
const LINK_USAGE = { sent: 520, received: 180, cost: 0.0018 };
const HTTP_PATTERN = /^https?:\/\//i;

function permissionPrompt(url) {
  return `Bash(open "${url}") — Claude needs your permission to run this command. Proceed? [y/N]`;
}

/* Permission first, then the Bash tool runs — mirrors the real CLI flow. */
async function openWithApproval({ io, url, successText, cancelText }) {
  const approved = await io.confirm(permissionPrompt(url));
  if (!approved) {
    io.print('warning', cancelText);
    io.usage(LINK_USAGE);
    return;
  }
  await io.runTool({
    tool: 'Bash',
    args: { command: `open "${url}"` },
    result: 'Opened in a new browser tab',
    duration: OPEN_TOOL_MS
  });
  io.print('success', successText);
  window.open(url, WINDOW_TARGET);
  io.usage(LINK_USAGE);
}

export async function echo({ io, args }) {
  await io.delay(SHORT_PAUSE_MS);
  io.print('success', args || '');
}

export async function open({ io, args }) {
  if (!args) {
    io.print('error', 'Error: A URL is required! Usage: open <url>');
    return;
  }
  const target = args.trim();
  const url = HTTP_PATTERN.test(target) ? target : `https://${target}`;
  await openWithApproval({
    io,
    url,
    successText: 'Permission granted. Opening in a new browser tab…',
    cancelText: 'Permission denied. Command aborted.'
  });
}

export function resume({ io }) {
  return openWithApproval({
    io,
    url: links.resume,
    successText: 'Opening resume…',
    cancelText: 'Command aborted.'
  });
}

export function menu({ io }) {
  return openWithApproval({
    io,
    url: links.menu,
    successText: 'Opening portfolio menu…',
    cancelText: 'Command aborted.'
  });
}

export function game2048({ io }) {
  return openWithApproval({
    io,
    url: links.game2048,
    successText: 'Launching 2048 — have fun!',
    cancelText: 'Game launch cancelled.'
  });
}
