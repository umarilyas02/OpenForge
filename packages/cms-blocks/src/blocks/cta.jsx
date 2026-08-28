import { createCmsBlock } from "../block.js";

function Cta({ heading, buttonLabel, buttonHref }) {
  return (
    <section className="of-block of-cta">
      {heading ? <h2 className="of-cta-heading">{heading}</h2> : null}
      <a className="of-cta-button" href={buttonHref}>
        {buttonLabel}
      </a>
    </section>
  );
}

export const ctaBlock = createCmsBlock({
  definition: {
    schemaVersion: 1,
    id: "openforge-cms.cta",
    version: 1,
    name: "Call to Action",
    description: "A heading with a single prominent action button.",
    tags: ["conversion", "cta"],
    defaultProps: {},
    editableFields: [
      { path: "heading", label: "Heading", control: "text", required: false },
      {
        path: "buttonLabel",
        label: "Button label",
        control: "text",
        required: true,
      },
      {
        path: "buttonHref",
        label: "Button link",
        control: "url",
        required: true,
      },
    ],
    slots: [],
    accessibility: [
      "Button renders as a real link with visible focus styles from theme tokens.",
    ],
    migrations: [],
  },
  component: Cta,
});
