import { Link } from "react-router-dom";
import { ArrowRight, MapPin } from "lucide-react";
import type { Development } from "@shared/api";

/** Compact chamfered portfolio link for About / Experience teasers. */
export function BrandPortfolioCard({ project }: { project: Development }) {
  const teaser = project.description_short ?? project.tagline;

  return (
    <Link
      to={`/projects/${project.slug}`}
      className="cu-chamfer-card group relative flex flex-col h-full pb-1"
    >
      <div className="cu-chamfer-border-tr flex-1">
        <div className="cu-chamfer-fill-tr p-6 h-full flex flex-col bg-white hover:bg-cu-warm-white transition-colors">
          <h3 className="font-montserrat font-bold text-cu-black group-hover:text-cu-orange transition-colors">
            {project.name}
          </h3>
          {project.location_label && (
            <p className="flex items-center gap-1 text-sm text-cu-concrete mt-2">
              <MapPin size={14} className="text-cu-orange shrink-0" />
              {project.location_label}
            </p>
          )}
          {teaser && (
            <p className="text-sm text-cu-concrete/80 mt-2 line-clamp-2 flex-1">{teaser}</p>
          )}
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-cu-orange mt-4">
            Ver detalle <ArrowRight size={14} />
          </span>
        </div>
      </div>
      <div className="cu-chamfer-accent opacity-60 group-hover:opacity-100 transition-opacity" aria-hidden />
    </Link>
  );
}
