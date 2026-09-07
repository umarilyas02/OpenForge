"use client";

import { BaseStyles, ThemeProvider } from "@primer/react";

export function AppTheme({ children }) {
  return (
    <ThemeProvider colorMode="light">
      <BaseStyles>{children}</BaseStyles>
    </ThemeProvider>
  );
}
