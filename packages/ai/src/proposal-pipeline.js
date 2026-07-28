import { createHash } from "node:crypto";

import {
  analyzeSourceCompatibility,
  COMPATIBILITY_LEVELS,
  normalizeProjectPath,
  withTemporaryProject,
} from "@openforge/compiler";
import { createTwoFilesPatch } from "diff";

import { invariant } from "./errors.js";
import { redactAISecrets } from "./context-policy.js";

const SOURCE_EXTENSIONS = /\.(?:[cm]?[jt]sx?)$/iu;
const REVISION = /^[a-zA-Z0-9._:-]{1,160}$/u;
const PROTECTED_PATHS = [
  /^\.git(?:\/|$)/u,
  /^\.openforge(?:\/|$)/u,
  /(?:^|\/)\.env(?:\.|$)/u,
  /(?:^|\/)(?:id_rsa|id_ed25519|credentials)(?:\.|$)/u,
];

export function createAIProposalPipeline({
  validators,
  audit = async () => {},
  clock = () => new Date(),
} = {}) {
  const normalizedValidators = parseValidators(validators);
  const proposals = new Map();
  const approvals = new Map();

  async function validate({ proposal, currentFiles, currentRevision }) {
    const parsed = parseAIProposal(proposal);
    assertRevision(currentRevision);
    invariant(
      parsed.baseRevision === currentRevision,
      "OF_AI_PROPOSAL_STALE",
      "The AI proposal base revision is stale.",
    );
    const current = parseCurrentFiles(currentFiles);
    const result = await validateParsedProposal({
      parsed,
      current,
      validators: normalizedValidators,
      clock,
    });
    proposals.set(result.id, {
      parsed,
      currentDigests: digestFiles(current),
      result,
    });
    await writeAudit(audit, "ai.proposal.validated", result);
    return publicValidation(result);
  }

  async function approve({
    proposalId,
    approvedPaths,
    currentFiles,
    currentRevision,
    actor,
  }) {
    const stored = proposals.get(proposalId);
    invariant(
      stored,
      "OF_AI_PROPOSAL_NOT_FOUND",
      "The AI proposal validation was not found.",
    );
    invariant(
      stored.result.status === "passed",
      "OF_AI_PROPOSAL_NOT_VALID",
      "Only a fully validated AI proposal can be approved.",
    );
    assertRevision(currentRevision);
    invariant(
      currentRevision === stored.parsed.baseRevision,
      "OF_AI_PROPOSAL_STALE",
      "The project revision changed after proposal validation.",
    );
    const current = parseCurrentFiles(currentFiles);
    invariant(
      JSON.stringify(digestFiles(current)) ===
        JSON.stringify(stored.currentDigests),
      "OF_AI_PROPOSAL_STALE",
      "Project files changed after proposal validation.",
    );
    const selected = parseApprovedPaths(approvedPaths, stored.parsed.changes);
    const selectedProposal = {
      ...stored.parsed,
      changes: stored.parsed.changes.filter((change) =>
        selected.includes(change.path),
      ),
    };
    const selectedValidation = await validateParsedProposal({
      parsed: selectedProposal,
      current,
      validators: normalizedValidators,
      clock,
    });
    invariant(
      selectedValidation.status === "passed",
      "OF_AI_PROPOSAL_SELECTION_INVALID",
      "The selected AI proposal files did not pass validation together.",
      { reports: selectedValidation.reports },
    );
    const approvalId = `ai_approval_${crypto.randomUUID().replaceAll("-", "")}`;
    const approval = {
      schemaVersion: 1,
      id: approvalId,
      proposalId,
      baseRevision: currentRevision,
      approvedPaths: selected,
      createdAt: clock().toISOString(),
      actor: safeActor(actor),
      confirmation: `APPLY ${approvalId}`,
    };
    approvals.set(approvalId, {
      approval,
      files: selectedValidation.files,
      changes: selectedProposal.changes,
      currentDigests: stored.currentDigests,
      used: false,
    });
    await writeAudit(audit, "ai.proposal.approved", {
      id: proposalId,
      approvalId,
      approvedPaths: selected,
      actor: approval.actor,
    });
    return structuredClone(approval);
  }

  async function apply({
    approvalId,
    confirmation,
    currentFiles,
    currentRevision,
    applyChanges,
    actor,
  }) {
    const stored = approvals.get(approvalId);
    invariant(
      stored,
      "OF_AI_APPROVAL_NOT_FOUND",
      "The AI proposal approval was not found.",
    );
    invariant(
      !stored.used,
      "OF_AI_APPROVAL_USED",
      "The AI proposal approval has already been used.",
    );
    invariant(
      confirmation === stored.approval.confirmation,
      "OF_AI_APPLY_CONFIRMATION_REQUIRED",
      "Applying an AI proposal requires the exact confirmation phrase.",
    );
    invariant(
      safeActor(actor) === stored.approval.actor,
      "OF_AI_APPROVAL_ACTOR_MISMATCH",
      "The AI proposal must be applied by its approving actor.",
    );
    assertRevision(currentRevision);
    invariant(
      currentRevision === stored.approval.baseRevision &&
        JSON.stringify(digestFiles(parseCurrentFiles(currentFiles))) ===
          JSON.stringify(stored.currentDigests),
      "OF_AI_PROPOSAL_STALE",
      "The project changed after AI proposal approval.",
    );
    invariant(
      typeof applyChanges === "function",
      "OF_AI_APPLIER_REQUIRED",
      "Applying an AI proposal requires an explicit source writer.",
    );

    await writeAudit(audit, "ai.proposal.apply-started", {
      id: stored.approval.proposalId,
      approvalId,
      approvedPaths: stored.approval.approvedPaths,
      actor: stored.approval.actor,
    });
    try {
      const result = await applyChanges({
        proposalId: stored.approval.proposalId,
        approvalId,
        files: structuredClone(stored.files),
        changes: structuredClone(stored.changes),
      });
      stored.used = true;
      await writeAudit(audit, "ai.proposal.applied", {
        id: stored.approval.proposalId,
        approvalId,
        approvedPaths: stored.approval.approvedPaths,
        actor: stored.approval.actor,
      });
      return {
        applied: true,
        proposalId: stored.approval.proposalId,
        approvalId,
        result,
      };
    } catch {
      await writeAudit(audit, "ai.proposal.apply-failed", {
        id: stored.approval.proposalId,
        approvalId,
        approvedPaths: stored.approval.approvedPaths,
        actor: stored.approval.actor,
      });
      throw new AIProposalError(
        "OF_AI_APPLY_FAILED",
        "The approved AI proposal could not be applied.",
      );
    }
  }

  return { validate, approve, apply };
}

