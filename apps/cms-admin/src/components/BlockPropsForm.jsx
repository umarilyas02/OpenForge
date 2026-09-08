"use client";

import { Checkbox, Textarea, TextInput } from "@primer/react";
import { useEffect, useRef, useState } from "react";

const FONT_WEIGHTS = ["400", "500", "600", "700", "800"];
const TEXT_ALIGNS = ["left", "center", "right", "justify"];
const BORDER_STYLES = ["solid", "dashed", "dotted"];
const SHADOW_PRESETS = [
  { value: "none", label: "None" },
  { value: "sm", label: "Small" },
  { value: "md", label: "Medium" },
  { value: "lg", label: "Large" },
];

/** How long to let edits settle before persisting — see the comment on BlockPropsForm for why this exists at all. */
const COMMIT_DEBOUNCE_MS = 450;

function ContentFields({ definition, props, setField }) {
  return (
    <div className="stack-sm">
      {definition.editableFields.map((field) => {
        const value = props[field.path] ?? "";

        if (field.control === "boolean") {
          return (
            <div className="toggle-row" key={field.path}>
              <Checkbox
                checked={Boolean(value)}
                id={`field-${field.path}`}
                onChange={(event) => setField(field.path, event.target.checked)}
              />
              <label htmlFor={`field-${field.path}`}>{field.label}</label>
            </div>
          );
        }

        if (field.control === "select") {
          return (
            <div className="form-field" key={field.path}>
              <label htmlFor={`field-${field.path}`}>
                {field.label}
                {field.required ? " *" : ""}
              </label>
              <select
                id={`field-${field.path}`}
                onChange={(event) => setField(field.path, event.target.value)}
                value={value}
              >
                {field.options.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          );
        }

        if (field.control === "textarea") {
          return (
            <div className="form-field" key={field.path}>
              <label htmlFor={`field-${field.path}`}>
                {field.label}
                {field.required ? " *" : ""}
              </label>
              <Textarea
                block
                id={`field-${field.path}`}
                onChange={(event) => setField(field.path, event.target.value)}
                rows={3}
                value={value}
              />
            </div>
          );
        }

        return (
          <div className="form-field" key={field.path}>
            <label htmlFor={`field-${field.path}`}>
              {field.label}
              {field.required ? " *" : ""}
            </label>
            <TextInput
              block
              id={`field-${field.path}`}
              onChange={(event) => setField(field.path, event.target.value)}
              value={value}
            />
          </div>
        );
      })}
    </div>
  );
}

function StyleGroup({ title, children }) {
  return (
    <div className="style-group">
      <p className="style-group-title">{title}</p>
      <div className="style-group-body">{children}</div>
    </div>
  );
}

function StyleField({ label, children, span }) {
  return (
    <div className="style-field" data-span={span ?? undefined}>
      <label>{label}</label>
      {children}
    </div>
  );
}

function StyleFields({ style, setStyleField }) {
  const typography = style.typography ?? {};
  const color = style.color ?? {};
  const spacing = style.spacing ?? {};
  const border = style.border ?? {};
  const shadowPreset = style.shadow?.preset ?? "none";

  return (
    <div className="stack">
      <StyleGroup title="Typography">
        <StyleField label="Font size">
          <input
            onChange={(event) =>
              setStyleField("typography", "fontSize", event.target.value)
            }
            placeholder="16px"
            type="text"
            value={typography.fontSize ?? ""}
          />
        </StyleField>
        <StyleField label="Weight">
          <select
            onChange={(event) =>
              setStyleField("typography", "fontWeight", event.target.value)
            }
            value={typography.fontWeight ?? ""}
          >
            <option value="">Default</option>
            {FONT_WEIGHTS.map((weight) => (
              <option key={weight} value={weight}>
                {weight}
              </option>
            ))}
          </select>
        </StyleField>
        <StyleField label="Line height">
          <input
            onChange={(event) =>
              setStyleField("typography", "lineHeight", event.target.value)
            }
            placeholder="1.5"
            type="text"
            value={typography.lineHeight ?? ""}
          />
        </StyleField>
        <StyleField label="Letter spacing">
          <input
            onChange={(event) =>
              setStyleField("typography", "letterSpacing", event.target.value)
            }
            placeholder="0"
            type="text"
            value={typography.letterSpacing ?? ""}
          />
        </StyleField>
        <StyleField label="Align" span={2}>
          <select
            onChange={(event) =>
              setStyleField("typography", "textAlign", event.target.value)
            }
            value={typography.textAlign ?? ""}
          >
            <option value="">Default</option>
            {TEXT_ALIGNS.map((align) => (
              <option key={align} value={align}>
                {align}
              </option>
            ))}
          </select>
        </StyleField>
      </StyleGroup>

      <StyleGroup title="Color">
        <StyleField label="Text">
          <input
            onChange={(event) =>
              setStyleField("color", "text", event.target.value)
            }
            type="color"
            value={color.text ?? "#000000"}
          />
        </StyleField>
        <StyleField label="Background">
          <input
            onChange={(event) =>
              setStyleField("color", "background", event.target.value)
            }
            type="color"
            value={color.background ?? "#ffffff"}
          />
        </StyleField>
      </StyleGroup>

      <StyleGroup title="Spacing">
        <StyleField label="Padding top">
          <input
            onChange={(event) =>
              setStyleField("spacing", "paddingTop", event.target.value)
            }
            placeholder="0px"
            type="text"
            value={spacing.paddingTop ?? ""}
          />
        </StyleField>
        <StyleField label="Padding right">
          <input
            onChange={(event) =>
              setStyleField("spacing", "paddingRight", event.target.value)
            }
            placeholder="0px"
            type="text"
            value={spacing.paddingRight ?? ""}
          />
        </StyleField>
        <StyleField label="Padding bottom">
          <input
            onChange={(event) =>
              setStyleField("spacing", "paddingBottom", event.target.value)
            }
            placeholder="0px"
            type="text"
            value={spacing.paddingBottom ?? ""}
          />
        </StyleField>
        <StyleField label="Padding left">
          <input
            onChange={(event) =>
              setStyleField("spacing", "paddingLeft", event.target.value)
            }
            placeholder="0px"
            type="text"
            value={spacing.paddingLeft ?? ""}
          />
        </StyleField>
        <StyleField label="Margin top">
          <input
            onChange={(event) =>
              setStyleField("spacing", "marginTop", event.target.value)
            }
            placeholder="0px"
            type="text"
            value={spacing.marginTop ?? ""}
          />
        </StyleField>
        <StyleField label="Margin bottom">
          <input
            onChange={(event) =>
              setStyleField("spacing", "marginBottom", event.target.value)
            }
            placeholder="0px"
            type="text"
            value={spacing.marginBottom ?? ""}
          />
        </StyleField>
      </StyleGroup>

      <StyleGroup title="Border">
        <StyleField label="Width">
          <input
            onChange={(event) =>
              setStyleField("border", "width", event.target.value)
            }
            placeholder="0px"
            type="text"
            value={border.width ?? ""}
          />
        </StyleField>
        <StyleField label="Style">
          <select
            onChange={(event) =>
              setStyleField("border", "style", event.target.value)
            }
            value={border.style ?? "solid"}
          >
            {BORDER_STYLES.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </StyleField>
        <StyleField label="Color">
          <input
            onChange={(event) =>
              setStyleField("border", "color", event.target.value)
            }
            type="color"
            value={border.color ?? "#000000"}
          />
        </StyleField>
        <StyleField label="Radius">
          <input
            onChange={(event) =>
              setStyleField("border", "radius", event.target.value)
            }
            placeholder="0px"
            type="text"
            value={border.radius ?? ""}
          />
        </StyleField>
      </StyleGroup>

      <StyleGroup title="Shadow">
        <StyleField label="Preset" span={2}>
          <select
            onChange={(event) =>
              setStyleField("shadow", "preset", event.target.value)
            }
            value={shadowPreset}
          >
            {SHADOW_PRESETS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </StyleField>
      </StyleGroup>
    </div>
  );
}

function AdvancedFields({ className, setClassName }) {
  return (
    <div className="stack-sm">
      <div className="form-field">
        <label htmlFor="advanced-class-name">Custom CSS class</label>
        <TextInput
          block
          id="advanced-class-name"
          onChange={(event) => setClassName(event.target.value)}
          placeholder="e.g. my-custom-class"
          value={className}
        />
        <span className="form-hint">
          Added alongside this block&apos;s own classes — useful for a
          project&apos;s own stylesheet or utility classes.
        </span>
      </div>
    </div>
  );
}

/**
 * Content/Style/Advanced tabs for the block currently selected on the
 * canvas. Style and Advanced write to the universal `style`/`className`
 * props every block supports (see packages/renderer's renderNode) — real
 * CSS, persisted through the same compiler pipeline as any other prop
 * edit, and rendered identically on the live published site.
 *
 * Every field here edits local state instantly and only *persists*
 * (calling `onChange`, which triggers a real file read + AST parse +
 * compiler operation + file write + git commit) after a short pause in
 * typing. Without this, every keystroke fired that whole round trip: the
 * canvas visibly lagged behind typing, and — worse — two of those round
 * trips could resolve out of order (whichever server call happened to
 * *finish* last would win, even if it wasn't the last one *issued*),
 * silently dropping an edit. Mount a fresh instance per selected block
 * (CanvasEditor passes `key={selectedNode.id}`) so switching blocks always
 * starts from that block's real current props, never a stale local draft.
 */
export function BlockPropsForm({ definition, props, onChange }) {
  const [tab, setTab] = useState("content");
  const [localProps, setLocalProps] = useState(props);

  const timerRef = useRef(null);
  const pendingRef = useRef(null);
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  useEffect(() => {
    return () => {
      // Flush rather than drop: switching to another block (or navigating
      // away) shouldn't silently discard whatever was still debouncing.
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        if (pendingRef.current) onChangeRef.current(pendingRef.current);
      }
    };
  }, []);

  function commit(nextProps) {
    setLocalProps(nextProps);
    pendingRef.current = nextProps;
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      timerRef.current = null;
      const value = pendingRef.current;
      pendingRef.current = null;
      onChangeRef.current(value);
    }, COMMIT_DEBOUNCE_MS);
  }

  function setField(path, value) {
    commit({ ...localProps, [path]: value });
  }

  function setStyleField(group, key, value) {
    const nextGroup = { ...(localProps.style?.[group] ?? {}), [key]: value };
    if (!value) delete nextGroup[key];
    const nextStyle = { ...(localProps.style ?? {}), [group]: nextGroup };
    if (Object.keys(nextGroup).length === 0) delete nextStyle[group];
    commit({ ...localProps, style: nextStyle });
  }

  function setClassName(value) {
    commit({ ...localProps, className: value });
  }

  return (
    <div className="stack">
      <div className="props-tabs">
        <button
          data-active={tab === "content"}
          onClick={() => setTab("content")}
          type="button"
        >
          Content
        </button>
        <button
          data-active={tab === "style"}
          onClick={() => setTab("style")}
          type="button"
        >
          Style
        </button>
        <button
          data-active={tab === "advanced"}
          onClick={() => setTab("advanced")}
          type="button"
        >
          Advanced
        </button>
      </div>

      {tab === "content" ? (
        <ContentFields
          definition={definition}
          props={localProps}
          setField={setField}
        />
      ) : null}
      {tab === "style" ? (
        <StyleFields
          setStyleField={setStyleField}
          style={localProps.style ?? {}}
        />
      ) : null}
      {tab === "advanced" ? (
        <AdvancedFields
          className={localProps.className ?? ""}
          setClassName={setClassName}
        />
      ) : null}
    </div>
  );
}
