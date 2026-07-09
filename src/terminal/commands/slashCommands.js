import {
  LONG_PAUSE_MS,
  MEDIUM_PAUSE_MS,
  PERCENT_MAX,
  SHORT_PAUSE_MS
} from '../constants';

const COMPACT_STEPS = 10;
const COMPACT_STEP_MS = 200;
const BAR_SLOTS = 20;
const SLOTS_PER_STEP = BAR_SLOTS / COMPACT_STEPS;
const PERCENT_PER_STEP = PERCENT_MAX / COMPACT_STEPS;
const COMPACT_KEEP_RATIO = 0.2;

export async function clear({ engine }) {
  engine.clearLines();
}

function compactBar(step) {
  const filled = step * SLOTS_PER_STEP;
  return `[${'='.repeat(filled)}${'░'.repeat(BAR_SLOTS - filled)}] ${step * PERCENT_PER_STEP}%`;
}

/* Shrinks the tracked session context so the next usage line reflects it. */
export async function compact({ io }) {
  const before = io.session.tokensUsed;
  const progressId = io.print('info', `Compacting context: ${compactBar(0)}`);
  for (let step = 1; step <= COMPACT_STEPS; step += 1) {
    await io.delay(COMPACT_STEP_MS);
    io.update(progressId, { text: `Compacting context: ${compactBar(step)}` });
  }
  await io.delay(MEDIUM_PAUSE_MS);
  io.update(progressId, { text: '✔ Conversation compacted successfully!', type: 'success' });
  const after = Math.round(before * COMPACT_KEEP_RATIO);
  io.session.tokensUsed = after;
  const savings = PERCENT_MAX - Math.round((after / Math.max(before, 1)) * PERCENT_MAX);
  io.print(
    'text',
    `Reduced context window from ${before.toLocaleString()} to ${after.toLocaleString()} tokens (${savings}% savings).`
  );
}

export async function history({ io, engine }) {
  await io.delay(SHORT_PAUSE_MS);
  io.print('info', 'Command History (latest first):');
  const entries = engine.getHistory();
  if (entries.length === 0) {
    io.print('text', '  No commands run yet.');
    return;
  }
  entries.forEach((cmd, index) => io.print('text', `  [${index + 1}] ${cmd}`));
}

function RestartButton({ onRestart }) {
  return (
    <button type="button" className="terminal-restart-btn" onClick={onRestart}>
      🔄 Reconnect Claude CLI
    </button>
  );
}

export async function exit({ io, engine }) {
  await io.delay(MEDIUM_PAUSE_MS);
  io.print('system', 'Closing session connection…');
  await io.delay(LONG_PAUSE_MS);
  io.print('error', 'Connection closed. Claude terminal is offline.');
  io.print('system', 'Click "Reconnect Claude CLI" below to start a new session.');
  io.print('info', {
    isReactNode: true,
    node: <RestartButton onRestart={engine.restart} />
  });
}
