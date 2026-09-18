import { createCmsBlock } from "../block.js";

/**
 * A UI-only site-search input with a submit button.
 *
 * Like the contact form block, this renders a real, native <form> with no
 * working submit handler and no search backend behind it — there is no
 * search index for a statically-rendered page to query. The input is named
 * with an aria-label (placeholder text is a hint, not a label, and is not
 * announced as one by assistive technology), so the control stays properly
 * labeled even with no visible <label> shown. The component takes no hooks
 * and no props besides its own, so it is safe to render on the server or
 * call directly as a function.
 */
function SearchBar({ placeholder, buttonLabel }) {
  return (
    <div className="of-block">
      <form
        className="flex w-full max-w-md items-stretch gap-2"
        role="search"
      >
        <input
          aria-label="Search"
          className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-50 dark:placeholder:text-slate-500"
          name="q"
          placeholder={placeholder}
          type="search"
        />
        <button
          className="shrink-0 rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 dark:bg-slate-50 dark:text-slate-900 dark:hover:bg-slate-200"
          type="submit"
        >
          {buttonLabel}
        </button>
      </form>
    </div>
  );
}

export const searchBarBlock = createCmsBlock({
  definition: {
    schemaVersion: 1,
    id: "openforge-cms.search-bar",
    version: 1,
    name: "Search Bar",
    description:
      "A UI-only site-search input with a submit button. The block renders the markup only — there is no search backend or index behind it, so submitting does nothing on a statically-rendered page.",
    tags: ["form", "search", "tailwind"],
    defaultProps: {
      placeholder: "Search this site…",
      buttonLabel: "Search",
    },
    editableFields: [
      {
        path: "placeholder",
        label: "Input placeholder text",
        control: "text",
        required: true,
      },
      {
        path: "buttonLabel",
        label: "Submit button text",
        control: "text",
        required: true,
      },
    ],
    slots: [],
    accessibility: [
      'The input carries an aria-label ("Search") so it is properly named for assistive technology even without a visible <label>; the placeholder is decorative hint text only, never a label substitute.',
      'The form uses role="search" so assistive technology can identify and navigate to it as a landmark.',
    ],
    migrations: [],
  },
  component: SearchBar,
});
