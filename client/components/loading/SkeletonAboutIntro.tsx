import { SkeletonLine } from "./SkeletonPrimitives";
import { SkeletonStatsPanel } from "./SkeletonStatsPanel";

export function SkeletonAboutIntro() {
  return (
    <div
      className="grid lg:grid-cols-12 gap-10 lg:gap-12 items-start"
      aria-busy
      aria-label="Cargando historia"
    >
      <div className="lg:col-span-7 space-y-10 pl-6 sm:pl-8 border-l-2 border-cu-stone/15">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="space-y-3">
            <SkeletonLine className="h-6 w-2/3" />
            <SkeletonLine className="h-3 w-full" tone="warm" />
            <SkeletonLine className="h-3 w-full" tone="warm" />
            <SkeletonLine className="h-3 w-4/5" tone="warm" />
          </div>
        ))}
      </div>
      <div className="lg:col-span-5">
        <SkeletonStatsPanel />
      </div>
    </div>
  );
}
