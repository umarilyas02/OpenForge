import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";

import "./globals.css";

export const metadata = {
  title: "OpenForge Editor",
  description: "Build visually while keeping standard Next.js source.",
};

export default function RootLayout({ children }) {
  return (
    <html className={`${GeistSans.variable} ${GeistMono.variable}`} lang="en">
      <body>{children}</body>
    </html>
  );
}
