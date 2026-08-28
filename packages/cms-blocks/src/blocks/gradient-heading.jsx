import { createCmsBlock } from "../block.js";

const GRADIENT_BY_TONE = {
  sunset: "from-orange-500 via-pink-500 to-fuchsia-600",
  ocean: "from-cyan-400 via-sky-500 to-blue-600",
  forest: "from-lime-400 via-emerald-500 to-teal-600",
  candy: "from-fuchsia-500 via-purple-500 to-indigo-500",
};

function GradientHeading({ text, level, tone }) {
  const Tag = level === "h1" ? "h1" : level === "h3" ? "h3" : "h2";
  const gradient = GRADIENT_BY_TONE[tone] ?? GRADIENT_BY_TONE.sunset;

  return (
    <div className="of-block text-center">
      <Tag
        className={`inline-block bg-gradient-to-r ${gradient} bg-clip-text text-4xl font-extrabold tracking-tight text-transparent sm:text-5xl`}
      >
        {text}
      </Tag>
    </div>
  );
}

export const gradientHeadingBlock = createCmsBlock({
  definition: {
    schemaVersion: 1,
    id: "openforge-cms.gradient-heading",
    version: 1,
    name: "Gradient Heading",
    description: "A large heading with a gradient-clipped text fill.",
    tags: ["text", "heading", "tailwind"],
    defaultProps: { level: "h2", tone: "sunset" },
    editableFields: [
      { path: "text", label: "Text", control: "text", required: true },
      {
        path: "level",
        label: "Level",
        control: "select",
        required: false,
        options: [
          { value: "h1", label: "Heading 1" },
          { value: "h2", label: "Heading 2" },
          { value: "h3", label: "Heading 3" },
        ],
      },
      {
        path: "tone",
        label: "Gradient",
        control: "select",
        required: false,
        options: [
          { value: "sunset", label: "Sunset" },
          { value: "ocean", label: "Ocean" },
          { value: "forest", label: "Forest" },
          { value: "candy", label: "Candy" },
        ],
      },
    ],
    slots: [],
    accessibility: [
      "Renders a real semantic heading level; the gradient is a text-fill effect, not an image, so it remains selectable and screen-reader readable.",
    ],
    migrations: [],
  },
  component: GradientHeading,
});
