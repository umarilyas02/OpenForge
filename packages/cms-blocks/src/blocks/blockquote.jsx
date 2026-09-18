import { createCmsBlock } from "../block.js";

function Blockquote({ quote, author, role }) {
  return (
    <div className="of-block">
      <blockquote className="mx-auto max-w-3xl text-center">
        <svg
          aria-hidden="true"
          className="mx-auto mb-4 h-8 w-8 text-emerald-500"
          fill="currentColor"
          viewBox="0 0 32 32"
        >
          <path d="M10 8c-3.3 0-6 2.7-6 6v10h10V14H7.5c0-1.4 1.1-2.5 2.5-2.5V8zm14 0c-3.3 0-6 2.7-6 6v10h10V14h-6.5c0-1.4 1.1-2.5 2.5-2.5V8z" />
        </svg>
        <p className="text-2xl font-medium italic leading-snug text-slate-900 dark:text-slate-50 sm:text-3xl">
          &ldquo;{quote}&rdquo;
        </p>
        {author ? (
          <cite className="mt-4 block text-base font-semibold not-italic text-slate-700 dark:text-slate-300">
            {author}
            {role ? (
              <span className="font-normal text-slate-500 dark:text-slate-400">
                {" "}
                &middot; {role}
              </span>
            ) : null}
          </cite>
        ) : null}
      </blockquote>
    </div>
  );
}

export const blockquoteBlock = createCmsBlock({
  definition: {
    schemaVersion: 1,
    id: "openforge-cms.blockquote",
    version: 1,
    name: "Blockquote",
    description: "A large styled pull-quote with an optional attribution.",
    tags: ["content", "quote", "tailwind"],
    defaultProps: {
      quote:
        "Design is not just what it looks like and feels like. Design is how it works.",
      author: "Steve Jobs",
      role: "Co-founder, Apple",
    },
    editableFields: [
      { path: "quote", label: "Quote", control: "textarea", required: true },
      { path: "author", label: "Author", control: "text", required: false },
      {
        path: "role",
        label: "Role / Company",
        control: "text",
        required: false,
      },
    ],
    slots: [],
    accessibility: [
      "The quote renders in a semantic <blockquote>; attribution renders in a <cite> element and is only shown when an author is present.",
    ],
    migrations: [],
  },
  component: Blockquote,
});
