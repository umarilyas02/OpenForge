import { z } from "zod";

import {
  nodeEnvField,
  optionalPortField,
  optionalString,
  optionalUrl,
  portField,
  requiredSecret,
  requiredString,
  requiredUrl,
} from "./fields.js";

/**
 * Root development convenience schema, mirroring the repository's
 * `.env.example`. Individual services validate their own narrower schema
 * below rather than this one.
 */
export const rootEnvSchema = z
  .object({
    OPENFORGE_ENV: nodeEnvField,
    OPENFORGE_PUBLIC_URL: optionalUrl(),
    OPENFORGE_API_URL: optionalUrl(),
    OPENFORGE_PREVIEW_URL: optionalUrl(),
    OPENFORGE_PYTHON_URL: optionalUrl(),
    DATABASE_URL: requiredUrl(),
    REDIS_URL: requiredUrl(),
    OBJECT_STORAGE_ENDPOINT: requiredUrl(),
    OBJECT_STORAGE_ACCESS_KEY: requiredString(),
    OBJECT_STORAGE_SECRET_KEY: requiredString(),
    ENCRYPTION_MASTER_KEY: requiredSecret(),
    SESSION_SECRET: requiredSecret(),
  })
  .strict();

export const apiEnvSchema = z
  .object({
    NODE_ENV: nodeEnvField,
    PORT: portField,
    PUBLIC_URL: requiredUrl(),
    WEB_ORIGIN: requiredUrl(),
    DATABASE_URL: requiredUrl(),
    REDIS_URL: requiredUrl(),
    OBJECT_STORAGE_ENDPOINT: requiredUrl(),
    OBJECT_STORAGE_REGION: optionalString(),
    OBJECT_STORAGE_BUCKET: requiredString(),
    OBJECT_STORAGE_ACCESS_KEY: requiredString(),
    OBJECT_STORAGE_SECRET_KEY: requiredString(),
    ENCRYPTION_MASTER_KEY: requiredSecret(),
    SESSION_SECRET: requiredSecret(),
    INTERNAL_SERVICE_TOKEN: requiredSecret(),
    GITHUB_APP_ID: optionalString(),
    GITHUB_APP_PRIVATE_KEY: optionalString(),
    GITHUB_WEBHOOK_SECRET: optionalString(),
    VERCEL_CLIENT_ID: optionalString(),
    VERCEL_CLIENT_SECRET: optionalString(),
    VERCEL_WEBHOOK_SECRET: optionalString(),
  })
  .strict();

export const workerEnvSchema = z
  .object({
    NODE_ENV: nodeEnvField,
    DATABASE_URL: requiredUrl(),
    REDIS_URL: requiredUrl(),
    OBJECT_STORAGE_ENDPOINT: requiredUrl(),
    OBJECT_STORAGE_REGION: optionalString(),
    OBJECT_STORAGE_BUCKET: requiredString(),
    OBJECT_STORAGE_ACCESS_KEY: requiredString(),
    OBJECT_STORAGE_SECRET_KEY: requiredString(),
    ENCRYPTION_MASTER_KEY: requiredSecret(),
    INTERNAL_SERVICE_TOKEN: requiredSecret(),
    PYTHON_ANALYSIS_URL: requiredUrl(),
    WORKSPACE_ROOT: requiredString(),
    ARTIFACT_ROOT: requiredString(),
  })
  .strict();

export const webEnvSchema = z
  .object({
    NODE_ENV: nodeEnvField,
    PORT: portField,
    NEXT_PUBLIC_OPENFORGE_URL: requiredUrl(),
    NEXT_PUBLIC_OPENFORGE_API_URL: requiredUrl(),
    NEXT_PUBLIC_OPENFORGE_PREVIEW_ORIGIN: requiredUrl(),
    SESSION_SECRET: requiredSecret(),
    GITHUB_CLIENT_ID: optionalString(),
    GITHUB_CLIENT_SECRET: optionalString(),
  })
  .strict();

export const previewEnvSchema = z
  .object({
    NODE_ENV: nodeEnvField,
    PORT: portField,
    PREVIEW_PUBLIC_ORIGIN: requiredUrl(),
    CONTROL_PLANE_ORIGIN: requiredUrl(),
    REDIS_URL: requiredUrl(),
    INTERNAL_SERVICE_TOKEN: requiredSecret(),
    PREVIEW_WORKSPACE_ROOT: requiredString(),
    PREVIEW_CPU_LIMIT: optionalPortField,
    PREVIEW_MEMORY_LIMIT: optionalString(),
    PREVIEW_TIMEOUT_SECONDS: optionalPortField,
    PREVIEW_NETWORK_POLICY: optionalString(),
  })
  .strict();

export const cmsRendererEnvSchema = z
  .object({
    NODE_ENV: nodeEnvField,
    PORT: portField,
    DATABASE_URL: requiredUrl(),
  })
  .strict();

export const aiProvidersEnvSchema = z
  .object({
    OPENAI_API_KEY: optionalString(),
    ANTHROPIC_API_KEY: optionalString(),
    GEMINI_API_KEY: optionalString(),
    OPENAI_COMPATIBLE_BASE_URL: optionalUrl(),
    OLLAMA_BASE_URL: optionalUrl(),
  })
  .strict();

export const SERVICE_ENV_SCHEMAS = Object.freeze({
  root: rootEnvSchema,
  api: apiEnvSchema,
  worker: workerEnvSchema,
  web: webEnvSchema,
  preview: previewEnvSchema,
  "cms-renderer": cmsRendererEnvSchema,
  "ai-providers": aiProvidersEnvSchema,
});
