import { describe, expect, it } from "vitest";

import {
  auditOfficialBlockDefinitions,
  createAccessibilityStatus,
  getMotionPreferences,
  normalizeAccessibilityResults,
  resolveEditorKeyboardCommand,
} from "../src/index.js";

describe("editor accessibility model", () => {
  it("maps keyboard-only editor workflows across platforms", () => {
    expect(resolveEditorKeyboardCommand({ key: "k", ctrlKey: true })).toBe(
      "open-command-palette",
    );
    expect(
      resolveEditorKeyboardCommand({
        key: "z",
        metaKey: true,
        shiftKey: true,
      }),
    ).toBe("redo");
    expect(resolveEditorKeyboardCommand({ key: "ArrowUp" })).toBe(
      "navigate-parent",
    );
    expect(resolveEditorKeyboardCommand({ key: " " })).toBe("activate");
    expect(resolveEditorKeyboardCommand({ key: "a" })).toBeNull();
  });

  it("creates live status contracts and reduced-motion behavior", () => {
    expect(createAccessibilityStatus("Saved revision 12.")).toEqual({
      role: "status",
      ariaLive: "polite",
      ariaAtomic: true,
      message: "Saved revision 12.",
    });
    expect(getMotionPreferences(true)).toEqual({
      reduced: true,
      durationScale: 0,
      smoothScroll: false,
      autoplay: false,
    });
    expect(getMotionPreferences(false).autoplay).toBe(true);
  });

  it("normalizes axe results without exposing unbounded markup", () => {
    const diagnostics = normalizeAccessibilityResults({
      violations: [
        {
          id: "button-name",
          impact: "serious",
          help: "Buttons must have discernible text",
          helpUrl: "https://dequeuniversity.com/rules/axe/button-name",
          nodes: [
            {
              target: [".save"],
              html: `<button>${"x".repeat(500)}</button>`,
              failureSummary: "Fix the button label.",
            },
          ],
        },
      ],
    });
    expect(diagnostics[0]).toMatchObject({
      code: "OF_A11Y_BUTTON_NAME",
      severity: "error",
      target: [".save"],
    });
    expect(diagnostics[0].html.length).toBe(300);
  });

  it("audits official block source contracts", () => {
    expect(
      auditOfficialBlockDefinitions([
        {
          id: "openforge.hero",
          category: "hero",
          accessibility: ["Heading order", "Named actions"],
          source: "export function Hero() { return <h1>Build</h1>; }",
        },
      ]),
    ).toEqual([]);

    expect(
      auditOfficialBlockDefinitions([
        {
          id: "openforge.hero",
          category: "hero",
          accessibility: [],
          source:
            'export function Hero() { return <div onClick={go}><img src="/a.png" tabIndex="2" /></div>; }',
        },
      ]).map(({ code }) => code),
    ).toEqual([
      "OF_A11Y_HERO_HEADING",
      "OF_A11Y_IMAGE_ALT",
      "OF_A11Y_NONINTERACTIVE_CLICK",
      "OF_A11Y_NOTES_MISSING",
      "OF_A11Y_POSITIVE_TABINDEX",
    ]);
  });
});
