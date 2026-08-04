import type { BlogPostSection, BlogSectionType } from "@shared/api";
import { BLOG_SECTION_TYPES } from "@/lib/blog";
import { resolveBlogEmbed } from "@/lib/blogEmbed";

export type BlogEditorValidationIssue = {
  /** null = post-level field */
  sectionIndex: number | null;
  field: string;
  message: string;
};

export type BlogEditorFormLike = {
  title: string;
  author_id: string;
  status: string;
  scheduled_at: string;
  sections: BlogPostSection[];
};

function sectionLabel(type: BlogSectionType): string {
  return BLOG_SECTION_TYPES.find((t) => t.value === type)?.label ?? type;
}

function metaObject(
  meta: BlogPostSection["meta_json"],
): Record<string, unknown> {
  if (meta && typeof meta === "object" && !Array.isArray(meta)) return meta;
  if (typeof meta === "string" && meta.trim()) {
    try {
      const parsed = JSON.parse(meta) as unknown;
      if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
        return parsed as Record<string, unknown>;
      }
    } catch {
      /* ignore */
    }
  }
  return {};
}

/** Strip HTML to decide if a rich-text body is empty. */
export function plainTextFromHtml(value: string): string {
  return value
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<\/p>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/\s+/g, " ")
    .trim();
}

function youtubeLooksValid(raw: string): boolean {
  const v = raw.trim();
  if (!v) return false;
  if (/^[\w-]{11}$/.test(v)) return true;
  const built = resolveBlogEmbed({ url: v, html: v });
  return built?.provider === "youtube" && Boolean(built.iframeSrc);
}

export function validateBlogSection(
  section: BlogPostSection,
  index: number,
): BlogEditorValidationIssue[] {
  const issues: BlogEditorValidationIssue[] = [];
  const type = section.section_type;
  const label = sectionLabel(type);
  const prefix = `Sección ${index + 1} (${label})`;
  const meta = metaObject(section.meta_json);
  const title = (section.title ?? "").trim();
  const body = (section.body ?? "").trim();

  const push = (field: string, message: string) => {
    issues.push({ sectionIndex: index, field, message });
  };

  switch (type) {
    case "text":
      if (!plainTextFromHtml(body)) {
        push("body", `${prefix}: agrega el texto.`);
      }
      break;
    case "heading":
      if (!title) {
        push("title", `${prefix}: el encabezado es obligatorio.`);
      }
      break;
    case "quote":
      if (!plainTextFromHtml(body) && !title) {
        push("body", `${prefix}: escribe la cita.`);
      }
      break;
    case "image":
      if (!(section.image_url ?? "").trim()) {
        push("image_url", `${prefix}: agrega una imagen (archivo o URL).`);
      }
      break;
    case "gallery": {
      const images = Array.isArray(meta.images)
        ? (meta.images as unknown[]).filter(
            (img) => typeof img === "string" && img.trim(),
          )
        : [];
      if (images.length === 0) {
        push("images", `${prefix}: agrega al menos una imagen.`);
      }
      break;
    }
    case "youtube": {
      const yt = String(meta.youtube ?? "").trim();
      if (!yt) {
        push("youtube", `${prefix}: pega la URL o el ID de YouTube.`);
      } else if (!youtubeLooksValid(yt)) {
        push("youtube", `${prefix}: la URL de YouTube no es válida.`);
      }
      break;
    }
    case "embed": {
      const built = resolveBlogEmbed({
        url: typeof meta.url === "string" ? meta.url : null,
        html: typeof meta.html === "string" ? meta.html : null,
        body,
      });
      if (!built?.iframeSrc && !(built?.html && built.html.trim().startsWith("<"))) {
        const hasInput =
          String(meta.url ?? "").trim() ||
          String(meta.html ?? "").trim() ||
          body;
        push(
          "embed",
          hasInput
            ? `${prefix}: URL no reconocida. Usa un enlace de red social o HTML de embed.`
            : `${prefix}: pega la URL del post o el HTML del embed.`,
        );
      }
      break;
    }
    case "cta":
      if (!title && !plainTextFromHtml(body)) {
        push("title", `${prefix}: indica el texto del botón o un mensaje.`);
      }
      break;
    default:
      break;
  }

  return issues;
}

export function validateBlogEditor(
  form: BlogEditorFormLike,
): {
  ok: boolean;
  issues: BlogEditorValidationIssue[];
  /** First blocking message for toasts / button titles. */
  summary: string | null;
} {
  const issues: BlogEditorValidationIssue[] = [];

  if (!form.title.trim()) {
    issues.push({
      sectionIndex: null,
      field: "title",
      message: "El título es obligatorio.",
    });
  }
  if (!form.author_id.trim()) {
    issues.push({
      sectionIndex: null,
      field: "author_id",
      message: "El autor es obligatorio.",
    });
  }
  if (form.status === "scheduled" && !form.scheduled_at.trim()) {
    issues.push({
      sectionIndex: null,
      field: "scheduled_at",
      message: "Indica fecha y hora para programar la publicación.",
    });
  }

  if (!form.sections.length) {
    issues.push({
      sectionIndex: null,
      field: "sections",
      message: "Agrega al menos una sección de contenido.",
    });
  } else {
    form.sections.forEach((section, index) => {
      issues.push(...validateBlogSection(section, index));
    });
  }

  return {
    ok: issues.length === 0,
    issues,
    summary: issues[0]?.message ?? null,
  };
}

export function blogIssueAnchor(issue: BlogEditorValidationIssue): string {
  if (issue.sectionIndex === null) {
    if (issue.field === "sections") return "blog-sections";
    return `blog-field-${issue.field}`;
  }
  return `blog-section-${issue.sectionIndex}`;
}

export function blogIssueShortLabel(issue: BlogEditorValidationIssue): string {
  if (issue.sectionIndex !== null) {
    return `Sección ${issue.sectionIndex + 1}`;
  }
  switch (issue.field) {
    case "title":
      return "Título";
    case "author_id":
      return "Autor";
    case "scheduled_at":
      return "Programación";
    case "sections":
      return "Secciones";
    default:
      return issue.field;
  }
}

/** One jump target per field/section (deduped). */
export function blogIssueJumpTargets(issues: BlogEditorValidationIssue[]): {
  id: string;
  label: string;
  message: string;
  count: number;
}[] {
  const map = new Map<
    string,
    { label: string; message: string; count: number }
  >();
  for (const issue of issues) {
    const id = blogIssueAnchor(issue);
    const existing = map.get(id);
    if (existing) {
      existing.count += 1;
    } else {
      map.set(id, {
        label: blogIssueShortLabel(issue),
        message: issue.message,
        count: 1,
      });
    }
  }
  return [...map.entries()].map(([id, v]) => ({ id, ...v }));
}

export function issuesForSection(
  issues: BlogEditorValidationIssue[],
  index: number,
): BlogEditorValidationIssue[] {
  return issues.filter((i) => i.sectionIndex === index);
}
