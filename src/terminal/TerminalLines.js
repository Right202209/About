import { claudeBrand } from '../info';
import SystemGlyph from '../components/icons/SystemGlyph';

export function isRunningToolLine(line) {
  return line.type === 'tool_call' && line.text && line.text.status === 'running';
}

function InputEcho({ text }) {
  return (
    <p className="claude-terminal__line-input">
      <span className="claude-terminal__prompt">{claudeBrand.cwd} &gt;</span>
      <span className="claude-terminal__input-echo">{text}</span>
    </p>
  );
}

function ToolCallBox({ call }) {
  const running = call.status === 'running';
  const args = Object.values(call.args || {}).map(value => typeof value === 'string' ? value : JSON.stringify(value)).join(', ');
  return (
    <div className={`claude-tool-box claude-tool-box--${call.status}`}>
      <div className="claude-tool-box__header">
        <span className="claude-tool-box__status-dot" />
        <span className="claude-tool-box__title">
          <strong>{call.tool}</strong><span className="claude-tool-box__args">({args})</span>
        </span>
        {running && <span className="claude-tool-box__spinner" />}
      </div>
      {!running && call.result && (
        <div className="claude-tool-box__footer">
          <SystemGlyph name="branch" /><span>{call.result}</span>
        </div>
      )}
    </div>
  );
}

export default function TerminalLine({ line }) {
  if (line.type === 'input') {
    return <InputEcho text={line.text} />;
  }
  if (line.type === 'tool_call') {
    return <ToolCallBox call={line.text} />;
  }
  if (line.text && line.text.isReactNode) {
    return <div className="claude-terminal__line-custom-node">{line.text.node}</div>;
  }
  return <p className={`claude-terminal__line-${line.type}`}>{line.text}</p>;
}
