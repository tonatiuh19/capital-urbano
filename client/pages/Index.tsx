import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PageMeta } from "@/components/seo/PageMeta";
import { HeroBackground } from "@/components/home/HeroBackground";
import { DeveloperExperienceSection } from "@/components/home/DeveloperExperienceSection";
import { HomeBlogSection } from "@/components/home/HomeBlogSection";
import { DevelopmentCard } from "@/components/projects/DevelopmentCard";
import { DevelopmentsMap } from "@/components/projects/DevelopmentsMap";
import { apiGet } from "@/lib/api";
import { pillarIcon } from "@/lib/pillarIcons";
import { SiteStatsStrip } from "@/components/content/SiteStatsStrip";
import { BrandFeatureCard } from "@/components/brand/BrandFeatureCard";
import { SkeletonChamferCard, SkeletonDevelopmentGrid } from "@/components/loading";
import { useShowQuerySkeleton } from "@/hooks/useShowQuerySkeleton";
import type { Development, QualityPillar } from "@shared/api";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { BrandVideoPreview } from "@/components/media/BrandVideoPreview";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import {
  BRAND_CONCEPT,
  BRAND_DNA_PILLARS,
  BRAND_SLOGAN,
  BRAND_TAGLINE,
  BRAND_VALUE_MANTRA,
  BRAND_VALUE_PROPOSITION,
  HOME_ABOUT_BULLETS,
  HOME_ABOUT_TEASER,
  HOME_CTA_PROJECTS,
} from "@/lib/brand/copy";
import { CONTENT_CANON, canonLinkLabel } from "@/lib/brand/contentCanon";

import { BrandDnaCard, dnaCardWidthClass } from "@/components/brand/BrandDnaCard";
import { useWhatsAppUrl } from "@/hooks/useWhatsAppUrl";
import {
  brandReveal,
  brandStaggerChild,
  brandStaggerParent,
  brandViewport,
} from "@/lib/motion";

