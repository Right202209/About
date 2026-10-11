import { useState } from 'react';
import { contacts, links } from '../../info';
import SystemGlyph from '../icons/SystemGlyph';

const contactUrl = prefix => contacts.find(contact => contact.label.toLowerCase().startsWith(prefix))?.content.replace(/\x60/g, '').trim() || links.menu;
const FAVORITES = [
  { icon: 'globe', name: 'Portfolio', url: links.menu }, { icon: 'document', name: 'Resume', url: links.resume },
  { icon: 'game', name: '2048', url: links.game2048 }, { icon: 'github', name: 'GitHub', url: contactUrl('github') },
  { icon: 'twitter', name: 'Twitter', url: contactUrl('twitter') }
];

export default function SafariApp() {
  const [address, setAddress] = useState(links.menu);
  const [error, setError] = useState('');
  const navigate = event => {
    event.preventDefault();
    try {
      const url = new URL(address.includes('://') ? address : `https://${address}`);
      if (!['https:', 'http:'].includes(url.protocol)) throw new Error('Invalid protocol');
      window.open(url.href, '_blank', 'noopener,noreferrer');
      setError('');
    } catch { setError('Enter a valid website address.'); }
  };
  return <div className="app-safari">
    <div className="safari-toolbar">
      <SystemGlyph name="sidebar" />
      <form className="safari-address" onSubmit={navigate}><SystemGlyph name="lock" /><input aria-label="Website address" value={address} onChange={event => setAddress(event.target.value)} spellCheck="false" /><button type="submit" aria-label="Open website"><SystemGlyph name="chevronRight" /></button></form>
      <button type="button" className="safari-home" aria-label="Show start page" onClick={() => { setAddress(links.menu); setError(''); }}><SystemGlyph name="home" /></button>
    </div>
    <div className="safari-start">
      <h2>Favorites</h2>
      <div className="safari-favorites">{FAVORITES.map(favorite => <a key={favorite.name} href={favorite.url} target="_blank" rel="noreferrer" className="safari-favorite">
        <span className={`safari-favorite__icon safari-favorite__icon--${favorite.icon}`}><SystemGlyph name={favorite.icon} /></span><span>{favorite.name}</span>
      </a>)}</div>
      <div className="safari-privacy"><SystemGlyph name="lock" /><div><strong>Your own little corner of the web.</strong><p>Favorite places, just a click away.</p></div></div>
      {error && <p className="safari-error" role="alert">{error}</p>}
    </div>
    <footer className="safari-footer">Links open in a new tab.</footer>
  </div>;
}
