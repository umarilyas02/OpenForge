import "@openforge/cms-blocks/blocks.css";

/**
 * A third, deliberately separate root layout (see (canvas)/layout.jsx for
 * the same reasoning) so the chrome-free "preview the whole site" route
 * loads only the same CSS real sites render with — none of the admin
 * app's own OKLCH product-register CSS from app/(admin). Unlike the
 * canvas, this route is navigated to directly (not embedded in an
 * iframe), since it has no editor state to receive over postMessage.
 */
export default function PreviewLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
