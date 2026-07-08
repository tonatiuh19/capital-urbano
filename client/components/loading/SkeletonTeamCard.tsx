import { cn } from "@/lib/utils";
import { SkeletonBlock, SkeletonLine } from "./SkeletonPrimitives";

export function SkeletonTeamCard({ featured = false }: { featured?: boolean }) {
  const avatar = featured ? "w-40 h-40" : "w-28 h-28";

  return (
    <div className="cu-chamfer-card relative pb-1 h-full" aria-hidden>
      <div className="cu-chamfer-border-tr h-full">
        <div className="cu-chamfer-fill-tr bg-cu-warm-white p-6 text-center h-full flex flex-col items-center">
          <div className={cn("cu-chamfer-border-tr mb-4", avatar)}>
            <SkeletonBlock className="cu-chamfer-fill-tr w-full h-full" />
          </div>
          <SkeletonLine className="h-4 mb-2 w-2/3 mx-auto" />
          <SkeletonLine className="h-3 mb-4 w-1/2 mx-auto" tone="warm" />
          <SkeletonLine className="h-3 w-full" tone="warm" />
          <SkeletonLine className="h-3 w-5/6 mt-2 mx-auto" tone="warm" />
        </div>
      </div>
      <div className="cu-chamfer-accent opacity-40" />
    </div>
  );
}

export function SkeletonTeamGrid({
  count = 4,
  featured = false,
  className = "grid sm:grid-cols-2 lg:grid-cols-4 gap-6 cu-card-grid",
}: {
  count?: number;
  featured?: boolean;
  className?: string;
}) {
  return (
    <div className={className} aria-busy aria-label="Cargando equipo">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonTeamCard key={i} featured={featured} />
      ))}
    </div>
  );
}
