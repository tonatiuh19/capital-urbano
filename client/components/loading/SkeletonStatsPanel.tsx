import { cn } from "@/lib/utils";
import { SkeletonLine } from "./SkeletonPrimitives";

export function SkeletonStatsPanel({
  variant = "light",
  className,
}: {
  variant?: "light" | "dark";
  className?: string;
}) {
  const dark = variant === "dark";

  return (
    <div
      className={cn("cu-chamfer-card relative pb-1 max-w-5xl mx-auto", className)}
      aria-busy
      aria-label="Cargando estadísticas"
    >
      <div className="cu-chamfer-border-tr">
        <div
          className={cn(
            "cu-chamfer-fill-tr px-6 py-10 sm:px-12 sm:py-12",
            dark ? "bg-cu-black-80" : "bg-white",
          )}
        >
          <div
            className={cn(
              "grid grid-cols-2 lg:grid-cols-4 gap-y-10 gap-x-6 lg:gap-0",
              dark && "lg:divide-x lg:divide-white/15",
            )}
          >
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="text-center px-2 sm:px-4 space-y-2">
                <SkeletonLine
                  className="h-10 sm:h-12 mx-auto w-2/3"
                  tone={dark ? "dark" : "light"}
                />
                <SkeletonLine
                  className="h-3 mx-auto w-4/5"
                  tone={dark ? "dark" : "warm"}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className={cn("cu-chamfer-accent", dark ? "" : "opacity-80")} aria-hidden />
    </div>
  );
}
