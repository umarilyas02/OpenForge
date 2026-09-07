const SHADOW_PRESETS = Object.freeze({
  sm: "0 1px 2px rgba(0, 0, 0, 0.05)",
  md: "0 8px 24px rgba(0, 0, 0, 0.08)",
  lg: "0 24px 60px rgba(0, 0, 0, 0.16)",
});

/**
 * Converts a block instance's optional `style` prop — the universal
 * Typography/Color/Spacing/Border/Shadow overrides set from the admin's
 * Style tab (see apps/cms-admin's BlockPropsForm.jsx) — into a plain React
 * CSSProperties object. Block components themselves never need to know
 * this schema exists: renderNode (see renderer.js) wraps the component's
 * own output in one extra element carrying this CSS only when there's
 * something to apply, so a block with no style overrides renders exactly
 * as it always has.
 *
 * @param {unknown} style
 * @returns {Record<string, string | number> | null}
 */
export function styleOverrideToCss(style) {
  if (!style || typeof style !== "object" || Array.isArray(style)) {
    return null;
  }

  const css = {};
  const typography = style.typography ?? {};
  if (typography.fontSize) css.fontSize = typography.fontSize;
  if (typography.fontWeight) css.fontWeight = typography.fontWeight;
  if (typography.lineHeight) css.lineHeight = typography.lineHeight;
  if (typography.letterSpacing) css.letterSpacing = typography.letterSpacing;
  if (typography.textAlign) css.textAlign = typography.textAlign;

  const color = style.color ?? {};
  if (color.text) css.color = color.text;
  if (color.background) css.backgroundColor = color.background;

  const spacing = style.spacing ?? {};
  if (spacing.paddingTop) css.paddingTop = spacing.paddingTop;
  if (spacing.paddingRight) css.paddingRight = spacing.paddingRight;
  if (spacing.paddingBottom) css.paddingBottom = spacing.paddingBottom;
  if (spacing.paddingLeft) css.paddingLeft = spacing.paddingLeft;
  if (spacing.marginTop) css.marginTop = spacing.marginTop;
  if (spacing.marginBottom) css.marginBottom = spacing.marginBottom;

  const border = style.border ?? {};
  if (border.width || border.color || border.style) {
    css.borderWidth = border.width || "1px";
    css.borderStyle = border.style || "solid";
    css.borderColor = border.color || "currentColor";
  }
  if (border.radius) css.borderRadius = border.radius;

  const shadowPreset = style.shadow?.preset;
  if (shadowPreset && shadowPreset !== "none" && SHADOW_PRESETS[shadowPreset]) {
    css.boxShadow = SHADOW_PRESETS[shadowPreset];
  }

  return Object.keys(css).length > 0 ? css : null;
}
