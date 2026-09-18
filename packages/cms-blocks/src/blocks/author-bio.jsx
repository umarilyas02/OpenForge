import { createCmsBlock } from "../block.js";

function AuthorBio({ name, avatar, role, bio }) {
  return (
    <div className="of-block flex items-start gap-4 rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
      <img
        alt={name}
        className="h-16 w-16 shrink-0 rounded-full object-cover"
        src={avatar}
      />
      <div className="min-w-0">
        <p className="text-base font-semibold text-slate-900 dark:text-slate-50">
          {name}
        </p>
        {role ? (
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
            {role}
          </p>
        ) : null}
        {bio ? (
          <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">
            {bio}
          </p>
        ) : null}
      </div>
    </div>
  );
}

export const authorBioBlock = createCmsBlock({
  definition: {
    schemaVersion: 1,
    id: "openforge-cms.author-bio",
    version: 1,
    name: "Author Bio",
    description: "A blog-post author byline card with avatar, name, role, and bio.",
    tags: ["content", "blog", "tailwind"],
    defaultProps: {
      name: "Jordan Rivera",
      avatar: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=256&h=256&fit=crop&crop=faces",
      role: "Senior Editor",
      bio: "Jordan writes about design systems and developer tooling.",
    },
    editableFields: [
      { path: "name", label: "Name", control: "text", required: true },
      { path: "avatar", label: "Avatar", control: "image", required: true },
      { path: "role", label: "Role", control: "text", required: false },
      { path: "bio", label: "Bio", control: "textarea", required: false },
    ],
    slots: [],
    accessibility: [
      "The avatar image has a real alt attribute equal to the author's name.",
    ],
    migrations: [],
  },
  component: AuthorBio,
});
