import { invariant } from "./errors.js";
import { redactAISecrets } from "./context-policy.js";
import { parseAIProposal } from "./proposal-pipeline.js";

const SKILL_ID = /^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/u;
const CONTEXT_TYPES = new Set([
  "selectedPage",
  "selectedFiles",
  "screenshots",
  "designTokens",
  "diagnostics",
  "dependencyManifest",
  "gitDiff",
]);
const PERMISSIONS = new Set([
  "project.readFiles",
  "project.readDiagnostics",
  "assets.read",
  "editor.proposePatch",
]);
const VALIDATORS = new Set([
  "format",
  "security",
  "compatibility",
  "lint",
  "test",
  "build",
]);

export function parseAISkillDefinition(input) {
  invariant(
    input && typeof input === "object" && !Array.isArray(input),
    "OF_AI_SKILL_INVALID",
    "The AI skill definition must be an object.",
  );
  invariant(
    input.schemaVersion === 1 &&
      SKILL_ID.test(input.id) &&
      typeof input.name === "string" &&
      input.name.length > 0 &&
      input.name.length <= 100 &&
      typeof input.description === "string" &&
      input.description.length > 0 &&
      input.description.length <= 500 &&
      typeof input.instructions === "string" &&
      input.instructions.length >= 100 &&
      input.instructions.length <= 10_000,
    "OF_AI_SKILL_INVALID",
    "The AI skill identity or instructions are invalid.",
  );
  const capabilities = {
    vision: Boolean(input.capabilities?.vision),
    tools: Boolean(input.capabilities?.tools),
    structuredOutput: Boolean(input.capabilities?.structuredOutput),
  };
  invariant(
    capabilities.structuredOutput,
    "OF_AI_SKILL_INVALID",
    "Official AI skills require structured output.",
  );
  const context = parseContext(input.context);
  const permissions = parseUniqueList(input.permissions, PERMISSIONS);
  const validators = parseUniqueList(input.validators, VALIDATORS);
  invariant(
    input.patchPolicy === "proposal-only" &&
      permissions.includes("editor.proposePatch") &&
      validators.length === VALIDATORS.size &&
      [...VALIDATORS].every((name) => validators.includes(name)),
    "OF_AI_SKILL_POLICY_INVALID",
    "Official AI skills must use proposal-only output and the complete validation pipeline.",
  );
  const inputSchema = parseJSONSchema(input.inputSchema, "input");
  const outputSchema = parseJSONSchema(input.outputSchema, "output");
  return deepFreeze({
    schemaVersion: 1,
    id: input.id,
    name: input.name,
    description: input.description,
    instructions: input.instructions,
    capabilities,
    context,
    permissions,
    inputSchema,
    outputSchema,
    patchPolicy: "proposal-only",
    validators,
  });
}

export function evaluateAISkillRun({
  definition,
  input,
  output,
  providerCapabilities,
  providedContext,
  grantedPermissions,
}) {
  const skill = parseAISkillDefinition(definition);
  assertProviderCapabilities(skill, providerCapabilities);
  const contextTypes = parseRuntimeList(providedContext, CONTEXT_TYPES);
  const missingContext = skill.context
    .filter(({ required }) => required)
    .map(({ type }) => type)
    .filter((type) => !contextTypes.includes(type));
  invariant(
    missingContext.length === 0,
    "OF_AI_SKILL_CONTEXT_MISSING",
    "The AI skill is missing required approved context.",
    { missingContext },
  );
  const granted = parseRuntimeList(grantedPermissions, PERMISSIONS);
  const missingPermissions = skill.permissions.filter(
    (permission) => !granted.includes(permission),
  );
  invariant(
    missingPermissions.length === 0,
    "OF_AI_SKILL_PERMISSION_DENIED",
    "The AI skill is missing required permissions.",
    { missingPermissions },
  );
  const inputDiagnostics = validateJSONSchema(
    input,
    skill.inputSchema,
    "$input",
  );
  const outputDiagnostics = validateJSONSchema(
    output,
    skill.outputSchema,
    "$output",
  );
  invariant(
    inputDiagnostics.length === 0,
    "OF_AI_SKILL_INPUT_INVALID",
    "The AI skill input does not match its schema.",
    { diagnostics: inputDiagnostics },
  );
  invariant(
    outputDiagnostics.length === 0,
    "OF_AI_SKILL_OUTPUT_INVALID",
    "The AI skill output does not match its schema.",
    { diagnostics: outputDiagnostics },
  );
  const secretScan = redactAISecrets(JSON.stringify(output));
  invariant(
    secretScan.findings.length === 0,
    "OF_AI_SKILL_OUTPUT_SECRET",
    "The AI skill output contains a likely secret.",
    {
      findings: secretScan.findings,
    },
  );
  if (output.proposal !== null && output.proposal !== undefined) {
    parseAIProposal(output.proposal);
  }
  return {
    valid: true,
    skillId: skill.id,
    patchPolicy: skill.patchPolicy,
    validators: [...skill.validators],
    context: contextTypes,
  };
}

