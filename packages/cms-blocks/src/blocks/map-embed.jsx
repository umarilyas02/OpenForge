import { createCmsBlock } from "../block.js";

const HEIGHT_PX = {
  small: 300,
  medium: 450,
  large: 600,
};

function MapEmbed({ embedUrl, title, height }) {
  const pixelHeight = HEIGHT_PX[height] ?? HEIGHT_PX.medium;

  return (
    <div className="of-block overflow-hidden rounded-lg border border-slate-200 dark:border-slate-800">
      <iframe
        allowFullScreen
        className="w-full border-0"
        height={pixelHeight}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        src={embedUrl}
        style={{ height: `${pixelHeight}px` }}
        title={title}
        width="100%"
      />
    </div>
  );
}

export const mapEmbedBlock = createCmsBlock({
  definition: {
    schemaVersion: 1,
    id: "openforge-cms.map-embed",
    version: 1,
    name: "Map Embed",
    description: "An embedded map pointing at a business address.",
    tags: ["content", "map", "location", "tailwind"],
    defaultProps: {
      embedUrl:
        "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.5!2d-122.4194!3d37.7749!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzfCsDQ2JzM1LjYiTiAxMjLCsDI1JzA5LjgiVw!5e0!3m2!1sen!2sus!4v1700000000000!5m2!1sen!2sus",
      title: "Map showing our business location",
      height: "medium",
    },
    editableFields: [
      {
        path: "embedUrl",
        label: "Map embed URL",
        control: "url",
        required: true,
      },
      {
        path: "title",
        label: "Accessible title",
        control: "text",
        required: true,
      },
      {
        path: "height",
        label: "Height",
        control: "select",
        required: false,
        options: [
          { value: "small", label: "Small" },
          { value: "medium", label: "Medium" },
          { value: "large", label: "Large" },
        ],
      },
    ],
    slots: [],
    accessibility: [
      "The iframe carries a real, descriptive title attribute so assistive tech announces the embedded map's purpose.",
    ],
    migrations: [],
  },
  component: MapEmbed,
});
