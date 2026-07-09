# src/terminal/ — simulated Claude Code CLI

- `ClaudeTerminal.js` — the component: output view, input row, key handling (Tab/→ accepts the ghost suggestion, ↑/↓ history, Ctrl+C via a document-wide listener so interrupt works while the input is disabled).
- `useTerminalEngine.js` — line buffer, command lifecycle, y/N confirmations, history. Each run gets a `proc` cancellation handle; Ctrl+C rejects the pending delay/confirm so commands abort mid-flight.
- `useTerminalInput.js` — entry value, ghost-text suggestion, history navigation.
- `runtime.js` — `createTerminalIO`: `print`/`update`/`delay`/`typeText`/`runTool`/`confirm`/`usage`. `usage` accumulates a simulated context budget shown in meta lines (`/compact` shrinks it).
- `TerminalLines.js` — per-line renderers including the tool-call box; `constants.js` — shared timings and wording.
- `commands/` — one async handler per command, each taking a single `{ io, engine, args, rawInput }` ctx (never positional params).

## Conventions

- Simulated tools use real Claude Code names and arg shapes: `Read` (`file_path`), `Grep` (`pattern`, `path`), `Bash` (`command`), `WebSearch` (`query`).
- Anything that opens a URL or changes state asks permission first (`io.confirm`), then runs the simulated `Bash` tool, then acts.
- Unrecognized input falls through to `assistant.js` (keyword-matched natural-language answers).

## Adding a command

1. Put any data in `src/info.js`.
2. Write a handler in `commands/` (async, ctx struct as above).
3. Register it in the `HANDLERS` map in `commands/index.js` — `COMMAND_NAMES` (autocomplete) derives from the registry automatically.
