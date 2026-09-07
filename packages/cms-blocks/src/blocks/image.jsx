import { createCmsBlock } from "../block.js";

function ImageBlock({ src, alt, caption }) {
  return (
    <figure className="of-block of-image">
      <img className="of-image-media" src={src} alt={alt} />
      {caption ? (
        <figcaption className="of-image-caption">{caption}</figcaption>
      ) : null}
    </figure>
  );
}

export const imageBlock = createCmsBlock({
  definition: {
    schemaVersion: 1,
    id: "openforge-cms.image",
    version: 1,
    name: "Image",
    description: "A single image with required alt text.",
    tags: ["media", "image"],
    defaultProps: {
      src: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect width='400' height='300' fill='%23e2e2e2'/%3E%3C/svg%3E",
      alt: "Placeholder image",
    },
    editableFields: [
      { path: "src", label: "Image", control: "image", required: true },
      { path: "alt", label: "Alt text", control: "text", required: true },
      { path: "caption", label: "Caption", control: "text", required: false },
    ],
    slots: [],
    accessibility: [
      "Alt text is a required field; images cannot be published without it.",
    ],
    migrations: [],
  },
  component: ImageBlock,
});
