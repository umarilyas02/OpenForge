import Link from "next/link";

/**
 * Scoped to the (preview) route group (see layout.jsx) — loads none of
 * the admin app's CSS, so this can't lean on its .btn/.card classes and
 * is styled inline instead, matching preview/[siteId]/page.jsx's chrome.
 * Reached whenever a preview link points at a site that doesn't exist
 * (removed, or just a malformed/stale id) rather than the framework's
 * bare default 404, and offers a way back into the admin instead of a
 * dead end.
 */
export default function PreviewNotFound() {
  return (
    <div
      style={{
        alignItems: "center",
        background: "#0a0a0a",
        color: "#ffffff",
        display: "flex",
        flexDirection: "column",
        fontFamily: "system-ui, sans-serif",
        gap: 20,
        justifyContent: "center",
        minHeight: "100vh",
        padding: 24,
        textAlign: "center",
      }}
    >
      <div>
        <p
          style={{
            color: "#6b7280",
            fontSize: 13,
            fontWeight: 600,
            letterSpacing: "0.04em",
            margin: "0 0 8px",
            textTransform: "uppercase",
          }}
        >
          Preview
        </p>
        <h1 style={{ fontSize: 28, fontWeight: 700, margin: "0 0 8px" }}>
          This site isn&apos;t available
        </h1>
        <p style={{ color: "#9ca3af", fontSize: 15, margin: 0 }}>
          The link is broken, or the site has been removed.
        </p>
      </div>
      <Link
        href="/sites"
        style={{
          background: "#ffffff",
          borderRadius: 999,
          color: "#111111",
          fontSize: 14,
          fontWeight: 600,
          padding: "10px 20px",
          textDecoration: "none",
        }}
      >
        Go to admin
      </Link>
    </div>
  );
}
