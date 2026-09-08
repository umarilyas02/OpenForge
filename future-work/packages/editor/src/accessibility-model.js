export const EDITOR_KEYBOARD_COMMANDS = Object.freeze({
  "Mod+K": "open-command-palette",
  "Mod+Z": "undo",
  "Mod+Shift+Z": "redo",
  Escape: "dismiss",
  Enter: "activate",
  Space: "activate",
  ArrowUp: "navigate-parent",
  ArrowDown: "navigate-child",
  ArrowLeft: "navigate-previous",
  ArrowRight: "navigate-next",
});

export function resolveEditorKeyboardCommand(event) {
  const key = normalizeKey(event.key);
  const modifier = event.ctrlKey || event.metaKey;
  const signature = [
    modifier ? "Mod+" : "",
    modifier && event.shiftKey ? "Shift+" : "",
    key,
  ].join("");
  return EDITOR_KEYBOARD_COMMANDS[signature] ?? null;
}

export function createAccessibilityStatus(message, priority = "polite") {
  if (
    typeof message !== "string" ||
    !["polite", "assertive"].includes(priority)
  ) {
    throw new TypeError("Status requires a message and valid live priority.");
  }
  return {
    role: "status",
    ariaLive: priority,
    ariaAtomic: true,
    message,
  };
}

export function getMotionPreferences(prefersReducedMotion) {
  return prefersReducedMotion
    ? {
        reduced: true,
        durationScale: 0,
        smoothScroll: false,
        autoplay: false,
      }
    : {
        reduced: false,
        durationScale: 1,
        smoothScroll: true,
        autoplay: true,
      };
}

export function normalizeAccessibilityResults(results) {
  if (!results || !Array.isArray(results.violations)) {
    throw new TypeError("Accessibility results require a violations array.");
  }
  return results.violations
    .flatMap((violation) =>
      violation.nodes.map((node, index) => ({
        id: `${violation.id}:${index}`,
        code: `OF_A11Y_${violation.id.replaceAll("-", "_").toUpperCase()}`,
        severity: normalizeImpact(node.impact ?? violation.impact),
        rule: violation.id,
        help: violation.help,
        helpUrl: violation.helpUrl,
        target: [...node.target],
        summary: node.failureSummary,
        html: node.html.slice(0, 300),
      })),
    )
    .sort(
      (left, right) =>
        left.code.localeCompare(right.code) ||
        left.target.join(" ").localeCompare(right.target.join(" ")),
    );
}

export function auditOfficialBlockDefinitions(blocks) {
  const diagnostics = [];
  for (const block of blocks) {
    if (!Array.isArray(block.accessibility) || block.accessibility.length < 2) {
      diagnostics.push(
        diagnostic(
          block.id,
          "OF_A11Y_NOTES_MISSING",
          "Official blocks require at least two accessibility implementation notes.",
        ),
      );
    }
    if (block.category === "hero" && !/<h1(?:\s|>)/u.test(block.source)) {
      diagnostics.push(
        diagnostic(
          block.id,
          "OF_A11Y_HERO_HEADING",
          "Hero blocks require one semantic h1.",
        ),
      );
    }
    for (const match of block.source.matchAll(/<img\b[^>]*>/gu)) {
      if (!/\balt\s*=/u.test(match[0])) {
        diagnostics.push(
          diagnostic(
            block.id,
            "OF_A11Y_IMAGE_ALT",
            "Image elements require an alt attribute.",
          ),
        );
      }
    }
    if (/\btabIndex\s*=\s*(?:["']?[1-9]|\{[1-9])/u.test(block.source)) {
      diagnostics.push(
        diagnostic(
          block.id,
          "OF_A11Y_POSITIVE_TABINDEX",
          "Positive tabIndex values are not allowed in official blocks.",
        ),
      );
    }
    if (/<(?:div|span)\b[^>]*\bonClick\s*=/u.test(block.source)) {
      diagnostics.push(
        diagnostic(
          block.id,
          "OF_A11Y_NONINTERACTIVE_CLICK",
          "Pointer actions must use a native interactive element.",
        ),
      );
    }
  }
  return diagnostics.sort(
    (left, right) =>
      left.blockId.localeCompare(right.blockId) ||
      left.code.localeCompare(right.code),
  );
}

function diagnostic(blockId, code, message) {
  return { blockId, code, severity: "error", message };
}

function normalizeKey(key) {
  if (key === " ") return "Space";
  if (typeof key === "string" && key.length === 1) return key.toUpperCase();
  return key;
}

function normalizeImpact(impact) {
  if (["critical", "serious"].includes(impact)) return "error";
  if (impact === "moderate") return "warning";
  return "info";
}
