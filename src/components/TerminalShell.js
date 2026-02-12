import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

function normalizeLine(line, fallbackType = 'info') {
  if (line === undefined || line === null) {
    return null
  }

  if (typeof line === 'string' || typeof line === 'number') {
    return {
      type: fallbackType,
      label: '',
      content: String(line),
      time: ''
    }
  }

  if (typeof line === 'object') {
    const type = line.type || fallbackType
    const label = line.label ? String(line.label) : ''
    const time = line.time ? String(line.time) : ''
    const content = line.content === undefined || line.content === null ? '' : String(line.content)
    return { type, label, content, time }
  }

  return {
    type: fallbackType,
    label: '',
    content: String(line),
    time: ''
  }
}

function buildPrefix(time, label) {
  const left = time ? `${time} ` : ''
  return `${left}${label || ''}`.trim()
}

export default function TerminalShell({ className = 'terminal', cmd = {}, config = {} }) {
  const commands = useMemo(() => ({ ...(cmd.staticList || {}), ...(cmd.dynamicList || {}) }), [cmd.dynamicList, cmd.staticList])

  const prompt = config.prompt || '$ '
  const [lines, setLines] = useState([])
  const [inputValue, setInputValue] = useState('')
  const [history, setHistory] = useState([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [draftInput, setDraftInput] = useState('')
  const [isRunning, setIsRunning] = useState(false)

  const bodyRef = useRef(null)
  const inputRef = useRef(null)

  const appendLines = useCallback(entries => {
    const items = Array.isArray(entries) ? entries : [entries]
    const normalized = items
      .map(item => normalizeLine(item))
      .filter(Boolean)
      .map(item => ({ kind: 'output', ...item }))

    if (normalized.length > 0) {
      setLines(prev => [...prev, ...normalized])
    }
  }, [])

  const appendCommand = useCallback(text => {
    setLines(prev => [...prev, { kind: 'command', text }])
  }, [])

  const runCommand = useCallback(
    async (raw, options = {}) => {
      const { echo = true, trackHistory = true } = options
      const trimmed = raw.trim()

      if (!trimmed) {
        return
      }

      if (echo) {
        appendCommand(trimmed)
      }

      if (trackHistory) {
        setHistory(prev => [...prev, trimmed])
      }

      const [name, ...rest] = trimmed.split(/\s+/)
      const commandName = name.toLowerCase()
      const argInput = rest.join(' ').trim()

      if (commandName === 'clear') {
        setLines([])
        return
      }

      if (commandName === 'help') {
        appendLines({ type: 'system', label: 'System', content: 'Available commands:' })
        Object.entries(commands)
          .sort(([a], [b]) => a.localeCompare(b))
          .forEach(([key, definition]) => {
            appendLines({
              type: 'info',
              label: `${key}:`,
              content: definition?.description || ''
            })
          })
        appendLines({ type: 'info', label: 'help:', content: 'Show available commands.' })
        appendLines({ type: 'info', label: 'clear:', content: 'Clear the terminal output.' })
        return
      }

      const definition = commands[commandName]
      if (!definition) {
        appendLines({
          type: 'error',
          label: 'Error',
          content: `Command not found: ${commandName}. Type help to list commands.`
        })
        return
      }

      setIsRunning(true)
      try {
        if (Array.isArray(definition.list)) {
          appendLines(definition.list)
        } else if (typeof definition.run === 'function') {
          const print = entry => appendLines(entry)
          const result = await definition.run(print, argInput)
          if (result !== undefined && result !== null) {
            appendLines(result)
          }
        } else {
          appendLines({
            type: 'warning',
            label: 'Warning',
            content: 'Command has no runnable handler.'
          })
        }
      } catch (error) {
        appendLines({
          type: 'error',
          label: 'Error',
          content: error?.message || 'Command execution failed.'
        })
      } finally {
        setIsRunning(false)
      }
    },
    [appendCommand, appendLines, commands]
  )

  useEffect(() => {
    if (!config.bootCmd) {
      return
    }

    runCommand(config.bootCmd, { echo: false, trackHistory: false })
  }, [config.bootCmd, runCommand])

  useEffect(() => {
    const body = bodyRef.current
    if (body) {
      body.scrollTop = body.scrollHeight
    }
  }, [lines, isRunning])

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const onSubmit = event => {
    event.preventDefault()
    if (isRunning) {
      return
    }

    const value = inputValue
    setInputValue('')
    setDraftInput('')
    setHistoryIndex(-1)
    runCommand(value)
  }

  const onInputChange = event => {
    const nextValue = event.target.value
    setInputValue(nextValue)
    if (historyIndex === -1) {
      setDraftInput(nextValue)
    }
  }

  const onKeyDown = event => {
    if (event.key === 'ArrowUp') {
      if (history.length === 0) {
        return
      }

      event.preventDefault()
      const nextIndex = historyIndex === -1 ? history.length - 1 : Math.max(0, historyIndex - 1)
      if (historyIndex === -1) {
        setDraftInput(inputValue)
      }
      setHistoryIndex(nextIndex)
      setInputValue(history[nextIndex])
      return
    }

    if (event.key === 'ArrowDown') {
      if (history.length === 0 || historyIndex === -1) {
        return
      }

      event.preventDefault()
      if (historyIndex >= history.length - 1) {
        setHistoryIndex(-1)
        setInputValue(draftInput)
      } else {
        const nextIndex = historyIndex + 1
        setHistoryIndex(nextIndex)
        setInputValue(history[nextIndex])
      }
    }
  }

  return (
    <div className={className} onClick={() => inputRef.current?.focus()} role="presentation">
      <div className="terminal__titlebar">
        <h4>
          {config.initialDirectory || 'Terminal'} v{config.version || '1.0.0'}
        </h4>
      </div>
      <div className="terminal__body" ref={bodyRef}>
        <div className="terminal__inner">
          {lines.map((line, index) => {
            if (line.kind === 'command') {
              return (
                <p className="cmd" key={`cmd-${index}`}>
                  <span>{prompt}</span>
                  <span>{line.text}</span>
                </p>
              )
            }

            const prefix = buildPrefix(line.time, line.label) || ' '
            return (
              <p className={line.type || 'info'} key={`out-${index}`}>
                <span>{prefix}</span>
                <span>{line.content}</span>
              </p>
            )
          })}

          <form className="terminal__prompt-row" onSubmit={onSubmit}>
            <span className="terminal__prompt">{prompt}</span>
            <input
              aria-label="Terminal input"
              autoComplete="off"
              autoCorrect="off"
              className="terminal__input"
              disabled={isRunning}
              onChange={onInputChange}
              onKeyDown={onKeyDown}
              ref={inputRef}
              spellCheck={false}
              type="text"
              value={inputValue}
            />
          </form>
        </div>
      </div>
    </div>
  )
}
