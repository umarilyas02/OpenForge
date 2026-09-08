import { invariant } from "./errors.js";

const OWNER = /^[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,37}[a-zA-Z0-9])?$/u;
const REPOSITORY = /^[a-zA-Z0-9._-]{1,100}$/u;
const BRANCH = /^(?![./])(?!.*(?:\.\.|\/\/|@\{|\\))[\p{L}\p{N}._/-]{1,255}$/u;

export function normalizeRepositoryCoordinates({ owner, name }) {
  invariant(
    OWNER.test(owner) && REPOSITORY.test(name),
    "OF_GITHUB_REPOSITORY_INVALID",
    "The GitHub repository coordinates are invalid.",
  );
  return { owner, name };
}

export function normalizeBranch(branch) {
  invariant(
    typeof branch === "string" &&
      BRANCH.test(branch) &&
      !branch.endsWith(".") &&
      !branch.endsWith("/") &&
      !branch.endsWith(".lock"),
    "OF_GITHUB_BRANCH_INVALID",
    "The GitHub branch name is invalid.",
  );
  return branch;
}

export function normalizeInstallationId(value) {
  const id = typeof value === "string" ? Number(value) : value;
  invariant(
    Number.isSafeInteger(id) && id > 0,
    "OF_GITHUB_INSTALLATION_INVALID",
    "The GitHub App installation ID is invalid.",
  );
  return id;
}

export function normalizeReturnTo(value) {
  invariant(
    typeof value === "string" &&
      value.startsWith("/") &&
      !value.startsWith("//") &&
      !value.includes("\\") &&
      value.length <= 500,
    "OF_GITHUB_RETURN_TO_INVALID",
    "The post-authentication return path is invalid.",
  );
  return value;
}
