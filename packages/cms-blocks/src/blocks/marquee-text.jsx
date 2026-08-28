import { createCmsBlock } from "../block.js";

const ANIMATION_BY_SPEED = {
  slow: "animate-marquee-slow",
  normal: "animate-marquee-normal",
  fast: "animate-marquee-fast",
};

function MarqueeText({ text, speed }) {
  const animation = ANIMATION_BY_SPEED[speed] ?? ANIMATION_BY_SPEED.normal;

  return (
    <div className="of-block overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_10%,black_90%,transparent)]">
      <div className={`flex w-max gap-16 whitespace-nowrap ${animation}`}>
        <span className="text-2xl font-semibold text-slate-800 dark:text-slate-200">
          {text}
        </span>
        <span
          aria-hidden="true"
          className="text-2xl font-semibold text-slate-800 dark:text-slate-200"
        >
          {text}
        </span>
      </div>
    </div>
  );
}

export const marqueeTextBlock = createCmsBlock({
  definition: {
    schemaVersion: 1,
    id: "openforge-cms.marquee-text",
    version: 1,
    name: "Marquee Text",
    description:
      "A continuously scrolling line of text, e.g. a tagline ticker.",
    tags: ["content", "layout", "tailwind"],
    defaultProps: { speed: "normal" },
    editableFields: [
      { path: "text", label: "Text", control: "text", required: true },
      {
        path: "speed",
        label: "Speed",
        control: "select",
        required: false,
        options: [
          { value: "slow", label: "Slow" },
          { value: "normal", label: "Normal" },
          { value: "fast", label: "Fast" },
        ],
      },
    ],
    slots: [],
    accessibility: [
      "The scroll animation respects prefers-reduced-motion, stopping to a static line instead.",
      "The text is duplicated for a seamless loop; the duplicate copy is aria-hidden so screen readers see it once.",
    ],
    migrations: [],
  },
  component: MarqueeText,
});
