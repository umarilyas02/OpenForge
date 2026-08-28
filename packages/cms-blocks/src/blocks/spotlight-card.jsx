import { createCmsBlock } from "../block.js";

const GLOW_BY_TONE = {
  violet: "from-violet-500/25 via-fuchsia-500/10",
  cyan: "from-cyan-400/25 via-sky-500/10",
  amber: "from-amber-400/25 via-orange-500/10",
  rose: "from-rose-500/25 via-pink-500/10",
};

function SpotlightCard({ icon, title, description, tone }) {
  const glow = GLOW_BY_TONE[tone] ?? GLOW_BY_TONE.violet;

  return (
    <div className="of-block">
      <div
        className={`group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-8 shadow-sm transition-shadow duration-300 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900`}
      >
        <div
          aria-hidden="true"
          className={`pointer-events-none absolute -top-24 -right-24 h-56 w-56 rounded-full bg-gradient-to-br ${glow} to-transparent blur-2xl transition-opacity duration-300 group-hover:opacity-100 opacity-60`}
        />
        <div className="relative">
          {icon ? (
            <span aria-hidden="true" className="mb-4 block text-3xl">
              {icon}
            </span>
          ) : null}
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50">
            {title}
          </h3>
          {description ? (
            <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
              {description}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export const spotlightCardBlock = createCmsBlock({
  definition: {
    schemaVersion: 1,
    id: "openforge-cms.spotlight-card",
    version: 1,
    name: "Spotlight Card",
    description: "A card with a soft gradient glow that brightens on hover.",
    tags: ["content", "card", "tailwind"],
    defaultProps: { tone: "violet" },
    editableFields: [
      { path: "icon", label: "Icon (emoji)", control: "text", required: false },
      { path: "title", label: "Title", control: "text", required: true },
      {
        path: "description",
        label: "Description",
        control: "textarea",
        required: false,
      },
      {
        path: "tone",
        label: "Glow color",
        control: "select",
        required: false,
        options: [
          { value: "violet", label: "Violet" },
          { value: "cyan", label: "Cyan" },
          { value: "amber", label: "Amber" },
          { value: "rose", label: "Rose" },
        ],
      },
    ],
    slots: [],
    accessibility: [
      "The glow is decorative (aria-hidden) and purely visual; title and description carry all the meaning.",
    ],
    migrations: [],
  },
  component: SpotlightCard,
});
