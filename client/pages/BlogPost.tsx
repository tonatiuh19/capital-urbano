import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MetaTags } from "@/components/seo/MetaTags";
import { BlogSections } from "@/components/blog/BlogSections";
import { apiGet, assetUrl } from "@/lib/api";
import { SafeImage } from "@/components/ui/SafeImage";
import {
  buildBreadcrumbSchema,
  buildOrganizationSchema,
  toJsonLdGraph,
  truncateMetaDescription,
} from "@/lib/seo";
import type { BlogPost } from "@shared/api";
import { ArrowLeft } from "lucide-react";
import { SkeletonProjectDetail } from "@/components/loading";
import { useShowQuerySkeleton } from "@/hooks/useShowQuerySkeleton";

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const postQ = useQuery({
    queryKey: ["blog", "post", slug],
    queryFn: () =>
      apiGet<{ post: BlogPost }>(`/api/blog.php?slug=${encodeURIComponent(slug!)}`),
    enabled: !!slug,
    retry: false,
  });

  const loading = useShowQuerySkeleton(postQ);
  const post = postQ.data?.post;

  if (loading) {
    return <SkeletonProjectDetail />;
  }

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <MetaTags
          title="Artículo no encontrado"
          description="El artículo solicitado no existe o aún no está publicado."
          noIndex
          canonicalPath="/blog"
        />
        <p className="text-cu-black font-montserrat font-bold">Artículo no encontrado</p>
        <Link to="/blog" className="text-cu-orange hover:underline">
          Volver al blog
        </Link>
      </div>
    );
  }

  const canonicalPath = `/blog/${post.slug}`;
  const title = post.meta_title || post.title;
  const description = truncateMetaDescription(
    post.meta_description || post.excerpt || post.title,
  );

  return (
    <div className="cu-page min-h-screen bg-white">
      <MetaTags
        title={title}
        description={description}
        keywords={post.meta_keywords ?? undefined}
        image={post.hero_image_url ?? undefined}
        imageAlt={post.title}
        type="article"
        canonicalPath={canonicalPath}
        structuredData={toJsonLdGraph([
          buildOrganizationSchema(),
          {
            "@type": "BlogPosting",
            headline: post.title,
            description,
            image: post.hero_image_url
              ? assetUrl(post.hero_image_url)
              : undefined,
            datePublished: post.published_at ?? undefined,
            dateModified: post.updated_at ?? undefined,
            author: post.author
              ? { "@type": "Person", name: post.author.name }
              : { "@type": "Organization", name: "Capital Urbano" },
          },
          buildBreadcrumbSchema([
            { name: "Inicio", path: "/" },
            { name: "Blog", path: "/blog" },
            { name: post.title, path: canonicalPath },
          ]),
        ])}
      />
      <Header />
      <article className="pt-28 pb-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-sm text-cu-concrete hover:text-cu-orange mb-8"
          >
            <ArrowLeft size={16} /> Blog
          </Link>

          <div className="flex flex-wrap gap-3 text-xs font-montserrat font-bold uppercase tracking-wider text-cu-orange mb-4">
            {post.category?.name && <span>{post.category.name}</span>}
            {post.published_at && (
              <time className="text-cu-stone font-medium normal-case tracking-normal">
                {new Date(post.published_at).toLocaleDateString("es-MX", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </time>
            )}
          </div>

          <h1 className="text-3xl sm:text-5xl font-montserrat font-bold text-cu-black leading-tight text-balance mb-6">
            {post.title}
          </h1>

          {post.excerpt && (
            <p className="text-lg sm:text-xl text-cu-concrete font-josefin leading-relaxed mb-8">
              {post.excerpt}
            </p>
          )}

          {post.author && (
            <p className="text-sm text-cu-stone font-montserrat mb-10">
              Por <span className="text-cu-black font-semibold">{post.author.name}</span>
              {post.author.role_title ? ` · ${post.author.role_title}` : ""}
            </p>
          )}

          {post.hero_image_url && (
            <div className="cu-chamfer-border-tr mb-12">
              <div className="cu-chamfer-fill-tr overflow-hidden bg-cu-warm-white">
                <SafeImage
                  src={assetUrl(post.hero_image_url) || null}
                  alt={post.title}
                  className="w-full max-h-[28rem] object-cover"
                  fallbackClassName="w-full h-56"
                />
              </div>
            </div>
          )}

          <BlogSections sections={post.sections ?? []} />

          {post.tags && post.tags.length > 0 && (
            <div className="mt-12 pt-8 border-t border-cu-stone/15 flex flex-wrap gap-2">
              {post.tags.map((t) => (
                <Link
                  key={t.id}
                  to={`/blog?tag=${encodeURIComponent(t.slug)}`}
                  className="px-3 py-1 text-xs font-montserrat font-semibold rounded-sm bg-cu-warm-white text-cu-concrete hover:text-cu-orange"
                >
                  #{t.name}
                </Link>
              ))}
            </div>
          )}
        </div>
      </article>
      <Footer />
    </div>
  );
}
