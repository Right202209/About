/* Pure-CSS wallpaper: conic base, grain, light beams and floating orbs. */
export default function DesktopBackground() {
  return (
    <div className="desktop__bg-container">
      <div className="desktop__bg" aria-hidden="true">
        <div className="desktop__grain" />
        <div className="desktop__beam desktop__beam--one" />
        <div className="desktop__beam desktop__beam--two" />
        <div className="desktop__orb desktop__orb--one" />
        <div className="desktop__orb desktop__orb--two" />
        <div className="desktop__orb desktop__orb--three" />
      </div>
    </div>
  );
}
