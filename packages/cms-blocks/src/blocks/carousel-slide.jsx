import { createCmsBlock } from "../block.js";

function CarouselSlide({ image, caption }) {
  return (
    <figure className="w-[85%] shrink-0 snap-center sm:w-2/3 lg:w-1/2">
      <img
        alt={caption ?? ""}
        className="aspect-video w-full rounded-xl object-cover"
        src={image}
      />
      {caption ? (
        <figcaption className="mt-2 text-center text-sm text-slate-500 dark:text-slate-400">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}

export const carouselSlideBlock = createCmsBlock({
  definition: {
    schemaVersion: 1,
    id: "openforge-cms.carousel-slide",
    version: 1,
    name: "Carousel Slide",
    description: "A single image slide. Used inside Carousel.",
    tags: ["media", "tailwind"],
    defaultProps: {},
    editableFields: [
      { path: "image", label: "Image", control: "image", required: true },
      { path: "caption", label: "Caption", control: "text", required: false },
    ],
    slots: [],
    accessibility: [
      "The image's alt text is the caption when present; each slide is a real figure/figcaption pair.",
    ],
    migrations: [],
  },
  component: CarouselSlide,
});
