import { createCmsBlock } from "../block.js";

/**
 * Inline SVG path data for each supported platform, adapted from the
 * self-contained social glyphs already used by the harvested component
 * library's footers. Every glyph is drawn on a 24x24 viewBox with
 * `fill="currentColor"` so it inherits the link's colour with no external
 * icon font or library.
 */
const PLATFORM_ICONS = {
  twitter: {
    label: "X (Twitter)",
    path: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231L18.244 2.25Zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77Z",
  },
  instagram: {
    label: "Instagram",
    path: "M7.8 2h8.4A5.8 5.8 0 0 1 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8A5.8 5.8 0 0 1 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2Zm-.2 2A3.6 3.6 0 0 0 4 7.6v8.8A3.6 3.6 0 0 0 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6A3.6 3.6 0 0 0 16.4 4H7.6Zm9.5 1.5a1.3 1.3 0 1 1 0 2.6 1.3 1.3 0 0 1 0-2.6ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z",
  },
  facebook: {
    label: "Facebook",
    path: "M13.5 21v-7h2.3l.4-2.8h-2.7V9.4c0-.8.2-1.4 1.4-1.4H16V5.6c-.2 0-.9-.1-1.8-.1-1.8 0-3 1.1-3 3.2v2.5H9V14h2.4v7h2.1Z",
  },
  linkedin: {
    label: "LinkedIn",
    path: "M6.9 8.5H4V20h2.9V8.5ZM5.5 3.9a1.7 1.7 0 1 0 0 3.4 1.7 1.7 0 0 0 0-3.4ZM20 12.7c0-3-1.6-4.4-3.8-4.4-1.7 0-2.5 1-2.9 1.6v-1.4h-2.9V20h2.9v-6.4c0-.3 0-.7.1-.9.2-.7.8-1.5 1.8-1.5 1.3 0 1.8 1 1.8 2.4V20H20v-7.3Z",
  },
  youtube: {
    label: "YouTube",
    path: "M23.5 6.19a3.02 3.02 0 0 0-2.12-2.14C19.5 3.55 12 3.55 12 3.55s-7.5 0-9.38.5A3.02 3.02 0 0 0 .5 6.2C0 8.07 0 12 0 12s0 3.93.5 5.81a3.02 3.02 0 0 0 2.12 2.14c1.88.5 9.38.5 9.38.5s7.5 0 9.38-.5a3.02 3.02 0 0 0 2.12-2.14C24 15.93 24 12 24 12s0-3.93-.5-5.81ZM9.55 15.57V8.43L15.82 12l-6.27 3.57Z",
  },
  tiktok: {
    label: "TikTok",
    path: "M16.44 2h-3.2v13.6a2.72 2.72 0 0 1-2.73 2.72 2.73 2.73 0 0 1 0-5.45c.28 0 .55.05.8.13V9.72a6.2 6.2 0 0 0-.8-.05A5.94 5.94 0 0 0 4.58 15.6 5.94 5.94 0 0 0 10.5 21.6a5.94 5.94 0 0 0 5.94-5.94V8.9a7.5 7.5 0 0 0 4.36 1.4V7.06a4.36 4.36 0 0 1-4.36-4.36V2Z",
  },
  github: {
    label: "GitHub",
    path: "M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48l-.01-1.7c-2.78.61-3.37-1.34-3.37-1.34-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.89 1.53 2.34 1.09 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.56-1.11-4.56-4.95 0-1.09.39-1.99 1.03-2.69-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.03a9.5 9.5 0 0 1 5 0c1.91-1.3 2.75-1.03 2.75-1.03.55 1.38.2 2.4.1 2.65.64.7 1.03 1.6 1.03 2.69 0 3.85-2.34 4.7-4.57 4.95.36.31.68.92.68 1.85l-.01 2.75c0 .27.18.58.69.48A10 10 0 0 0 12 2Z",
  },
  generic: {
    label: "",
    path: "M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm6.93 6h-2.95a15.65 15.65 0 0 0-1.38-3.56A8.03 8.03 0 0 1 18.93 8ZM12 4.04c.83 1.2 1.48 2.53 1.91 3.96h-3.82c.43-1.43 1.08-2.76 1.91-3.96ZM4.26 14A8.09 8.09 0 0 1 4 12c0-.69.1-1.36.26-2h3.38a16.5 16.5 0 0 0 0 4H4.26Zm.81 2h2.95c.33 1.27.8 2.47 1.38 3.56A7.99 7.99 0 0 1 5.07 16Zm2.95-8H5.07a7.99 7.99 0 0 1 4.33-3.56A15.65 15.65 0 0 0 8.02 8ZM12 19.96c-.83-1.2-1.48-2.53-1.91-3.96h3.82c-.43 1.43-1.08 2.76-1.91 3.96ZM14.34 14H9.66a14.7 14.7 0 0 1 0-4h4.68a14.7 14.7 0 0 1 0 4Zm.26 5.56c.58-1.09 1.05-2.29 1.38-3.56h2.95a7.99 7.99 0 0 1-4.33 3.56ZM16.36 14a16.5 16.5 0 0 0 0-4h3.38c.16.64.26 1.31.26 2s-.1 1.36-.26 2h-3.38Z",
  },
};

