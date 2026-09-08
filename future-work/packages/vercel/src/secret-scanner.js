import { createHash } from "node:crypto";

const PATTERNS = Object.freeze([
  {
    type: "private-key",
    severity: "block",
    pattern: /-----BEGIN (?:[A-Z ]+ )?PRIVATE KEY-----/gu,
  },
  {
    type: "github-token",
    severity: "block",
    pattern: /\bgh[opsur]_[a-zA-Z0-9]{20,}\b/gu,
  },
  {
    type: "aws-access-key",
    severity: "block",
    pattern: /\bAKIA[0-9A-Z]{16}\b/gu,
  },
  {
    type: "credential-url",
    severity: "block",
    pattern: /\b[a-z][a-z0-9+.-]*:\/\/[^/\s:@]+:[^/\s@]+@[^/\s]+/giu,
  },
  {
    type: "assigned-secret",
    severity: "block",
    pattern:
      /\b(?:VERCEL_TOKEN|DATABASE_URL|AUTH_SECRET|API_SECRET)\s*[:=]\s*["'][^"'\r\n]{8,}["']/gu,
  },
]);

export function scanSourceSecrets(files) {
  const findings = [];
  for (const file of files) {
    if (
      typeof file?.path !== "string" ||
      typeof file?.source !== "string" ||
      file.source.length > 2 * 1024 * 1024
    ) {
      continue;
    }
    for (const definition of PATTERNS) {
      for (const match of file.source.matchAll(definition.pattern)) {
        const location = locate(file.source, match.index);
        findings.push({
          path: file.path,
          line: location.line,
          column: location.column,
          type: definition.type,
          severity: definition.severity,
          fingerprint: createHash("sha256")
            .update(`${definition.type}:${match[0]}`)
            .digest("hex")
            .slice(0, 16),
        });
      }
    }
  }
  return findings.sort(
    (left, right) =>
      left.path.localeCompare(right.path) ||
      left.line - right.line ||
      left.column - right.column ||
      left.type.localeCompare(right.type),
  );
}

function locate(source, index) {
  const before = source.slice(0, index);
  const lines = before.split(/\r?\n/u);
  return {
    line: lines.length,
    column: lines.at(-1).length + 1,
  };
}
