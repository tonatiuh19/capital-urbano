/** Split CMS markdown into ## sections (tolerates single newlines before headings). */
export function parseMarkdownSections(raw: string): { title: string; body: string }[] {
  const normalized = raw
    .replace(/\r\n/g, "\n")
    .replace(/\n## /g, "\n\n## ")
    .trim();

  if (!normalized) return [];

  const parts = normalized.split(/\n## /).map((p) => p.trim()).filter(Boolean);

  return parts.map((part) => {
    const withoutHash = part.startsWith("## ") ? part.slice(3) : part;
    const newline = withoutHash.indexOf("\n");
    if (newline === -1) {
      return { title: withoutHash.trim(), body: "" };
    }
    return {
      title: withoutHash.slice(0, newline).trim(),
      body: withoutHash.slice(newline + 1).trim(),
    };
  });
}
