export default function DesktopBackground({ brightness = 100 }) {
  return <div className="desktop__wallpaper" style={{ '--desktop-brightness': brightness / 100 }} aria-hidden="true">
    <img src={`${process.env.PUBLIC_URL}/macos26-desktop.jpg`} alt="" draggable="false" />
  </div>;
}
