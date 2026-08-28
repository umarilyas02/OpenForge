import { createCmsBlock } from "../block.js";

function Accordion({ heading, slots }) {
  const items = slots?.items ?? [];

  return (
    <section className="of-block of-accordion">
      {heading ? <h2 className="of-accordion-heading">{heading}</h2> : null}
      <div className="of-accordion-list">
        {items.map((item, index) => (
          <div key={index}>{item}</div>
        ))}
      </div>
    </section>
  );
}

export const accordionBlock = createCmsBlock({
  definition: {
    schemaVersion: 1,
    id: "openforge-cms.accordion",
    version: 1,
    name: "Accordion",
    description: "A list of collapsible question-and-answer items.",
    tags: ["faq", "layout"],
    defaultProps: {},
    editableFields: [
      { path: "heading", label: "Heading", control: "text", required: false },
    ],
    slots: [
      {
        name: "items",
        label: "Items",
        acceptedTypes: ["openforge-cms.faq-item"],
        min: 1,
        max: null,
      },
    ],
    accessibility: [
      "Each item is independently keyboard-operable via native <details>.",
    ],
    migrations: [],
  },
  component: Accordion,
});
