import { motion, type HTMLMotionProps } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import {
  Award,
  Building2,
  Cog,
  Home,
  ShieldCheck,
} from "lucide-react";
import { brandStaggerChild } from "@/lib/motion";
import { cn } from "@/lib/utils";

const dnaIcons: Record<string, LucideIcon> = {
  metodo: Cog,
  calidad: ShieldCheck,
  permanencia: Home,
  operacion: Building2,
  calidad_integral: Award,
};

/** @deprecated Use `.cu-dna-grid` on the parent — cards are full width of their grid cell. */
export const dnaCardWidthClass = "w-full h-full min-h-0";

export type BrandDnaCardProps = {
  index: number;
  title: string;
  description: string;
  iconKey?: string;
} & Omit<HTMLMotionProps<"article">, "title">;

/**
 * PDF brand card: chamfered top-right border, icon badge straddling the top edge,
 * bottom orange accent on the border line.
 */
export function BrandDnaCard({
  index,
  title,
  description,
  iconKey,
  className = "",
  ...motionProps
}: BrandDnaCardProps) {
  const Icon = (iconKey && dnaIcons[iconKey]) || Cog;

  return (
    <motion.article
      variants={brandStaggerChild}
      className={cn("cu-dna-card group relative flex flex-col h-full min-h-0 w-full", className)}
      {...motionProps}
    >
      {/* Icon badge — centered on the card's top border */}
      <div className="cu-dna-card__icon" aria-hidden>
        <div className="cu-chamfer-border-tl w-full h-full">
          <div className="cu-chamfer-fill-tl bg-cu-orange w-full h-full flex items-center justify-center">
            <Icon className="w-7 h-7 sm:w-8 sm:h-8 text-white" strokeWidth={1.5} />
          </div>
        </div>
      </div>

      <div className="cu-chamfer-border-tr cu-dna-card__shell flex flex-col flex-1">
        <div className="cu-chamfer-fill-tr bg-white flex flex-col flex-1 cu-dna-card__body text-left">
          <h3 className="font-montserrat font-bold text-cu-orange text-base sm:text-lg mb-3 leading-snug">
            {index}. {title}
          </h3>
          <p className="text-sm text-cu-black-80 leading-relaxed flex-1 font-josefin">
            {description}
          </p>
        </div>
      </div>

      <div className="cu-chamfer-accent" aria-hidden />
    </motion.article>
  );
}
