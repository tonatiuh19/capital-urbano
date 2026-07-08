import { motion } from "framer-motion";
import { BRAND_WHY_IT_WORKS } from "@/lib/brand/copy";
import { brandReveal, brandViewport } from "@/lib/motion";
import { BrandBulletList } from "./BrandStrategyPanel";

/** Black panel with chamfered bottom-right (PDF “Por qué funciona”). */
export function BrandWhyPanel({ className = "" }: { className?: string }) {
  return (
    <motion.div
      className={`cu-chamfer-border-br w-full text-left ${className}`}
      variants={brandReveal}
      initial="hidden"
      whileInView="visible"
      viewport={brandViewport}
    >
      <div className="cu-chamfer-fill-br bg-cu-black text-white px-8 py-7 sm:px-10 sm:py-8">
        <h3 className="font-montserrat font-bold text-cu-orange text-xl sm:text-2xl mb-5">
          Por qué funciona
        </h3>
        <BrandBulletList items={[...BRAND_WHY_IT_WORKS]} />
      </div>
    </motion.div>
  );
}
