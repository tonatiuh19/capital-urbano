import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PageMeta } from "@/components/seo/PageMeta";
import { PageHero } from "@/components/content/PageHero";
import { PageContentRenderer } from "@/components/content/PageContentRenderer";
import { PageCtaBand } from "@/components/content/PageCtaBand";
import { ExperienceJourneySection } from "@/components/content/ExperienceJourneySection";
import { DevelopmentCard } from "@/components/projects/DevelopmentCard";
import { SkeletonDevelopmentGrid } from "@/components/loading";
import { useShowQuerySkeleton } from "@/hooks/useShowQuerySkeleton";
import { apiGet } from "@/lib/api";
import { usePublicSiteConfig } from "@/hooks/usePublicSiteConfig";
import type { CmsPage, Development } from "@shared/api";
import { MapPin } from "lucide-react";

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5 },
};

export default function Experience() {
  const { data: config } = usePublicSiteConfig();
  const pageQ = useQuery({
    queryKey: ["page", "experience"],
    queryFn: () =>
      apiGet<{ page: CmsPage | null }>("/api/pages.php?slug=experience"),
  });
  const devQ = useQuery({
    queryKey: ["developments", "public"],
    queryFn: () => apiGet<{ developments: Development[] }>("/api/developments.php"),
  });

  const pageLoading = useShowQuerySkeleton(pageQ);
  const devLoading = useShowQuerySkeleton(devQ);

  const page = pageQ.data?.page;
  const projects = devQ.data?.developments ?? [];
  const heroSubtitle =
    (config?.experience_hero_subtitle as string) || page?.meta_description || "";

  return (
    <div className="cu-page min-h-screen bg-white">
      <PageMeta route="experience" page={page} />
      <Header />

      <section className="relative overflow-hidden pb-12">
        <div className="absolute inset-0 bg-gradient-to-br from-cu-warm-white via-white to-cu-warm-white" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <PageHero
            label="Experiencia del cliente"
            title={page?.title ?? "Experiencia"}
            subtitle={heroSubtitle}
          />
        </div>
      </section>

      <section className="pb-20 sm:pb-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ExperienceJourneySection config={config} />

          {(pageLoading || page?.body_markdown) && (
            <div className="mb-20">
              <PageContentRenderer
                slug="experience"
                markdown={page?.body_markdown}
                loading={pageLoading}
                skeletonCount={2}
              />
            </div>
          )}

          {devLoading && (
            <SkeletonDevelopmentGrid
              count={3}
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20 cu-card-grid"
            />
          )}

          {!devLoading && projects.length > 0 && (
            <motion.div {...fadeUp}>
              <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
                <div>
                  <span className="text-xs font-montserrat font-bold text-cu-orange uppercase tracking-widest">
                    Portafolio
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-montserrat font-bold text-cu-black mt-1">
                    Elige tu desarrollo
                  </h2>
                </div>
                <Link
                  to="/projects"
                  className="inline-flex items-center gap-2 text-sm font-montserrat font-semibold text-cu-orange"
                >
                  <MapPin size={16} /> Ver mapa y fichas
                </Link>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 cu-card-grid">
                {projects.slice(0, 3).map((p, i) => (
                  <DevelopmentCard key={p.id} project={p} index={i} />
                ))}
              </div>
            </motion.div>
          )}

          <PageCtaBand
            primaryLabel="Contáctanos"
            primaryTo="/contact"
            secondaryLabel="Ver proyectos"
            secondaryTo="/projects"
          />
        </div>
      </section>

      <Footer />
    </div>
  );
}
