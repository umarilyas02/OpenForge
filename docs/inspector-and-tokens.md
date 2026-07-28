# Inspector and design tokens

The Phase 2 inspector model represents every editable value with explicit
provenance:

- inherited from a parent or component;
- global token;
- project semantic token;
- local element value;
- breakpoint override.

Controls cover content, layout, spacing, size, typography, background, border,
and responsive state. The model resolves the nearest active mobile, tablet,
laptop, or desktop override and retains the base value so reset is
deterministic.

`@openforge/design-tokens` owns the versioned global, semantic, and component
token contract. It validates token identity and type, rejects CSS injection and
unsafe units, detects missing references and cycles, resolves semantic values,
and emits portable CSS custom properties without a runtime dependency.

Before a global token value changes, `planInspectorTokenUpdate()` validates the
new value against the selected property and reports every affected source
location and file. The editor must display that impact and ask for the normal
explicit operation confirmation; planning never mutates the collection.

Dynamic or unsupported values remain visible as code-owned values and are not
coerced into unsafe inspector edits.
