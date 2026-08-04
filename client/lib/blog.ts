/** Client-side blog SEO helpers (mirrors PHP blog_auto_seo). */

export function slugifyBlog(text: string): string {
  return text
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 160) || "articulo";
}

export function autoBlogSeo(input: {
  title: string;
  excerpt?: string | null;
  tags?: string[];
}): { meta_title: string; meta_description: string; meta_keywords: string; slug: string } {
  const title = input.title.trim();
  const meta_title = title.slice(0, 60);
  const descSource =
    input.excerpt?.trim() ||
    `${title} — Capital Urbano, desarrolladora de vivienda vertical en Guadalajara.`;
  const meta_description = descSource.slice(0, 160);
  const keywords = Array.from(
    new Set([
      "Capital Urbano",
      "Guadalajara",
      "vivienda vertical",
      "desarrollo inmobiliario",
      ...(input.tags ?? []).map((t) => t.trim()).filter(Boolean),
    ]),
  );
  return {
    meta_title,
    meta_description,
    meta_keywords: keywords.join(", ").slice(0, 320),
    slug: slugifyBlog(title),
  };
}

export const BLOG_SECTION_TYPES = [
  {
    value: "text",
    label: "Texto",
    hint: "Párrafo principal del artículo. Usa negrita, listas y enlaces.",
  },
  {
    value: "heading",
    label: "Encabezado",
    hint: "Subtítulo para separar temas dentro del artículo.",
  },
  {
    value: "image",
    label: "Imagen",
    hint: "Una sola imagen a ancho completo, con título opcional como pie.",
  },
  {
    value: "gallery",
    label: "Galería",
    hint: "Varias imágenes en cuadrícula. Adjunta archivos o pega URLs.",
  },
  {
    value: "youtube",
    label: "YouTube",
    hint: "Pega la URL del video; se muestra embebido en el artículo.",
  },
  {
    value: "embed",
    label: "Embed / redes",
    hint: "Pega el enlace de un post de Instagram, X, TikTok, Facebook o LinkedIn.",
  },
  {
    value: "quote",
    label: "Cita",
    hint: "Frase destacada. El título sirve como autor o atribución.",
  },
  {
    value: "cta",
    label: "Llamado a la acción",
    hint: "Botón para llevar al lector a contactar, un proyecto u otra página. Ideal al final del artículo.",
  },
] as const;

export function blogSectionHint(type: string): string {
  return (
    BLOG_SECTION_TYPES.find((t) => t.value === type)?.hint ??
    "Bloque de contenido del artículo."
  );
}

export const BLOG_STATUS_LABELS: Record<string, string> = {
  draft: "Borrador",
  scheduled: "Programado",
  published: "Publicado",
  archived: "Archivado",
};

/** Max blog posts marked featured (home + blog spotlight). */
export const MAX_FEATURED_BLOG_POSTS = 3;
