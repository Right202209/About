import assistant from './assistant';
import intro from './intro';
import { ascii, book, cartoon, contact, help, skill } from './infoCommands';
import { echo, game2048, menu, open, resume } from './linkCommands';
import { clear, compact, exit, history } from './slashCommands';

const HANDLERS = {
  intro,
  help,
  '/help': help,
  skill,
  contact,
  cartoon,
  book,
  ascii,
  name: ascii,
  echo,
  open,
  resume,
  menu,
  '2048': game2048,
  '/clear': clear,
  '/compact': compact,
  '/history': history,
  '/exit': exit
};

/* Drives the inline autocomplete; stays in sync with the registry above. */
export const COMMAND_NAMES = Object.keys(HANDLERS);

const WHITESPACE = /\s+/;

export async function runCommand({ io, rawInput, engine, isBoot }) {
  const parts = rawInput.trim().split(WHITESPACE);
  const commandName = parts[0].toLowerCase();
  const args = parts.slice(1).join(' ');
  const handler = isBoot ? intro : HANDLERS[commandName];
  const ctx = { io, engine, args, rawInput };
  if (handler) {
    await handler(ctx);
    return;
  }
  await assistant(ctx);
}
