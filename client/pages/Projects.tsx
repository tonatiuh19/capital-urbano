import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PageMeta } from "@/components/seo/PageMeta";
import { PageHero } from "@/components/content/PageHero";
import { DevelopmentCard } from "@/components/projects/DevelopmentCard";
import { DevelopmentsMap } from "@/components/projects/DevelopmentsMap";
import { ProjectsVideoShowcase } from "@/components/projects/ProjectsVideoShowcase";
import { SkeletonDevelopmentGrid, SkeletonMap } from "@/components/loading";
import { useShowQuerySkeleton } from "@/hooks/useShowQuerySkeleton";
import { apiGet } from "@/lib/api";
import type { Development } from "@shared/api";
import { BRAND_VALUE_PROPOSITION } from "@/lib/brand/copy";

export default function Projects() {
  const devQ = useQuery({
    queryKey: ["developments", "public"],
    queryFn: () => apiGet<{ developments: Development[] }>("/api/developments.php"),
  });

  const loading = useShowQuerySkeleton(devQ);
  const projects = devQ.data?.developments ?? [];
  const error = devQ.error;

  return (
    <div className="cu-page min-h-screen bg-white">
      <PageMeta route="projects" />
      <Header />
      <section className="pb-20 sm:pb-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <PageHero
            title="Proyectos"
            subtitle={BRAND_VALUE_PROPOSITION}
          />

          {loading && (
            <>
              <SkeletonMap className="mb-12 sm:mb-16 h-[420px] sm:h-[480px]" />
              <SkeletonDevelopmentGrid count={6} />
            </>
          )}

          {!loading && error && (
            <p className="text-center text-red-600">
              No se pudieron cargar los proyectos.
            </p>
          )}

          {!loading && !error && (
            <>
              <DevelopmentsMap
                className="mb-12 sm:mb-16 h-[420px] sm:h-[480px]"
                title="Mapa del portafolio"
                subtitle="Explora la ubicación de cada desarrollo en Guadalajara"
              />

              <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-8">
                <div>
                  <span className="text-xs font-montserrat font-bold text-cu-orange uppercase tracking-widest">
                    Fichas de proyecto
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-montserrat font-bold text-cu-black mt-1">
                    Todos los desarrollos
                  </h2>
                </div>
                {projects.length > 0 && (
                  <p className="text-sm text-cu-concrete font-montserrat">
                    {projects.length}{" "}
                    {projects.length === 1 ? "proyecto en portafolio" : "proyectos en portafolio"}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 cu-card-grid">
                {projects.map((p, i) => (
                  <DevelopmentCard key={p.id} project={p} index={i} />
                ))}
              </div>

              <ProjectsVideoShowcase projectCount={projects.length} />
            </>
          )}
        </div>
      </section>
      <Footer />
    </div>
  );
}
