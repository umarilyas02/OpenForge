import { createCmsBlock } from "../block.js";

function JobListing({ title, department, location, type, applyHref }) {
  const meta = [department, location, type].filter(Boolean);

  return (
    <div className="of-block rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-50">
        {title}
      </h3>
      {meta.length > 0 ? (
        <ul className="mt-3 flex flex-wrap gap-2">
          {meta.map((entry, index) => (
            <li
              className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300"
              key={index}
            >
              {entry}
            </li>
          ))}
        </ul>
      ) : null}
      <a
        className="mt-5 inline-flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-indigo-500"
        href={applyHref}
      >
        Apply
      </a>
    </div>
  );
}

export const jobListingBlock = createCmsBlock({
  definition: {
    schemaVersion: 1,
    id: "openforge-cms.job-listing",
    version: 1,
    name: "Job Listing",
    description:
      "A careers-page job-posting card with title, meta tags, and an apply link.",
    tags: ["content", "careers", "tailwind"],
    defaultProps: {
      title: "Senior Engineer",
      department: "Engineering",
      location: "Remote",
      type: "Full-time",
      applyHref: "https://example.com/careers/senior-engineer/apply",
    },
    editableFields: [
      { path: "title", label: "Job Title", control: "text", required: true },
      {
        path: "department",
        label: "Department",
        control: "text",
        required: false,
      },
      {
        path: "location",
        label: "Location",
        control: "text",
        required: false,
      },
      {
        path: "type",
        label: "Employment Type",
        control: "select",
        required: false,
        options: [
          { value: "Full-time", label: "Full-time" },
          { value: "Part-time", label: "Part-time" },
          { value: "Contract", label: "Contract" },
        ],
      },
      {
        path: "applyHref",
        label: "Apply Link",
        control: "url",
        required: true,
      },
    ],
    slots: [],
    accessibility: [
      "The department/location/type meta tags are plain list text, not decorative.",
      "The Apply control is a real <a> link so it is reachable and operable via keyboard and assistive tech.",
    ],
    migrations: [],
  },
  component: JobListing,
});
