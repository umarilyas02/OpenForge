import { createHash, randomUUID } from "node:crypto";

import {
  assertLeastPrivilege,
  createAuditEvent,
  createIdempotencyExecutor,
  redactAuditValue,
} from "@openforge/integration-security";

import { createMemoryDeploymentStore } from "./deployment-store.js";
import { invariant } from "./errors.js";
import {
  assertPromotionTarget,
  createPromotionConfirmations,
} from "./promotion-confirmation.js";
import {
  normalizeDeploymentStatus,
  sanitizeDeploymentEvents,
} from "./safe-deployment-output.js";
import { scanSourceSecrets } from "./secret-scanner.js";

export const VERCEL_DEPLOYMENT_OPERATIONS = Object.freeze([
  "deployment:create",
]);

export function createVercelDeploymentManager({
  transport,
  vault,
  grantedScopes,
  authorizedOperations = VERCEL_DEPLOYMENT_OPERATIONS,
  store = createMemoryDeploymentStore(),
  executeIdempotently = createIdempotencyExecutor(),
  validate = async () => ({ valid: true, diagnostics: [] }),
  audit = async () => {},
  clock = () => new Date(),
}) {
  assertLeastPrivilege("vercel", authorizedOperations, grantedScopes);
  const promotions = createPromotionConfirmations({
    store,
    clock: () => clock().getTime(),
  });

  async function preflight({
    connection,
    source,
    files,
    requiredEnvironmentKeys = [],
  }) {
    assertConnection(connection);
    const normalizedFiles = normalizeDeploymentFiles(files);
    const normalizedSource = normalizeDeploymentSource(source);
    const filesHash = hashFiles(normalizedFiles);
    const findings = scanSourceSecrets(normalizedFiles);
    const validation = await validate(normalizedFiles);
    const environment = await withConnection(connection, (token) =>
      transport.listEnvironmentVariables({
        token,
        teamId: connection.teamId,
        projectId: connection.vercelProject.id,
      }),
    );
    const previewKeys = new Set(
      environment
        .filter(({ targets }) => targets.includes("preview"))
        .map(({ key }) => key),
    );
    invariant(
      Array.isArray(requiredEnvironmentKeys) &&
        requiredEnvironmentKeys.every(
          (key) =>
            typeof key === "string" &&
            /^[a-zA-Z_][a-zA-Z0-9_]{0,255}$/u.test(key),
        ),
      "OF_VERCEL_REQUIRED_ENV_INVALID",
      "Required environment names are invalid.",
    );
    const missingEnvironmentKeys = [...new Set(requiredEnvironmentKeys)]
      .filter((key) => !previewKeys.has(key))
      .sort();
    const repositoryMismatch =
      connection.vercelProject.gitRepository?.type === "github" &&
      connection.vercelProject.gitRepository.repo !== normalizedSource.repo;
    const checks = {
      validation: validation?.valid === true,
      secrets: findings.length === 0,
      environment: missingEnvironmentKeys.length === 0,
      repository: !repositoryMismatch,
    };
    return {
      ready: Object.values(checks).every(Boolean),
      checks,
      validation: {
        valid: validation?.valid === true,
        diagnostics: sanitizeDiagnostics(validation?.diagnostics),
      },
      secretFindings: findings,
      missingEnvironmentKeys,
      source: normalizedSource,
      filesHash,
    };
  }

  async function createPreview({
    idempotencyKey,
    connection,
    source,
    files,
    requiredEnvironmentKeys,
    requestId,
  }) {
    const check = await preflight({
      connection,
      source,
      files,
      requiredEnvironmentKeys,
    });
    invariant(
      check.ready,
      "OF_VERCEL_PREFLIGHT_FAILED",
      "Preview deployment preflight checks failed.",
      {
        checks: check.checks,
        validationDiagnostics: check.validation.diagnostics,
        secretFindings: check.secretFindings,
        missingEnvironmentKeys: check.missingEnvironmentKeys,
      },
    );
    return executeIdempotently(
      {
        key: idempotencyKey,
        operation: "vercel:deployment:preview",
        input: {
          connectionId: connection.id,
          projectId: connection.vercelProject.id,
          source: check.source,
          filesHash: check.filesHash,
          requiredEnvironmentKeys: [...new Set(requiredEnvironmentKeys)].sort(),
        },
      },
      async () => {
        const deployment = await withConnection(connection, (token) =>
          transport.createDeployment({
            token,
            teamId: connection.teamId,
            project: connection.vercelProject,
            source: check.source,
            target: "preview",
          }),
        );
        const status = normalizeDeploymentStatus(deployment);
        const job = {
          id: `deployment_job_${randomUUID().replaceAll("-", "")}`,
          connectionId: connection.id,
          deploymentId: status.id,
          source: check.source,
          target: "preview",
          status,
          createdAt: clock().toISOString(),
        };
        await store.putJob(job);
        await audit(
          createAuditEvent(
            {
              action: "vercel.deployment.preview",
              actor: { installationId: connection.installationId },
              target: {
                projectId: connection.projectId,
                vercelProjectId: connection.vercelProject.id,
                deploymentId: status.id,
              },
              outcome: "success",
              requestId,
              details: { source: check.source, status: status.status },
            },
            { clock },
          ),
        );
        return publicJob(job);
      },
    );
  }

  async function refresh({ connection, jobId }) {
    const job = await requireJob(store, connection, jobId);
    const deployment = await withConnection(connection, (token) =>
      transport.getDeployment({
        token,
        teamId: connection.teamId,
        deploymentId: job.deploymentId,
      }),
    );
    const status = normalizeDeploymentStatus(deployment);
    const updated = await store.updateJob(job.id, { status });
    return publicJob(updated);
  }

  async function logs({ connection, jobId }) {
    const job = await requireJob(store, connection, jobId);
    const events = await withConnection(connection, (token) =>
      transport.getDeploymentEvents({
        token,
        teamId: connection.teamId,
        deploymentId: job.deploymentId,
      }),
    );
    return sanitizeDeploymentEvents(events);
  }

  async function prepareProduction({ connection, jobId }) {
    const refreshed = await refresh({ connection, jobId });
    invariant(
      refreshed.target === "preview" && refreshed.status.status === "ready",
      "OF_VERCEL_PROMOTION_NOT_READY",
      "Only a ready Preview deployment can be prepared for Production.",
    );
    const job = await requireJob(store, connection, jobId);
    const target = {
      projectId: connection.vercelProject.id,
      deploymentId: job.deploymentId,
      environment: "production",
    };
    const confirmationToken = await promotions.issue({
      id: `promotion_${randomUUID().replaceAll("-", "")}`,
      connectionId: connection.id,
      target,
      source: job.source,
      previewUrl: refreshed.status.url,
      preparedAt: clock().toISOString(),
    });
    return {
      target,
      source: job.source,
      previewUrl: refreshed.status.url,
      confirmationToken,
      warning:
        "Production uses Production environment variables and can affect live traffic.",
      expiresInSeconds: 600,
    };
  }

  async function promote({
    connection,
    confirmationToken,
    confirmedTarget,
    requestId,
  }) {
    const confirmation = await promotions.get(confirmationToken);
    const plan = confirmation.plan;
    invariant(
      plan.connectionId === connection.id,
      "OF_VERCEL_PROMOTION_CONFIRMATION_REJECTED",
      "The production confirmation belongs to another connection.",
    );
    assertPromotionTarget(plan.target, confirmedTarget);
    return executeIdempotently(
      {
        key: confirmationToken,
        operation: "vercel:deployment:production",
        input: plan,
      },
      async () => {
        const preview = await withConnection(connection, (token) =>
          transport.getDeployment({
            token,
            teamId: connection.teamId,
            deploymentId: plan.target.deploymentId,
          }),
        );
        const previewStatus = normalizeDeploymentStatus(preview);
        invariant(
          previewStatus.status === "ready" &&
            previewStatus.target === "preview",
          "OF_VERCEL_PROMOTION_NOT_READY",
          "The confirmed Preview deployment is no longer ready.",
        );
        const production = await withConnection(connection, (token) =>
          transport.createDeployment({
            token,
            teamId: connection.teamId,
            project: connection.vercelProject,
            source: plan.source,
            target: "production",
          }),
        );
        const status = normalizeDeploymentStatus(production);
        const job = {
          id: `deployment_job_${randomUUID().replaceAll("-", "")}`,
          connectionId: connection.id,
          deploymentId: status.id,
          source: plan.source,
          target: "production",
          promotedFrom: plan.target.deploymentId,
          status,
          createdAt: clock().toISOString(),
        };
        await store.putJob(job);
        await promotions.markUsed(confirmationToken);
        await audit(
          createAuditEvent(
            {
              action: "vercel.deployment.production",
              actor: { installationId: connection.installationId },
              target: {
                projectId: connection.projectId,
                vercelProjectId: connection.vercelProject.id,
                deploymentId: status.id,
              },
              outcome: "success",
              requestId,
              details: {
                source: plan.source,
                promotedFrom: plan.target.deploymentId,
                status: status.status,
              },
            },
            { clock },
          ),
        );
        return publicJob(job);
      },
    );
  }

  async function withConnection(connection, consume) {
    assertConnection(connection);
    return vault.withSecret(
      connection.accessTokenRef,
      {
        provider: "vercel",
        connectionId: connection.installationId,
        name: "integration-access-token",
      },
      consume,
    );
  }

  return {
    preflight,
    createPreview,
    refresh,
    logs,
    prepareProduction,
    promote,
  };
}

