import DOMPurify from "dompurify";

/** True if string looks like HTML markup. */
export function looksLikeHtml(value: string): boolean {
  return /<[a-z][\s\S]*>/i.test(value.trim());
}

/**
 * Convert plain textarea content (newlines) into simple HTML paragraphs
 * so TipTap and the public renderer share one format.
 */
export function plainTextToBlogHtml(value: string): string {
  const raw = value.trim();
  if (!raw) return "";
  if (looksLikeHtml(raw)) return raw;
  return raw
    .split(/\n{2,}/)
    .map((block) => {
      const withBreaks = block
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean)
        .join("<br>");
      return withBreaks ? `<p>${withBreaks}</p>` : "";
    })
    .filter(Boolean)
    .join("");
}

/** Sanitize admin-authored HTML for safe public rendering. */
export function sanitizeBlogHtml(html: string): string {
  if (!html.trim()) return "";
  return DOMPurify.sanitize(html, {
    USE_PROFILES: { html: true },
    ADD_ATTR: ["target", "rel"],
  });
}
