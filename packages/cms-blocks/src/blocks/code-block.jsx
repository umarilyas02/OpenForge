import { createCmsBlock } from "../block.js";

function CodeBlock({ code, language }) {
  const content = code ?? "";
  const lang = language || "text";

  return (
    <div className="of-block">
      <div className="overflow-hidden rounded-lg bg-slate-900 shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-700/60 px-4 py-2">
          <span className="rounded bg-slate-800 px-2 py-0.5 font-mono text-xs uppercase tracking-wide text-slate-400">
            {lang}
          </span>
        </div>
        <pre className="overflow-x-auto p-4">
          <code className="font-mono text-sm leading-relaxed text-slate-100">
            {content}
          </code>
        </pre>
      </div>
    </div>
  );
}

export const codeBlockBlock = createCmsBlock({
  definition: {
    schemaVersion: 1,
    id: "openforge-cms.code-block",
    version: 1,
    name: "Code Block",
    description: "A monospace code snippet with an optional language label.",
    tags: ["content", "code", "tailwind"],
    defaultProps: {
      code: 'function greet(name) {\n  return `Hello, ${name}!`;\n}',
      language: "javascript",
    },
    editableFields: [
      {
        path: "code",
        label: "Code",
        control: "textarea",
        required: true,
      },
      {
        path: "language",
        label: "Language",
        control: "select",
        required: false,
        options: [
          { value: "javascript", label: "JavaScript" },
          { value: "python", label: "Python" },
          { value: "bash", label: "Bash" },
          { value: "json", label: "JSON" },
          { value: "text", label: "Plain text" },
        ],
      },
    ],
    slots: [],
    accessibility: [
      "Code is real selectable text inside <pre><code>, not an image, so it works with screen readers and copy/paste; the language tag is a plain text label.",
    ],
    migrations: [],
  },
  component: CodeBlock,
});
