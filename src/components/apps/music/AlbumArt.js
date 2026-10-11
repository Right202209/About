import { musicAlbums } from '../../../content';

export const albumById = id => musicAlbums.find(album => album.id === id);

/* Generated cover art: a gradient, soft rings and the album title, no image files needed. */
export default function AlbumArt({ albumId, size = 'md', className = '' }) {
  const album = albumById(albumId);
  if (!album) return <span className={`album-art album-art--${size} album-art--empty ${className}`} />;
  const [from, to] = album.colors;
  return <span className={`album-art album-art--${size} ${className}`} style={{ background: `linear-gradient(140deg, ${from}, ${to})` }}>
    <svg viewBox="0 0 100 100" aria-hidden="true"><g fill="none" stroke="#fff" strokeOpacity=".22">{[14, 24, 34, 44].map(r => <circle key={r} cx="78" cy="22" r={r} />)}</g></svg>
    {size !== 'xs' && <span className="album-art__title">{album.title}</span>}
  </span>;
}
