import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PageMeta } from "@/components/seo/PageMeta";
import { PageHero } from "@/components/content/PageHero";
import { PageContentRenderer } from "@/components/content/PageContentRenderer";
import { ContentAccordion } from "@/components/content/ContentAccordion";
import { PageSectionHeader } from "@/components/content/PageSectionHeader";
import { PageCtaBand } from "@/components/content/PageCtaBand";
import { apiGet } from "@/lib/api";
import { usePublicSiteConfig } from "@/hooks/usePublicSiteConfig";
import { pillarIcon } from "@/lib/pillarIcons";
import { CONTENT_CANON } from "@/lib/brand/contentCanon";
import { SkeletonChamferCard } from "@/components/loading";
import { useShowQuerySkeleton } from "@/hooks/useShowQuerySkeleton";
import type { CmsPage, QualityPillar } from "@shared/api";
import { ArrowRight, ShieldCheck } from "lucide-react";

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5 },
};

const processPhases = [
  {
    step: "01",
    title: "Diseño y planeación",
    text: "Anteproyecto, BIM y especificaciones validadas con proveedores clave.",
  },
  {
    step: "02",
    title: "Obra supervisada",
    text: "Control de calidad en sitio, bitácoras digitales e inspecciones externas.",
  },
  {
    step: "03",
    title: "Entrega documentada",
    text: "Walkthrough, garantías y protocolos de postventa para propietarios.",
  },
];

export default function Quality() {
  const { data: config } = usePublicSiteConfig();
  const pageQ = useQuery({
    queryKey: ["page", "quality"],
    queryFn: () => apiGet<{ page: CmsPage | null }>("/api/pages.php?slug=quality"),
  });
  const pillarsQ = useQuery({
    queryKey: ["pillars", "public"],
    queryFn: () => apiGet<{ pillars: QualityPillar[] }>("/api/quality-pillars.php"),
  });

  const pageLoading = useShowQuerySkeleton(pageQ);
  const pillarsLoading = useShowQuerySkeleton(pillarsQ);

  const page = pageQ.data?.page;
  const pillars = pillarsQ.data?.pillars ?? [];
  const heroSubtitle =
    (config?.quality_hero_subtitle as string) || page?.meta_description || "";

  const pillarAccordionItems = pillars.map((p) => ({
    id: String(p.id),
    title: p.title,
    icon: pillarIcon(p.icon),
    content: p.description,
  }));

  return (
    <div className="cu-page min-h-screen bg-white">
      <PageMeta route="quality" page={page} />
      <Header />

      <section className="relative bg-cu-black text-white overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cu-orange/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-cu-orange/5 rounded-full blur-3xl" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 sm:pb-20">
          <PageHero
            label="Estándares Capital Urbano"
            title={page?.title ?? "Calidad"}
            subtitle={heroSubtitle}
            dark
          />
        </div>
      </section>

      {(pageLoading || page?.body_markdown) && (
        <section
          id="intro-calidad"
          className="py-16 sm:py-20 bg-white border-b border-cu-stone/10 scroll-mt-28"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <PageContentRenderer
              slug="quality"
              markdown={page?.body_markdown}
              loading={pageLoading}
            />
          </div>
        </section>
      )}

      <section id={CONTENT_CANON.qualityPillars.sectionId} className="py-20 sm:py-28 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <PageSectionHeader
            eyebrow="Estándares"
            title="Cuatro pilares"
            description="Expande cada pilar para conocer protocolos, procesos y estándares aplicados en obra."
            icon={ShieldCheck}
          />

          {pillarsLoading && (
            <div className="space-y-3 max-w-3xl mx-auto">
              {Array.from({ length: 4 }).map((_, i) => (
                <SkeletonChamferCard key={i} tone="dark" showIcon lines={2} />
              ))}
            </div>
          )}

          {!pillarsLoading && (
            <ContentAccordion
              items={pillarAccordionItems}
              variant="dark"
              className="max-w-3xl mx-auto"
            />
          )}
        </div>
      </section>

      <section id="ciclo-calidad" className="py-16 sm:py-20 bg-cu-warm-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <PageSectionHeader
            eyebrow="Proceso"
            title="Ciclo de calidad"
            description="De la planeación a la entrega documentada."
            align="center"
            className="mb-12"
          />
          <div className="grid md:grid-cols-3 gap-6 lg:gap-8 cu-card-grid">
            {processPhases.map((phase, i) => (
              <motion.div
                key={phase.step}
                className="cu-chamfer-card relative pb-1 h-full flex flex-col"
                {...fadeUp}
                transition={{ delay: i * 0.1 }}
              >
                <div className="cu-chamfer-border-tr flex-1 flex flex-col">
                  <div className="cu-chamfer-fill-tr bg-white flex-1 flex flex-col px-6 py-8 sm:px-8">
                    <p className="text-xs font-montserrat font-bold text-cu-orange tracking-[0.2em] mb-3">
                      {phase.step}
                    </p>
                    <h3 className="font-montserrat font-bold text-cu-black text-lg mb-3">
                      {phase.title}
                    </h3>
                    <p className="text-cu-concrete text-sm font-josefin leading-relaxed flex-1">
                      {phase.text}
                    </p>
                  </div>
                </div>
                <div className="cu-chamfer-accent opacity-60" aria-hidden />
              </motion.div>
            ))}
          </div>
          <motion.div className="text-center mt-12" {...fadeUp}>
            <Link
              to="/projects"
              className="inline-flex items-center gap-2 text-cu-orange font-montserrat font-semibold hover:gap-3 transition-all"
            >
              Conoce nuestros proyectos <ArrowRight size={18} />
            </Link>
          </motion.div>
        </div>
      </section>

      <section className="pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <PageCtaBand
            title="Calidad que se ve y se siente"
            subtitle="Agenda una visita a obra o solicita el dossier de cualquier desarrollo."
          />
        </div>
      </section>

      <Footer />
    </div>
  );
}
