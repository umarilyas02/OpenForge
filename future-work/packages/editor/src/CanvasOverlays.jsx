import "./canvas-overlays.css";

export function CanvasOverlays({ descriptors }) {
  return (
    <div aria-hidden="true" className="openforge-overlays">
      {descriptors.map((descriptor) => (
        <div
          className={descriptor.states
            .map((state) => `openforge-overlay-${state}`)
            .join(" ")}
          data-node-id={descriptor.id}
          key={descriptor.id}
          style={{
            height: descriptor.rectangle.height,
            left: descriptor.rectangle.left,
            pointerEvents: "none",
            position: "absolute",
            top: descriptor.rectangle.top,
            width: descriptor.rectangle.width,
          }}
        >
          {(descriptor.states.includes("selected") ||
            descriptor.states.includes("invalid-drop")) && (
            <span className="openforge-overlay-label">{descriptor.label}</span>
          )}
        </div>
      ))}
    </div>
  );
}
