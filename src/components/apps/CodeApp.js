import { skills, personalInfo } from '../../info';
import SystemGlyph from '../icons/SystemGlyph';

const SKILL_PATTERN = /·\s+(.+)\s+(\d+)\/100/;
const PARSED_SKILLS = skills.map(item => {
  const match = item.content.match(SKILL_PATTERN);
  return match ? { name: match[1], score: Number(match[2]) } : null;
}).filter(Boolean).sort((a, b) => b.score - a.score);

export default function CodeApp() {
  return <div className="app-code">
    <aside className="code-activity" aria-hidden="true"><SystemGlyph name="document" /><SystemGlyph name="search" /><SystemGlyph name="code" /></aside>
    <aside className="code-explorer"><p>EXPLORER</p><strong><SystemGlyph name="chevronDown" />{personalInfo.name.toUpperCase()}</strong><span><SystemGlyph name="code" />skills.json</span></aside>
    <div className="code-editor"><div className="code-tab"><span>JSON</span>skills.json</div><div className="code-breadcrumb">{personalInfo.name}<SystemGlyph name="chevronRight" />skills.json</div>
      <div className="code-lines"><div><i>1</i><code>{'{'}</code></div>{PARSED_SKILLS.map((skill, index) => <div key={skill.name}><i>{index + 2}</i><code>  <span className="code-key">"{skill.name}"</span>: <span className="code-number">{skill.score}</span>{index < PARSED_SKILLS.length - 1 ? ',' : ''}</code></div>)}<div><i>{PARSED_SKILLS.length + 2}</i><code>{'}'}</code></div></div>
    </div>
    <footer className="code-status"><span><SystemGlyph name="code" />main</span><span>UTF-8</span><span>JSON</span></footer>
  </div>;
}
