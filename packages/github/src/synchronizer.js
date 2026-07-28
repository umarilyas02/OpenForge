import { randomUUID } from "node:crypto";

import { withTemporaryProject } from "@openforge/compiler";
import { createAuditEvent } from "@openforge/integration-security";

import { invariant } from "./errors.js";
import {
  assertPushTarget,
  createMemoryPushConfirmationStore,
} from "./push-confirmation.js";
import {
  diffSourceFiles,
  normalizeSourceFiles,
  sourceFilesHash,
} from "./source-diff.js";
import { createMemoryGitSyncStore } from "./sync-store.js";
import { mergeSourceFiles } from "./three-way-merge.js";
import {
  normalizeBranch,
  normalizeRepositoryCoordinates,
} from "./validation.js";

export function createGitSynchronizer({
  transport,
  vault,
  store = createMemoryGitSyncStore(),
  confirmations = createMemoryPushConfirmationStore(),
  validate = async () => ({ valid: true, diagnostics: [] }),
  audit = async () => {},
  clock = () => new Date(),
}) {
  async function withConnection(connection, consume) {
    assertConnection(connection);
    return vault.withSecret(
      connection.accessTokenRef,
      {
        provider: "github",
        connectionId: connection.identityId,
        name: "user-access-token",
      },
      consume,
    );
  }

  async function initialize({ connection, files, remoteSha }) {
    const normalized = normalizeSourceFiles(files);
    const sha = remoteSha ?? connection.branch.sha;
    invariant(
      isCommitSha(sha),
      "OF_GITHUB_SYNC_SHA_INVALID",
      "A remote commit SHA is required to initialize synchronization.",
    );
    const state = {
      connectionId: connection.id,
      baseSha: sha,
      baseFiles: normalized,
      updatedAt: clock().toISOString(),
    };
    await store.putState(connection.id, state);
    return publicState(state);
  }

  async function status({ connection, localHeadSha }) {
    const remote = await withConnection(connection, (token) =>
      transport.getRef({
        token,
        repository: connection.repository,
        branch: connection.branch.name,
      }),
    );
    if (!localHeadSha || localHeadSha === remote.sha) {
      return {
        localHeadSha: localHeadSha ?? remote.sha,
        remoteHeadSha: remote.sha,
        ahead: 0,
        behind: 0,
        diverged: false,
      };
    }
    invariant(
      isCommitSha(localHeadSha),
      "OF_GITHUB_SYNC_SHA_INVALID",
      "The local commit SHA is invalid.",
    );
    const comparison = await withConnection(connection, (token) =>
      transport.compareCommits({
        token,
        repository: connection.repository,
        base: remote.sha,
        head: localHeadSha,
      }),
    );
    return {
      localHeadSha,
      remoteHeadSha: remote.sha,
      ahead: comparison.aheadBy,
      behind: comparison.behindBy,
      diverged: comparison.aheadBy > 0 && comparison.behindBy > 0,
    };
  }

  async function preparePush({
    connection,
    files,
    baseSha,
    message,
    requestId,
  }) {
    const normalized = normalizeSourceFiles(files);
    const target = connectionTarget(connection);
    assertCommitMessage(message);
    invariant(
      isCommitSha(baseSha),
      "OF_GITHUB_SYNC_SHA_INVALID",
      "The push base SHA is invalid.",
    );
    const remote = await withConnection(connection, (token) =>
      transport.getRef({
        token,
        repository: connection.repository,
        branch: target.branch,
      }),
    );
    invariant(
      remote.sha === baseSha,
      "OF_GITHUB_REMOTE_CHANGED",
      "The remote branch changed before push preparation.",
      { expected: baseSha, actual: remote.sha },
    );
    const remoteFiles = await withConnection(connection, (token) =>
      transport.getRepositoryFiles({
        token,
        repository: connection.repository,
        branch: target.branch,
      }),
    );
    const changes = diffSourceFiles(remoteFiles, normalized);
    invariant(
      changes.length > 0,
      "OF_GITHUB_PUSH_EMPTY",
      "There are no source changes to push.",
    );
    invariant(
      !changes.some(({ path }) => path.startsWith(".github/workflows/")),
      "OF_GITHUB_WORKFLOW_SCOPE_REQUIRED",
      "Workflow changes require a separately approved GitHub Workflows permission.",
    );
    const validation = await withTemporaryProject(normalized, () =>
      validate(normalized),
    );
    invariant(
      validation?.valid === true,
      "OF_GITHUB_PUSH_VALIDATION_FAILED",
      "Project validation failed before push.",
      { diagnostics: validation?.diagnostics ?? [] },
    );
    const plan = {
      id: `push_${randomUUID().replaceAll("-", "")}`,
      connectionId: connection.id,
      target,
      baseSha,
      files: normalized,
      filesHash: sourceFilesHash(normalized),
      changes,
      message,
      requestId,
      preparedAt: clock().toISOString(),
    };
    const confirmationToken = await confirmations.issue(plan);
    return {
      id: plan.id,
      target,
      baseSha,
      filesHash: plan.filesHash,
      changes,
      message,
      validation,
      confirmationToken,
      expiresInSeconds: 600,
    };
  }

  async function push({
    connection,
    confirmationToken,
    confirmedTarget,
    requestId,
  }) {
    const plan = await confirmations.consume(confirmationToken);
    invariant(
      plan && plan.connectionId === connection.id,
      "OF_GITHUB_PUSH_CONFIRMATION_REJECTED",
      "The push confirmation is invalid, expired, or already used.",
    );
    assertPushTarget(plan.target, confirmedTarget);
    invariant(
      plan.filesHash === sourceFilesHash(plan.files),
      "OF_GITHUB_PUSH_PLAN_TAMPERED",
      "The prepared push content no longer matches its digest.",
    );
    const targetBranch = await withConnection(connection, (token) =>
      transport.getBranch({
        token,
        repository: connection.repository,
        branch: plan.target.branch,
      }),
    );
    invariant(
      targetBranch && targetBranch.sha === plan.baseSha,
      "OF_GITHUB_REMOTE_CHANGED",
      "The remote branch changed after push confirmation.",
    );

    let result;
    if (targetBranch.protected) {
      const featureBranch = featureBranchName(plan.message, clock());
      result = await withConnection(connection, async (token) => {
        await transport.createBranch({
          token,
          repository: connection.repository,
          branch: featureBranch,
          sha: plan.baseSha,
        });
        const commit = await transport.createCommit({
          token,
          repository: connection.repository,
          branch: featureBranch,
          baseSha: plan.baseSha,
          message: plan.message,
          files: plan.files,
          changes: plan.changes,
        });
        const pullRequest = await transport.createPullRequest({
          token,
          repository: connection.repository,
          title: plan.message,
          body: "Prepared and validated by OpenForge.",
          head: featureBranch,
          base: plan.target.branch,
        });
        return {
          mode: "pull-request",
          commit,
          featureBranch,
          pullRequest,
        };
      });
    } else {
      result = await withConnection(connection, async (token) => ({
        mode: "direct",
        commit: await transport.createCommit({
          token,
          repository: connection.repository,
          branch: plan.target.branch,
          baseSha: plan.baseSha,
          message: plan.message,
          files: plan.files,
          changes: plan.changes,
        }),
      }));
    }
    await store.putState(connection.id, {
      connectionId: connection.id,
      baseSha: result.commit.sha,
      baseFiles: plan.files,
      updatedAt: clock().toISOString(),
    });
    await audit(
      createAuditEvent(
        {
          action: "github.repository.push",
          actor: { id: connection.identityId },
          target: plan.target,
          outcome: "success",
          requestId: requestId ?? plan.requestId,
          details: {
            mode: result.mode,
            changeCount: plan.changes.length,
            commitSha: result.commit.sha,
            pullRequestNumber: result.pullRequest?.number ?? null,
          },
        },
        { clock },
      ),
    );
    return result;
  }

  async function preparePull({ connection, localFiles }) {
    const state = await store.getState(connection.id);
    invariant(
      state,
      "OF_GITHUB_SYNC_NOT_INITIALIZED",
      "Git synchronization must be initialized before pulling.",
    );
    const remote = await withConnection(connection, (token) =>
      transport.getRef({
        token,
        repository: connection.repository,
        branch: connection.branch.name,
      }),
    );
    const remoteFiles = await withConnection(connection, (token) =>
      transport.getRepositoryFiles({
        token,
        repository: connection.repository,
        branch: connection.branch.name,
      }),
    );
    const merge = mergeSourceFiles({
      baseFiles: state.baseFiles,
      localFiles,
      remoteFiles,
    });
    const pull = {
      id: `pull_${randomUUID().replaceAll("-", "")}`,
      connectionId: connection.id,
      remoteSha: remote.sha,
      remoteFiles: normalizeSourceFiles(remoteFiles),
      mergedFiles: merge.files,
      conflicts: merge.conflicts,
      previewHash: sourceFilesHash(merge.files),
    };
    await store.putPull(pull);
    return {
      id: pull.id,
      remoteSha: pull.remoteSha,
      files: pull.mergedFiles,
      conflicts: pull.conflicts,
      clean: merge.clean,
      previewHash: pull.previewHash,
    };
  }

  async function applyPull({
    connection,
    pullId,
    previewHash,
    apply,
    requestId,
  }) {
    const pull = await store.consumePull(pullId);
    invariant(
      pull &&
        pull.connectionId === connection.id &&
        pull.previewHash === previewHash,
      "OF_GITHUB_PULL_PREVIEW_REJECTED",
      "The pull preview is invalid, stale, or already applied.",
    );
    invariant(
      pull.conflicts.length === 0,
      "OF_GITHUB_PULL_CONFLICTS",
      "Conflicting files must be resolved in code mode before applying.",
      { conflicts: pull.conflicts.map(({ path, kind }) => ({ path, kind })) },
    );
    invariant(
      typeof apply === "function",
      "OF_GITHUB_PULL_APPLIER_REQUIRED",
      "A workspace apply callback is required.",
    );
    const result = await withTemporaryProject(pull.mergedFiles, () =>
      apply(structuredClone(pull.mergedFiles)),
    );
    await store.putState(connection.id, {
      connectionId: connection.id,
      baseSha: pull.remoteSha,
      baseFiles: pull.remoteFiles,
      updatedAt: clock().toISOString(),
    });
    await audit(
      createAuditEvent(
        {
          action: "github.repository.pull",
          actor: { id: connection.identityId },
          target: connectionTarget(connection),
          outcome: "success",
          requestId,
          details: {
            remoteSha: pull.remoteSha,
            fileCount: pull.mergedFiles.length,
          },
        },
        { clock },
      ),
    );
    return { remoteSha: pull.remoteSha, result };
  }

  return {
    initialize,
    status,
    preparePush,
    push,
    preparePull,
    applyPull,
  };
}

