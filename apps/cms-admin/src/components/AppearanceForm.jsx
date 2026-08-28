"use client";

import { Button } from "@primer/react";
import { useSearchParams } from "next/navigation";
import { useActionState, useState } from "react";

const initialState = { error: null };

/**
 * @param {{ siteId: string, tokens: { name: string, cssVariable: string, description: string, value: string }[], saveAppearance: Function }} props
 */
export function AppearanceForm({ siteId, tokens, saveAppearance }) {
  const searchParams = useSearchParams();
  const saved = searchParams.get("saved") === "1";
  const [values, setValues] = useState(
    Object.fromEntries(tokens.map((token) => [token.name, token.value])),
  );
  const action = saveAppearance.bind(null, siteId);
  const [state, formAction, pending] = useActionState(action, initialState);

  return (
    <form action={formAction} className="card stack prose-width">
      {tokens.map((token) => (
        <div className="token-row" key={token.name}>
          <div className="token-meta">
            <div className="token-name">{token.cssVariable}</div>
            <div className="token-desc">{token.description}</div>
          </div>
          <div style={{ alignItems: "center", display: "flex", gap: 8 }}>
            <span className="muted" style={{ fontSize: 12 }}>
              {values[token.name]}
            </span>
            <input
              className="token-swatch"
              name={token.name}
              onChange={(event) =>
                setValues((prev) => ({
                  ...prev,
                  [token.name]: event.target.value,
                }))
              }
              type="color"
              value={values[token.name]}
            />
          </div>
        </div>
      ))}

      {state.error ? <p className="form-error">{state.error}</p> : null}
      {saved && !state.error ? (
        <p className="toast-success">✓ Appearance saved</p>
      ) : null}
      <div className="form-actions">
        <Button disabled={pending} type="submit" variant="primary">
          {pending ? "Saving…" : "Save appearance"}
        </Button>
      </div>
    </form>
  );
}