function normalizeDeploymentSource(source) {
  invariant(
    source?.type === "github" &&
      /^[a-zA-Z0-9_.-]{1,100}\/[a-zA-Z0-9_.-]{1,100}$/u.test(source.repo) &&
      typeof source.ref === "string" &&
      source.ref.length >= 1 &&
      source.ref.length <= 255 &&
      !source.ref.startsWith("/") &&
      !source.ref.includes("\\") &&
      !source.ref.includes("..") &&
      !source.ref.includes("@{") &&
      /^[a-f0-9]{7,64}$/u.test(source.sha) &&
      (Number.isSafeInteger(source.repoId) ||
        (typeof source.repoId === "string" &&
          /^[a-zA-Z0-9_-]{1,100}$/u.test(source.repoId))),
    "OF_VERCEL_DEPLOYMENT_SOURCE_INVALID",
    "A precise GitHub repository, ref, repository ID, and commit SHA are required.",
  );
  return {
    type: "github",
    repo: source.repo,
    repoId: source.repoId,
    ref: source.ref,
    sha: source.sha,
  };
}

function assertConnection(connection) {
  invariant(
    connection?.provider === "vercel" &&
      /^secret_[a-f0-9]{32}$/u.test(connection.accessTokenRef) &&
      connection.vercelProject?.id,
    "OF_VERCEL_CONNECTION_INVALID",
    "A complete Vercel project connection is required.",
  );
}