/** Common spellings that should resolve to a real glyph rather than fall back. */
const PLATFORM_ALIASES = {
  x: "twitter",
  "twitter-x": "twitter",
  "x-twitter": "twitter",
  ig: "instagram",
  fb: "facebook",
  meta: "facebook",
  "linked-in": "linkedin",
  yt: "youtube",
  "tik-tok": "tiktok",
  gh: "github",
  git: "github",
  website: "generic",
  link: "generic",
  other: "generic",
};

/**
 * Resolve a free-text platform name to a known glyph, case-insensitively,
 * along with the accessible name to fall back to when the author hasn't
 * written their own label. Anything unrecognized resolves to the generic
 * globe so an unexpected value renders a real, named link instead of
 * throwing or leaving the icon unlabelled.
 *
 * @param {unknown} platform
 */
function resolvePlatform(platform) {
  const key = String(platform ?? "")
    .trim()
    .toLowerCase();
  const canonical = PLATFORM_ALIASES[key] ?? key;
  const icon = PLATFORM_ICONS[canonical];

  if (icon?.label) {
    return { icon, fallbackName: `Follow on ${icon.label}` };
  }

  return {
    icon: PLATFORM_ICONS.generic,
    // Unknown platform: keep the author's own wording in the accessible name.
    fallbackName: icon || !key ? "Follow us" : `Follow on ${key}`,
  };
}

function SocialLinkItem({ platform, href, label }) {
  const { icon, fallbackName } = resolvePlatform(platform);
  const accessibleName =
    typeof label === "string" && label.trim() ? label : fallbackName;

  return (
    <a
      aria-label={accessibleName}
      className="of-social-link-item"
      href={href}
      rel="noreferrer noopener"
      target="_blank"
    >
      <svg
        aria-hidden="true"
        className="of-social-link-item-icon"
        fill="currentColor"
        focusable="false"
        height="20"
        viewBox="0 0 24 24"
        width="20"
      >
        <path d={icon.path} />
      </svg>
    </a>
  );
}

export const socialLinkItemBlock = createCmsBlock({
  definition: {
    schemaVersion: 1,
    id: "openforge-cms.social-link-item",
    version: 1,
    name: "Social Link",
    description:
      "A single social-media icon link. Used inside the Social Links block.",
    tags: ["navigation", "social"],
    defaultProps: {
      platform: "twitter",
      href: "#",
    },
    editableFields: [
      {
        path: "platform",
        label: "Platform",
        control: "select",
        required: true,
        options: [
          { value: "twitter", label: "X (Twitter)" },
          { value: "instagram", label: "Instagram" },
          { value: "facebook", label: "Facebook" },
          { value: "linkedin", label: "LinkedIn" },
          { value: "youtube", label: "YouTube" },
          { value: "tiktok", label: "TikTok" },
          { value: "github", label: "GitHub" },
          { value: "generic", label: "Other link" },
        ],
      },
      { path: "href", label: "Profile URL", control: "url", required: true },
      {
        path: "label",
        label: "Accessible label",
        control: "text",
        required: false,
      },
    ],
    slots: [],
    accessibility: [
      'The icon is the only visible content, so the link always carries an aria-label — the author\'s own label when set, otherwise a derived "Follow on <platform>".',
      "The SVG glyph is aria-hidden and non-focusable so screen readers announce the link once, by its accessible name.",
      "An unrecognized platform name falls back to a generic globe glyph and still keeps a real accessible name.",
    ],
    migrations: [],
  },
  component: SocialLinkItem,
});