export function parseAIProposal(input) {
  invariant(
    input && typeof input === "object" && !Array.isArray(input),
    "OF_AI_PROPOSAL_INVALID",
    "The AI proposal must be an object.",
  );
  invariant(
    input.schemaVersion === 1 &&
      input.intent &&
      typeof input.intent.summary === "string" &&
      input.intent.summary.length > 0 &&
      input.intent.summary.length <= 500 &&
      (input.intent.rationale === undefined ||
        (typeof input.intent.rationale === "string" &&
          input.intent.rationale.length <= 2_000)) &&
      isRevision(input.baseRevision),
    "OF_AI_PROPOSAL_INVALID",
    "The AI proposal intent or revision is invalid.",
  );
  invariant(
    Array.isArray(input.changes) &&
      input.changes.length > 0 &&
      input.changes.length <= 100,
    "OF_AI_PROPOSAL_CHANGES_INVALID",
    "The AI proposal must contain between one and 100 changes.",
  );
  const changes = input.changes.map(parseChange);
  invariant(
    new Set(changes.map(({ path }) => path)).size === changes.length,
    "OF_AI_PROPOSAL_CHANGES_INVALID",
    "An AI proposal cannot change a path more than once.",
  );
  invariant(
    changes.reduce(
      (bytes, change) =>
        bytes + Buffer.byteLength(change.content ?? "", "utf8"),
      0,
    ) <= 2_000_000,
    "OF_AI_PROPOSAL_SIZE_LIMIT",
    "The AI proposal source payload is too large.",
  );
  return {
    schemaVersion: 1,
    intent: {
      summary: input.intent.summary,
      rationale: input.intent.rationale ?? "",
    },
    baseRevision: input.baseRevision,
    changes,
  };
}

