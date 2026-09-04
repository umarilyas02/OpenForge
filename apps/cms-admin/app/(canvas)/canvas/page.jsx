"use client";

import { defaultDesignTokens } from "@openforge/design-tokens";
import { createRenderer, renderSiteStyles } from "@openforge/renderer";
import {
  defaultTheme,
  defaultThemeBlockRegistry,
} from "@openforge/theme-default";
import { useEffect, useState } from "react";

/**
 * The live canvas: a same-app, isolated-CSS document loaded in an <iframe>
 * by the content editor. It renders the exact same block-tree pipeline
 * apps/cms-renderer uses in production, so what you see while editing is
 * what actually ships — this route is never linked to directly, only ever
 * embedded. The parent posts the current (possibly unsaved) tree on every
 * change; this page re-renders it and reports clicks back by path so the
 * parent can drive a properties panel.
 */
export default function CanvasPage() {
  const [tree, setTree] = useState(null);
  const [tokenOverrides, setTokenOverrides] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    function handleMessage(event) {
      if (event.source !== window.parent) return;
      if (event.data?.type !== "of-canvas-tree") return;
      setError(null);
      setTree(event.data.tree);
      setTokenOverrides(event.data.tokenOverrides ?? {});
    }

    window.addEventListener("message", handleMessage);
    window.parent.postMessage({ type: "of-canvas-ready" }, "*");
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  function wrapNode(element, path, migrated) {
    return (
      <div
        data-of-block-id={migrated.blockId}
        data-of-path={JSON.stringify(path)}
        key={JSON.stringify(path)}
        onClick={(event) => {
          event.stopPropagation();
          window.parent.postMessage(
            { type: "of-canvas-select", path, blockId: migrated.blockId },
            "*",
          );
        }}
        style={{ display: "contents" }}
      >
        {element}
      </div>
    );
  }

  if (error) {
    return (
      <p style={{ color: "#b91c1c", fontFamily: "sans-serif", padding: 24 }}>
        {error}
      </p>
    );
  }

  if (!tree) {
    return (
      <p style={{ color: "#71717a", fontFamily: "sans-serif", padding: 24 }}>
        Waiting for content…
      </p>
    );
  }

  const renderer = createRenderer({
    theme: defaultTheme,
    blockRegistry: defaultThemeBlockRegistry,
    wrapNode,
  });
  const css = renderSiteStyles({
    baseTokens: defaultDesignTokens,
    overrides: tokenOverrides,
  });

  let body;
  try {
    body = renderer.renderTree(tree);
  } catch (renderError) {
    return (
      <p style={{ color: "#b91c1c", fontFamily: "sans-serif", padding: 24 }}>
        {renderError.message}
      </p>
    );
  }

  return (
    <div
      onClick={() =>
        window.parent.postMessage({ type: "of-canvas-select", path: null }, "*")
      }
    >
      {/* Token CSS is generated and validated by packages/design-tokens, never raw user input. */}
      <style dangerouslySetInnerHTML={{ __html: css }} />
      {body}
    </div>
  );
}
