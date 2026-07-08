import { SkeletonChamferCard } from "./SkeletonChamferCard";
import { SkeletonLine } from "./SkeletonPrimitives";

export function SkeletonContactSection() {
  return (
    <div
      className="grid lg:grid-cols-2 gap-8 lg:gap-12 max-w-6xl mx-auto min-w-0"
      aria-busy
      aria-label="Cargando contacto"
    >
      <div className="space-y-6">
        <SkeletonLine className="h-6 w-48" />
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex gap-3 items-center">
              <SkeletonLine className="h-5 w-5 shrink-0" tone="warm" />
              <SkeletonLine className="h-4 flex-1" tone="warm" />
            </div>
          ))}
        </div>
        <div className="space-y-3 pt-4">
          <SkeletonLine className="h-5 w-40" />
          {Array.from({ length: 3 }).map((_, i) => (
            <SkeletonLine key={i} className="h-3 w-full" tone="warm" />
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <SkeletonLine className="h-6 w-36" />
        <div className="space-y-3">
          <SkeletonLine className="h-10 w-full" tone="warm" />
          <SkeletonLine className="h-10 w-full" tone="warm" />
          <SkeletonLine className="h-10 w-full" tone="warm" />
          <SkeletonLine className="h-28 w-full" tone="warm" />
          <SkeletonLine className="h-11 w-full" />
        </div>
      </div>

      <div className="lg:col-span-2 space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <SkeletonChamferCard key={i} tone="warm" showIcon={false} lines={2} />
        ))}
      </div>
    </div>
  );
}
