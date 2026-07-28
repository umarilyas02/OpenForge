import { invariant } from "./errors.js";

export function canonicalJson(value) {
  return JSON.stringify(normalize(value, new Set()));
}

function normalize(value, ancestors) {
  if (
    value === null ||
    typeof value === "string" ||
    typeof value === "boolean"
  ) {
    return value;
  }
  if (typeof value === "number") {
    invariant(
      Number.isFinite(value),
      "OF_SECURITY_VALUE_INVALID",
      "Canonical values cannot contain non-finite numbers.",
    );
    return value;
  }
  if (Array.isArray(value)) {
    guardCycle(value, ancestors);
    const normalized = value.map((entry) => normalize(entry, ancestors));
    ancestors.delete(value);
    return normalized;
  }
  invariant(
    typeof value === "object",
    "OF_SECURITY_VALUE_INVALID",
    "Canonical values must be JSON-compatible.",
  );
  guardCycle(value, ancestors);
  const normalized = {};
  for (const key of Object.keys(value).sort()) {
    if (value[key] !== undefined) {
      normalized[key] = normalize(value[key], ancestors);
    }
  }
  ancestors.delete(value);
  return normalized;
}

function guardCycle(value, ancestors) {
  invariant(
    !ancestors.has(value),
    "OF_SECURITY_VALUE_CYCLIC",
    "Canonical values cannot contain cycles.",
  );
  ancestors.add(value);
}
