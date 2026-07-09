import { contacts, personalInfo } from '../../info';

const BACKTICK_PATTERN = /`/g;
const CHANNEL_GLYPHS = { email: '✉️', github: '🐙', twitter: '🐦', telegram: '📨' };
const DEFAULT_GLYPH = '✉️';

function channelGlyph(label) {
  const key = label.toLowerCase().replace(':', '');
  return CHANNEL_GLYPHS[key] || DEFAULT_GLYPH;
}

function channelHref(value) {
  return value.startsWith('http') ? value : `mailto:${value}`;
}

export default function MailApp() {
  return (
    <div className="app-mail">
      <p className="app-section-title">Inbox — contact Droit</p>
      {contacts.map(entry => {
        const value = entry.content.replace(BACKTICK_PATTERN, '').trim();
        return (
          <a
            key={entry.label}
            className="app-row"
            href={channelHref(value)}
            target="_blank"
            rel="noreferrer"
          >
            <span className="app-row__glyph" aria-hidden="true">{channelGlyph(entry.label)}</span>
            <span className="app-row__name">{entry.label.replace(':', '')}</span>
            <span className="app-row__meta">{value}</span>
          </a>
        );
      })}
      <div className="app-mail__cta">
        <a className="app-button" href={`mailto:${personalInfo.email}`}>
          ✏️ Compose — say hello
        </a>
      </div>
    </div>
  );
}
