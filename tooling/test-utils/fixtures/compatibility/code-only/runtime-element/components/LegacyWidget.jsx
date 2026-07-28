import React from "react";

export function LegacyWidget({ tag, children }) {
  return React.createElement(tag, { className: "legacy-widget" }, children);
}
