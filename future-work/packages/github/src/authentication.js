import { randomUUID } from "node:crypto";

import { createAuditEvent } from "@openforge/integration-security";

import { invariant } from "./errors.js";
import { assertOAuthCode, createMemoryOAuthStateStore } from "./oauth-state.js";
import { normalizeReturnTo } from "./validation.js";

export function createGitHubAuthentication({
  clientId,
  clientSecretRef,
  redirectUri,
  vault,
  transport,
  stateStore = createMemoryOAuthStateStore(),
  audit = async () => {},
  clock = () => new Date(),
}) {
  invariant(
    typeof clientId === "string" && clientId.length >= 8,
    "OF_GITHUB_CLIENT_ID_INVALID",
    "A GitHub App client ID is required.",
  );
  invariant(
    /^secret_[a-f0-9]{32}$/u.test(clientSecretRef),
    "OF_GITHUB_CLIENT_SECRET_REF_INVALID",
    "A GitHub App client-secret reference is required.",
  );
  const callback = new URL(redirectUri);
  invariant(
    callback.protocol === "https:" ||
      (callback.protocol === "http:" && callback.hostname === "localhost"),
    "OF_GITHUB_REDIRECT_URI_INVALID",
    "The GitHub callback must use HTTPS, except on localhost.",
  );

  return {
    async begin({ returnTo = "/" } = {}) {
      const normalizedReturnTo = normalizeReturnTo(returnTo);
      const state = await stateStore.issue({ returnTo: normalizedReturnTo });
      const authorizationUrl = new URL(
        "https://github.com/login/oauth/authorize",
      );
      authorizationUrl.searchParams.set("client_id", clientId);
      authorizationUrl.searchParams.set("redirect_uri", callback.toString());
      authorizationUrl.searchParams.set("state", state);
      return { authorizationUrl: authorizationUrl.toString(), state };
    },

    async complete({ code, state, requestId }) {
      assertOAuthCode(code);
      const context = await stateStore.consume(state);
      invariant(
        context,
        "OF_GITHUB_OAUTH_STATE_REJECTED",
        "The GitHub authorization state is invalid, expired, or already used.",
      );
      const identityId = `github_identity_${randomUUID().replaceAll("-", "")}`;
      const token = await vault.withSecret(
        clientSecretRef,
        { provider: "github", name: "app-client-secret" },
        (clientSecret) =>
          transport.exchangeUserCode({
            clientId,
            clientSecret,
            code,
            redirectUri: callback.toString(),
          }),
      );
      invariant(
        typeof token?.accessToken === "string" && token.accessToken.length > 0,
        "OF_GITHUB_TOKEN_EXCHANGE_INVALID",
        "GitHub did not return a user access token.",
      );
      const user = await transport.getViewer({ token: token.accessToken });
      const access = await vault.putSecret({
        provider: "github",
        connectionId: identityId,
        name: "user-access-token",
        value: token.accessToken,
      });
      let refresh = null;
      if (token.refreshToken) {
        refresh = await vault.putSecret({
          provider: "github",
          connectionId: identityId,
          name: "user-refresh-token",
          value: token.refreshToken,
        });
      }
      const identity = {
        id: identityId,
        provider: "github",
        login: user.login,
        accountId: user.id,
        avatarUrl: user.avatarUrl ?? null,
        accessTokenRef: access.ref,
        refreshTokenRef: refresh?.ref ?? null,
        accessTokenExpiresAt: token.expiresAt ?? null,
        refreshTokenExpiresAt: token.refreshExpiresAt ?? null,
      };
      await audit(
        createAuditEvent(
          {
            action: "github.authentication.complete",
            actor: { id: identity.id, login: identity.login },
            target: { provider: "github" },
            outcome: "success",
            requestId,
            details: { returnTo: context.returnTo },
          },
          { clock },
        ),
      );
      return { identity, returnTo: context.returnTo };
    },
  };
}
