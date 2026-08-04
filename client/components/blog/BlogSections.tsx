import { Link } from "react-router-dom";
import type { BlogPostSection } from "@shared/api";
import { assetUrl } from "@/lib/api";
import { SafeImage } from "@/components/ui/SafeImage";
import { looksLikeHtml, sanitizeBlogHtml } from "@/lib/blogHtml";
import {
  resolveBlogEmbed,
  socialEmbedAspectClass,
} from "@/lib/blogEmbed";

function RichBody({
  body,
  className,
}: {
  body: string;
  className?: string;
}) {
  if (!body.trim()) return null;
  if (looksLikeHtml(body)) {
    return (
      <div
        className={className}
        dangerouslySetInnerHTML={{ __html: sanitizeBlogHtml(body) }}
      />
    );
  }
  return <div className={`${className ?? ""} whitespace-pre-line`}>{body}</div>;
}

function youtubeId(raw: string): string | null {
  const v = raw.trim();
  if (/^[\w-]{11}$/.test(v)) return v;
  try {
    const u = new URL(v);
    if (u.hostname.includes("youtu.be")) return u.pathname.slice(1).slice(0, 11) || null;
    return u.searchParams.get("v");
  } catch {
    return null;
  }
}

export function BlogSections({ sections }: { sections: BlogPostSection[] }) {
  if (!sections?.length) return null;

  return (
    <div className="space-y-10">
      {sections
        .filter((s) => s.is_active !== 0)
        .map((section, i) => {
          let meta: Record<string, unknown> = {};
          if (typeof section.meta_json === "string" && section.meta_json.trim()) {
            try {
              meta = JSON.parse(section.meta_json) as Record<string, unknown>;
            } catch {
              meta = {};
            }
          } else if (
            typeof section.meta_json === "object" &&
            section.meta_json &&
            !Array.isArray(section.meta_json)
          ) {
            meta = section.meta_json;
          }
          const key = section.id ?? i;

          switch (section.section_type) {
            case "heading":
              return (
                <div key={key}>
                  {section.title && (
                    <h2 className="text-2xl sm:text-3xl font-montserrat font-bold text-cu-black mb-3">
                      {section.title}
                    </h2>
                  )}
                  {section.body && (
                    <RichBody
                      body={section.body}
                      className="prose-cu text-lg text-cu-concrete font-josefin leading-relaxed"
                    />
                  )}
                </div>
              );
            case "text":
              return (
                <RichBody
                  key={key}
                  body={section.body ?? ""}
                  className="prose-cu text-base sm:text-lg text-cu-concrete font-josefin leading-relaxed [&_a]:text-cu-orange [&_a]:underline [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_blockquote]:border-l-4 [&_blockquote]:border-cu-orange [&_blockquote]:pl-4 [&_blockquote]:italic"
                />
              );
            case "quote":
              return (
                <blockquote
                  key={key}
                  className="border-l-4 border-cu-orange pl-5 py-2 bg-cu-warm-white/60"
                >
                  {looksLikeHtml(section.body || "") ? (
                    <RichBody
                      body={section.body || ""}
                      className="prose-cu text-lg sm:text-xl font-josefin italic text-cu-black leading-relaxed"
                    />
                  ) : (
                    <p className="text-lg sm:text-xl font-josefin italic text-cu-black leading-relaxed whitespace-pre-line">
                      {section.body || section.title}
                    </p>
                  )}
                  {section.title && section.body && (
                    <cite className="block mt-3 text-sm text-cu-orange not-italic font-montserrat font-semibold">
                      — {section.title}
                    </cite>
                  )}
                </blockquote>
              );
            case "image":
              return (
                <figure key={key} className="cu-chamfer-border-tr">
                  <div className="cu-chamfer-fill-tr overflow-hidden bg-cu-warm-white">
                    <SafeImage
                      src={assetUrl(section.image_url) || null}
                      alt={section.title || "Imagen del artículo"}
                      className="w-full max-h-[28rem] object-cover"
                      fallbackClassName="w-full h-48"
                    />
                  </div>
                  {section.title && (
                    <figcaption className="text-sm text-cu-concrete mt-2 font-josefin">
                      {section.title}
                    </figcaption>
                  )}
                </figure>
              );
            case "gallery": {
              const images = Array.isArray(meta.images) ? (meta.images as string[]) : [];
              return (
                <div key={key} className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {images.map((src) => (
                    <SafeImage
                      key={src}
                      src={assetUrl(src) || null}
                      alt=""
                      className="w-full aspect-[4/3] object-cover rounded-sm"
                      fallbackClassName="w-full aspect-[4/3] rounded-sm"
                    />
                  ))}
                </div>
              );
            }
            case "youtube": {
              const id = youtubeId(String(meta.youtube ?? ""));
              if (!id) return null;
              return (
                <div key={key} className="aspect-video rounded-sm overflow-hidden bg-cu-black">
                  <iframe
                    src={`https://www.youtube.com/embed/${id}`}
                    title={section.title || "YouTube"}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              );
            }
            case "embed": {
              const built = resolveBlogEmbed({
                url: typeof meta.url === "string" ? meta.url : null,
                html:
                  typeof meta.html === "string"
                    ? meta.html
                    : (section.body ?? null),
                body: section.body,
              });
              if (!built) return null;
              if (built.iframeSrc) {
                return (
                  <div
                    key={key}
                    className={`blog-embed overflow-hidden rounded-sm bg-cu-warm-white ${socialEmbedAspectClass(built.aspect)}`}
                  >
                    <iframe
                      src={built.iframeSrc}
                      title={section.title || built.label}
                      className="w-full h-full border-0"
                      loading="lazy"
                      referrerPolicy="strict-origin-when-cross-origin"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    />
                  </div>
                );
              }
              return (
                <div
                  key={key}
                  className="blog-embed overflow-x-auto"
                  dangerouslySetInnerHTML={{ __html: built.html }}
                />
              );
            }
            case "cta": {
              let href = String(meta.href ?? "/contact").trim() || "/contact";
              if (/^\s*javascript:/i.test(href)) href = "/contact";
              const internal = href.startsWith("/");
              const content = (
                <span className="inline-flex items-center gap-2 px-6 py-3 bg-cu-orange text-white font-montserrat font-semibold text-sm rounded-sm hover:bg-cu-orange-80 transition-colors">
                  {section.title || section.body || "Conocer más"}
                </span>
              );
              return (
                <div key={key} className="text-center py-4 space-y-4">
                  {section.image_url && (
                    <div className="cu-chamfer-border-tr max-w-lg mx-auto">
                      <div className="cu-chamfer-fill-tr overflow-hidden bg-cu-warm-white">
                        <SafeImage
                          src={assetUrl(section.image_url) || null}
                          alt={section.title || "Llamado a la acción"}
                          className="w-full max-h-64 object-cover"
                          fallbackClassName="w-full h-40"
                        />
                      </div>
                    </div>
                  )}
                  {section.body && section.title && (
                    <p className="text-cu-concrete mb-0 font-josefin">
                      {section.body}
                    </p>
                  )}
                  {internal ? (
                    <Link to={href}>{content}</Link>
                  ) : (
                    <a href={href} target="_blank" rel="noopener noreferrer">
                      {content}
                    </a>
                  )}
                </div>
              );
            }
            default:
              return null;
          }
        })}
    </div>
  );
}
