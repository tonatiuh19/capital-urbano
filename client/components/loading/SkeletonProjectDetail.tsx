import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SkeletonBlock, SkeletonLine } from "./SkeletonPrimitives";

export function SkeletonProjectDetail() {
  return (
    <div className="cu-page min-h-screen bg-white">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10" aria-busy aria-label="Cargando proyecto">
        <SkeletonLine className="h-4 w-32 mb-8" tone="warm" />
        <div className="cu-chamfer-border-tr aspect-[16/9] w-full mb-10">
          <SkeletonBlock className="cu-chamfer-fill-tr w-full h-full" />
        </div>
        <SkeletonLine className="h-10 w-2/3 mb-4" />
        <SkeletonLine className="h-4 w-1/3 mb-8" tone="warm" />
        <div className="grid lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonLine key={i} tone="warm" className="h-3" width={i % 2 === 0 ? "full" : "3/4"} />
            ))}
          </div>
          <div className="space-y-4">
            <SkeletonChamferSidebar />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

function SkeletonChamferSidebar() {
  return (
    <div className="cu-chamfer-card relative pb-1">
      <div className="cu-chamfer-border-tr">
        <div className="cu-chamfer-fill-tr bg-cu-warm-white p-6 space-y-3">
          <SkeletonLine className="h-4 w-1/2" />
          <SkeletonLine className="h-3 w-full" tone="warm" />
          <SkeletonLine className="h-3 w-full" tone="warm" />
          <SkeletonBlock className="h-10 w-full mt-4" />
        </div>
      </div>
    </div>
  );
}
