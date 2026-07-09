import { skills } from '../../info';

const SKILL_PATTERN = /·\s+(.+)\s+(\d+)\/100/;
const MAX_SCORE = 100;
const PERCENT_MAX = 100;

const PARSED_SKILLS = skills
  .map(item => {
    const match = item.content.match(SKILL_PATTERN);
    return match ? { name: match[1], score: parseInt(match[2], 10) } : null;
  })
  .filter(Boolean)
  .sort((a, b) => b.score - a.score);

export default function CodeApp() {
  return (
    <div className="app-code">
      <p className="app-section-title">Explorer — skills.json</p>
      {PARSED_SKILLS.map(entry => (
        <div key={entry.name} className="app-code__skill">
          <span className="app-code__lang">{entry.name}</span>
          <span className="app-code__meter" aria-hidden="true">
            <span
              className="app-code__fill"
              style={{ width: `${(entry.score / MAX_SCORE) * PERCENT_MAX}%` }}
            />
          </span>
          <span className="app-code__score">{entry.score}/{MAX_SCORE}</span>
        </div>
      ))}
    </div>
  );
}
