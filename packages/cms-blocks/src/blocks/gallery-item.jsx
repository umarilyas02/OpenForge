import { createCmsBlock } from "../block.js";

function GalleryItem({ image, alt, caption }) {
  return (
    <figure className="of-gallery-item">
      <img alt={alt} className="of-gallery-item-image" src={image} />
      {caption ? (
        <figcaption className="of-gallery-item-caption">{caption}</figcaption>
      ) : null}
    </figure>
  );
}

export const galleryItemBlock = createCmsBlock({
  definition: {
    schemaVersion: 1,
    id: "openforge-cms.gallery-item",
    version: 1,
    name: "Gallery Item",
    description:
      "A single photo with required alt text and an optional caption. Used inside Image Gallery.",
    tags: ["content", "gallery", "image"],
    defaultProps: {
      image:
        "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect width='400' height='300' fill='%23e2e2e2'/%3E%3C/svg%3E",
      alt: "Placeholder gallery photo",
    },
    editableFields: [
      { path: "image", label: "Image", control: "image", required: true },
      { path: "alt", label: "Alt text", control: "text", required: true },
      { path: "caption", label: "Caption", control: "text", required: false },
    ],
    slots: [],
    accessibility: [
      "Alt text is a required field: gallery photos are meaningful content, so they are never published as decorative images with an empty alt.",
      "Alt text and the caption are separate fields, so a visible caption never has to double as the image's description.",
      "Each item is a real figure/figcaption pair rather than a bare image plus loose text.",
    ],
    migrations: [],
  },
  component: GalleryItem,
});
