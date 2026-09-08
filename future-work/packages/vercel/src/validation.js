import { invariant } from "./errors.js";

const VERCEL_ID = /^[a-zA-Z0-9_-]{2,100}$/u;
const PROJECT_NAME = /^(?!-)[a-z0-9-]{1,100}(?<!-)$/u;
const ENV_KEY = /^[a-zA-Z_][a-zA-Z0-9_]{0,255}$/u;

export const VERCEL_ENVIRONMENTS = Object.freeze([
  "development",
  "preview",
  "production",
]);

export function normalizeVercelId(value, field = "identifier") {
  invariant(
    typeof value === "string" && VERCEL_ID.test(value),
    "OF_VERCEL_ID_INVALID",
    `The Vercel ${field} is invalid.`,
    { field },
  );
  return value;
}

export function normalizeProjectName(value) {
  invariant(
    typeof value === "string" && PROJECT_NAME.test(value),
    "OF_VERCEL_PROJECT_NAME_INVALID",
    "The Vercel project name is invalid.",
  );
  return value;
}

export function normalizeEnvironmentInput({
  key,
  value,
  targets,
  sensitive = false,
  gitBranch,
}) {
  invariant(
    typeof key === "string" && ENV_KEY.test(key),
    "OF_VERCEL_ENV_KEY_INVALID",
    "The environment variable name is invalid.",
  );
  invariant(
    typeof value === "string" &&
      Buffer.byteLength(value, "utf8") > 0 &&
      Buffer.byteLength(value, "utf8") <= 64 * 1024,
    "OF_VERCEL_ENV_VALUE_INVALID",
    "The environment variable value is empty or too large.",
  );
  invariant(
    Array.isArray(targets) &&
      targets.length > 0 &&
      new Set(targets).size === targets.length &&
      targets.every((target) => VERCEL_ENVIRONMENTS.includes(target)),
    "OF_VERCEL_ENV_TARGET_INVALID",
    "Environment targets must be unique supported Vercel environments.",
  );
  invariant(
    !sensitive || !targets.includes("development"),
    "OF_VERCEL_SENSITIVE_DEVELOPMENT_UNSUPPORTED",
    "Vercel sensitive variables are only available for preview and production.",
  );
  invariant(
    gitBranch === undefined ||
      (targets.length === 1 &&
        targets[0] === "preview" &&
        typeof gitBranch === "string" &&
        gitBranch.length <= 255),
    "OF_VERCEL_ENV_BRANCH_INVALID",
    "Branch-specific variables require one preview target.",
  );
  return {
    key,
    value,
    targets: [...targets],
    sensitive,
    gitBranch: gitBranch ?? null,
  };
}

export function normalizeNextUrl(value) {
  if (value === undefined || value === null) return null;
  const next = new URL(value);
  invariant(
    next.protocol === "https:" &&
      (next.hostname === "vercel.com" || next.hostname.endsWith(".vercel.com")),
    "OF_VERCEL_NEXT_URL_INVALID",
    "The Vercel completion URL is invalid.",
  );
  return next.toString();
}

export function normalizeGitRepository(value) {
  if (value === undefined || value === null) return null;
  invariant(
    value.type === "github" &&
      typeof value.repo === "string" &&
      /^[a-zA-Z0-9_.-]{1,100}\/[a-zA-Z0-9_.-]{1,100}$/u.test(value.repo),
    "OF_VERCEL_GIT_REPOSITORY_INVALID",
    "The Git repository link is invalid.",
  );
  return { type: "github", repo: value.repo };
}
