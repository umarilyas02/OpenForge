import { createCmsBlock } from "../block.js";

function Columns({ heading, slots }) {
  const items = slots?.items ?? [];

  return (
    <section className="of-block of-columns">
      {heading ? <h2 className="of-columns-heading">{heading}</h2> : null}
      <div className="of-columns-grid">
        {items.map((item, index) => (
          <div className="of-columns-item" key={index}>
            {item}
          </div>
        ))}
      </div>
    </section>
  );
}

export const columnsBlock = createCmsBlock({
  definition: {
    schemaVersion: 1,
    id: "openforge-cms.columns",
    version: 1,
    name: "Columns",
    description: "A row of nested blocks laid out in equal-width columns.",
    tags: ["layout", "columns"],
    defaultProps: {},
    editableFields: [
      { path: "heading", label: "Heading", control: "text", required: false },
    ],
    slots: [
      {
        name: "items",
        label: "Columns",
        acceptedTypes: [
          "openforge-cms.rich-text",
          "openforge-cms.image",
          "openforge-cms.cta",
        ],
        min: 1,
        max: null,
      },
    ],
    accessibility: ["Column order in source matches visual and reading order."],
    migrations: [],
  },
  component: Columns,
});
