import type { Development } from "@shared/api";

/** Resolve LIV Capital feed slug for a development, if any. */
export function getLivProjectSlug(d: Development): string | null {
  if (d.liv_project_slug?.trim()) return d.liv_project_slug.trim();
  if (d.external_site_url?.includes("livcapitalgdl.mx")) return "liv-capital";
  const slug = d.slug?.toLowerCase() ?? "";
  const name = d.name.toLowerCase();
  if (slug.includes("liv") || name.includes("liv capital")) return "liv-capital";
  return null;
}

export function isLivProject(d: Development): boolean {
  return getLivProjectSlug(d) !== null;
}
