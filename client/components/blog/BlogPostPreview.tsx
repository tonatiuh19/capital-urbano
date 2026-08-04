import { SafeImage } from "@/components/ui/SafeImage";
import { BlogSections } from "@/components/blog/BlogSections";
import { assetUrl } from "@/lib/api";
import type { BlogAuthor, BlogCategory, BlogPostSection, BlogTag } from "@shared/api";

type BlogPostPreviewProps = {
  title: string;
  excerpt: string;
  slug: string;
  heroImageUrl: string;
  author?: BlogAuthor | null;
  category?: BlogCategory | null;
  tags?: BlogTag[];
  sections: BlogPostSection[];
  publishedAt?: string | null;
};

/** Renders the public article layout for admin live preview (unsaved form state). */
export function BlogPostPreview({
  title,
  excerpt,
  slug,
  heroImageUrl,
  author,
  category,
  tags = [],
  sections,
  publishedAt,
}: BlogPostPreviewProps) {
  const dateLabel = publishedAt
    ? new Date(publishedAt.replace(" ", "T")).toLocaleDateString("es-MX", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Borrador / sin fecha";

  return (
    <article className="bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
        <p className="text-[11px] font-montserrat font-semibold uppercase tracking-wider text-cu-stone mb-4">
          Vista previa · /blog/{slug || "tu-slug"}
        </p>

        <div className="flex flex-wrap gap-3 text-xs font-montserrat font-bold uppercase tracking-wider text-cu-orange mb-4">
          {category?.name && <span>{category.name}</span>}
          <time className="text-cu-stone font-medium normal-case tracking-normal">{dateLabel}</time>
        </div>

        <h1 className="text-3xl sm:text-4xl font-montserrat font-bold text-cu-black leading-tight text-balance mb-5">
          {title.trim() || "Sin título"}
        </h1>

        {excerpt.trim() && (
          <p className="text-lg text-cu-concrete font-josefin leading-relaxed mb-6">{excerpt}</p>
        )}

        {author?.name && (
          <p className="text-sm text-cu-stone font-montserrat mb-8">
            Por <span className="text-cu-black font-semibold">{author.name}</span>
            {author.role_title ? ` · ${author.role_title}` : ""}
          </p>
        )}

        {heroImageUrl && (
          <div className="cu-chamfer-border-tr mb-10">
            <div className="cu-chamfer-fill-tr overflow-hidden bg-cu-warm-white">
              <SafeImage
                src={assetUrl(heroImageUrl) || null}
                alt={title || "Imagen destacada"}
                className="w-full max-h-[22rem] object-cover"
                fallbackClassName="w-full h-48"
              />
            </div>
          </div>
        )}

        {sections.length > 0 ? (
          <BlogSections sections={sections} />
        ) : (
          <p className="text-cu-concrete text-sm italic">Sin secciones de contenido todavía.</p>
        )}

        {tags.length > 0 && (
          <div className="mt-10 pt-6 border-t border-cu-stone/15 flex flex-wrap gap-2">
            {tags.map((t) => (
              <span
                key={t.id}
                className="px-3 py-1 text-xs font-montserrat font-semibold rounded-sm bg-cu-warm-white text-cu-concrete"
              >
                #{t.name}
              </span>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}
