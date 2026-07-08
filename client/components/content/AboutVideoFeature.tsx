import { motion } from "framer-motion";
import { Building2, Film } from "lucide-react";
import { BrandVideoPreview } from "@/components/media/BrandVideoPreview";

const VIDEO_SRC = "/assets/videos/CapitalUrbano.mp4";

const fadeUp = {
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 },
};

export function AboutVideoFeature() {
  return (
    <motion.section
      className="relative mb-20 sm:mb-28 overflow-hidden"
      {...fadeUp}
      aria-labelledby="about-video-heading"
    >
      <div className="absolute inset-0 -mx-4 sm:-mx-6 lg:-mx-8 bg-gradient-to-br from-cu-warm-white via-white to-cu-warm-white/80 rounded-sm pointer-events-none" />

      <div className="relative grid lg:grid-cols-12 gap-10 lg:gap-12 items-center">
        <div className="lg:col-span-5 space-y-5">
          <div className="inline-flex items-center gap-2 text-cu-orange">
            <Film size={18} aria-hidden />
            <span className="text-xs font-montserrat font-bold uppercase tracking-[0.25em]">
              Nuestra esencia
            </span>
          </div>
          <h2
            id="about-video-heading"
            className="text-2xl sm:text-3xl lg:text-4xl font-montserrat font-bold text-cu-black leading-tight text-balance"
          >
            Capital Urbano en movimiento
          </h2>
          <p className="text-cu-concrete leading-relaxed">
            Conoce la visión, el equipo y el ADN de la desarrolladora que está
            transformando el skyline de Guadalajara con proyectos verticales de
            excelencia.
          </p>
          <ul className="space-y-3 text-sm text-cu-black">
            {[
              "Trayectoria y liderazgo en desarrollo inmobiliario",
              "Procesos constructivos y estándares internacionales",
              "Compromiso con comunidades y plusvalía urbana",
            ].map((item) => (
              <li key={item} className="flex gap-3">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-cu-orange" />
                <span className="font-montserrat">{item}</span>
              </li>
            ))}
          </ul>
          <p className="flex items-center gap-2 text-xs text-cu-concrete font-montserrat pt-1">
            <Building2 size={14} className="text-cu-orange shrink-0" />
            Haz clic en el reproductor para ver el documental completo con audio.
          </p>
        </div>

        <div className="lg:col-span-7">
          <BrandVideoPreview
            src={VIDEO_SRC}
            title="Capital Urbano"
            caption="Desarrollos que definen la ciudad"
            variant="cinema"
          />
        </div>
      </div>
    </motion.section>
  );
}
