"use client";

import { useSearchParams } from "next/navigation";
import { useActionState, useMemo, useState } from "react";

const SECTION_ORDER = [
  { key: "color", title: "Color", desc: "Semantic color tokens used across the admin, themes, and renderer." },
  { key: "typography", title: "Typography", desc: "Type scale for a consistent, readable hierarchy." },
  { key: "dimension", title: "Spacing", desc: "Spacing scale used for layouts and components." },
  { key: "radius", title: "Radius", desc: "Border radius scale for a consistent look and feel." },
  { key: "shadow", title: "Shadows", desc: "Elevation for cards, popovers, and modals." },
];

const TYPOGRAPHY_TYPES = new Set([
  "font-family",
  "font-size",
  "font-weight",
  "line-height",
]);

const BREAKPOINTS = [
  { name: "sm", value: "640px" },
  { name: "md", value: "768px" },
  { name: "lg", value: "1024px" },
  { name: "xl", value: "1280px" },
  { name: "2xl", value: "1536px" },
];

function sectionKeyFor(type) {
  if (type === "color") return "color";
  if (TYPOGRAPHY_TYPES.has(type)) return "typography";
  if (type === "dimension") return "dimension";
  if (type === "radius") return "radius";
  if (type === "shadow") return "shadow";
  return "color";
}

const initialState = { error: null };

/**
 * @param {{ siteId: string, tokens: { name: string, cssVariable: string, type: string, tier: string, value: string, resolvedValue: string, description: string }[], saveDesignTokens: Function }} props
 */
export function DesignTokensForm({ siteId, tokens, saveDesignTokens }) {
  const searchParams = useSearchParams();
  const saved = searchParams.get("saved") === "1";

  const initialValues = useMemo(
    () => Object.fromEntries(tokens.map((token) => [token.name, token.resolvedValue])),
    [tokens],
  );
  const [values, setValues] = useState(initialValues);
  const action = saveDesignTokens.bind(null, siteId);
  const [state, formAction, pending] = useActionState(action, initialState);

  const sections = useMemo(() => {
    const grouped = new Map(SECTION_ORDER.map((section) => [section.key, []]));
    for (const token of tokens) {
      grouped.get(sectionKeyFor(token.type))?.push(token);
    }
    return SECTION_ORDER.map((section) => ({
      ...section,
      tokens: grouped.get(section.key) ?? [],
    })).filter((section) => section.tokens.length > 0);
  }, [tokens]);

  const preview = {
    "--of-preview-bg": values["color.background"],
    "--of-preview-text": values["color.ink"],
    "--of-preview-accent": values["color.action"],
    "--of-preview-accent-ink": values["color.paper"],
    "--of-preview-radius": values["radius.control"],
  };

  function updateValue(name, value) {
    setValues((prev) => ({ ...prev, [name]: value }));
  }

  return (
    <form action={formAction}>
      <div className="page-header">
        <div>
          <p className="page-eyebrow">Appearance / System</p>
          <h1 className="page-title">Design Tokens</h1>
          <p className="page-subtitle">
            Define the visual foundation shared by themes, blocks, and the
            renderer.
          </p>
        </div>
        <div className="form-actions">
          <button
            className="btn btn-ghost"
            onClick={() => setValues(initialValues)}
            type="button"
          >
            Reset
          </button>
          <button className="btn btn-primary" disabled={pending} type="submit">
            {pending ? "Saving…" : "Save changes"}
          </button>
        </div>
      </div>

      {state.error ? <p className="form-error">{state.error}</p> : null}
      {saved && !state.error ? (
        <p className="toast-success">✓ Design tokens saved</p>
      ) : null}

      <div className="tokens-layout">
        <nav className="foundations-nav" aria-label="Foundations">
          <p className="foundations-nav-title">Foundations</p>
          {sections.map((section) => (
            <a
              className="foundations-nav-link"
              href={`#${section.key}`}
              key={section.key}
            >
              {section.title}
            </a>
          ))}
          <a className="foundations-nav-link" href="#breakpoints">
            Breakpoints
          </a>
        </nav>

        <div className="tokens-content-grid">
          <div className="tokens-main">
            {sections.map((section) => (
              <section className="token-section" id={section.key} key={section.key}>
                <div className="token-section-header">
                  <h2 className="token-section-title">{section.title}</h2>
                  <p className="token-section-desc">{section.desc}</p>
                </div>
                <table className="token-table">
                  <thead>
                    <tr>
                      {section.key === "color" ? <th>Swatch</th> : null}
                      <th>Token</th>
                      <th>Value</th>
                      <th>Usage</th>
                    </tr>
                  </thead>
                  <tbody>
                    {section.tokens.map((token) => (
                      <tr key={token.name}>
                        {section.key === "color" ? (
                          <td className="token-table-swatch-cell">
                            <input
                              aria-label={`${token.cssVariable} color`}
                              className="token-swatch-input"
                              name={token.name}
                              onChange={(event) =>
                                updateValue(token.name, event.target.value)
                              }
                              type="color"
                              value={values[token.name]}
                            />
                          </td>
                        ) : null}
                        <td>
                          <div className="token-table-token">{token.cssVariable}</div>
                        </td>
                        <td className="token-table-value">
                          {section.key === "color" ? (
                            values[token.name]
                          ) : (
                            <input
                              name={token.name}
                              onChange={(event) =>
                                updateValue(token.name, event.target.value)
                              }
                              type="text"
                              value={values[token.name]}
                            />
                          )}
                        </td>
                        <td className="token-table-usage">{token.description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </section>
            ))}

            <section className="token-section" id="breakpoints">
              <div className="token-section-header">
                <h2 className="token-section-title">Breakpoints</h2>
                <p className="token-section-desc">
                  Fixed layout breakpoints — not yet user-configurable.
                </p>
              </div>
              <table className="token-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Value</th>
                  </tr>
                </thead>
                <tbody>
                  {BREAKPOINTS.map((bp) => (
                    <tr key={bp.name}>
                      <td className="token-table-token">--of-bp-{bp.name}</td>
                      <td className="token-table-value">{bp.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          </div>

          <aside className="live-preview-panel">
            <div className="live-preview-header">
              <div>
                <p className="live-preview-title">Live Preview</p>
                <p className="live-preview-desc">Components using your tokens</p>
              </div>
            </div>
            <div className="live-preview-card" style={preview}>
              <span className="live-preview-eyebrow">OpenForge</span>
              <h3 className="live-preview-heading">Build without limits.</h3>
              <p className="live-preview-body">
                A modern Next.js CMS and visual editor. Fully yours.
              </p>
              <button className="live-preview-btn" type="button">
                Get started →
              </button>
            </div>
          </aside>
        </div>
      </div>
    </form>
  );
}
