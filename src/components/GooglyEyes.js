/* Pupils follow the pointer via --googly-pupil-x/y set by useGooglyPointer. */
export default function GooglyEyes() {
  return (
    <div className="googly-eyes googly-eyes--menu">
      <span className="googly-eye">
        <span className="googly-pupil" />
      </span>
      <span className="googly-eye">
        <span className="googly-pupil" />
      </span>
    </div>
  );
}
