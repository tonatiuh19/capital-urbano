import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PageMeta } from "@/components/seo/PageMeta";
import { PageHero } from "@/components/content/PageHero";
import { AboutIntroSection } from "@/components/content/AboutIntroSection";
import { AboutVideoFeature } from "@/components/content/AboutVideoFeature";
import { PageCtaBand } from "@/components/content/PageCtaBand";
import { SiteStatsStrip } from "@/components/content/SiteStatsStrip";
import { BrandPortfolioCard } from "@/components/projects/BrandPortfolioCard";
import { TeamProfileModal } from "@/components/team/TeamProfileModal";
import { apiGet, assetUrl } from "@/lib/api";
import { usePublicSiteConfig } from "@/hooks/usePublicSiteConfig";
import type { CmsPage, Development, TeamMember } from "@shared/api";
import { Linkedin, MapPin } from "lucide-react";
import { PageSectionHeader } from "@/components/content/PageSectionHeader";
import { BRAND_TAGLINE } from "@/lib/brand/copy";
import { BrandStrategyPanel } from "@/components/brand/BrandStrategyPanel";
import {
  brandReveal,
  brandStaggerParent,
  brandViewport,
} from "@/lib/motion";
import {
  SkeletonAboutIntro,
  SkeletonDevelopmentGrid,
  SkeletonTeamGrid,
} from "@/components/loading";
import { useShowQuerySkeleton } from "@/hooks/useShowQuerySkeleton";
import {
  ABOUT_LEADERSHIP,
  ABOUT_MILESTONES,
  ABOUT_TEAM,
  ABOUT_TECHNICAL,
  ABOUT_VALUES,
  ABOUT_WHY_BULLETS,
} from "@/lib/copy/aboutPage";
import { resolveTeamSection } from "@/lib/teamSection";

const panelVariants = ["orange", "black", "gray"] as const;

const fadeUp = {
  variants: brandReveal,
  initial: "hidden" as const,
  whileInView: "visible" as const,
  viewport: brandViewport,
};

