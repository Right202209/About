export default function TrashApp() {
  return (
    <div className="app-trash">
      <span className="app-trash__glyph" aria-hidden="true">🗑️</span>
      <p className="app-trash__title">Trash is empty</p>
      <p className="app-trash__hint">Droit keeps a tidy desktop — nothing to clean here.</p>
    </div>
  );
}
