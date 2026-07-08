import { cn } from "@/lib/utils";
import { SkeletonBlock, SkeletonLine } from "./SkeletonPrimitives";

type SkeletonTone = "light" | "dark" | "warm";

export function SkeletonChamferCard({
  tone = "light",
  lines = 3,
  showIcon = true,
  showEyebrow = false,
  className,
}: {
  tone?: SkeletonTone;
  lines?: number;
  showIcon?: boolean;
  showEyebrow?: boolean;
  className?: string;
}) {
  const fillTone = tone === "dark" ? "dark" : tone;

  return (
    <div className={cn("cu-chamfer-card relative pb-1", className)} aria-hidden>
      <div className="cu-chamfer-border-tr min-h-[13rem]">
        <div
          className={cn(
            "cu-chamfer-fill-tr h-full p-7 sm:p-8",
            tone === "dark" && "bg-[#111111]",
            tone === "light" && "bg-white",
            tone === "warm" && "bg-cu-warm-white",
          )}
        >
          {(showIcon || showEyebrow) && (
            <div className="flex items-start gap-4 mb-5">
              {showIcon && (
                <SkeletonBlock tone={fillTone} className="w-12 h-12 shrink-0" />
              )}
              {showEyebrow && (
                <SkeletonLine tone={fillTone} width="1/3" className="h-2.5 mt-2" />
              )}
            </div>
          )}
          <SkeletonLine tone={fillTone} className="h-5 mb-3 w-2/3" />
          <div className="space-y-2">
            {Array.from({ length: lines }).map((_, i) => (
              <SkeletonLine
                key={i}
                tone={fillTone}
                width={i === lines - 1 ? "3/4" : "full"}
                className="h-3"
              />
            ))}
          </div>
        </div>
      </div>
      <div className="cu-chamfer-accent opacity-40" />
    </div>
  );
}