function assertConnection(connection) {
  invariant(
    connection?.provider !== "vercel" &&
      typeof connection?.id === "string" &&
      typeof connection?.identityId === "string" &&
      /^secret_[a-f0-9]{32}$/u.test(connection?.accessTokenRef) &&
      connection?.repository &&
      connection?.branch,
    "OF_GITHUB_CONNECTION_INVALID",
    "A complete GitHub repository connection is required.",
  );
}

function connectionTarget(connection) {
  const repository = normalizeRepositoryCoordinates(connection.repository);
  return {
    ...repository,
    branch: normalizeBranch(connection.branch.name),
  };
}

function publicState(state) {
  return {
    connectionId: state.connectionId,
    baseSha: state.baseSha,
    fileCount: state.baseFiles.length,
    filesHash: sourceFilesHash(state.baseFiles),
    updatedAt: state.updatedAt,
  };
}

function isCommitSha(value) {
  return typeof value === "string" && /^[a-f0-9]{7,64}$/u.test(value);
}

function assertCommitMessage(message) {
  invariant(
    typeof message === "string" &&
      message.trim() === message &&
      message.length >= 3 &&
      message.length <= 200 &&
      !/[\r\n]/u.test(message),
    "OF_GITHUB_COMMIT_MESSAGE_INVALID",
    "The commit message must be a single trimmed line.",
  );
}

function featureBranchName(message, date) {
  const slug =
    message
      .toLowerCase()
      .replace(/[^a-z0-9]+/gu, "-")
      .replace(/^-|-$/gu, "")
      .slice(0, 40) || "update";
  const stamp = date.toISOString().replace(/\D/gu, "").slice(0, 14);
  return `openforge/${stamp}-${slug}`;
}