export default function Index() {
  const whatsappUrl = useWhatsAppUrl();
  const devQ = useQuery({
    queryKey: ["developments", "public"],
    queryFn: () => apiGet<{ developments: Development[] }>("/api/developments.php"),
    retry: false,
  });
  const pillarsQ = useQuery({
    queryKey: ["pillars", "public"],
    queryFn: () => apiGet<{ pillars: QualityPillar[] }>("/api/quality-pillars.php"),
    retry: false,
  });

  const devLoading = useShowQuerySkeleton(devQ);
  const pillarsLoading = useShowQuerySkeleton(pillarsQ);
  const featured =
    devQ.data?.developments?.filter((d) => d.is_featured).slice(0, 3) ??
    devQ.data?.developments?.slice(0, 3) ??
    [];
  const pillars = pillarsQ.data?.pillars ?? [];
  const [heroVideoActive, setHeroVideoActive] = useState(false);

  return (
    <div className="cu-page min-h-screen bg-white">
      <PageMeta route="home" titleMode="home" />
      <Header />

      {/* Hero Section */}
      <section className="relative min-h-screen min-h-[100dvh] pt-20 overflow-hidden">
        <HeroBackground onVideoActive={setHeroVideoActive} />

        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 min-h-[calc(100dvh-5rem)] flex items-center justify-center">
          <motion.div
            className={`text-center ${heroVideoActive ? "cu-hero-video-copy" : ""}`}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            {/* Status Badge */}
            <motion.div
              className={`hidden md:inline-flex items-center gap-2 px-5 py-2.5 rounded-sm mb-10 shadow-sm border ${
                heroVideoActive
                  ? "bg-white/10 border-white/25 backdrop-blur-md text-white"
                  : "bg-white border-cu-stone/20"
              }`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <span className="w-2 h-2 bg-cu-orange rounded-full animate-pulse" />
              <span
                className={`text-xs font-montserrat font-medium uppercase tracking-wider ${
                  heroVideoActive ? "text-white/95" : "text-cu-black"
                }`}
              >
                {BRAND_TAGLINE}
              </span>
            </motion.div>

            {/* Reveal full header once this passes the top (past first hero block) */}
            <div id="hero-scroll-sentinel" className="h-px w-full" aria-hidden />

            {/* Main Headline - Architectural Typography */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <h1
                className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-montserrat font-bold mb-8 leading-[1.15] tracking-tight text-balance max-w-4xl mx-auto ${
                  heroVideoActive ? "text-white" : "text-cu-black"
                }`}
              >
                {BRAND_SLOGAN}
              </h1>
            </motion.div>

            {/* Divider Line */}
            <motion.div
              className="w-16 h-1 bg-cu-orange mx-auto mb-8"
              initial={{ width: 0 }}
              animate={{ width: 64 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            />

            {/* Subheadline */}
            <motion.p
              className={`text-base sm:text-lg max-w-2xl mx-auto mb-12 leading-relaxed ${
                heroVideoActive ? "text-white/85" : "text-cu-black-60"
              }`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              {BRAND_VALUE_PROPOSITION}
            </motion.p>

            {/* CTA Buttons - Refined */}
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center items-stretch sm:items-center w-full max-w-md sm:max-w-none mx-auto px-2 sm:px-0"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <Link
                to="/projects"
                className="inline-flex items-center justify-center gap-3 w-full sm:w-auto px-8 sm:px-10 py-4 bg-cu-orange text-white font-montserrat font-semibold text-sm uppercase tracking-wider rounded-sm hover:bg-cu-orange-80 transition-all duration-300 shadow-lg hover:shadow-xl sm:hover:translate-y-[-2px] group"
              >
                {HOME_CTA_PROJECTS}
                <ArrowRight
                  size={18}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </Link>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center justify-center gap-3 w-full sm:w-auto px-8 sm:px-10 py-4 border-2 font-montserrat font-semibold text-sm uppercase tracking-wider rounded-sm transition-all duration-300 ${
                  heroVideoActive
                    ? "border-white/80 text-white hover:bg-white hover:text-cu-black"
                    : "border-cu-black text-cu-black hover:bg-cu-black hover:text-white"
                }`}
              >
                Contactar por WhatsApp
              </a>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll hint — pinned to hero bottom; hidden on mobile */}
        <motion.div
          className="hidden md:flex absolute inset-x-0 bottom-[max(1.25rem,env(safe-area-inset-bottom))] lg:bottom-8 z-20 justify-center pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1 }}
          aria-hidden
        >
          <div className="flex flex-col items-center gap-2.5">
            <span
              className={`text-xs font-montserrat uppercase tracking-wider opacity-60 ${
                heroVideoActive ? "text-white/70" : "text-cu-stone"
              }`}
            >
              Desplázate
            </span>
            <div
              className={`w-5 h-8 border rounded-full flex items-start justify-center pt-1.5 opacity-60 ${
                heroVideoActive ? "border-white/50" : "border-cu-stone"
              }`}
            >
              <motion.div
                className={`w-1 h-2 rounded-full ${
                  heroVideoActive ? "bg-white/70" : "bg-cu-stone"
                }`}
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              />
            </div>
          </div>
        </motion.div>
      </section>

      {/* Trust Indicators */}
      <section className="relative py-20 sm:py-28 cu-stats-band overflow-hidden">
        <div
          className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cu-orange/40 to-transparent"
          aria-hidden
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-xs sm:text-sm font-montserrat font-bold text-cu-orange uppercase tracking-[0.2em] mb-10 sm:mb-12">
            {BRAND_VALUE_MANTRA}
          </p>
          <SiteStatsStrip variant="dark" />
        </div>
      </section>

      <DeveloperExperienceSection />

      {/* ADN de marca */}
      <section id={CONTENT_CANON.dnaPillars.sectionId} className="py-16 sm:py-20 bg-cu-warm-white scroll-mt-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-14"
            variants={brandReveal}
            initial="hidden"
            whileInView="visible"
            viewport={brandViewport}
          >
            <span className="text-xs font-montserrat font-bold text-cu-orange uppercase tracking-widest">
              {BRAND_CONCEPT}
            </span>
            <h2 className="text-2xl sm:text-3xl font-montserrat font-bold text-cu-black mt-2">
              Método, calidad y permanencia
            </h2>
          </motion.div>
          <motion.div
            className="cu-dna-grid"
            variants={brandStaggerParent}
            initial="hidden"
            whileInView="visible"
            viewport={brandViewport}
          >
            {BRAND_DNA_PILLARS.map((pillar, index) => (
              <BrandDnaCard
                key={pillar.key}
                index={index + 1}
                title={pillar.title}
                description={pillar.description}
                iconKey={pillar.key}
                className={dnaCardWidthClass}
              />
            ))}
          </motion.div>
        </div>
      </section>

      {/* Featured Projects Section */}
      <section className="py-20 sm:py-28 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <motion.div
            className="text-center mb-16"
            variants={brandReveal}
            initial="hidden"
            whileInView="visible"
            viewport={brandViewport}
          >
            <h2 className="text-3xl sm:text-5xl font-montserrat font-bold text-cu-black mb-4 text-balance px-2 sm:px-0">
              Proyectos Destacados
            </h2>
            <p className="text-lg text-cu-black-60 max-w-2xl mx-auto">
              {BRAND_VALUE_PROPOSITION}
            </p>
          </motion.div>

          <DevelopmentsMap
            className="mb-16 h-[380px] sm:h-[420px]"
            title=""
            subtitle=""
          />

          {/* Projects Grid */}
          {devLoading ? (
            <SkeletonDevelopmentGrid count={3} />
          ) : (
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 cu-card-grid"
              variants={brandStaggerParent}
              initial="hidden"
              whileInView="visible"
              viewport={brandViewport}
            >
              {featured.map((project, index) => (
                <DevelopmentCard
                  key={project.id}
                  project={project}
                  index={index}
                  staggered
                />
              ))}
            </motion.div>
          )}

          {/* See All Projects CTA */}
          <motion.div
            className="text-center mt-16"
            variants={brandReveal}
            initial="hidden"
            whileInView="visible"
            viewport={brandViewport}
          >
            <Link
              to="/projects"
              className="inline-flex items-center gap-2 px-8 py-4 border-2 border-cu-orange text-cu-orange font-montserrat font-semibold rounded-sm hover:bg-cu-orange hover:text-white transition-all duration-300 group"
            >
              Ver Todos los Proyectos
              <ArrowRight
                size={20}
                className="group-hover:translate-x-1 transition-transform"
              />
            </Link>
          </motion.div>
        </div>
      </section>

      <HomeBlogSection />

      {/* Quality Pillars Section */}
      <section
        id={CONTENT_CANON.qualityPillars.sectionId}
        className="py-20 sm:py-28 bg-cu-black text-white relative overflow-hidden scroll-mt-28"
      >
        <div className="absolute top-0 right-0 w-96 h-96 bg-cu-orange opacity-5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-cu-orange opacity-5 rounded-full blur-3xl" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <motion.div
            className="text-center mb-16"
            variants={brandReveal}
            initial="hidden"
            whileInView="visible"
            viewport={brandViewport}
          >
            <h2 className="text-3xl sm:text-5xl font-montserrat font-bold mb-4 text-balance px-2 sm:px-0">
              Nuestros Pilares de Calidad
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Protocolos, inspecciones y procesos que respaldan la calidad en
              cada etapa del desarrollo.
            </p>
          </motion.div>

          {/* Pillars — compact teaser; full detail on /quality */}
          {pillarsLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 cu-card-grid">
              {Array.from({ length: 4 }).map((_, i) => (
                <SkeletonChamferCard key={i} tone="warm" showIcon lines={1} />
              ))}
            </div>
          ) : (
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 cu-card-grid"
              variants={brandStaggerParent}
              initial="hidden"
              whileInView="visible"
              viewport={brandViewport}
            >
              {pillars.map((pillar) => {
                const Icon = pillarIcon(pillar.icon);
                return (
                  <motion.div key={pillar.id} variants={brandStaggerChild} className="h-full min-h-0">
                    <BrandFeatureCard
                      icon={Icon}
                      title={pillar.title}
                      variant="dark"
                      compact
                      showAccent={false}
                      className="h-full"
                    />
                  </motion.div>
                );
              })}
            </motion.div>
          )}

          <motion.div
            className="text-center mt-12"
            variants={brandReveal}
            initial="hidden"
            whileInView="visible"
            viewport={brandViewport}
          >
            <Link
              to={CONTENT_CANON.qualityPillars.canonical}
              className="inline-flex items-center gap-2 text-cu-orange font-montserrat font-semibold hover:gap-3 transition-all"
            >
              {canonLinkLabel("qualityPillars")}
              <ArrowRight size={18} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
            variants={brandStaggerParent}
            initial="hidden"
            whileInView="visible"
            viewport={brandViewport}
          >
            {/* Content */}
            <motion.div variants={brandReveal}>
              <span className="text-sm font-montserrat font-bold text-cu-orange uppercase tracking-widest">
                Sobre Capital Urbano
              </span>
              <h2 className="text-3xl sm:text-5xl font-montserrat font-bold text-cu-black mt-2 mb-6 text-balance">
                {BRAND_TAGLINE}
              </h2>
              <p className="text-lg text-cu-black-60 mb-8 leading-relaxed">
                {HOME_ABOUT_TEASER}
              </p>

              <div className="space-y-3 mb-8">
                {HOME_ABOUT_BULLETS.map((item, index) => (
                  <motion.div
                    key={index}
                    className="flex items-start gap-3"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <CheckCircle2
                      className="text-cu-orange flex-shrink-0 mt-1"
                      size={20}
                    />
                    <span className="text-cu-black font-montserrat font-medium">
                      {item}
                    </span>
                  </motion.div>
                ))}
              </div>

              <Link
                to="/about"
                className="inline-flex items-center gap-2 px-8 py-4 bg-cu-orange text-white font-montserrat font-semibold rounded-sm hover:bg-cu-orange-80 transition-all duration-300 group"
              >
                Conocer Más Sobre Nosotros
                <ArrowRight
                  size={20}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </Link>
            </motion.div>

            <motion.div
              className="relative min-h-[16rem] lg:min-h-0"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <BrandVideoPreview
                src="/assets/videos/SomosCapitalUrbano.mp4"
                title={BRAND_CONCEPT}
                caption="27 años de trayectoria"
              />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 sm:py-28 bg-cu-orange text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white opacity-5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-white opacity-5 rounded-full blur-3xl" />

        <motion.div
          className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
          variants={brandReveal}
          initial="hidden"
          whileInView="visible"
          viewport={brandViewport}
        >
          <h2 className="text-3xl sm:text-5xl font-montserrat font-bold mb-6 text-balance px-4">
            {BRAND_SLOGAN}
          </h2>
          <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
            Agenda una asesoría con nuestro equipo comercial y conoce el
            portafolio de desarrollos verticales en Guadalajara.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/projects"
              className="inline-flex items-center gap-2 px-8 py-4 bg-cu-black text-white font-montserrat font-semibold rounded-sm hover:bg-cu-concrete transition-all duration-300 group"
            >
              Ver Proyectos
              <ArrowRight
                size={20}
                className="group-hover:translate-x-1 transition-transform"
              />
            </Link>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 border-2 border-white text-white font-montserrat font-semibold rounded-sm hover:bg-white hover:text-cu-orange transition-all duration-300"
            >
              Contactar por WhatsApp
            </a>
          </div>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
}
