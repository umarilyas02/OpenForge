import { randomUUID } from "node:crypto";

import { createAuditEvent } from "@openforge/integration-security";

import { invariant } from "./errors.js";
import { createMemoryVercelStateStore } from "./installation-state.js";
import { normalizeNextUrl, normalizeVercelId } from "./validation.js";

export function createVercelInstallation({
  integrationSlug,
  clientId,
  clientSecretRef,
  redirectUri,
  vault,
  transport,
  stateStore = createMemoryVercelStateStore(),
  audit = async () => {},
  clock = () => new Date(),
}) {
  invariant(
    /^[a-z0-9-]{2,100}$/u.test(integrationSlug),
    "OF_VERCEL_INTEGRATION_SLUG_INVALID",
    "The Vercel integration slug is invalid.",
  );
  invariant(
    typeof clientId === "string" && clientId.length >= 8,
    "OF_VERCEL_CLIENT_ID_INVALID",
    "A Vercel integration client ID is required.",
  );
  invariant(
    /^secret_[a-f0-9]{32}$/u.test(clientSecretRef),
    "OF_VERCEL_CLIENT_SECRET_REF_INVALID",
    "A Vercel integration client-secret reference is required.",
  );
  const callback = new URL(redirectUri);
  invariant(
    callback.protocol === "https:" ||
      (callback.protocol === "http:" && callback.hostname === "localhost"),
    "OF_VERCEL_REDIRECT_URI_INVALID",
    "The Vercel callback must use HTTPS, except on localhost.",
  );

  return {
    async begin({ projectId, returnTo = "/" }) {
      normalizeVercelId(projectId, "OpenForge project ID");
      invariant(
        typeof returnTo === "string" &&
          returnTo.startsWith("/") &&
          !returnTo.startsWith("//") &&
          !returnTo.includes("\\"),
        "OF_VERCEL_RETURN_TO_INVALID",
        "The post-installation return path is invalid.",
      );
      const state = await stateStore.issue({ projectId, returnTo });
      const url = new URL(
        `/integrations/${integrationSlug}/new`,
        "https://vercel.com",
      );
      url.searchParams.set("state", state);
      url.searchParams.set("source", "external");
      return { installationUrl: url.toString(), state };
    },

    async complete({ code, state, teamId, configurationId, next, requestId }) {
      invariant(
        typeof code === "string" && /^[a-zA-Z0-9_-]{8,512}$/u.test(code),
        "OF_VERCEL_INSTALLATION_CODE_INVALID",
        "The Vercel installation code is invalid.",
      );
      const context = await stateStore.consume(state);
      invariant(
        context,
        "OF_VERCEL_INSTALLATION_STATE_REJECTED",
        "The Vercel installation state is invalid, expired, or already used.",
      );
      const normalizedConfigurationId = normalizeVercelId(
        configurationId,
        "configuration ID",
      );
      const normalizedNext = normalizeNextUrl(next);
      const installationId = `vercel_installation_${randomUUID().replaceAll("-", "")}`;
      const exchanged = await vault.withSecret(
        clientSecretRef,
        { provider: "vercel", name: "integration-client-secret" },
        (clientSecret) =>
          transport.exchangeInstallationCode({
            clientId,
            clientSecret,
            code,
            redirectUri: callback.toString(),
          }),
      );
      invariant(
        typeof exchanged?.accessToken === "string" &&
          exchanged.accessToken.length > 0,
        "OF_VERCEL_TOKEN_EXCHANGE_INVALID",
        "Vercel did not return an integration access token.",
      );
      const callbackTeamId = teamId
        ? normalizeVercelId(teamId, "team ID")
        : null;
      const exchangedTeamId = exchanged.teamId ?? null;
      invariant(
        !callbackTeamId ||
          !exchangedTeamId ||
          callbackTeamId === exchangedTeamId,
        "OF_VERCEL_TEAM_MISMATCH",
        "The Vercel callback and token exchange team do not match.",
      );
      const access = await vault.putSecret({
        provider: "vercel",
        connectionId: installationId,
        name: "integration-access-token",
        value: exchanged.accessToken,
      });
      const installation = {
        id: installationId,
        provider: "vercel",
        projectId: context.projectId,
        configurationId: normalizedConfigurationId,
        teamId: exchangedTeamId ?? callbackTeamId,
        userId: exchanged.userId ?? null,
        accessTokenRef: access.ref,
        createdAt: clock().toISOString(),
      };
      await audit(
        createAuditEvent(
          {
            action: "vercel.installation.complete",
            actor: { id: installation.userId },
            target: {
              projectId: context.projectId,
              configurationId: normalizedConfigurationId,
              teamId: installation.teamId,
            },
            outcome: "success",
            requestId,
            details: { returnTo: context.returnTo },
          },
          { clock },
        ),
      );
      return {
        installation,
        returnTo: context.returnTo,
        next: normalizedNext,
      };
    },
  };
}
