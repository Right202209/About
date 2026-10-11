import { sampleCode } from '../../content';
import SystemGlyph from '../icons/SystemGlyph';

const TOKEN_PATTERN = /('[^']*'|`[^`]*`|\b(?:const|function|return)\b)/g;
const KEYWORDS = ['const', 'function', 'return'];

function highlight(line) {
  return line.split(TOKEN_PATTERN).map((part, index) => {
    if (KEYWORDS.includes(part)) return <span key={index} className="code-keyword">{part}</span>;
    if (/^['`]/.test(part)) return <span key={index} className="code-string">{part}</span>;
    return part;
  });
}

export default function CodeApp() {
  const { folder, file, language, lines } = sampleCode;
  return <div className="app-code">
    <aside className="code-activity" aria-hidden="true"><SystemGlyph name="document" /><SystemGlyph name="search" /><SystemGlyph name="code" /></aside>
    <aside className="code-explorer"><p>EXPLORER</p><strong><SystemGlyph name="chevronDown" />{folder.toUpperCase()}</strong><span><SystemGlyph name="code" />{file}</span></aside>
    <div className="code-editor"><div className="code-tab"><span>JS</span>{file}</div><div className="code-breadcrumb">{folder}<SystemGlyph name="chevronRight" />{file}</div>
      <div className="code-lines">{lines.map((line, index) => <div key={index}><i>{index + 1}</i><code>{highlight(line)}</code></div>)}</div>
    </div>
    <footer className="code-status"><span><SystemGlyph name="code" />main</span><span>UTF-8</span><span>{language}</span></footer>
  </div>;
}
