"use client";

import { BaseStyles, ThemeProvider } from "@primer/react";

export function AppTheme({ children }) {
  return (
    <ThemeProvider colorMode="dark" nightScheme="dark_dimmed">
      <BaseStyles>{children}</BaseStyles>
    </ThemeProvider>
  );
}
