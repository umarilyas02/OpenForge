"use client";

import { Checkbox, Textarea, TextInput } from "@primer/react";

export function BlockPropsForm({ definition, props, onChange }) {
  function setField(path, value) {
    onChange({ ...props, [path]: value });
  }

  return (
    <div className="stack" style={{ marginTop: 8 }}>
      {definition.editableFields.map((field) => {
        const value = props[field.path] ?? "";

        if (field.control === "boolean") {
          return (
            <label
              key={field.path}
              style={{ alignItems: "center", display: "flex", gap: 8 }}
            >
              <Checkbox
                checked={Boolean(value)}
                onChange={(event) => setField(field.path, event.target.checked)}
              />
              {field.label}
            </label>
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
                id={`field-${field.path}`}
                value={value}
                onChange={(event) => setField(field.path, event.target.value)}
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
              id={`field-${field.path}`}
              value={value}
              onChange={(event) => setField(field.path, event.target.value)}
            />
          </div>
        );
      })}
    </div>
  );
}