async function requireJob(store, connection, id) {
  const job = await store.getJob(id);
  invariant(
    job && job.connectionId === connection.id,
    "OF_VERCEL_DEPLOYMENT_JOB_NOT_FOUND",
    "The deployment job was not found for this connection.",
  );
  return job;
}

function publicJob(job) {
  return {
    id: job.id,
    deploymentId: job.deploymentId,
    target: job.target,
    source: job.source,
    promotedFrom: job.promotedFrom ?? null,
    status: job.status,
    createdAt: job.createdAt,
  };
}

function hashFiles(files) {
  return createHash("sha256").update(JSON.stringify(files)).digest("hex");
}

function normalizeDeploymentFiles(files) {
  invariant(
    Array.isArray(files) && files.length > 0 && files.length <= 5000,
    "OF_VERCEL_DEPLOYMENT_FILES_INVALID",
    "Deployment source files must be a non-empty bounded array.",
  );
  let totalBytes = 0;
  const normalized = files
    .map((file) => {
      const segments =
        typeof file?.path === "string" ? file.path.split("/") : [];
      const bytes =
        typeof file?.source === "string"
          ? Buffer.byteLength(file.source, "utf8")
          : 0;
      invariant(
        typeof file?.path === "string" &&
          file.path.length >= 1 &&
          file.path.length <= 500 &&
          typeof file?.source === "string" &&
          bytes <= 2 * 1024 * 1024 &&
          !file.path.startsWith("/") &&
          !file.path.includes("\\") &&
          segments.every(
            (segment) =>
              segment.length > 0 && ![".", "..", ".git"].includes(segment),
          ),
        "OF_VERCEL_DEPLOYMENT_FILE_INVALID",
        "A deployment source file is invalid or too large.",
      );
      totalBytes += bytes;
      return { path: file.path, source: file.source };
    })
    .sort((left, right) => left.path.localeCompare(right.path));
  invariant(
    totalBytes <= 50 * 1024 * 1024 &&
      new Set(normalized.map(({ path }) => path)).size === normalized.length,
    "OF_VERCEL_DEPLOYMENT_FILES_INVALID",
    "Deployment source files exceed limits or contain duplicate paths.",
  );
  return normalized;
}

function sanitizeDiagnostics(diagnostics) {
  if (!Array.isArray(diagnostics)) return [];
  return diagnostics.slice(0, 100).map((diagnostic) => ({
    code:
      typeof diagnostic?.code === "string" &&
      /^[A-Z0-9_:-]{1,100}$/u.test(diagnostic.code)
        ? diagnostic.code
        : "VALIDATION_ERROR",
    message: redactAuditValue(
      typeof diagnostic?.message === "string"
        ? diagnostic.message.slice(0, 1000)
        : "Project validation failed.",
    ),
    path:
      typeof diagnostic?.path === "string"
        ? diagnostic.path.slice(0, 500)
        : null,
  }));
}
