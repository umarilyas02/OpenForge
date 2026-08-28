import { createCmsBlock } from "../block.js";

function Carousel({ heading, slots }) {
  const items = slots?.items ?? [];

  return (
    <div className="of-block">
      {heading ? (
        <h2 className="mb-6 text-center text-2xl font-semibold text-slate-900 dark:text-slate-50">
          {heading}
        </h2>
      ) : null}
      <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-2">
        {items.map((item, index) => (
          <div className="snap-center" key={index}>
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}

export const carouselBlock = createCmsBlock({
  definition: {
    schemaVersion: 1,
    id: "openforge-cms.carousel",
    version: 1,
    name: "Carousel",
    description: "A horizontally scrolling row of image slides.",
    tags: ["media", "layout", "tailwind"],
    defaultProps: {},
    editableFields: [
      { path: "heading", label: "Heading", control: "text", required: false },
    ],
    slots: [
      {
        name: "items",
        label: "Slides",
        acceptedTypes: ["openforge-cms.carousel-slide"],
        min: 2,
        max: 12,
      },
    ],
    accessibility: [
      "Scrolling is native (CSS scroll-snap, no JavaScript), so it works with touch, trackpad, arrow-key focus scrolling, and keyboard scroll commands without a custom widget.",
    ],
    migrations: [],
  },
  component: Carousel,
});
