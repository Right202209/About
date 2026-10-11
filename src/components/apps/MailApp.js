import SystemGlyph from '../icons/SystemGlyph';

const MAILBOXES = [{ name: 'Inbox', icon: 'mail' }, { name: 'Sent', icon: 'share' }, { name: 'Drafts', icon: 'edit' }];

export default function MailApp() {
  return <div className="app-mail">
    <aside className="mail-sidebar"><p>Favorites</p>{MAILBOXES.map((box, index) => <div key={box.name} className={index === 0 ? 'mail-sidebar__selected' : 'mail-sidebar__item'}><SystemGlyph name={box.icon} />{box.name}<span>0</span></div>)}</aside>
    <div className="mail-content">
      <div className="mail-heading"><h2>Inbox</h2><span className="mail-compose" aria-hidden="true"><SystemGlyph name="edit" /></span></div>
      <div className="app-empty"><SystemGlyph name="mail" /><h3>No Messages</h3><p>Your inbox is empty.</p></div>
    </div>
  </div>;
}
