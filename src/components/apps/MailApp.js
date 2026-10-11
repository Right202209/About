import { contacts, personalInfo } from '../../info';
import SystemGlyph from '../icons/SystemGlyph';

const CHANNEL_ICONS = { email: 'mail', github: 'github', twitter: 'twitter', telegram: 'telegram' };

export default function MailApp() {
  return <div className="app-mail">
    <aside className="mail-sidebar"><p>Favorites</p><div className="mail-sidebar__selected"><SystemGlyph name="mail" />All Contacts<span>{contacts.length}</span></div></aside>
    <div className="mail-content">
      <div className="mail-heading"><h2>Contacts</h2><a href={`mailto:${personalInfo.email}`} className="mail-compose" aria-label="Compose email"><SystemGlyph name="edit" /></a></div>
      <div className="mail-profile"><img src={`${process.env.PUBLIC_URL}/droit.jpg`} alt="" /><div><h3>{personalInfo.name}</h3><a href={`mailto:${personalInfo.email}`}>{personalInfo.email}</a></div></div>
      <div className="mail-contacts">{contacts.map(entry => {
        const value = entry.content.replace(/\x60/g, '').trim();
        const name = entry.label.replace(':', '');
        return <a key={entry.label} className="mail-contact" href={value.startsWith('http') ? value : `mailto:${value}`} target="_blank" rel="noreferrer">
          <span className="mail-contact__icon"><SystemGlyph name={CHANNEL_ICONS[name.toLowerCase()] || 'mail'} /></span>
          <span><strong>{name}</strong><small>{value}</small></span><SystemGlyph name="chevronRight" />
        </a>;
      })}</div>
    </div>
  </div>;
}