export default function About() {
  const { data: config } = usePublicSiteConfig();
  const pageQ = useQuery({
    queryKey: ["page", "about"],
    queryFn: () => apiGet<{ page: CmsPage | null }>("/api/pages.php?slug=about"),
  });
  const teamQ = useQuery({
    queryKey: ["team"],
    queryFn: () => apiGet<{ members: TeamMember[] }>("/api/team.php"),
  });
  const devQ = useQuery({
    queryKey: ["developments", "public"],
    queryFn: () => apiGet<{ developments: Development[] }>("/api/developments.php"),
  });

  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);

  const pageLoading = useShowQuerySkeleton(pageQ);
  const teamLoading = useShowQuerySkeleton(teamQ);
  const devLoading = useShowQuerySkeleton(devQ);

  const page = pageQ.data?.page;
  const allMembers = teamQ.data?.members ?? [];
  const leadership = allMembers.filter((m) => resolveTeamSection(m) === "leadership");
  const technicalStaff = allMembers.filter((m) => resolveTeamSection(m) === "technical");
  const team = allMembers.filter((m) => resolveTeamSection(m) === "general");
  const projects = devQ.data?.developments ?? [];
  const heroSubtitle =
    (config?.about_hero_subtitle as string) ||
    page?.meta_description ||
    BRAND_TAGLINE;
  const leadershipTitle =
    (config?.about_leadership_title as string) || ABOUT_LEADERSHIP.title;
  const leadershipSubtitle =
    (config?.about_leadership_subtitle as string) || ABOUT_LEADERSHIP.subtitle;
  const technicalTitle =
    (config?.about_technical_title as string) || ABOUT_TECHNICAL.title;
  const technicalSubtitle =
    (config?.about_technical_subtitle as string) || ABOUT_TECHNICAL.subtitle;
  const teamTitle = (config?.about_team_title as string) || ABOUT_TEAM.title;
  const teamSubtitle = (config?.about_team_subtitle as string) || ABOUT_TEAM.subtitle;

  return (
    <div className="cu-page min-h-screen bg-white">
      <PageMeta route="about" page={page} />
      <Header />

      <section className="relative pb-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-cu-warm-white via-white to-white" />
        <div className="absolute top-20 right-0 w-80 h-80 bg-cu-orange/5 rounded-full blur-3xl" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <PageHero
            label="Capital Urbano"
            title={page?.title ?? "Nosotros"}
            subtitle={heroSubtitle}
          />
        </div>
      </section>

      <section className="pb-16 sm:pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div id="historia" className="mb-20 sm:mb-28 scroll-mt-36">
            {pageLoading && <SkeletonAboutIntro />}
            {!pageLoading && page?.body_markdown && (
              <AboutIntroSection markdown={page.body_markdown} />
            )}
          </div>

          <AboutVideoFeature />

          <motion.div id="valores" className="mb-20 scroll-mt-36" {...fadeUp}>
            <PageSectionHeader
              eyebrow="ADN"
              title="Valores y método"
              description="Tres principios que guían cada decisión — y por qué ese enfoque genera permanencia urbana."
              align="center"
              className="mb-10"
            />
            <motion.div
              className="space-y-4 max-w-3xl mx-auto mb-10"
              variants={brandStaggerParent}
              initial="hidden"
              whileInView="visible"
              viewport={brandViewport}
            >
              {ABOUT_VALUES.map((v, index) => (
                <BrandStrategyPanel
                  key={v.key}
                  variant={panelVariants[index] ?? "gray"}
                  title={v.title}
                >
                  {v.text}
                </BrandStrategyPanel>
              ))}
            </motion.div>
            <div className="max-w-3xl mx-auto grid sm:grid-cols-2 gap-4 cu-card-grid">
              {ABOUT_WHY_BULLETS.map((bullet) => (
                <div key={bullet} className="cu-chamfer-border-tl h-full">
                  <div className="cu-chamfer-fill-tl bg-cu-warm-white px-5 py-4 text-sm text-cu-concrete font-josefin leading-relaxed h-full">
                    <span className="block w-6 h-0.5 bg-cu-orange mb-3" aria-hidden />
                    {bullet}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            id="trayectoria"
            className="mb-20 scroll-mt-36 space-y-12"
            {...fadeUp}
          >
            <div>
              <PageSectionHeader
                eyebrow="Trayectoria"
                title="Cifras y hitos"
                description="27 años de trayectoria en desarrollo vertical transformando el skyline de Guadalajara."
                align="center"
                className="mb-8"
              />
              <SiteStatsStrip />
            </div>
            <div className="py-12 px-8 sm:px-12 bg-cu-black text-white rounded-sm">
              <h3 className="text-xl font-montserrat font-bold text-center mb-10">
                Hitos que definen nuestra historia
              </h3>
              <div className="grid md:grid-cols-3 gap-8">
                {ABOUT_MILESTONES.map((m) => (
                  <div
                    key={m.year}
                    className="text-center border-t border-white/10 pt-6 md:border-t-0 md:pt-0"
                  >
                    <p className="text-3xl font-montserrat font-bold text-cu-orange mb-2">
                      {m.year}
                    </p>
                    <p className="text-sm text-gray-400 leading-relaxed">{m.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {devLoading && (
            <div className="mb-20">
              <SkeletonDevelopmentGrid
                count={3}
                className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 cu-card-grid"
              />
            </div>
          )}

          {!devLoading && projects.length > 0 && (
            <motion.div id="portafolio" className="mb-20 scroll-mt-36" {...fadeUp}>
              <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
                <div>
                  <span className="text-xs font-montserrat font-bold text-cu-orange uppercase tracking-widest">
                    Portafolio
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-montserrat font-bold text-cu-black mt-1">
                    Desarrollos activos
                  </h2>
                </div>
                <Link
                  to="/projects"
                  className="inline-flex items-center gap-2 text-cu-orange font-montserrat font-semibold text-sm"
                >
                  <MapPin size={16} /> Ver mapa y fichas
                </Link>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 cu-card-grid">
                {projects.map((p) => (
                  <BrandPortfolioCard key={p.id} project={p} />
                ))}
              </div>
            </motion.div>
          )}

          <div id="equipo" className="scroll-mt-36">
            {teamLoading && (
              <>
                <SkeletonTeamGrid
                  count={3}
                  featured
                  className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-20 cu-card-grid"
                />
                <SkeletonTeamGrid
                  count={4}
                  className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12 cu-card-grid"
                />
              </>
            )}

            {!teamLoading && leadership.length > 0 && (
              <motion.div className="mb-20" {...fadeUp}>
                <h2 className="text-3xl sm:text-4xl font-montserrat font-bold text-cu-black text-center mb-4">
                  {leadershipTitle}
                </h2>
                <p className="text-center text-cu-concrete max-w-xl mx-auto mb-12">
                  {leadershipSubtitle}
                </p>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 cu-card-grid">
                  {leadership.map((m) => (
                    <TeamCard
                      key={m.id}
                      member={m}
                      featured
                      onSelect={() => setSelectedMember(m)}
                    />
                  ))}
                </div>
              </motion.div>
            )}

            {!teamLoading && technicalStaff.length > 0 && (
              <motion.div className="mb-20" {...fadeUp}>
                <h2 className="text-2xl sm:text-3xl font-montserrat font-bold text-cu-black text-center mb-4">
                  {technicalTitle}
                </h2>
                <p className="text-center text-cu-concrete max-w-lg mx-auto mb-10 text-sm">
                  {technicalSubtitle}
                </p>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 cu-card-grid">
                  {technicalStaff.map((m) => (
                    <TeamCard
                      key={m.id}
                      member={m}
                      onSelect={() => setSelectedMember(m)}
                    />
                  ))}
                </div>
              </motion.div>
            )}

            {!teamLoading && team.length > 0 && (
              <motion.div className="mb-12" {...fadeUp}>
                <h2 className="text-2xl font-montserrat font-bold text-cu-black text-center mb-4">
                  {teamTitle}
                </h2>
                <p className="text-center text-cu-concrete max-w-lg mx-auto mb-10 text-sm">
                  {teamSubtitle}
                </p>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 cu-card-grid">
                  {team.map((m) => (
                    <TeamCard
                      key={m.id}
                      member={m}
                      onSelect={() => setSelectedMember(m)}
                    />
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          <PageCtaBand />
        </div>
      </section>

      <TeamProfileModal
        member={selectedMember}
        open={selectedMember !== null}
        onOpenChange={(open) => !open && setSelectedMember(null)}
      />

      <Footer />
    </div>
  );
}

function initials(name: string): string {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

function TeamCard({
  member: m,
  featured = false,
  onSelect,
}: {
  member: TeamMember;
  featured?: boolean;
  onSelect: () => void;
}) {
  const [photoFailed, setPhotoFailed] = useState(false);
  const size = featured ? "w-40 h-40" : "w-28 h-28";
  const showPhoto = m.photo_url && !photoFailed;
  const teaser = m.bio_short;

  return (
    <button
      type="button"
      onClick={onSelect}
      className={`cu-chamfer-card group relative flex flex-col h-full text-center pb-1 w-full cursor-pointer text-left ${
        featured ? "" : ""
      }`}
    >
      <div className="cu-chamfer-border-tr flex-1">
        <div
          className={`cu-chamfer-fill-tr p-6 h-full flex flex-col items-center ${
            featured ? "bg-cu-warm-white" : "bg-white"
          }`}
        >
          <div
            className={`mx-auto mb-4 cu-chamfer-border-tr overflow-hidden flex items-center justify-center bg-gradient-to-br from-cu-orange to-cu-orange-80 ${size}`}
          >
            <div className="cu-chamfer-fill-tr w-full h-full flex items-center justify-center">
              {showPhoto ? (
                <img
                  src={assetUrl(m.photo_url)}
                  alt={m.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={() => setPhotoFailed(true)}
                />
              ) : (
                <span
                  className={`font-montserrat font-bold text-white ${featured ? "text-3xl" : "text-xl"}`}
                >
                  {initials(m.name)}
                </span>
              )}
            </div>
          </div>
          <h3 className="font-montserrat font-bold text-cu-black group-hover:text-cu-orange transition-colors">
            {m.name}
          </h3>
          {m.role_title && (
            <p className="text-sm text-cu-orange mt-1 font-medium">{m.role_title}</p>
          )}
          {teaser && (
            <p className="text-sm text-cu-concrete mt-3 leading-relaxed flex-1 text-center w-full line-clamp-3">
              {teaser}
            </p>
          )}
          <span className="mt-3 text-xs font-semibold text-cu-orange">Ver perfil</span>
          {m.linkedin_url ? (
            <a
              href={m.linkedin_url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="inline-flex mt-2 text-cu-concrete hover:text-cu-orange"
              aria-label={`LinkedIn de ${m.name}`}
            >
              <Linkedin size={18} />
            </a>
          ) : (
            <span className="mt-2 h-[18px]" aria-hidden />
          )}
        </div>
      </div>
      <div className="cu-chamfer-accent" aria-hidden />
    </button>
  );
}
