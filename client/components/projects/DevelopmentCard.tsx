import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { MapPin, ArrowRight } from "lucide-react";
import type { Development } from "@shared/api";
import { assetUrl } from "@/lib/api";
import { SafeImage } from "@/components/ui/SafeImage";
import { brandStaggerChild } from "@/lib/motion";

const statusLabels: Record<string, string> = {
  planning: "En planeación",
  construction: "En construcción",
  delivered: "Entregado",
  sold_out: "Agotado",
};

export function DevelopmentCard({
  project,
  index: _index = 0,
  staggered = false,
}: {
  project: Development;
  index?: number;
  /** When true, parent supplies stagger animation via variants. */
  staggered?: boolean;
}) {
  const hero = assetUrl(project.hero_image_url);
  const Wrapper = staggered ? motion.div : "div";
  const motionProps = staggered
    ? { variants: brandStaggerChild, className: "group h-full min-h-0" }
    : { className: "group h-full min-h-0" };

  return (
    <Wrapper {...motionProps}>
      <Link to={`/projects/${project.slug}`} className="block h-full flex flex-col">
        <div className="relative h-64 sm:h-80 w-full mb-4 cu-chamfer-border-tr">
          <div className="relative h-full w-full cu-chamfer-fill-tr overflow-hidden bg-cu-warm-white">
            <SafeImage
              src={hero || null}
              alt={project.name}
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              fallbackClassName="absolute inset-0 w-full h-full"
              showNameOnFallback
            />
            <div className="absolute inset-0 bg-gradient-to-t from-cu-black/70 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
              <span className="text-xs uppercase tracking-wider text-cu-orange font-semibold">
                {statusLabels[project.status] ?? project.status}
              </span>
              <h3 className="text-xl font-montserrat font-bold mt-1">{project.name}</h3>
            </div>
          </div>
        </div>
        <div className="flex items-start justify-between gap-4 min-w-0 flex-1 mt-auto">
          <div className="min-w-0 flex-1">
            {project.location_label && (
              <p className="flex items-center gap-1 text-sm text-cu-concrete mb-1">
                <MapPin size={14} className="text-cu-orange" />
                {project.location_label}
              </p>
            )}
            {project.units_label && (
              <p className="text-sm text-cu-stone">{project.units_label}</p>
            )}
            {(project.description_short ?? project.tagline) && (
              <p className="text-sm text-cu-concrete/80 mt-1 line-clamp-2">
                {project.description_short ?? project.tagline}
              </p>
            )}
          </div>
          <ArrowRight
            size={20}
            className="text-cu-orange flex-shrink-0 group-hover:translate-x-1 transition-transform"
          />
        </div>
      </Link>
    </Wrapper>
  );
}
