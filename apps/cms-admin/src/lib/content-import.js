const FRONTMATTER_RE = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/u;

/**
 * A minimal `key: value` frontmatter block, not full YAML — matches the
 * handful of fields this importer actually reads (title, slug, type,
 * status). Anything more structured belongs in the JSON import path
 * instead.
 */
function parseFrontmatter(text) {
  const match = text.match(FRONTMATTER_RE);
  if (!match) return { meta: {}, body: text };

  const meta = {};
  for (const line of match[1].split(/\r?\n/u)) {
    const separatorIndex = line.indexOf(":");
    if (separatorIndex === -1) continue;
    const key = line.slice(0, separatorIndex).trim();
    const value = line
      .slice(separatorIndex + 1)
      .trim()
      .replace(/^["']|["']$/gu, "");
    if (key) meta[key] = value;
  }
  return { meta, body: text.slice(match[0].length) };
}

/**
 * `@openforge/cms-blocks`'s Rich Text block only ever renders plain
 * paragraphs (see packages/cms-blocks/src/blocks/rich-text.jsx) — it has no
 * heading/bold/link rendering to import into. Stripping common Markdown
 * syntax down to its plain text keeps an imported post readable instead of
 * showing literal "##"/"**"/"[text](url)" once it lands in that block.
 */
function stripMarkdownSyntax(body) {
  return body
    .replace(/\r\n/gu, "\n")
    .split("\n")
    .map((line) => line.replace(/^#{1,6}\s+/u, "").replace(/^[-*]\s+/u, ""))
    .join("\n")
    .replace(/\*\*([^*]+)\*\*/gu, "$1")
    .replace(/\*([^*]+)\*/gu, "$1")
    .replace(/\[([^\]]+)\]\([^)]+\)/gu, "$1")
    .trim();
}

function firstNonEmptyLine(text) {
  return text.split("\n").find((line) => line.trim().length > 0) ?? "";
}

/**
 * A single Markdown file: optional `---` frontmatter (title, slug, type,
 * status) followed by body text. Always returns exactly one entry, in the
 * same shape `parseJsonImport` returns, so the caller doesn't need to know
 * which format it got.
 *
 * @param {string} text
 * @param {string} fallbackTitle used when there's no frontmatter title and
 *   the body's first line is empty (e.g. the imported file's own name).
 */
export function parseMarkdownImport(text, fallbackTitle = "Untitled") {
  const { meta, body } = parseFrontmatter(text);
  const cleanBody = stripMarkdownSyntax(body);
  const title =
    meta.title || firstNonEmptyLine(cleanBody).slice(0, 120) || fallbackTitle;

  return [
    {
      title,
      slug: meta.slug,
      type: meta.type === "page" ? "page" : "post",
      status: meta.status === "published" ? "published" : "draft",
      body: cleanBody,
    },
  ];
}

/**
 * A JSON array (or single object) of `{ title, slug?, type?, status?,
 * body? }` entries — e.g. hand-written, or exported from another system.
 * `body` is plain text for the Rich Text block, same as the Markdown path.
 *
 * @param {string} text
 * @throws {Error} on invalid JSON or an entry missing a title — the caller
 *   is expected to surface `error.message` directly to the user.
 */
export function parseJsonImport(text) {
  const parsed = JSON.parse(text);
  const list = Array.isArray(parsed) ? parsed : [parsed];

  return list.map((entry, index) => {
    if (!entry || typeof entry.title !== "string" || !entry.title.trim()) {
      throw new Error(`Entry ${index + 1} is missing a "title".`);
    }
    return {
      title: entry.title.trim(),
      slug: typeof entry.slug === "string" ? entry.slug : undefined,
      type: entry.type === "page" ? "page" : "post",
      status: entry.status === "published" ? "published" : "draft",
      body: typeof entry.body === "string" ? entry.body : "",
    };
  });
}

/**
 * Dispatches on file extension. Anything not recognized as `.json` is
 * treated as Markdown/plain text — a `.txt` file imports the same way a
 * frontmatter-free `.md` file would.
 *
 * @param {string} filename
 * @param {string} text
 */
export function parseImportFile(filename, text) {
  if (filename.toLowerCase().endsWith(".json")) return parseJsonImport(text);
  return parseMarkdownImport(text, filename.replace(/\.[^.]+$/u, ""));
}
