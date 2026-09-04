import "@openforge/cms-blocks/blocks.css";
import "./tailwind.css";

/**
 * A second, deliberately separate root layout (Next.js supports multiple
 * root layouts, one per top-level route group) so the live-canvas editor
 * loads only the same CSS apps/cms-renderer serves real sites with — none
 * of the admin app's own OKLCH product-register CSS from app/(admin). The
 * canvas is embedded via an <iframe>, so this document never shares a page
 * with the admin chrome; the separate root layout just keeps the two CSS
 * systems from ever being loaded together in the same build output either.
 */
export default function CanvasLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
