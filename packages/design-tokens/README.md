# `@openforge/design-tokens`

Portable, versioned design-token contracts for OpenForge projects and inspector
controls.

The registry validates typed global, semantic, and component tokens; resolves
references with cycle and type checks; emits standalone CSS custom properties;
rejects unsafe CSS values; and reports exact source locations affected by a
token update before it is applied.

The default collection includes the initial color, spacing, radius, typography,
line-height, and shadow foundation. Project source can use the generated CSS
without an OpenForge runtime dependency.
