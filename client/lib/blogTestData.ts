import { slugifyBlog } from "@/lib/blog";
import type {
  BlogAuthor,
  BlogCategory,
  BlogPostSection,
  BlogTag,
} from "@shared/api";

/** True only in Vite local/dev builds — never ships in production. */
export function isLocalAdminDev(): boolean {
  return Boolean(import.meta.env.DEV);
}

export type BlogEditorTestForm = {
  title: string;
  slug: string;
  excerpt: string;
  meta_title: string;
  meta_description: string;
  meta_keywords: string;
  hero_image_url: string;
  author_id: string;
  category_id: string;
  status: string;
  published_at: string;
  scheduled_at: string;
  is_featured: boolean;
  display_order: number;
  auto_seo: boolean;
  tag_ids: number[];
  sections: BlogPostSection[];
};

function sampleSections(): BlogPostSection[] {
  return [
    {
      section_type: "heading",
      title: "Por qué la vivienda vertical importa",
      body: "Una mirada a la densidad bien hecha en Guadalajara.",
      image_url: "",
      meta_json: {},
      display_order: 0,
      is_active: 1,
    },
    {
      section_type: "text",
      title: "",
      body:
        "Capital Urbano desarrolla vivienda conectada a la ciudad: ubicaciones con infraestructura, control de calidad y visión de largo plazo.<br><br>Este párrafo de prueba incluye <strong>formato enriquecido</strong> para validar el editor.",
      image_url: "",
      meta_json: {},
      display_order: 1,
      is_active: 1,
    },
    {
      section_type: "quote",
      title: "Equipo Capital Urbano",
      body: "La calidad no es un eslogan: se verifica en cada etapa de la obra.",
      image_url: "",
      meta_json: {},
      display_order: 2,
      is_active: 1,
    },
    {
      section_type: "image",
      title: "Imagen de prueba (logo del sitio)",
      body: "",
      image_url: "/logo.png",
      meta_json: {},
      display_order: 3,
      is_active: 1,
    },
    {
      section_type: "gallery",
      title: "",
      body: "",
      image_url: "",
      meta_json: { images: ["/logo.png", "/logo.png"] },
      display_order: 4,
      is_active: 1,
    },
    {
      section_type: "youtube",
      title: "Video de prueba",
      body: "",
      image_url: "",
      meta_json: { youtube: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" },
      display_order: 5,
      is_active: 1,
    },
    {
      section_type: "embed",
      title: "",
      body: "",
      image_url: "",
      meta_json: {
        url: "https://www.instagram.com/reel/ABC123xyz/",
        html: '<iframe src="https://www.instagram.com/reel/ABC123xyz/embed" loading="lazy" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>',
        provider: "instagram",
      },
      display_order: 6,
      is_active: 1,
    },
    {
      section_type: "cta",
      title: "Conoce nuestros proyectos",
      body: "Agenda una asesoría con el equipo comercial.",
      image_url: "",
      meta_json: { href: "/projects" },
      display_order: 7,
      is_active: 1,
    },
  ];
}

/**
 * Fills the blog editor with rich sample content for local QA.
 * `flow`: draft | scheduled | published — different publication states.
 */
export function buildBlogEditorTestData(
  opts: {
    authors: BlogAuthor[];
    categories: BlogCategory[];
    tags: BlogTag[];
    flow?: "draft" | "scheduled" | "published";
  },
): BlogEditorTestForm {
  const flow = opts.flow ?? "draft";
  const stamp = new Date()
    .toISOString()
    .slice(0, 16)
    .replace(/-/g, "")
    .replace(/:/g, "")
    .replace(/T/g, "");
  const title = `Artículo de prueba (${flow}) ${stamp}`;
  const slug = slugifyBlog(title);
  const excerpt =
    "Extracto de prueba para validar listados, SEO y la vista previa del blog Capital Urbano.";

  const authorId = opts.authors[0]?.id ? String(opts.authors[0].id) : "";
  const categoryId = opts.categories[0]?.id ? String(opts.categories[0].id) : "";
  const tagIds = opts.tags.slice(0, 3).map((t) => t.id);

  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  const localInput = (d: Date) =>
    `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;

  let status = "draft";
  let published_at = "";
  let scheduled_at = "";

  if (flow === "published") {
    status = "published";
    published_at = localInput(now);
  } else if (flow === "scheduled") {
    status = "scheduled";
    const later = new Date(now.getTime() + 2 * 60 * 60 * 1000);
    scheduled_at = localInput(later);
  }

  return {
    title,
    slug,
    excerpt,
    meta_title: title.slice(0, 60),
    meta_description: excerpt.slice(0, 160),
    meta_keywords: "Capital Urbano, Guadalajara, prueba, blog",
    hero_image_url: "/logo.png",
    author_id: authorId,
    category_id: categoryId,
    status,
    published_at,
    scheduled_at,
    is_featured: false,
    display_order: 0,
    auto_seo: true,
    tag_ids: tagIds,
    sections: sampleSections(),
  };
}
