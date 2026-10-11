const RUN_TIMEOUT = 4000;

const BRIDGE = `<script>
(function () {
  var send = function (level, args) {
    parent.postMessage({ source: 'code-runner', level: level, text: Array.prototype.map.call(args, function (value) {
      if (typeof value === 'string') return value;
      try { return JSON.stringify(value); } catch (error) { return String(value); }
    }).join(' ') }, '*');
  };
  ['log', 'info', 'warn', 'error'].forEach(function (level) { console[level] = function () { send(level, arguments); }; });
  window.onerror = function (message, source, line) { send('error', [message + (line ? ' (line ' + line + ')' : '')]); };
  window.addEventListener('unhandledrejection', function (event) { send('error', ['Uncaught (in promise) ' + event.reason]); });
})();
</script>`;

const escapeScript = code => code.replace(/<\/script/gi, '<\\/script');

/* Runs JavaScript in a throwaway sandboxed frame and streams console output back. */
export function runJavaScript(code, onLine) {
  const frame = document.createElement('iframe');
  frame.setAttribute('sandbox', 'allow-scripts');
  frame.style.display = 'none';
  const listener = event => {
    if (event.source !== frame.contentWindow || event.data?.source !== 'code-runner') return;
    onLine({ level: event.data.level, text: event.data.text });
  };
  window.addEventListener('message', listener);
  frame.srcdoc = `<!doctype html><html><body>${BRIDGE}<script>${escapeScript(code)}\n</script></body></html>`;
  document.body.appendChild(frame);
  const stop = () => { window.removeEventListener('message', listener); frame.remove(); };
  const timer = setTimeout(stop, RUN_TIMEOUT);
  return () => { clearTimeout(timer); stop(); };
}

/* Inline linked stylesheets and scripts from the workspace so the preview works offline. */
export function buildPreview(html, files) {
  const byName = Object.fromEntries(files.map(file => [file.name, file.content]));
  return html
    .replace(/<link[^>]*href=["']([^"']+\.css)["'][^>]*>/gi, (tag, name) => byName[name] !== undefined ? `<style>${byName[name]}</style>` : tag)
    .replace(/<script[^>]*src=["']([^"']+\.js)["'][^>]*><\/script>/gi, (tag, name) => byName[name] !== undefined ? `<script>${escapeScript(byName[name])}</script>` : tag);
}
