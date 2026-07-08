import { SkeletonChamferCard } from "./SkeletonChamferCard";

export function SkeletonDnaGrid({ count = 5 }: { count?: number }) {
  return (
    <div className="cu-dna-grid" aria-busy aria-label="Cargando pilares">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonChamferCard
          key={i}
          tone="warm"
          showIcon
          className="h-full min-h-[13.5rem]"
        />
      ))}
    </div>
  );
}
