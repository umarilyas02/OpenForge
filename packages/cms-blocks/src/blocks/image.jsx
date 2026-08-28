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
    defaultProps: { alt: "" },
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
