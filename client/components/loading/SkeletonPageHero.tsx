import { SkeletonLine } from "./SkeletonPrimitives";

export function SkeletonPageHero({ dark = false }: { dark?: boolean }) {
  const tone = dark ? "dark" : "light";

  return (
    <div className="py-12 sm:py-16 space-y-4 max-w-3xl" aria-busy aria-label="Cargando">
      <SkeletonLine tone={tone} className="h-3 w-32" />
      <SkeletonLine tone={tone} className="h-10 sm:h-12 w-4/5" />
      <SkeletonLine tone={tone} className="h-4 w-full" />
      <SkeletonLine tone={tone} className="h-4 w-2/3" />
    </div>
  );
}
