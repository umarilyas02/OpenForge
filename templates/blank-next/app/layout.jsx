import "./globals.css";

export const metadata = {
  title: {
    default: "OpenForge Starter",
    template: "%s · OpenForge Starter",
  },
  description: "A portable JavaScript Next.js project.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
