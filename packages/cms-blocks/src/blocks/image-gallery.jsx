import { createCmsBlock } from "../block.js";

function ImageGallery({ heading, slots }) {
  const items = slots?.items ?? [];

  return (
    <section className="of-block of-image-gallery">
      {heading ? <h2 className="of-image-gallery-heading">{heading}</h2> : null}
      <div className="of-image-gallery-grid">
        {items.map((item, index) => (
          <div className="of-image-gallery-cell" key={index}>
            {item}
          </div>
        ))}
      </div>
    </section>
  );
}

export const imageGalleryBlock = createCmsBlock({
  definition: {
    schemaVersion: 1,
    id: "openforge-cms.image-gallery",
    version: 1,
    name: "Image Gallery",
    description:
      "A static, responsive grid of photos with every image visible at once. Unlike Carousel, nothing scrolls or advances: it is a plain CSS grid of Gallery Item children.",
    tags: ["content", "gallery", "image"],
    defaultProps: {},
    editableFields: [
      { path: "heading", label: "Heading", control: "text", required: false },
    ],
    slots: [
      {
        name: "items",
        label: "Images",
        acceptedTypes: ["openforge-cms.gallery-item"],
        min: 1,
        max: 24,
      },
    ],
    accessibility: [
      "Every image is rendered at once in document order, so screen readers and keyboard users reach all of them without operating a slideshow widget.",
      "The grid is pure CSS with no JavaScript, lightbox, or click-to-enlarge behaviour, so nothing traps focus and the gallery works with scripting disabled.",
      "Tiles reflow with auto-fit columns rather than a horizontal scroller, so the gallery stays readable when zoomed or on a narrow viewport.",
    ],
    migrations: [],
  },
  component: ImageGallery,
});
