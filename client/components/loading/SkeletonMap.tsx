import { SkeletonBlock } from "./SkeletonPrimitives";

export function SkeletonMap({ className = "h-[420px]" }: { className?: string }) {
  return (
    <div
      className={`cu-chamfer-border-tr w-full ${className}`}
      aria-busy
      aria-label="Cargando mapa"
    >
      <SkeletonBlock className="cu-chamfer-fill-tr w-full h-full" tone="warm" />
    </div>
  );
}
