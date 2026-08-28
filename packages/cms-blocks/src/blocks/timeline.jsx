import { createCmsBlock } from "../block.js";

function Timeline({ heading, slots }) {
  const items = slots?.items ?? [];

  return (
    <section className="of-block of-timeline">
      {heading ? <h2 className="of-timeline-heading">{heading}</h2> : null}
      <div className="of-timeline-list">
        {items.map((item, index) => (
          <div className="of-timeline-list-item" key={index}>
            {item}
          </div>
        ))}
      </div>
    </section>
  );
}

export const timelineBlock = createCmsBlock({
  definition: {
    schemaVersion: 1,
    id: "openforge-cms.timeline",
    version: 1,
    name: "Timeline",
    description:
      "A vertical timeline of dated milestones, e.g. a roadmap or process.",
    tags: ["timeline", "layout"],
    defaultProps: {},
    editableFields: [
      { path: "heading", label: "Heading", control: "text", required: false },
    ],
    slots: [
      {
        name: "items",
        label: "Steps",
        acceptedTypes: ["openforge-cms.timeline-step"],
        min: 2,
        max: null,
      },
    ],
    accessibility: ["Step order in source matches visual and reading order."],
    migrations: [],
  },
  component: Timeline,
});
