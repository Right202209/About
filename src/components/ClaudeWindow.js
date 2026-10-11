import ClaudeTerminal from '../terminal/ClaudeTerminal';
import { claudeBrand } from '../info';

const CLAUDE_LOGO_SRC = `${process.env.PUBLIC_URL}/claudecode.svg`;

function Banner() {
  return <div className="claude-banner">
    <img className="claude-banner__logo" src={CLAUDE_LOGO_SRC} alt="" />
    <div className="claude-banner__meta">
      <h1 className="claude-banner__app">{claudeBrand.app} <span>{claudeBrand.version}</span></h1>
      <p className="claude-banner__model">{claudeBrand.model} <span>· {claudeBrand.modelNote}</span></p>
      <p className="claude-banner__cwd">{claudeBrand.cwd}</p>
    </div>
  </div>;
}

export default function ClaudeWindow({ theme, onThemeChange, active }) {
  return <div className="claude-session">
    <Banner />
    <ClaudeTerminal theme={theme} onThemeChange={onThemeChange} active={active} />
  </div>;
}
