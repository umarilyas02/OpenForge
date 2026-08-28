import "./blocks.css";
import "./tailwind.css";

export const metadata = {
  title: "OpenForge Site",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
