import { createCmsBlock } from "../block.js";

function BackToTop({ label }) {
  return (
    <a
      className="fixed bottom-6 right-6 z-50 inline-flex h-11 w-11 items-center justify-center rounded-full bg-slate-900 text-slate-50 shadow-lg transition-colors hover:bg-slate-700 dark:bg-slate-50 dark:text-slate-900 dark:hover:bg-slate-200"
      href="#top"
    >
      <svg
        aria-hidden="true"
        className="h-5 w-5"
        fill="none"
        viewBox="0 0 20 20"
      >
        <path
          d="M10 15.5V4.5M10 4.5L4.5 10M10 4.5L15.5 10"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
        />
      </svg>
      <span className="sr-only">{label}</span>
    </a>
  );
}

export const backToTopBlock = createCmsBlock({
  definition: {
    schemaVersion: 1,
    id: "openforge-cms.back-to-top",
    version: 1,
    name: "Back to Top",
    description:
      "A small floating button that jumps to the top of the page via a plain in-page anchor link, no JavaScript required.",
    tags: ["navigation", "utility", "tailwind"],
    defaultProps: {
      label: "Back to top",
    },
    editableFields: [
      {
        path: "label",
        label: "Accessible label",
        control: "text",
        required: true,
      },
    ],
    slots: [],
    accessibility: [
      "The arrow icon is decorative (aria-hidden); the button's accessible name comes from visually-hidden text driven by the label prop.",
      "Implemented as a real <a href=\"#top\"> fragment link, so it works with zero client-side JavaScript and is reachable/operable via keyboard like any link.",
    ],
    migrations: [],
  },
  component: BackToTop,
});
