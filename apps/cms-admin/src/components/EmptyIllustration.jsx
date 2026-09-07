const VARIANTS = {
  pages: (
    <>
      <rect x="34" y="20" width="70" height="88" rx="6" fill="var(--surface)" stroke="var(--border-strong)" strokeWidth="2" />
      <rect x="52" y="12" width="70" height="88" rx="6" fill="var(--accent-wash)" stroke="var(--border-strong)" strokeWidth="2" />
      <path d="M64 34h46M64 46h46M64 58h30" stroke="var(--border-strong)" strokeWidth="2" strokeLinecap="round" />
      <circle cx="128" cy="92" r="16" fill="var(--surface)" stroke="var(--border-strong)" strokeWidth="2" />
      <path d="M122 92l4 4 8-8" stroke="var(--border-strong)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  media: (
    <>
      <rect x="20" y="24" width="120" height="82" rx="8" fill="var(--surface)" stroke="var(--border-strong)" strokeWidth="2" />
      <circle cx="46" cy="50" r="10" fill="var(--accent-wash)" stroke="var(--border-strong)" strokeWidth="2" />
      <path d="M20 92l30-28 22 18 18-14 30 26" fill="none" stroke="var(--border-strong)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="106" y="16" width="34" height="34" rx="17" fill="var(--surface)" stroke="var(--border-strong)" strokeWidth="2" />
      <path d="M115 33l6 6 10-12" stroke="var(--border-strong)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  content: (
    <>
      <rect x="24" y="18" width="112" height="26" rx="6" fill="var(--accent-wash)" stroke="var(--border-strong)" strokeWidth="2" />
      <rect x="24" y="52" width="72" height="20" rx="5" fill="var(--surface)" stroke="var(--border-strong)" strokeWidth="2" />
      <rect x="24" y="80" width="90" height="20" rx="5" fill="var(--surface)" stroke="var(--border-strong)" strokeWidth="2" />
      <circle cx="130" cy="90" r="14" fill="var(--surface)" stroke="var(--border-strong)" strokeWidth="2" />
      <path d="M130 84v6l4 3" stroke="var(--border-strong)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  puzzle: (
    <>
      <path
        d="M46 30h26a6 6 0 0 1 6 6v6a7 7 0 0 0 14 0v-6a6 6 0 0 1 6-6h20v26a7 7 0 1 0 0 14v22a6 6 0 0 1-6 6H92a7 7 0 1 1 0-14 7 7 0 0 0-14 0 7 7 0 1 1-14 14H46a6 6 0 0 1-6-6V78a7 7 0 1 0 0-14V36a6 6 0 0 1 6-6Z"
        fill="var(--accent-wash)"
        stroke="var(--border-strong)"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </>
  ),
  browser: (
    <>
      <rect x="20" y="22" width="120" height="80" rx="8" fill="var(--surface)" stroke="var(--border-strong)" strokeWidth="2" />
      <path d="M20 40h120" stroke="var(--border-strong)" strokeWidth="2" />
      <circle cx="32" cy="31" r="3" fill="var(--border-strong)" />
      <circle cx="43" cy="31" r="3" fill="var(--border-strong)" />
      <circle cx="54" cy="31" r="3" fill="var(--border-strong)" />
      <circle cx="80" cy="72" r="24" fill="var(--accent-wash)" stroke="var(--border-strong)" strokeWidth="2" />
      <path d="M80 48v48M56 72h48M62 58c6 6 10 6 18 0s12-6 18 0M62 86c6-6 10-6 18 0s12 6 18 0" stroke="var(--border-strong)" strokeWidth="1.5" fill="none" />
    </>
  ),
  clock: (
    <>
      <circle cx="80" cy="64" r="46" fill="var(--surface)" stroke="var(--border-strong)" strokeWidth="2" />
      <circle cx="80" cy="64" r="34" fill="var(--accent-wash)" stroke="var(--border-strong)" strokeWidth="2" />
      <path d="M80 46v20l14 10" stroke="var(--border-strong)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="80" cy="64" r="3" fill="var(--border-strong)" />
    </>
  ),
};

/**
 * A small set of flat, single-tone illustrations for empty states — in the
 * spirit of unDraw, redrawn with the admin's own tokens so they sit
 * naturally in the monochrome/editorial system instead of unDraw's stock
 * purple palette.
 *
 * @param {{ variant: keyof typeof VARIANTS, className?: string }} props
 */
export function EmptyIllustration({ variant, className }) {
  const content = VARIANTS[variant] ?? VARIANTS.content;
  return (
    <svg
      className={className ? `empty-illustration ${className}` : "empty-illustration"}
      fill="none"
      height="120"
      viewBox="0 0 160 120"
      width="160"
    >
      {content}
    </svg>
  );
}
