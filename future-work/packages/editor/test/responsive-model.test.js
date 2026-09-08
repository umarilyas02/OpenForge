import { describe, expect, it } from "vitest";

import {
  ResponsiveEditorError,
  analyzeResponsiveLayout,
  createResponsiveEditorState,
  getResponsiveEditorLayout,
  resetResponsiveOverride,
  resolveResponsiveOverride,
  selectResponsiveViewport,
  setResponsiveOverride,
} from "../src/index.js";

describe("responsive editor state", () => {
  it("switches between all four named viewport presets", () => {
    let state = createResponsiveEditorState();
    expect(state).toMatchObject({ viewport: "desktop", viewportWidth: 1440 });
    state = selectResponsiveViewport(state, "mobile");
    expect(state).toMatchObject({ viewport: "mobile", viewportWidth: 390 });
    state = selectResponsiveViewport(state, "tablet");
    expect(state.viewportWidth).toBe(768);
    state = selectResponsiveViewport(state, "laptop");
    expect(state.viewportWidth).toBe(1024);
  });

  it("inherits the nearest override and resets without mutating prior state", () => {
    const initial = createResponsiveEditorState({ viewport: "desktop" });
    const mobile = setResponsiveOverride(initial, {
      nodeId: "hero",
      property: "gap",
      breakpoint: "mobile",
      value: "1rem",
    });
    const tablet = setResponsiveOverride(mobile, {
      nodeId: "hero",
      property: "gap",
      breakpoint: "tablet",
      value: "2rem",
    });

    expect(
      resolveResponsiveOverride(tablet, {
        nodeId: "hero",
        property: "gap",
        baseValue: "3rem",
      }),
    ).toEqual({
      value: "2rem",
      source: "breakpoint",
      breakpoint: "tablet",
      inherited: true,
    });
    expect(initial.overrides).toEqual({});

    const reset = resetResponsiveOverride(tablet, {
      nodeId: "hero",
      property: "gap",
      breakpoint: "tablet",
    });
    expect(
      resolveResponsiveOverride(reset, {
        nodeId: "hero",
        property: "gap",
        baseValue: "3rem",
      }),
    ).toMatchObject({ value: "1rem", breakpoint: "mobile" });
  });

  it("reports overflow, clipping, and fixed-width diagnostics", () => {
    const diagnostics = analyzeResponsiveLayout({
      viewport: "mobile",
      nodes: [
        {
          nodeId: "hero",
          label: "Hero",
          rect: { left: 0, width: 520 },
          clientWidth: 390,
          scrollWidth: 520,
          fixedWidth: true,
        },
        {
          nodeId: "copy",
          label: "Copy",
          rect: { left: 20, width: 300 },
          clientWidth: 300,
          scrollWidth: 300,
          fixedWidth: false,
        },
      ],
    });

    expect(diagnostics.map(({ code }) => code)).toEqual([
      "OF_RESPONSIVE_CONTENT_CLIPPED",
      "OF_RESPONSIVE_FIXED_WIDTH",
      "OF_RESPONSIVE_HORIZONTAL_OVERFLOW",
    ]);
    expect(diagnostics.every(({ nodeId }) => nodeId === "hero")).toBe(true);
  });

  it("uses a read-only review layout on narrow editor hosts", () => {
    expect(getResponsiveEditorLayout({ hostWidth: 840 })).toEqual({
      mode: "review",
      readOnly: true,
      showLayerPanel: false,
      showInspector: false,
      showBottomPanel: false,
    });
    expect(getResponsiveEditorLayout({ hostWidth: 1024 })).toMatchObject({
      mode: "compact",
      readOnly: false,
      showInspector: false,
    });
    expect(getResponsiveEditorLayout({ hostWidth: 1440 })).toMatchObject({
      mode: "editor",
      showInspector: true,
    });
  });

  it("rejects unknown viewports and invalid override targets", () => {
    expect(() =>
      createResponsiveEditorState({ viewport: "watch" }),
    ).toThrowError(ResponsiveEditorError);
    expect(() =>
      setResponsiveOverride(createResponsiveEditorState(), {
        nodeId: "hero",
        property: "gap",
        breakpoint: "base",
        value: "1rem",
      }),
    ).toThrowError(
      expect.objectContaining({ code: "OF_RESPONSIVE_OVERRIDE_INVALID" }),
    );
  });
});
