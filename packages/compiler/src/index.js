export {
  COMPATIBILITY_LEVELS,
  analyzeSourceCompatibility,
} from "./compatibility/analyze-source.js";
export {
  DuplicateProjectPathError,
  buildProjectIndex,
} from "./read/build-project-index.js";
export {
  ProjectPathError,
  normalizeProjectPath,
} from "./paths/normalize-project-path.js";
export {
  EDITOR_OPERATION_SCHEMA_VERSION,
  CompilerOperationError,
  editorOperationSchema,
  parseEditorOperation,
} from "./operations/operation-schema.js";
export { applyEditorOperation } from "./operations/apply-editor-operation.js";
export { withTemporaryProject } from "./workspace/with-temporary-project.js";
