import { redactAuditValue } from "@openforge/integration-security";

const PUBLIC_STATUS = Object.freeze({
  BUILDING: "building",
  CANCELED: "canceled",
  CANCELLED: "canceled",
  ERROR: "failed",
  INITIALIZING: "queued",
  QUEUED: "queued",
  READY: "ready",
});

export function normalizeDeploymentStatus(deployment) {
  const providerStatus =
    deployment.readyState ?? deployment.status ?? "INITIALIZING";
  const status =
    PUBLIC_STATUS[String(providerStatus).toUpperCase()] ?? "queued";
  return {
    id: deployment.id,
    status,
    target: deployment.target ?? "preview",
    url: safeDeploymentUrl(deployment.url),
    createdAt: deployment.createdAt ?? null,
    readyAt: deployment.readyAt ?? null,
    error:
      status === "failed" ? safeDeploymentError(deployment.errorCode) : null,
  };
}

export function sanitizeDeploymentEvents(events, { limit = 100 } = {}) {
  return events.slice(0, limit).map((event) => ({
    type: safeEventType(event.type),
    createdAt: event.createdAt ?? null,
    text: sanitizeLogText(event.text ?? ""),
    statusCode:
      Number.isInteger(event.statusCode) &&
      event.statusCode >= 100 &&
      event.statusCode <= 599
        ? event.statusCode
        : null,
  }));
}

export function sanitizeLogText(value) {
  const input = typeof value === "string" ? value : String(value);
  return redactAuditValue(input)
    .replace(
      /\b([a-z][a-z0-9+.-]*:\/\/)([^/\s:@]+):([^/\s@]+)@/giu,
      "$1[REDACTED]@",
    )
    .replace(
      /\b([A-Z][A-Z0-9_]*(?:TOKEN|SECRET|PASSWORD|KEY|URL))=([^\s]+)/gu,
      "$1=[REDACTED]",
    )
    .slice(0, 2000);
}

export function safeDeploymentUrl(value) {
  if (!value) return null;
  try {
    const url = new URL(
      value.startsWith("http://") || value.startsWith("https://")
        ? value
        : `https://${value}`,
    );
    if (
      url.protocol !== "https:" ||
      url.username ||
      url.password ||
      !/^[a-z0-9.-]+$/u.test(url.hostname) ||
      !url.hostname.includes(".") ||
      url.hostname.startsWith(".") ||
      url.hostname.endsWith(".")
    ) {
      return null;
    }
    url.pathname = "/";
    url.search = "";
    url.hash = "";
    return url.toString().replace(/\/$/u, "");
  } catch {
    return null;
  }
}

function safeDeploymentError(code) {
  const known = {
    BUILD_FAILED: "The project build failed. Review the sanitized build logs.",
    DEPLOYMENT_BLOCKED:
      "Vercel blocked the deployment because a project policy was not satisfied.",
    INTEGRATION_CONFIGURATION_DISABLED:
      "The Vercel integration is disabled and must be re-enabled.",
  };
  const normalizedCode =
    typeof code === "string" && /^[A-Z0-9_:-]{1,100}$/u.test(code)
      ? code
      : "DEPLOYMENT_FAILED";
  return {
    code: normalizedCode,
    message:
      known[normalizedCode.toUpperCase()] ??
      "The deployment failed. Review the sanitized build logs.",
  };
}

function safeEventType(value) {
  const type = String(value ?? "stdout");
  return [
    "command",
    "stdout",
    "stderr",
    "exit",
    "deployment-state",
    "fatal",
    "delimiter",
  ].includes(type)
    ? type
    : "stdout";
}
