"use client";

import { Checkbox, Textarea, TextInput } from "@primer/react";

export function BlockPropsForm({ definition, props, onChange }) {
  function setField(path, value) {
    onChange({ ...props, [path]: value });
  }

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
