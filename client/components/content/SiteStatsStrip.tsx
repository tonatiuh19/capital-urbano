import { motion } from "framer-motion";
import { usePublicSiteConfig, formatStat, type PublicSiteConfig } from "@/hooks/usePublicSiteConfig";
import { useShowQuerySkeleton } from "@/hooks/useShowQuerySkeleton";
import { SkeletonStatsPanel } from "@/components/loading";
import { cn } from "@/lib/utils";

const stats = [
  { key: "stat_years_experience", label: "Años experiencia", suffix: "+" },
  { key: "stat_sqm_built", label: "m² construidos", suffix: "+" },
  { key: "stat_sqm_developed", label: "m² desarrollados", suffix: "+" },
  { key: "stat_families", label: "Familias", suffix: "+" },
] as const;

function StatsGrid({
  dark,
  config,
}: {
  dark: boolean;
  config: PublicSiteConfig | undefined;
}) {
  return (
    <div
      className={cn(
        "grid grid-cols-2 lg:grid-cols-4 gap-y-10 gap-x-6 lg:gap-0",
        dark ? "lg:divide-x lg:divide-white/15" : "",
      )}
    >
      {stats.map((s, index) => (
        <div
          key={s.key}
          className={cn(
            "text-center px-2 sm:px-4",
            !dark && index > 0 && "lg:border-l lg:border-cu-stone/15",
          )}
        >
          <div
            className={cn(
              "font-montserrat font-bold text-cu-orange mb-2 tabular-nums tracking-tight",
              dark ? "text-4xl sm:text-5xl" : "text-3xl sm:text-4xl",
            )}
          >
            {formatStat(config?.[s.key], s.suffix)}
          </div>
          <p
            className={cn(
              "text-xs sm:text-sm font-montserrat font-medium leading-snug text-balance",
              dark
                ? "text-cu-black-20 uppercase tracking-[0.12em]"
                : "text-cu-concrete font-josefin",
            )}
          >
            {s.label}
          </p>
        </div>
      ))}
    </div>
  );
}

export function SiteStatsStrip({ variant = "light" }: { variant?: "light" | "dark" }) {
  const configQ = usePublicSiteConfig();
  const loading = useShowQuerySkeleton(configQ);
  const config = configQ.data;
  const dark = variant === "dark";

  if (loading) {
    return <SkeletonStatsPanel variant={dark ? "dark" : "light"} />;
  }

  if (dark) {
    return (
      <motion.div
        className="cu-chamfer-card relative pb-1 max-w-5xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.55 }}
      >
        <div className="cu-chamfer-border-tr">
          <div className="cu-chamfer-fill-tr bg-cu-black-80 px-6 py-10 sm:px-12 sm:py-12">
            <StatsGrid dark config={config} />
          </div>
        </div>
        <div className="cu-chamfer-accent" aria-hidden />
      </motion.div>
    );
  }

  return (
    <motion.div
      className="cu-chamfer-card relative pb-1 max-w-5xl mx-auto"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <div className="cu-chamfer-border-tr">
        <div className="cu-chamfer-fill-tr bg-white px-6 py-10 sm:px-10 sm:py-12">
          <StatsGrid dark={false} config={config} />
        </div>
      </div>
      <div className="cu-chamfer-accent opacity-80" aria-hidden />
    </motion.div>
  );
}
