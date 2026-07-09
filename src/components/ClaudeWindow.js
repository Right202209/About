import ClaudeTerminal from '../terminal/ClaudeTerminal';
import { claudeBrand, personalInfo } from '../info';

const CLAUDE_LOGO = ' ▐▛███▜▌\n▝▜█████▛▘\n  ▘▘ ▝▝';

function TitleBar() {
  return (
    <div className="claude-titlebar">
      <span className="claude-traffic" aria-hidden="true">
        <i className="claude-traffic__dot claude-traffic__dot--close" />
        <i className="claude-traffic__dot claude-traffic__dot--min" />
        <i className="claude-traffic__dot claude-traffic__dot--max" />
      </span>
      <span className="claude-titlebar__title">
        {personalInfo.name} — {claudeBrand.app}
      </span>
      <span className="claude-titlebar__spacer" aria-hidden="true" />
    </div>
  );
}

function Banner() {
  return (
    <div className="claude-banner">
      <pre className="claude-banner__logo" aria-hidden="true">{CLAUDE_LOGO}</pre>
      <div className="claude-banner__meta">
        <h1 className="claude-banner__app">
          {claudeBrand.app} <span>{claudeBrand.version}</span>
        </h1>
        <p className="claude-banner__model">
          {claudeBrand.model} · {claudeBrand.modelNote}
        </p>
        <p className="claude-banner__info">
          {personalInfo.name} · {personalInfo.sex} · {personalInfo.age}
        </p>
        <p className="claude-banner__info">{personalInfo.email}</p>
        <p className="claude-banner__info claude-banner__cwd">{claudeBrand.cwd}</p>
      </div>
    </div>
  );
}

export default function ClaudeWindow({ theme, onThemeChange }) {
  return (
    <div className="claude-window">
      <TitleBar />
      <Banner />
      <ClaudeTerminal theme={theme} onThemeChange={onThemeChange} />
    </div>
  );
}