async function validateParsedProposal({ parsed, current, validators, clock }) {
  const id = `ai_proposal_${crypto.randomUUID().replaceAll("-", "")}`;
  const reports = [];
  let proposed;
  try {
    proposed = applyChangesToFiles(current, parsed.changes);
  } catch (error) {
    reports.push(failedReport("patch", error));
    return validationResult({ id, parsed, reports, clock });
  }

  const changedPaths = parsed.changes.map(({ path }) => path);
  const formatted = await runFormatter({
    validator: validators.format,
    files: proposed,
    changedPaths,
    current,
  });
  reports.push(formatted.report);
  if (!formatted.report.ok) {
    return validationResult({ id, parsed, reports, clock });
  }
  proposed = formatted.files;

  const security = validateSecurity(proposed, changedPaths);
  reports.push(security);
  if (!security.ok) {
    return validationResult({ id, parsed, reports, clock });
  }
  const compatibility = validateCompatibility(proposed, changedPaths);
  reports.push(compatibility);
  if (!compatibility.ok) {
    return validationResult({ id, parsed, reports, clock });
  }

  await withTemporaryProject(proposed, async (workspacePath) => {
    for (const name of ["lint", "test", "build"]) {
      reports.push(
        await runWorkspaceValidator(
          name,
          validators[name],
          workspacePath,
          changedPaths,
        ),
      );
    }
  });
  const result = validationResult({
    id,
    parsed,
    reports,
    clock,
    files: proposed,
  });
  result.fileDiffs = buildDiffs(current, proposed, changedPaths);
  return result;
}

function parseChange(change) {
  invariant(
    change && typeof change === "object" && !Array.isArray(change),
    "OF_AI_PROPOSAL_CHANGE_INVALID",
    "An AI proposal change is invalid.",
  );
  const normalizedPath = normalizeProjectPath(change.path);
  invariant(
    !PROTECTED_PATHS.some((pattern) => pattern.test(normalizedPath)),
    "OF_AI_PROPOSAL_PATH_PROTECTED",
    "AI proposals cannot modify protected credential or control paths.",
    { path: normalizedPath },
  );
  invariant(
    ["create", "update", "delete"].includes(change.operation),
    "OF_AI_PROPOSAL_CHANGE_INVALID",
    "The AI proposal change operation is invalid.",
  );
  const requiresContent = change.operation !== "delete";
  const requiresDigest = change.operation !== "create";
  invariant(
    (!requiresContent ||
      (typeof change.content === "string" && change.content.length > 0)) &&
      (requiresContent || change.content === undefined) &&
      (!requiresDigest || /^[a-f0-9]{64}$/u.test(change.expectedSha256)) &&
      (requiresDigest || change.expectedSha256 === undefined),
    "OF_AI_PROPOSAL_CHANGE_INVALID",
    "The AI proposal change payload is invalid.",
  );
  return {
    path: normalizedPath,
    operation: change.operation,
    ...(requiresContent ? { content: change.content } : {}),
    ...(requiresDigest ? { expectedSha256: change.expectedSha256 } : {}),
  };
}

function parseCurrentFiles(files) {
  invariant(
    Array.isArray(files),
    "OF_AI_PROJECT_FILES_INVALID",
    "Current project files must be an array.",
  );
  const parsed = files.map((file) => ({
    path: normalizeProjectPath(file?.path),
    source: file?.source,
  }));
  invariant(
    parsed.every(({ source }) => typeof source === "string") &&
      new Set(parsed.map(({ path }) => path)).size === parsed.length,
    "OF_AI_PROJECT_FILES_INVALID",
    "Current project files are invalid or duplicated.",
  );
  return parsed.sort((left, right) => left.path.localeCompare(right.path));
}

