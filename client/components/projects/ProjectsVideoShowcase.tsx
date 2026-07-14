import { motion } from "framer-motion";
import { Clapperboard, MapPin, PlayCircle } from "lucide-react";
import { BrandVideoPreview } from "@/components/media/BrandVideoPreview";
import { PORTFOLIO_VIDEO_SRC } from "@/lib/brand/copy";
import { Link } from "react-router-dom";

const fadeUp = {
  initial: { opacity: 0, y: 32 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.65 },
};

type ProjectsVideoShowcaseProps = {
  projectCount?: number;
};

export function ProjectsVideoShowcase({ projectCount = 0 }: ProjectsVideoShowcaseProps) {
  return (
    <motion.section
      className="mt-16 sm:mt-20 mb-0"
      {...fadeUp}
      aria-labelledby="projects-video-heading"
    >
      <div className="grid lg:grid-cols-2 rounded-sm overflow-hidden border border-cu-stone/20 bg-white shadow-[0_20px_50px_-28px_rgba(0,0,0,0.12)] min-h-[18rem] lg:min-h-[22rem]">
        <div className="relative bg-gradient-to-br from-cu-warm-white via-white to-cu-warm-white/90 p-8 sm:p-10 lg:p-12 flex flex-col justify-center order-2 lg:order-1 border-b lg:border-b-0 lg:border-r-2 lg:border-r-cu-orange/80">
          <div className="inline-flex items-center gap-2 text-cu-orange mb-4">
            <Clapperboard size={18} aria-hidden />
            <span className="text-xs font-montserrat font-bold uppercase tracking-[0.25em]">
              Portafolio en video
            </span>
          </div>

          <h2
            id="projects-video-heading"
            className="text-2xl sm:text-3xl font-montserrat font-bold text-cu-black leading-tight text-balance mb-4"
          >
            Desarrollos que transforman el skyline
          </h2>

          <p className="text-sm sm:text-base text-cu-concrete leading-relaxed mb-6 max-w-md">
            Recorre en video nuestros proyectos verticales: ubicación estratégica,
            arquitectura de autor y el estándar de calidad Capital Urbano en cada
            entrega.
          </p>

          <div className="flex flex-wrap gap-3 mb-6">
            {projectCount > 0 && (
              <span className="inline-flex items-center gap-1.5 rounded-sm bg-white border border-cu-stone/25 px-3 py-1.5 text-xs font-montserrat font-semibold text-cu-black shadow-sm">
                <MapPin size={14} className="text-cu-orange" />
                {projectCount}{" "}
                {projectCount === 1 ? "desarrollo activo" : "desarrollos activos"}
              </span>
            )}
            <span className="inline-flex items-center gap-1.5 rounded-sm bg-cu-orange/10 border border-cu-orange/25 px-3 py-1.5 text-xs font-montserrat font-semibold text-cu-orange">
              <PlayCircle size={14} />
              Vista previa con audio al abrir
            </span>
          </div>

          <p className="text-xs text-cu-concrete font-montserrat">
            Desplázate al mapa arriba para ubicaciones ·{" "}
            <Link to="/about" className="text-cu-orange font-semibold hover:underline">
              Conoce nuestra historia
            </Link>
          </p>
        </div>

        <div className="relative order-1 lg:order-2 min-h-[14rem] sm:min-h-[16rem] lg:min-h-0 bg-cu-warm-white">
          <BrandVideoPreview
            src={PORTFOLIO_VIDEO_SRC}
            title="Capital Urbano"
            caption="Nuestros desarrollos en la ciudad"
            variant="cinema"
            className="h-full min-h-[14rem] sm:min-h-[16rem] lg:min-h-[22rem] rounded-none border-0 ring-0 shadow-none"
          />
        </div>
      </div>
    </motion.section>
  );
}
