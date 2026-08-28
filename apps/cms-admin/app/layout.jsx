import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";

import { AppTheme } from "../src/components/AppTheme.jsx";
import "./globals.css";

export const metadata = {
  title: "OpenForge CMS Admin",
  description: "Manage OpenForge CMS sites and content.",
};

export default function RootLayout({ children }) {
  return (
    <html className={`${GeistSans.variable} ${GeistMono.variable}`} lang="en">
      <body>
        <AppTheme>{children}</AppTheme>
      </body>
    </html>
  );
}
