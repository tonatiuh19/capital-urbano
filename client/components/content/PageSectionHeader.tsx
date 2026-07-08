import type { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";
import { brandReveal, brandViewport } from "@/lib/motion";
import { cn } from "@/lib/utils";

export function PageSectionHeader({
  eyebrow,
  title,
  description,
  icon: Icon,
  align = "center",
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  icon?: LucideIcon;
  align?: "center" | "left";
  className?: string;
}) {
  const centered = align === "center";

  return (
    <motion.header
      className={cn(
        "mb-12 sm:mb-16",
        centered ? "text-center max-w-2xl mx-auto" : "max-w-3xl",
        className,
      )}
      variants={brandReveal}
      initial="hidden"
      whileInView="visible"
      viewport={brandViewport}
    >
      {Icon && (
        <div className={cn("mb-6", centered && "flex justify-center")}>
          <div className="cu-chamfer-border-tl inline-block">
            <div className="cu-chamfer-fill-tl bg-cu-black px-5 py-4 sm:px-6 sm:py-5">
              <Icon className="text-cu-orange w-7 h-7 sm:w-8 sm:h-8" strokeWidth={1.5} />
            </div>
          </div>
        </div>
      )}
      {eyebrow && (
        <p className="text-[0.65rem] sm:text-xs font-montserrat font-bold text-cu-orange uppercase tracking-[0.28em] mb-3">
          {eyebrow}
        </p>
      )}
      <h2 className="text-2xl sm:text-4xl font-montserrat font-bold text-cu-black text-balance leading-tight">
        {title}
      </h2>
      {description && (
        <p className="mt-4 text-base sm:text-lg text-cu-concrete font-josefin leading-relaxed text-balance">
          {description}
        </p>
      )}
    </motion.header>
  );
}
