import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type BrandFeatureCardVariant = "light" | "dark" | "warm";

const fillClass: Record<BrandFeatureCardVariant, string> = {
  light: "bg-white text-cu-black",
  dark: "bg-[#111111] text-white",
  warm: "bg-cu-warm-white text-cu-black",
};

const bodyTextClass: Record<BrandFeatureCardVariant, string> = {
  light: "text-cu-concrete",
  dark: "text-gray-400",
  warm: "text-cu-concrete",
};

export type BrandFeatureCardProps = {
  title: string;
  description?: string;
  eyebrow?: string;
  icon?: LucideIcon;
  variant?: BrandFeatureCardVariant;
  align?: "left" | "center";
  showAccent?: boolean;
  /** Title + icon only — for home teasers linking to detail pages. */
  compact?: boolean;
  children?: ReactNode;
  className?: string;
};

/**
 * Chamfered feature card (quality pillars, journey steps, etc.).
 */
export function BrandFeatureCard({
  title,
  description,
  eyebrow,
  icon: Icon,
  variant = "light",
  align = "left",
  showAccent = true,
  compact = false,
  children,
  className,
}: BrandFeatureCardProps) {
  const centered = align === "center";

  return (
    <article
      className={cn(
        "cu-chamfer-card group relative flex flex-col h-full",
        showAccent && "pb-1",
        className,
      )}
    >
      <div
        className={cn(
          "cu-chamfer-border-tr flex flex-col flex-1",
          compact ? "min-h-[8.5rem]" : "min-h-[13rem]",
        )}
      >
        <div
          className={cn(
            "cu-chamfer-fill-tr flex flex-col flex-1 h-full",
            compact ? "p-5 sm:p-6" : "p-7 sm:p-8 lg:p-10",
            fillClass[variant],
            centered && "items-center text-center",
          )}
        >
          {(Icon || eyebrow) && (
            <div
              className={cn(
                "flex items-start gap-4",
                compact ? "mb-3" : "mb-5",
                centered && "flex-col items-center",
              )}
            >
              {Icon && (
                <div className="cu-chamfer-border-tl w-12 h-12 shrink-0">
                  <div className="cu-chamfer-fill-tl bg-cu-orange w-full h-full flex items-center justify-center">
                    <Icon className="w-6 h-6 text-white" strokeWidth={1.5} />
                  </div>
                </div>
              )}
              {eyebrow && (
                <span className="text-xs font-montserrat font-bold text-cu-orange pt-1">
                  {eyebrow}
                </span>
              )}
            </div>
          )}
          <h3
            className={cn(
              "font-montserrat font-bold leading-snug",
              compact ? "text-base sm:text-lg mb-0" : "text-lg sm:text-xl mb-3",
            )}
          >
            {title}
          </h3>
          {!compact && description && (
            <p className={cn("text-sm leading-relaxed flex-1", bodyTextClass[variant])}>
              {description}
            </p>
          )}
          {children}
        </div>
      </div>
      {showAccent && <div className="cu-chamfer-accent" aria-hidden />}
    </article>
  );
}
