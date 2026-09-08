"use client";

import { createContext, useContext, useEffect, useState } from "react";

const PageChromeContext = createContext(null);

/** Wraps AppShell's render so a specific leaf page can reach back up and adjust the shared chrome around it (currently just whether the outer topbar shows) without every intermediate layout having to thread that decision down as a prop. */
export function PageChromeProvider({ children }) {
  const [hideTopbar, setHideTopbar] = useState(false);
  return (
    <PageChromeContext.Provider value={{ hideTopbar, setHideTopbar }}>
      {children}
    </PageChromeContext.Provider>
  );
}

export function usePageChrome() {
  return useContext(PageChromeContext);
}

/** Opts the outer AppShell topbar (Preview/View site/user menu) out for as long as the calling page is mounted — used by the full-bleed page editor, which renders its own single toolbar in its place. */
export function useHideAppTopbar() {
  const chrome = usePageChrome();
  useEffect(() => {
    if (!chrome) return undefined;
    chrome.setHideTopbar(true);
    return () => chrome.setHideTopbar(false);
  }, []);
}