function applyChangesToFiles(current, changes) {
  const files = new Map(
    current.map((file) => [file.path, structuredClone(file)]),
  );
  for (const change of changes) {
    const existing = files.get(change.path);
    if (change.operation === "create") {
      invariant(
        !existing,
        "OF_AI_PROPOSAL_PATH_EXISTS",
        "An AI proposal create target already exists.",
        { path: change.path },
      );
      files.set(change.path, { path: change.path, source: change.content });
      continue;
    }
    invariant(
      existing,
      "OF_AI_PROPOSAL_PATH_MISSING",
      "An AI proposal target no longer exists.",
      { path: change.path },
    );
    invariant(
      digest(existing.source) === change.expectedSha256,
      "OF_AI_PROPOSAL_FILE_STALE",
      "An AI proposal target changed after context was captured.",
      { path: change.path },
    );
    if (change.operation === "delete") files.delete(change.path);
    if (change.operation === "update") {
      files.set(change.path, { path: change.path, source: change.content });
    }
  }
  return [...files.values()].sort((left, right) =>
    left.path.localeCompare(right.path),
  );
}

async function runFormatter({ validator, files, changedPaths, current }) {
  try {
    const output = await validator({
      files: structuredClone(files),
      changedPaths: [...changedPaths],
    });
    const formatted = parseCurrentFiles(output?.files ?? output);
    const currentMap = new Map(current.map((file) => [file.path, file.source]));
    const changed = new Set(changedPaths);
    invariant(
      formatted.every(
        (file) =>
          changed.has(file.path) || currentMap.get(file.path) === file.source,
      ) &&
        current.every(
          (file) =>
            changed.has(file.path) ||
            formatted.some(
              (candidate) =>
                candidate.path === file.path &&
                candidate.source === file.source,
            ),
        ),
      "OF_AI_FORMAT_SCOPE_VIOLATION",
      "The formatter changed a file outside the proposal.",
    );
    return {
      files: formatted,
      report: { name: "format", ok: true, diagnostics: [] },
    };
  } catch (error) {
    return { files, report: failedReport("format", error) };
  }
}

