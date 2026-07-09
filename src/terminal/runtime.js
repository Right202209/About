/*
 * Runtime for the simulated terminal. Each command run gets a `proc` (its
 * cancellation handle) and an `io` facade. Cancellation works by rejecting
 * the single pending await through `proc.abort`, so Ctrl+C stops a command
 * mid-flight instead of letting it keep printing.
 */
import {
  CONTEXT_WINDOW_TOKENS,
  DEFAULT_TOOL_MS,
  MS_PER_SECOND,
  PERCENT_MAX,
  TOOL_SETTLE_MS,
  TYPE_INTERVAL_MS
} from './constants';

let lineCounter = 0;

export function makeLine(type, text) {
  lineCounter += 1;
  return { id: `ln-${lineCounter}`, type, text };
}

export function cancelledError() {
  const error = new Error('Interrupted by user');
  error.cancelled = true;
  return error;
}

export function isCancelled(error) {
  return Boolean(error && error.cancelled);
}

export function createProcess() {
  const proc = { cancelled: false, startedAt: Date.now(), abort: null };
  proc.cancel = () => {
    proc.cancelled = true;
    if (proc.abort) {
      proc.abort();
    }
  };
  return proc;
}

function makeDelay(proc) {
  return ms => new Promise((resolve, reject) => {
    if (proc.cancelled) {
      reject(cancelledError());
      return;
    }
    const timer = setTimeout(() => {
      proc.abort = null;
      resolve();
    }, ms);
    proc.abort = () => {
      clearTimeout(timer);
      reject(cancelledError());
    };
  });
}

function makeTypeText(io) {
  return async ({ text, type = 'text', interval = TYPE_INTERVAL_MS }) => {
    const id = io.print(type, '');
    for (let i = 1; i <= text.length; i += 1) {
      io.update(id, { text: text.slice(0, i) });
      await io.delay(interval);
    }
  };
}

function makeRunTool(io) {
  return async ({ tool, args, result, duration = DEFAULT_TOOL_MS }) => {
    const id = io.print('tool_call', { tool, args, status: 'running' });
    await io.delay(duration);
    io.update(id, { text: { tool, args, status: 'success', result } });
    await io.delay(TOOL_SETTLE_MS);
  };
}

function contextLeftPercent(session) {
  const used = (session.tokensUsed / CONTEXT_WINDOW_TOKENS) * PERCENT_MAX;
  return Math.max(0, Math.round(PERCENT_MAX - used));
}

function makeUsage({ io, proc, session }) {
  return ({ sent, received, cost }) => {
    session.tokensUsed += sent + received;
    const elapsed = ((Date.now() - proc.startedAt) / MS_PER_SECOND).toFixed(1);
    const tokens = `${sent.toLocaleString()} sent · ${received.toLocaleString()} received`;
    const summary = `Tokens: ${tokens} | Cost: $${cost.toFixed(4)} | Time: ${elapsed}s`;
    io.print('meta', `${summary} | Context left: ${contextLeftPercent(session)}%`);
  };
}

export function createTerminalIO({ proc, appendLine, patchLine, session, askUser }) {
  const io = {
    session,
    confirm: askUser,
    print: (type, text) => {
      const line = makeLine(type, text);
      appendLine(line);
      return line.id;
    },
    update: (id, patch) => patchLine(id, patch)
  };
  io.delay = makeDelay(proc);
  io.typeText = makeTypeText(io);
  io.runTool = makeRunTool(io);
  io.usage = makeUsage({ io, proc, session });
  return io;
}
