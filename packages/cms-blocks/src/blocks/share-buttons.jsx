import { createCmsBlock } from "../block.js";

function buildShareLinks(url) {
  const target = typeof url === "string" && url.trim() ? url.trim() : "https://example.com";
  const encodedUrl = encodeURIComponent(target);

  return [
    {
      key: "x",
      label: "Share on X",
      href: `https://twitter.com/intent/tweet?url=${encodedUrl}`,
      icon: (
        <path
          d="M4 4l12 12M16 4L4 16"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
        />
      ),
    },
    {
      key: "facebook",
      label: "Share on Facebook",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      icon: (
        <path
          d="M13 6h2V3h-2a4 4 0 00-4 4v2H7v3h2v6h3v-6h2.2l.8-3H12V7a1 1 0 011-1z"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
        />
      ),
    },
    {
      key: "linkedin",
      label: "Share on LinkedIn",
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      icon: (
        <>
          <rect
            height="12"
            rx="1.5"
            stroke="currentColor"
            strokeWidth="1.5"
            width="12"
            x="4"
            y="4"
          />
          <path
            d="M7.5 9.5v4M7.5 7.5v.01M10.5 13.5v-2.2a1.3 1.3 0 012.6 0v2.2"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
          />
        </>
      ),
    },
    {
      key: "email",
      label: "Share via Email",
      href: `mailto:?body=${encodedUrl}`,
      icon: (
        <>
          <rect
            height="10"
            rx="1.5"
            stroke="currentColor"
            strokeWidth="1.5"
            width="14"
            x="3"
            y="5"
          />
          <path
            d="M3.5 5.5l6.5 5 6.5-5"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
          />
        </>
      ),
    },
  ];
}

function ShareButtons({ url, label }) {
  const links = buildShareLinks(url);

  return (
    <div className="of-block">
      {label ? (
        <h2 className="mb-4 text-2xl font-semibold text-slate-900 dark:text-slate-50">
          {label}
        </h2>
      ) : null}
      <ul className="flex flex-wrap items-center gap-3">
        {links.map((link) => (
          <li key={link.key}>
            <a
              className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-600 transition-colors hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 dark:border-slate-700 dark:text-slate-300 dark:hover:border-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-50"
              href={link.href}
              rel={link.key === "email" ? undefined : "noopener noreferrer"}
              target={link.key === "email" ? undefined : "_blank"}
            >
              <svg
                aria-hidden="true"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 20 20"
              >
                {link.icon}
              </svg>
              <span className="sr-only">{link.label}</span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export const shareButtonsBlock = createCmsBlock({
  definition: {
    schemaVersion: 1,
    id: "openforge-cms.share-buttons",
    version: 1,
    name: "Share Buttons",
    description:
      "A row of share links for the current page — X, Facebook, LinkedIn, and email — each built from that platform's real share-intent URL.",
    tags: ["content", "social", "tailwind"],
    defaultProps: {
      url: "https://example.com",
      label: "Share this",
    },
    editableFields: [
      {
        path: "url",
        label: "Page URL to share",
        control: "url",
        required: true,
      },
      {
        path: "label",
        label: "Heading",
        control: "text",
        required: false,
      },
    ],
    slots: [],
    accessibility: [
      "Each share link is a real anchor pointing at that platform's real share-intent URL, so it works without JavaScript.",
      "The icon in every link is decorative (aria-hidden); the link's real accessible name comes from visually-hidden (sr-only) text describing the platform being shared to.",
      "The X, Facebook, and LinkedIn links open in a new tab with rel=\"noopener noreferrer\"; the email link stays in the same context since mailto: does not need one.",
    ],
    migrations: [],
  },
  component: ShareButtons,
});
