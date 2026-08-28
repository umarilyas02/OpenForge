import { createCmsBlock } from "../block.js";

function StatsRow({ heading, slots }) {
  const items = slots?.items ?? [];

  return (
    <section className="of-block of-stats-row">
      {heading ? <h2 className="of-stats-row-heading">{heading}</h2> : null}
      <div className="of-stats-row-grid">
        {items.map((item, index) => (
          <div className="of-stats-row-item" key={index}>
            {item}
          </div>
        ))}
      </div>
    </section>
  );
}

export const statsRowBlock = createCmsBlock({
  definition: {
    schemaVersion: 1,
    id: "openforge-cms.stats-row",
    version: 1,
    name: "Stats Row",
    description: "A row of highlighted statistics.",
    tags: ["stats", "layout"],
    defaultProps: {},
    editableFields: [
      { path: "heading", label: "Heading", control: "text", required: false },
    ],
    slots: [
      {
        name: "items",
        label: "Statistics",
        acceptedTypes: ["openforge-cms.stat"],
        min: 2,
        max: 6,
      },
    ],
    accessibility: ["Stat order in source matches visual and reading order."],
    migrations: [],
  },
  component: StatsRow,
});
