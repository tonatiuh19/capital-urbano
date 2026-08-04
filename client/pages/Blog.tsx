import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useSearchParams } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PageMeta } from "@/components/seo/PageMeta";
import { PageHero } from "@/components/content/PageHero";
import { apiGet, assetUrl } from "@/lib/api";
import { SafeImage } from "@/components/ui/SafeImage";
import type { BlogCategory, BlogPost } from "@shared/api";
import { Search } from "lucide-react";

type BlogListResponse = {
  posts: BlogPost[];
  categories: (BlogCategory & { post_count?: number })[];
  pagination: { page: number; limit: number; total: number; pages: number };
};

export default function Blog() {
  const [searchParams] = useSearchParams();
  const tag = searchParams.get("tag")?.trim() ?? "";
  const [q, setQ] = useState("");
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(1);

  const queryKey = useMemo(
    () => ["blog", "list", q, category, tag, page] as const,
    [q, category, tag, page],
  );

  const blogQ = useQuery({
    queryKey,
    queryFn: () => {
      const params = new URLSearchParams();
      params.set("page", String(page));
      params.set("limit", "9");
      if (q.trim()) params.set("q", q.trim());
      if (category) params.set("category", category);
      if (tag) params.set("tag", tag);
      return apiGet<BlogListResponse>(`/api/blog.php?${params.toString()}`);
    },
  });

  const posts = blogQ.data?.posts ?? [];
  const categories = blogQ.data?.categories ?? [];
  const pagination = blogQ.data?.pagination;

  return (
    <div className="cu-page min-h-screen bg-white">
      <PageMeta route="blog" />
      <Header />
      <section className="pb-20 sm:pb-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <PageHero
            label="Capital Urbano"
            title="Blog"
            subtitle="Ideas, trayectoria y novedades sobre vivienda vertical en Guadalajara."
          />

          <div className="flex flex-col lg:flex-row gap-4 lg:items-end mb-10">
            <div className="relative flex-1 max-w-md">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-cu-stone"
              />
              <input
                type="search"
                value={q}
                onChange={(e) => {
                  setPage(1);
                  setQ(e.target.value);
                }}
                placeholder="Buscar artículos…"
                className="w-full pl-9 pr-4 py-3 border border-cu-stone/25 rounded-sm text-sm font-montserrat focus:outline-none focus:ring-2 focus:ring-cu-orange/40"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => {
                  setCategory("");
                  setPage(1);
                }}
                className={`px-3 py-1.5 text-xs font-montserrat font-semibold rounded-sm border ${
                  !category
                    ? "bg-cu-orange text-white border-cu-orange"
                    : "border-cu-stone/25 text-cu-concrete"
                }`}
              >
                Todas
              </button>
              {categories.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => {
                    setCategory(c.slug);
                    setPage(1);
                  }}
                  className={`px-3 py-1.5 text-xs font-montserrat font-semibold rounded-sm border ${
                    category === c.slug
                      ? "bg-cu-orange text-white border-cu-orange"
                      : "border-cu-stone/25 text-cu-concrete"
                  }`}
                >
                  {c.name}
                  {c.post_count != null ? ` (${c.post_count})` : ""}
                </button>
              ))}
            </div>
          </div>

          {blogQ.isPending && (
            <p className="text-cu-concrete text-center py-16">Cargando artículos…</p>
          )}

          {tag && (
            <p className="text-sm text-cu-concrete mb-6 font-josefin">
              Filtrando por etiqueta{" "}
              <span className="font-montserrat font-semibold text-cu-black">#{tag}</span>
              {" · "}
              <Link to="/blog" className="text-cu-orange hover:underline">
                Ver todos
              </Link>
            </p>
          )}

          {!blogQ.isPending && posts.length === 0 && (
            <p className="text-cu-concrete text-center py-16">
              {tag || q || category
                ? "No hay artículos con esos filtros."
                : "Pronto publicaremos contenido. Vuelve más tarde."}
            </p>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 cu-card-grid">
            {posts.map((post) => (
              <Link
                key={post.id}
                to={`/blog/${post.slug}`}
                className="group flex flex-col h-full"
              >
                <div className="cu-chamfer-border-tr mb-4">
                  <div className="cu-chamfer-fill-tr overflow-hidden bg-cu-warm-white aspect-[16/10] relative">
                    <SafeImage
                      src={assetUrl(post.hero_image_url) || null}
                      alt={post.title}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      fallbackClassName="absolute inset-0 w-full h-full"
                    />
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mb-2 text-[11px] font-montserrat font-bold uppercase tracking-wider text-cu-orange">
                  {post.category?.name && <span>{post.category.name}</span>}
                  {post.published_at && (
                    <span className="text-cu-stone font-medium normal-case tracking-normal">
                      {new Date(post.published_at).toLocaleDateString("es-MX", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  )}
                </div>
                <h2 className="text-xl font-montserrat font-bold text-cu-black group-hover:text-cu-orange transition-colors leading-snug">
                  {post.title}
                </h2>
                {post.excerpt && (
                  <p className="text-sm text-cu-concrete mt-2 line-clamp-3 font-josefin leading-relaxed flex-1">
                    {post.excerpt}
                  </p>
                )}
                {post.author?.name && (
                  <p className="text-xs text-cu-stone mt-3 font-montserrat">
                    {post.author.name}
                  </p>
                )}
              </Link>
            ))}
          </div>

          {pagination && pagination.pages > 1 && (
            <div className="flex justify-center gap-2 mt-12">
              {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPage(p)}
                  className={`w-10 h-10 text-sm font-montserrat font-semibold rounded-sm ${
                    p === page
                      ? "bg-cu-orange text-white"
                      : "bg-cu-warm-white text-cu-black hover:bg-cu-stone/20"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          )}
        </div>
      </section>
      <Footer />
    </div>
  );
}
