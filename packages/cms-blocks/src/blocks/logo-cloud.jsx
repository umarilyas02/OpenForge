import { createCmsBlock } from "../block.js";

function LogoCloud({ heading, slots }) {
  const items = slots?.items ?? [];

  return (
    <section className="of-block of-logo-cloud">
      {heading ? <h2 className="of-logo-cloud-heading">{heading}</h2> : null}
      <div className="of-logo-cloud-viewport">
        <div className="of-logo-cloud-track">
          {items.map((item, index) => (
            <div className="of-logo-cloud-track-item" key={`a-${index}`}>
              {item}
            </div>
          ))}
          {items.map((item, index) => (
            <div
              aria-hidden="true"
              className="of-logo-cloud-track-item"
              key={`b-${index}`}
            >
              {item}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export const logoCloudBlock = createCmsBlock({
  definition: {
    schemaVersion: 1,
    id: "openforge-cms.logo-cloud",
    version: 1,
    name: "Logo Cloud",
    description: "A continuously scrolling strip of partner or customer logos.",
    tags: ["social-proof", "layout"],
    defaultProps: {},
    editableFields: [
      { path: "heading", label: "Heading", control: "text", required: false },
    ],
    slots: [
      {
        name: "items",
        label: "Logos",
        acceptedTypes: ["openforge-cms.logo-item"],
        min: 2,
        max: 12,
      },
    ],
    accessibility: [
      "The scroll animation respects prefers-reduced-motion, pausing to a static row instead of animating.",
      "The logo list is duplicated visually for a seamless loop; the duplicate copy is aria-hidden so screen readers see each logo once.",
    ],
    migrations: [],
  },
  component: LogoCloud,
});
