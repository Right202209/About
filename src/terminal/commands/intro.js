import { personalInfo } from '../../info';
import {
  INFO_FILE,
  INTRO_TYPE_INTERVAL_MS,
  MEDIUM_PAUSE_MS,
  SHORT_PAUSE_MS,
  TINY_PAUSE_MS
} from '../constants';

const READ_INFO_MS = 800;
const INFO_FILE_LINES = 104;
const INTRO_USAGE = { sent: 1240, received: 480, cost: 0.0058 };

async function printProfile(io) {
  const rows = [
    `Name:   ${personalInfo.name}`,
    `Sex:    ${personalInfo.sex}`,
    `Age:    ${personalInfo.age} years old`,
    `Email:  ${personalInfo.email}`
  ];
  for (const row of rows) {
    io.print('text', row);
    await io.delay(TINY_PAUSE_MS);
  }
}

async function printAims(io) {
  io.print('info', `Goals (${personalInfo.aims.length}):`);
  for (let i = 0; i < personalInfo.aims.length; i += 1) {
    await io.delay(TINY_PAUSE_MS);
    io.print('text', `  => ${i + 1}. ${personalInfo.aims[i]}`);
  }
}

/* Boot command: self-introduction typed out Claude Code style. */
export default async function intro({ io }) {
  await io.typeText({
    text: `Welcome to ${personalInfo.name}'s Claude Code CLI.`,
    type: 'success',
    interval: INTRO_TYPE_INTERVAL_MS
  });
  await io.delay(MEDIUM_PAUSE_MS);
  await io.runTool({
    tool: 'Read',
    args: { file_path: INFO_FILE },
    result: `Read ${INFO_FILE_LINES} lines`,
    duration: READ_INFO_MS
  });
  await io.typeText({
    text: 'Thanks for your visit, let me introduce myself.',
    type: 'info',
    interval: INTRO_TYPE_INTERVAL_MS
  });
  await io.delay(SHORT_PAUSE_MS);
  await printProfile(io);
  await printAims(io);
  io.usage(INTRO_USAGE);
}
