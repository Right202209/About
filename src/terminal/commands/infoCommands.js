import { books, cartoons, contacts, skills } from '../../info';
import { INFO_FILE, PROJECT_DIR } from '../constants';

const NAME_PAD = 18;
const LABEL_PAD = 10;
const LANG_PAD = 12;
const BAR_SLOTS = 15;
const MAX_SCORE = 100;
const PROFICIENT_MIN = 50;
const SKILL_ROW_PAUSE_MS = 50;
const SKILL_PATTERN = /·\s+(.+)\s+(\d+)\/100/;
const BACKTICK_PATTERN = /`/g;

const HELP_TOOL_MS = 600;
const SKILL_TOOL_MS = 900;
const CONTACT_TOOL_MS = 700;
const LIST_TOOL_MS = 700;
const BOOK_TOOL_MS = 900;
const ASCII_TOOL_MS = 500;

const HELP_USAGE = { sent: 850, received: 620, cost: 0.0038 };
const SKILL_USAGE = { sent: 780, received: 550, cost: 0.0034 };
const CONTACT_USAGE = { sent: 520, received: 240, cost: 0.0018 };
const CARTOON_USAGE = { sent: 600, received: 380, cost: 0.0024 };
const BOOK_USAGE = { sent: 980, received: 780, cost: 0.0048 };
const ASCII_USAGE = { sent: 420, received: 150, cost: 0.0014 };

const COMMAND_HELP = [
  { name: 'intro', desc: 'Introduce Droit and his career goals.' },
  { name: 'skill', desc: "Display Droit's technical skills and proficiency." },
  { name: 'contact', desc: 'Show contact details (GitHub, Email, Twitter).' },
  { name: 'book', desc: "List Droit's reading history and study list." },
  { name: 'cartoon', desc: 'List cartoons and anime watched by Droit.' },
  { name: 'ascii / name', desc: 'Display a large ASCII art banner of "DROIT".' },
  { name: 'echo [text]', desc: 'Echo the input back to the terminal.' },
  { name: 'open [url]', desc: 'Open any website URL in a new tab (requires approval).' },
  { name: 'resume', desc: "Open Droit's online portfolio page." },
  { name: '2048', desc: 'Launch a 2048 game in a new browser tab.' }
];

const SLASH_HELP = [
  { name: '/help', desc: 'Show this comprehensive help screen.' },
  { name: '/clear', desc: 'Clear the terminal output screen.' },
  { name: '/compact', desc: 'Compress the conversation context to save tokens.' },
  { name: '/history', desc: 'Show the log of commands run in this session.' },
  { name: '/exit', desc: 'Close this Claude Code session.' }
];

const SHORTCUT_HELP = [
  '  Tab / ArrowRight  - Accept the inline command suggestion',
  '  ArrowUp / Down    - Navigate command history',
  '  Ctrl + C          - Interrupt the running command'
];

const ASCII_NAME = [
  'DDDD   RRRR   OOO    III  TTTTT',
  'D   D  R   R O   O    I     T  ',
  'D   D  RRRR  O   O    I     T  ',
  'D   D  R R   O   O    I     T  ',
  'DDDD   R  RR  OOO    III    T  '
];

export async function help({ io }) {
  await io.runTool({
    tool: 'Grep',
    args: { pattern: 'commands', path: PROJECT_DIR },
    result: `Found ${COMMAND_HELP.length + SLASH_HELP.length} commands`,
    duration: HELP_TOOL_MS
  });
  io.print('info', 'Available Commands:');
  COMMAND_HELP.forEach(entry => io.print('text', `  ${entry.name.padEnd(NAME_PAD)} - ${entry.desc}`));
  io.print('info', '\nSlash Commands & Shell Utilities:');
  SLASH_HELP.forEach(entry => io.print('text', `  ${entry.name.padEnd(NAME_PAD)} - ${entry.desc}`));
  io.print('info', '\nKeyboard Shortcuts:');
  SHORTCUT_HELP.forEach(row => io.print('text', row));
  io.usage(HELP_USAGE);
}

function skillTone({ score, fallbackType }) {
  if (score >= PROFICIENT_MIN) {
    return 'success';
  }
  if (score > 0) {
    return 'warning';
  }
  return fallbackType === 'error' ? 'error' : 'system';
}

function skillRow(item) {
  const matches = item.content.match(SKILL_PATTERN);
  if (!matches) {
    return { tone: 'text', text: `  ${item.content}` };
  }
  const score = parseInt(matches[2], 10);
  const filled = Math.round((score / MAX_SCORE) * BAR_SLOTS);
  const bar = '█'.repeat(filled) + '░'.repeat(BAR_SLOTS - filled);
  return {
    tone: skillTone({ score, fallbackType: item.type }),
    text: `  ${matches[1].padEnd(LANG_PAD)} [${bar}] ${score}/${MAX_SCORE}`
  };
}

export async function skill({ io }) {
  await io.runTool({
    tool: 'Grep',
    args: { pattern: 'skills', path: INFO_FILE },
    result: `Found ${skills.length} skill entries`,
    duration: SKILL_TOOL_MS
  });
  io.print('info', 'Technical Skills & Proficiency:');
  for (const item of skills) {
    const row = skillRow(item);
    io.print(row.tone, row.text);
    await io.delay(SKILL_ROW_PAUSE_MS);
  }
  io.usage(SKILL_USAGE);
}

export async function contact({ io }) {
  await io.runTool({
    tool: 'Read',
    args: { file_path: INFO_FILE },
    result: `Read ${contacts.length} contact entries`,
    duration: CONTACT_TOOL_MS
  });
  io.print('info', 'Contact Information:');
  contacts.forEach(entry => {
    const content = entry.content.replace(BACKTICK_PATTERN, '');
    io.print('text', `  ${entry.label.padEnd(LABEL_PAD)} ${content}`);
  });
  io.usage(CONTACT_USAGE);
}

export async function cartoon({ io }) {
  await io.runTool({
    tool: 'Read',
    args: { file_path: INFO_FILE },
    result: `Read ${cartoons.length} titles`,
    duration: LIST_TOOL_MS
  });
  io.print('info', 'Anime & Cartoons Watched:');
  cartoons.forEach(title => io.print('text', `  ${title.trim()}`));
  io.usage(CARTOON_USAGE);
}

export async function book({ io }) {
  await io.runTool({
    tool: 'Read',
    args: { file_path: INFO_FILE },
    result: `Read ${books.length} books`,
    duration: BOOK_TOOL_MS
  });
  io.print('info', 'Reading List & Study References:');
  books.forEach((title, index) => io.print('text', `  [${index + 1}] ${title.trim()}`));
  io.usage(BOOK_USAGE);
}

export async function ascii({ io }) {
  await io.runTool({
    tool: 'Bash',
    args: { command: 'figlet -f banner DROIT' },
    result: 'Rendered ASCII banner',
    duration: ASCII_TOOL_MS
  });
  ASCII_NAME.forEach(row => io.print('success', row));
  io.usage(ASCII_USAGE);
}