function parseContext(value) {
  invariant(
    Array.isArray(value) && value.length > 0,
    "OF_AI_SKILL_CONTEXT_INVALID",
    "The AI skill context declaration is invalid.",
  );
  const context = value.map((entry) => {
    invariant(
      entry &&
        typeof entry === "object" &&
        CONTEXT_TYPES.has(entry.type) &&
        typeof entry.required === "boolean" &&
        Object.keys(entry).every((key) =>
          ["type", "required", "purpose"].includes(key),
        ) &&
        typeof entry.purpose === "string" &&
        entry.purpose.length > 0 &&
        entry.purpose.length <= 300,
      "OF_AI_SKILL_CONTEXT_INVALID",
      "An AI skill context entry is invalid.",
    );
    return {
      type: entry.type,
      required: entry.required,
      purpose: entry.purpose,
    };
  });
  invariant(
    new Set(context.map(({ type }) => type)).size === context.length,
    "OF_AI_SKILL_CONTEXT_INVALID",
    "AI skill context types must be unique.",
  );
  return context;
}

function parseUniqueList(value, allowed) {
  invariant(
    Array.isArray(value) &&
      value.length > 0 &&
      new Set(value).size === value.length &&
      value.every((entry) => allowed.has(entry)),
    "OF_AI_SKILL_LIST_INVALID",
    "An AI skill declaration list is invalid.",
  );
  return [...value];
}

function parseRuntimeList(value, allowed) {
  invariant(
    Array.isArray(value) &&
      new Set(value).size === value.length &&
      value.every((entry) => allowed.has(entry)),
    "OF_AI_SKILL_LIST_INVALID",
    "An AI skill runtime list is invalid.",
  );
  return [...value];
}

function parseJSONSchema(schema, field) {
  invariant(
    schema &&
      typeof schema === "object" &&
      !Array.isArray(schema) &&
      schema.type === "object" &&
      schema.properties &&
      typeof schema.properties === "object" &&
      !Array.isArray(schema.properties) &&
      Array.isArray(schema.required),
    "OF_AI_SKILL_SCHEMA_INVALID",
    `The AI skill ${field} schema is invalid.`,
  );
  return structuredClone(schema);
}

function assertProviderCapabilities(skill, capabilities) {
  invariant(
    capabilities &&
      Array.isArray(capabilities.inputModalities) &&
      capabilities.tools &&
      capabilities.structuredOutput,
    "OF_AI_SKILL_PROVIDER_INVALID",
    "The AI skill requires normalized provider capabilities.",
  );
  const missing = [];
  if (
    skill.capabilities.vision &&
    !capabilities.inputModalities.includes("image")
  ) {
    missing.push("vision");
  }
  if (skill.capabilities.tools && !capabilities.tools.supported) {
    missing.push("tools");
  }
  if (
    skill.capabilities.structuredOutput &&
    !capabilities.structuredOutput.supported
  ) {
    missing.push("structuredOutput");
  }
  invariant(
    missing.length === 0,
    "OF_AI_SKILL_CAPABILITY_UNSUPPORTED",
    "The selected provider model does not support this AI skill.",
    { missing },
  );
}

function validateJSONSchema(value, schema, location) {
  const diagnostics = [];
  validateNode(value, schema, location, diagnostics);
  return diagnostics;
}

function validateNode(value, schema, location, diagnostics) {
  if (Array.isArray(schema.anyOf)) {
    const candidates = schema.anyOf.map((candidate) =>
      validateJSONSchema(value, candidate, location),
    );
    if (!candidates.some((candidate) => candidate.length === 0)) {
      diagnostics.push({ path: location, code: "anyOf" });
    }
    return;
  }
  const types = Array.isArray(schema.type) ? schema.type : [schema.type];
  if (!types.some((type) => matchesType(value, type))) {
    diagnostics.push({ path: location, code: "type" });
    return;
  }
  if (Array.isArray(schema.enum) && !schema.enum.includes(value)) {
    diagnostics.push({ path: location, code: "enum" });
  }
  if (typeof value === "string") {
    if (schema.minLength !== undefined && value.length < schema.minLength) {
      diagnostics.push({ path: location, code: "minLength" });
    }
    if (schema.maxLength !== undefined && value.length > schema.maxLength) {
      diagnostics.push({ path: location, code: "maxLength" });
    }
  }
  if (Array.isArray(value)) {
    if (schema.minItems !== undefined && value.length < schema.minItems) {
      diagnostics.push({ path: location, code: "minItems" });
    }
    if (schema.maxItems !== undefined && value.length > schema.maxItems) {
      diagnostics.push({ path: location, code: "maxItems" });
    }
    if (schema.items) {
      value.forEach((entry, index) =>
        validateNode(entry, schema.items, `${location}[${index}]`, diagnostics),
      );
    }
  }
  if (value && typeof value === "object" && !Array.isArray(value)) {
    for (const required of schema.required ?? []) {
      if (!(required in value)) {
        diagnostics.push({
          path: `${location}.${required}`,
          code: "required",
        });
      }
    }
    for (const [key, entry] of Object.entries(value)) {
      if (schema.properties?.[key]) {
        validateNode(
          entry,
          schema.properties[key],
          `${location}.${key}`,
          diagnostics,
        );
      } else if (schema.additionalProperties === false) {
        diagnostics.push({
          path: `${location}.${key}`,
          code: "additionalProperties",
        });
      }
    }
  }
}

function matchesType(value, type) {
  if (type === "null") return value === null;
  if (type === "array") return Array.isArray(value);
  if (type === "object") {
    return value !== null && typeof value === "object" && !Array.isArray(value);
  }
  if (type === "integer") return Number.isSafeInteger(value);
  return typeof value === type;
}

function deepFreeze(value) {
  Object.freeze(value);
  for (const entry of Object.values(value)) {
    if (entry && typeof entry === "object" && !Object.isFrozen(entry)) {
      deepFreeze(entry);
    }
  }
  return value;
}
