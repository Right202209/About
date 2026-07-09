import { personalInfo } from '../../info';
import { DARK_THEME, LIGHT_THEME } from '../../hooks/useTheme';
import { MEDIUM_PAUSE_MS, PROJECT_DIR, THINKING_PAUSE_MS } from '../constants';

const GREP_TOOL_MS = 800;
const LIST_TOOL_MS = 800;
const THEME_TOOL_MS = 700;
const SEARCH_TOOL_MS = 1000;
const ANSWER_TYPE_MS = 10;
const JOKE_TYPE_MS = 12;
const ASSISTANT_USAGE = { sent: 1450, received: 680, cost: 0.0145 };

const JOKES = [
  "Why do programmers wear glasses?\nBecause they can't C#!",
  "There are 10 types of people in the world:\nthose who understand binary, and those who don't.",
  "What is a programmer's favorite hangout place?\nFoo Bar!",
  "How many programmers does it take to change a light bulb?\nNone, that's a hardware problem."
];

async function answerProfile({ io }) {
  await io.runTool({
    tool: 'Grep',
    args: { pattern: 'personalInfo', path: PROJECT_DIR },
    result: 'Found 1 match',
    duration: GREP_TOOL_MS
  });
  await io.typeText({
    text: 'Droit is a passionate junior software developer. Here is what I know about him:\n',
    interval: ANSWER_TYPE_MS
  });
  io.print('text', `• Name:       ${personalInfo.name}`);
  io.print('text', `• Sex/Age:    ${personalInfo.sex}, ${personalInfo.age} years old`);
  io.print('text', `• Email:      ${personalInfo.email}`);
  io.print('text', '• Goal:       Become a full-stack engineer and contribute to open source.');
  io.print('text', "\nType 'skill' for his technical profile, or 'contact' to reach out!");
}

async function answerProjects({ io }) {
  await io.runTool({
    tool: 'Bash',
    args: { command: 'ls ~/Codes' },
    result: 'Listed 3 entries',
    duration: LIST_TOOL_MS
  });
  await io.typeText({
    text: 'I scanned the active workspace and found the following items:\n',
    interval: ANSWER_TYPE_MS
  });
  io.print('text', "📂 About      - Droit's macOS-style React portfolio page (this project).");
  io.print('text', '📂 2048       - A web-based 2048 game custom-built by Droit.');
  io.print('text', '📂 @datasets  - Storage folder containing datasets.');
  io.print('text', "\nRun '2048' to play the game, or type 'resume' to visit the homepage.");
}

async function answerTheme({ io, engine, question }) {
  const wantsLight = question.includes(LIGHT_THEME) && !question.includes(DARK_THEME);
  const target = wantsLight ? LIGHT_THEME : DARK_THEME;
  if (engine.theme === target) {
    io.print('info', `The current theme is already ${target} mode.`);
    return;
  }
  const approved = await io.confirm(
    `Claude wants to switch the interface to ${target} mode. Proceed? [y/N]`
  );
  if (!approved) {
    io.print('warning', 'Theme change cancelled.');
    return;
  }
  await io.runTool({
    tool: 'Bash',
    args: { command: `theme --set ${target}` },
    result: 'Stylesheet variables updated',
    duration: THEME_TOOL_MS
  });
  engine.setTheme(target);
  io.print('success', `Successfully changed theme to ${target} mode.`);
}

async function answerJoke({ io }) {
  await io.delay(MEDIUM_PAUSE_MS);
  const joke = JOKES[Math.floor(Math.random() * JOKES.length)];
  await io.typeText({ text: joke, type: 'success', interval: JOKE_TYPE_MS });
}

async function answerFallback({ io, rawInput }) {
  await io.runTool({
    tool: 'WebSearch',
    args: { query: rawInput },
    result: 'Search completed — no strong matches',
    duration: SEARCH_TOOL_MS
  });
  await io.typeText({
    text: `I've analyzed your query: "${rawInput}".\nAs Droit's personal AI agent, I can run these commands for you:\n`,
    interval: ANSWER_TYPE_MS
  });
  io.print('text', '  • skill    - View programming language ratings');
  io.print('text', '  • contact  - View contact cards');
  io.print('text', "  • book     - Read Droit's reference book list");
  io.print('text', '  • /help    - Open the full guide');
  io.print('text', '\nTry one of the commands above, or ask a specific question about Droit.');
}

const TOPICS = [
  { keywords: ['who', 'droit', 'about', 'introduce'], respond: answerProfile },
  { keywords: ['project', 'portfolio', 'code', 'repo'], respond: answerProjects },
  { keywords: ['theme', 'dark', 'light', 'color'], respond: answerTheme },
  { keywords: ['joke', 'funny'], respond: answerJoke }
];

/* Natural-language fallback for anything that is not a registered command. */
export default async function assistant(ctx) {
  const question = ctx.rawInput.toLowerCase();
  ctx.io.print('system', 'Thinking…');
  await ctx.io.delay(THINKING_PAUSE_MS);
  const topic = TOPICS.find(entry => entry.keywords.some(word => question.includes(word)));
  const respond = topic ? topic.respond : answerFallback;
  await respond({ ...ctx, question });
  ctx.io.usage(ASSISTANT_USAGE);
}
