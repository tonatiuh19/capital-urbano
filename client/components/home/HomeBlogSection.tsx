import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { apiGet, assetUrl } from "@/lib/api";
import { SafeImage } from "@/components/ui/SafeImage";
import { MAX_FEATURED_BLOG_POSTS } from "@/lib/blog";
import { useBlogFeatureEnabled } from "@/lib/featureFlags";
import { brandReveal, brandStaggerChild, brandStaggerParent, brandViewport } from "@/lib/motion";
import type { BlogPost } from "@shared/api";

type BlogListResponse = {
  posts: BlogPost[];
};

/**
 * Home spotlight: only published posts marked as featured (max 3).
 * Hidden entirely when there are no featured articles or blog feature is off.
 */
export function HomeBlogSection() {
  const { enabled: blogEnabled, isFetched } = useBlogFeatureEnabled();
  const featuredQ = useQuery({
    queryKey: ["blog", "home", "featured"],
    queryFn: () =>
      apiGet<BlogListResponse>(
        `/api/blog.php?featured=1&limit=${MAX_FEATURED_BLOG_POSTS}`,
      ),
    enabled: blogEnabled && isFetched,
    retry: false,
  });

  const posts = featuredQ.data?.posts ?? [];

  if (!blogEnabled || !isFetched || featuredQ.isPending || posts.length === 0) {
    return null;
  }

  return (
    <section className="py-20 sm:py-28 bg-cu-warm-white/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-12 sm:mb-16"
          variants={brandReveal}
          initial="hidden"
          whileInView="visible"
          viewport={brandViewport}
        >
          <p className="text-xs font-montserrat font-bold uppercase tracking-widest text-cu-orange mb-3">
            Blog
          </p>
          <h2 className="text-3xl sm:text-5xl font-montserrat font-bold text-cu-black mb-4 text-balance">
            Ideas y trayectoria
          </h2>
          <p className="text-lg text-cu-black-60 max-w-2xl mx-auto font-josefin">
            Artículos destacados sobre vivienda vertical, ciudad e inversión en Guadalajara.
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 cu-card-grid"
          variants={brandStaggerParent}
          initial="hidden"
          whileInView="visible"
          viewport={brandViewport}
        >
          {posts.map((post) => (
            <motion.div key={post.id} variants={brandStaggerChild}>
              <Link to={`/blog/${post.slug}`} className="group flex flex-col h-full">
                <div className="cu-chamfer-border-tr mb-4">
                  <div className="cu-chamfer-fill-tr overflow-hidden bg-white aspect-[16/10] relative">
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
                  <span className="text-cu-stone font-medium normal-case tracking-normal">
                    Destacado
                  </span>
                </div>
                <h3 className="text-xl font-montserrat font-bold text-cu-black group-hover:text-cu-orange transition-colors leading-snug">
                  {post.title}
                </h3>
                {post.excerpt && (
                  <p className="text-sm text-cu-concrete mt-2 line-clamp-3 font-josefin leading-relaxed flex-1">
                    {post.excerpt}
                  </p>
                )}
              </Link>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="text-center mt-12 sm:mt-16"
          variants={brandReveal}
          initial="hidden"
          whileInView="visible"
          viewport={brandViewport}
        >
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 px-8 py-4 border-2 border-cu-orange text-cu-orange font-montserrat font-semibold rounded-sm hover:bg-cu-orange hover:text-white transition-all duration-300 group"
          >
            Ver el blog
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
