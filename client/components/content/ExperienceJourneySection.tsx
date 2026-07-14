import { motion } from "framer-motion";
import { Users } from "lucide-react";
import { BrandFeatureCard } from "@/components/brand/BrandFeatureCard";
import {
  DEFAULT_EXPERIENCE_OWNERS_INTEGRATION,
  journeyStepIcon,
  parseExperienceJourneySteps,
  type ExperienceJourneyStep,
} from "@/lib/experienceJourney";
import type { PublicSiteConfig } from "@/hooks/usePublicSiteConfig";

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5 },
};

type Props = {
  config?: PublicSiteConfig;
};

export function ExperienceJourneySection({ config }: Props) {
  const steps = parseExperienceJourneySteps(config?.experience_journey_steps);
  const title =
    (config?.experience_journey_title as string) || "Tu recorrido con nosotros";
  const intro =
    (config?.experience_journey_intro as string) ||
    "Cuatro etapas pensadas para que cada decisión sea informada y tranquila.";
  const ownersIntegration =
    (config?.experience_owners_integration as string)?.trim() ||
    DEFAULT_EXPERIENCE_OWNERS_INTEGRATION;

  return (
    <section className="mb-20" aria-labelledby="experience-journey-heading">
      <motion.div className="text-center max-w-2xl mx-auto mb-12" {...fadeUp}>
        <span className="text-xs font-montserrat font-bold text-cu-orange uppercase tracking-widest">
          Proceso
        </span>
        <h2
          id="experience-journey-heading"
          className="text-2xl sm:text-3xl font-montserrat font-bold text-cu-black mt-2 mb-3 leading-tight"
        >
          {title}
        </h2>
        <p className="text-cu-concrete text-sm sm:text-base leading-relaxed">{intro}</p>
      </motion.div>

      <ol className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 lg:gap-8 list-none m-0 p-0 cu-card-grid">
        {steps.map((step, i) => (
          <JourneyStepCard key={`${step.title}-${i}`} step={step} index={i} total={steps.length} />
        ))}
      </ol>

      <motion.div
        className="mt-10 max-w-3xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <BrandFeatureCard
          icon={Users}
          title="Integración de propietarios"
          description={ownersIntegration}
          variant="light"
        />
      </motion.div>
    </section>
  );
}

function JourneyStepCard({
  step,
  index,
  total,
}: {
  step: ExperienceJourneyStep;
  index: number;
  total: number;
}) {
  const Icon = journeyStepIcon(step.icon);
  const showConnector = index < total - 1;

  return (
    <motion.li
      className="relative flex"
      {...fadeUp}
      transition={{ delay: index * 0.07 }}
    >
      {showConnector && (
        <span
          className="hidden xl:block absolute top-[26px] left-[calc(50%+2rem)] right-0 h-px bg-cu-stone/25 pointer-events-none"
          aria-hidden
        />
      )}
      <article className="flex flex-1 flex-col min-h-[220px] h-full">
        <BrandFeatureCard
          eyebrow={`Paso ${index + 1}`}
          icon={Icon}
          title={step.title}
          description={step.description}
          variant="light"
          className="h-full flex-1"
        />
      </article>
    </motion.li>
  );
}
