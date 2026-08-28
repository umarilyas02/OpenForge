import { createCmsBlock } from "../block.js";

function Hero({ heading, subheading, ctaLabel, ctaHref }) {
  return (
    <section className="of-block of-hero">
      <h1 className="of-hero-heading">{heading}</h1>
      {subheading ? <p className="of-hero-subheading">{subheading}</p> : null}
      {ctaLabel && ctaHref ? (
        <a className="of-hero-cta" href={ctaHref}>
          {ctaLabel}
        </a>
      ) : null}
    </section>
  );
}

export const heroBlock = createCmsBlock({
  definition: {
    schemaVersion: 1,
    id: "openforge-cms.hero",
    version: 1,
    name: "Hero",
    description:
      "A large introductory section with a heading and call to action.",
    tags: ["hero", "landing"],
    defaultProps: { heading: "Welcome" },
    editableFields: [
      { path: "heading", label: "Heading", control: "text", required: true },
      {
        path: "subheading",
        label: "Subheading",
        control: "textarea",
        required: false,
      },
      {
        path: "ctaLabel",
        label: "Button label",
        control: "text",
        required: false,
      },
      {
        path: "ctaHref",
        label: "Button link",
        control: "url",
        required: false,
      },
    ],
    slots: [],
    accessibility: ["Heading uses a single page-level <h1>."],
    migrations: [],
  },
  component: Hero,
});
