import { cn } from "@/lib/utils";

type SkeletonTone = "light" | "dark" | "warm";

const toneClass: Record<SkeletonTone, string> = {
  light: "cu-skeleton",
  dark: "cu-skeleton cu-skeleton--dark",
  warm: "cu-skeleton cu-skeleton--warm",
};

export function SkeletonBlock({
  className,
  tone = "light",
}: {
  className?: string;
  tone?: SkeletonTone;
}) {
  return (
    <div
      className={cn(toneClass[tone], "min-h-[0.75rem] shrink-0", className)}
      aria-hidden
    />
  );
}

export function SkeletonLine({
  className,
  tone = "light",
  width = "full",
}: {
  className?: string;
  tone?: SkeletonTone;
  width?: "full" | "3/4" | "1/2" | "1/3";
}) {
  const widthClass = {
    full: "w-full",
    "3/4": "w-3/4",
    "1/2": "w-1/2",
    "1/3": "w-1/3",
  }[width];

  return (
    <SkeletonBlock
      tone={tone}
      className={cn("h-3", widthClass, className)}
    />
  );
}

export function SkeletonCircle({
  className,
  tone = "light",
}: {
  className?: string;
  tone?: SkeletonTone;
}) {
  return (
    <SkeletonBlock
      tone={tone}
      className={cn("rounded-full", className)}
    />
  );
}
