import { SkeletonBlock, SkeletonLine } from "./SkeletonPrimitives";

export function SkeletonDevelopmentCard() {
  return (
    <div aria-hidden>
      <div className="cu-chamfer-border-tr h-64 sm:h-80 w-full mb-4">
        <SkeletonBlock className="cu-chamfer-fill-tr h-full w-full" />
      </div>
      <SkeletonLine className="h-4 mb-2 w-2/3" />
      <SkeletonLine className="h-3 w-1/2" tone="warm" />
    </div>
  );
}

export function SkeletonDevelopmentGrid({
  count = 6,
  className = "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 cu-card-grid",
}: {
  count?: number;
  className?: string;
}) {
  return (
    <div className={className} aria-busy aria-label="Cargando proyectos">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonDevelopmentCard key={i} />
      ))}
    </div>
  );
}
