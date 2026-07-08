import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { BRAND_SLOGAN, BRAND_TAGLINE } from "@/lib/brand/copy";

export function PageCtaBand({
  title = BRAND_SLOGAN,
  subtitle = `${BRAND_TAGLINE}. Conoce nuestros desarrollos o agenda una asesoría con el equipo comercial.`,
  primaryLabel = "Ver proyectos",
  primaryTo = "/projects",
  secondaryLabel = "Contactar",
  secondaryTo = "/contact",
}: {
  title?: string;
  subtitle?: string;
  primaryLabel?: string;
  primaryTo?: string;
  secondaryLabel?: string;
  secondaryTo?: string;
}) {
  return (
    <motion.section
      className="mt-20 sm:mt-28 py-16 sm:py-20 bg-cu-orange text-white rounded-sm relative overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      <div className="absolute inset-0 opacity-10 cu-urban-pattern" />
      <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
        <h2 className="text-2xl sm:text-3xl font-montserrat font-bold mb-3">{title}</h2>
        <p className="text-white/90 mb-8">{subtitle}</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-stretch sm:items-center max-w-md sm:max-w-none mx-auto">
          <Link
            to={primaryTo}
            className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-4 bg-white text-cu-orange font-montserrat font-semibold rounded-sm hover:bg-cu-warm-white transition-colors"
          >
            {primaryLabel}
            <ArrowRight size={18} />
          </Link>
          <Link
            to={secondaryTo}
            className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-4 border-2 border-white text-white font-montserrat font-semibold rounded-sm hover:bg-white/10 transition-colors"
          >
            {secondaryLabel}
          </Link>
        </div>
      </div>
    </motion.section>
  );
}
