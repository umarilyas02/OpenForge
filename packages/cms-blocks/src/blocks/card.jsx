import { createCmsBlock } from "../block.js";

function Card({ image, title, description, linkLabel, linkHref }) {
  return (
    <div className="of-block of-card">
      {image ? <img alt="" className="of-card-image" src={image} /> : null}
      <div className="of-card-body">
        <h3 className="of-card-title">{title}</h3>
        {description ? <p className="of-card-desc">{description}</p> : null}
        {linkLabel && linkHref ? (
          <a className="of-card-link" href={linkHref}>
            {linkLabel}
          </a>
        ) : null}
      </div>
    </div>
  );
}

export const cardBlock = createCmsBlock({
  definition: {
    schemaVersion: 1,
    id: "openforge-cms.card",
    version: 1,
    name: "Card",
    description:
      "A general-purpose content card with an optional image and link.",
    tags: ["content", "card"],
    defaultProps: {},
    editableFields: [
      { path: "image", label: "Image", control: "image", required: false },
      { path: "title", label: "Title", control: "text", required: true },
      {
        path: "description",
        label: "Description",
        control: "textarea",
        required: false,
      },
      {
        path: "linkLabel",
        label: "Link label",
        control: "text",
        required: false,
      },
      { path: "linkHref", label: "Link URL", control: "url", required: false },
    ],
    slots: [],
    accessibility: [
      "The image is decorative; the title carries the meaning. The link is a real anchor, not a styled div.",
    ],
    migrations: [],
  },
  component: Card,
});