function validateSecurity(files, changedPaths) {
  const diagnostics = [];
  const changed = new Set(changedPaths);
  for (const file of files) {
    if (!changed.has(file.path)) continue;
    const secretScan = redactAISecrets(file.source);
    diagnostics.push(
      ...secretScan.findings.map((finding) => ({
        code: "OF_AI_PROPOSAL_SECRET",
        path: file.path,
        line: finding.line,
        kind: finding.kind,
      })),
    );
    const dangerous = [
      ["OF_AI_PROPOSAL_EVAL", /\beval\s*\(/u],
      ["OF_AI_PROPOSAL_FUNCTION_CONSTRUCTOR", /\bnew\s+Function\s*\(/u],
      [
        "OF_AI_PROPOSAL_PROCESS_EXEC",
        /\b(?:exec|execSync|spawn|spawnSync)\s*\(/u,
      ],
    ];
    for (const [code, pattern] of dangerous) {
      if (pattern.test(file.source)) {
        diagnostics.push({ code, path: file.path });
      }
    }
    if (/(?:^|\/)package\.json$/u.test(file.path)) {
      try {
        const packageJson = JSON.parse(file.source);
        const lifecycle = Object.keys(packageJson.scripts ?? {}).filter(
          (name) => /^(?:pre|post)?install$/u.test(name),
        );
        diagnostics.push(
          ...lifecycle.map((name) => ({
            code: "OF_AI_PROPOSAL_INSTALL_SCRIPT",
            path: file.path,
            script: name,
          })),
        );
      } catch {
        diagnostics.push({
          code: "OF_AI_PROPOSAL_JSON_INVALID",
          path: file.path,
        });
      }
    }
  }
  return { name: "security", ok: diagnostics.length === 0, diagnostics };
}

function validateCompatibility(files, changedPaths) {
  const changed = new Set(changedPaths);
  const diagnostics = [];
  let blocked = false;
  for (const file of files) {
    if (!changed.has(file.path) || !SOURCE_EXTENSIONS.test(file.path)) continue;
    const analysis = analyzeSourceCompatibility({
      filePath: file.path,
      source: file.source,
    });
    if (analysis.level === COMPATIBILITY_LEVELS.CODE_ONLY) blocked = true;
    diagnostics.push(
      ...analysis.diagnostics.map((diagnostic) => ({
        ...diagnostic,
        path: file.path,
        severity:
          analysis.level === COMPATIBILITY_LEVELS.CODE_ONLY
            ? "error"
            : "warning",
      })),
    );
  }
  return {
    name: "compatibility",
    ok: !blocked,
    diagnostics,
  };
}

async function runWorkspaceValidator(
  name,
  validator,
  workspacePath,
  changedPaths,
) {
  try {
    const result = await validator({
      workspacePath,
      changedPaths: [...changedPaths],
    });
    invariant(
      result?.ok === true,
      "OF_AI_VALIDATOR_FAILED",
      `The AI proposal ${name} validator failed.`,
    );
    return {
      name,
      ok: true,
      diagnostics: Array.isArray(result.diagnostics)
        ? structuredClone(result.diagnostics)
        : [],
    };
  } catch (error) {
    return failedReport(name, error);
  }
}

function buildDiffs(current, proposed, changedPaths) {
  const before = new Map(current.map((file) => [file.path, file.source]));
  const after = new Map(proposed.map((file) => [file.path, file.source]));
  return changedPaths
    .map((filePath) => ({
      path: filePath,
      patch: createTwoFilesPatch(
        before.has(filePath) ? `a/${filePath}` : "/dev/null",
        after.has(filePath) ? `b/${filePath}` : "/dev/null",
        before.get(filePath) ?? "",
        after.get(filePath) ?? "",
        "",
        "",
        { context: 3 },
      ),
    }))
    .sort((left, right) => left.path.localeCompare(right.path));
}

function validationResult({ id, parsed, reports, clock, files = [] }) {
  return {
    schemaVersion: 1,
    id,
    status: reports.every(({ ok }) => ok) ? "passed" : "failed",
    baseRevision: parsed.baseRevision,
    intent: structuredClone(parsed.intent),
    changedPaths: parsed.changes.map(({ path }) => path),
    reports: structuredClone(reports),
    fileDiffs: [],
    files,
    createdAt: clock().toISOString(),
  };
}

function publicValidation(result) {
  const metadata = structuredClone(result);
  delete metadata.files;
  return metadata;
}

function parseValidators(validators) {
  invariant(
    validators &&
      ["format", "lint", "test", "build"].every(
        (name) => typeof validators[name] === "function",
      ),
    "OF_AI_VALIDATORS_REQUIRED",
    "AI proposals require format, lint, test, and build validators.",
  );
  return validators;
}

function parseApprovedPaths(paths, changes) {
  invariant(
    Array.isArray(paths) && paths.length > 0,
    "OF_AI_APPROVED_PATHS_INVALID",
    "At least one AI proposal file must be approved.",
  );
  const normalized = paths.map(normalizeProjectPath);
  const available = new Set(changes.map(({ path }) => path));
  invariant(
    new Set(normalized).size === normalized.length &&
      normalized.every((path) => available.has(path)),
    "OF_AI_APPROVED_PATHS_INVALID",
    "Approved paths must be unique proposal paths.",
  );
  return normalized.sort();
}

function digestFiles(files) {
  return files.map((file) => ({
    path: file.path,
    sha256: digest(file.source),
  }));
}

function digest(value) {
  return createHash("sha256").update(value, "utf8").digest("hex");
}

function failedReport(name, error) {
  return {
    name,
    ok: false,
    diagnostics: [
      {
        code: error?.code ?? "OF_AI_VALIDATOR_FAILED",
        message: `The AI proposal ${name} stage failed.`,
      },
    ],
  };
}

function assertRevision(revision) {
  invariant(
    isRevision(revision),
    "OF_AI_REVISION_INVALID",
    "The project revision is invalid.",
  );
}

function isRevision(revision) {
  return (
    (typeof revision === "string" && REVISION.test(revision)) ||
    (Number.isSafeInteger(revision) && revision >= 0)
  );
}

function safeActor(actor) {
  invariant(
    typeof actor === "string" && /^[a-zA-Z0-9._:@/-]{1,160}$/u.test(actor),
    "OF_AI_ACTOR_INVALID",
    "The AI proposal actor is invalid.",
  );
  return actor;
}

async function writeAudit(audit, action, value) {
  await audit({
    action,
    proposalId: value.id,
    approvalId: value.approvalId ?? null,
    status: value.status ?? null,
    changedPaths: value.changedPaths ?? value.approvedPaths ?? [],
    actor: value.actor ?? null,
  });
}

export class AIProposalError extends Error {
  constructor(code, message) {
    super(message);
    this.name = "AIProposalError";
    this.code = code;
  }
}
