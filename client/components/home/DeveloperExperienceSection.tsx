import { useState } from "react";
import { motion } from "framer-motion";
import {
  Boxes,
  Building2,
  ChevronDown,
  ClipboardCheck,
  Cpu,
  Handshake,
  Headphones,
  Layers,
  MapPin,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";
import { BrandFeatureCard } from "@/components/brand/BrandFeatureCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  DEVELOPER_BRAND_ALLIANCES,
  DEVELOPER_COMPANIES,
  DEVELOPER_CREDENTIALS,
  DEVELOPER_EXPERIENCE_INTRO,
  DEVELOPER_LEADER,
  DEVELOPER_METHOD_ITEMS,
  DEVELOPER_MISSION_PILLARS,
  DEVELOPER_PORTFOLIO,
  DEVELOPER_PORTFOLIO_DETAIL,
  DEVELOPER_STATS,
  DEVELOPER_VISION,
  DEVELOPER_ZONES,
} from "@/lib/copy/developerExperience";
import { brandReveal, brandViewport } from "@/lib/motion";
import { cn } from "@/lib/utils";

const METHOD_ICONS: Record<string, LucideIcon> = {
  "shield-check": ShieldCheck,
  headphones: Headphones,
  layers: Layers,
};

const PILLAR_ICONS: Record<string, LucideIcon> = {
  handshake: Handshake,
  boxes: Boxes,
  "clipboard-check": ClipboardCheck,
  cpu: Cpu,
};

function DetailToggle({ label, children }: { label: string; children: string }) {
  const [open, setOpen] = useState(false);
  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger className="group flex items-center gap-2 text-xs font-montserrat font-semibold text-cu-orange uppercase tracking-wider mt-4 hover:text-cu-orange-80 transition-colors">
        <ChevronDown
          size={16}
          className={cn("transition-transform duration-300", open && "rotate-180")}
        />
        {open ? "Ocultar detalle" : label}
      </CollapsibleTrigger>
      <CollapsibleContent className="overflow-hidden data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up">
        <p className="text-sm text-white/70 font-josefin leading-relaxed mt-3 pt-3 border-t border-white/15">
          {children}
        </p>
      </CollapsibleContent>
    </Collapsible>
  );
}

export function DeveloperExperienceSection() {
  return (
    <section
      className="relative py-20 sm:py-28 overflow-hidden scroll-mt-28 bg-cu-black text-white"
      aria-labelledby="developer-experience-heading"
    >
      <div
        className="absolute inset-0 opacity-[0.35] bg-[linear-gradient(90deg,rgba(255,153,51,0.08)_1px,transparent_1px),linear-gradient(0deg,rgba(255,153,51,0.06)_1px,transparent_1px)] bg-[size:48px_48px]"
        aria-hidden
      />
      <div className="absolute top-0 right-0 w-[32rem] h-[32rem] bg-cu-orange/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-cu-orange/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.header
          className="text-center max-w-3xl mx-auto mb-12 sm:mb-16"
          variants={brandReveal}
          initial="hidden"
          whileInView="visible"
          viewport={brandViewport}
        >
          <span className="text-xs font-montserrat font-bold text-cu-orange uppercase tracking-[0.25em]">
            Trayectoria
          </span>
          <h2
            id="developer-experience-heading"
            className="text-3xl sm:text-4xl lg:text-5xl font-montserrat font-bold mt-3 text-balance"
          >
            Experiencia de Capital Urbano
          </h2>
          <p className="text-sm sm:text-base text-white/70 mt-4 leading-relaxed font-josefin">
            {DEVELOPER_EXPERIENCE_INTRO}
          </p>
        </motion.header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          {/* Leader + stats sidebar */}
          <motion.aside
            className="lg:col-span-4 lg:sticky lg:top-28"
            variants={brandReveal}
            initial="hidden"
            whileInView="visible"
            viewport={brandViewport}
          >
            <div className="cu-chamfer-card relative pb-1">
              <div className="cu-chamfer-border-tr">
                <div className="cu-chamfer-fill-tr bg-[#141414] p-6 sm:p-8 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
                  <div className="flex items-start gap-4 mb-8">
                    <div className="cu-chamfer-border-tl w-14 h-14 shrink-0">
                      <div className="cu-chamfer-fill-tl bg-cu-orange w-full h-full flex items-center justify-center">
                        <Building2 className="w-7 h-7 text-white" strokeWidth={1.5} />
                      </div>
                    </div>
                    <div className="min-w-0">
                      <p className="text-[11px] font-montserrat font-bold text-cu-orange uppercase tracking-[0.18em] mb-1.5">
                        {DEVELOPER_LEADER.role}
                      </p>
                      <p className="text-lg sm:text-xl font-montserrat font-bold leading-tight text-white">
                        {DEVELOPER_LEADER.name}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-8">
                    {DEVELOPER_STATS.map((stat) => (
                      <div
                        key={stat.key}
                        className="rounded-sm bg-black/50 border border-white/15 px-3.5 py-3.5"
                      >
                        <p className="text-2xl sm:text-[1.75rem] font-montserrat font-bold text-white tabular-nums leading-none">
                          {stat.value}
                        </p>
                        <p className="text-[11px] sm:text-xs text-white/75 mt-2 leading-snug">
                          {stat.label}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-2.5 mb-6">
                    {DEVELOPER_CREDENTIALS.map((cred) => (
                      <p
                        key={cred}
                        className="text-xs text-white/85 font-montserrat leading-snug pl-3 border-l-2 border-cu-orange"
                      >
                        {cred}
                      </p>
                    ))}
                  </div>

                  <p className="text-[11px] font-montserrat font-bold text-white/55 uppercase tracking-[0.16em] mb-2.5">
                    Experiencia previa
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {DEVELOPER_COMPANIES.map((co) => (
                      <span
                        key={co}
                        className="text-xs font-montserrat font-medium px-2.5 py-1.5 rounded-sm bg-white/10 border border-white/20 text-white"
                      >
                        {co}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="cu-chamfer-accent opacity-80" aria-hidden />
            </div>
          </motion.aside>

          {/* Tabbed content */}
          <div className="lg:col-span-8 min-w-0">
            <Tabs defaultValue="portafolio" className="w-full">
              <TabsList className="w-full flex h-auto flex-wrap gap-1 bg-white/10 border border-white/15 p-1.5 rounded-sm mb-6">
                {[
                  { value: "portafolio", label: "Portafolio" },
                  { value: "metodologia", label: "Metodología" },
                  { value: "mision", label: "Misión" },
                ].map((tab) => (
                  <TabsTrigger
                    key={tab.value}
                    value={tab.value}
                    className="flex-1 min-w-[7rem] py-2.5 px-3 text-xs sm:text-sm font-montserrat font-semibold text-white/70 data-[state=active]:bg-cu-orange data-[state=active]:text-white rounded-sm"
                  >
                    {tab.label}
                  </TabsTrigger>
                ))}
              </TabsList>

              <TabsContent value="portafolio" className="mt-0 focus-visible:outline-none">
                <div>
                  <p className="text-sm text-white/70 font-josefin leading-relaxed mb-6 max-w-2xl">
                    {DEVELOPER_PORTFOLIO_DETAIL}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-8 items-center">
                    <span className="inline-flex items-center gap-1 text-[11px] font-montserrat font-bold text-cu-orange uppercase tracking-widest mr-1">
                      <MapPin size={12} aria-hidden /> Corredores
                    </span>
                    {DEVELOPER_ZONES.map((zone) => (
                      <span
                        key={zone}
                        className="text-xs font-montserrat px-2.5 py-1 rounded-full border border-cu-orange/60 text-white bg-cu-orange/15"
                      >
                        {zone}
                      </span>
                    ))}
                  </div>

                  <p className="text-[11px] font-montserrat font-bold text-white/60 uppercase tracking-[0.2em] mb-4">
                    Desarrollos emblemáticos
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
                    {DEVELOPER_PORTFOLIO.map((project, i) => (
                      <div
                        key={project}
                        className="group flex items-center gap-3 p-4 rounded-sm bg-[#141414] border border-white/15 hover:border-cu-orange/60 hover:bg-[#1a1a1a] transition-all duration-300"
                      >
                        <span className="text-xs font-montserrat font-bold text-cu-orange tabular-nums w-5 shrink-0">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <Building2
                          size={18}
                          className="text-cu-orange shrink-0 opacity-70 group-hover:opacity-100 transition-opacity"
                          strokeWidth={1.5}
                        />
                        <span className="text-sm font-montserrat font-medium text-white leading-snug min-w-0">
                          {project}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="metodologia" className="mt-0 focus-visible:outline-none">
                <div className="space-y-4">
                  {DEVELOPER_METHOD_ITEMS.map((item) => {
                    const Icon = METHOD_ICONS[item.icon] ?? ShieldCheck;
                    return (
                      <div
                        key={item.key}
                        className="rounded-sm border border-white/15 bg-[#141414] p-5 sm:p-6 hover:border-cu-orange/40 transition-colors"
                      >
                        <div className="flex items-start gap-4">
                          <div className="cu-chamfer-border-tl w-11 h-11 shrink-0">
                            <div className="cu-chamfer-fill-tl bg-cu-orange w-full h-full flex items-center justify-center">
                              <Icon className="w-5 h-5 text-white" strokeWidth={1.5} />
                            </div>
                          </div>
                          <div className="min-w-0 flex-1">
                            <h3 className="font-montserrat font-bold text-base sm:text-lg mb-1.5 text-white">
                              {item.title}
                            </h3>
                            <p className="text-sm text-white/80 font-josefin leading-relaxed">
                              {item.summary}
                            </p>
                            <DetailToggle label="Ver detalle técnico">{item.detail}</DetailToggle>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </TabsContent>

              <TabsContent value="mision" className="mt-0 focus-visible:outline-none">
                <div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                    {DEVELOPER_MISSION_PILLARS.map((pillar) => {
                      const Icon = PILLAR_ICONS[pillar.icon] ?? Boxes;
                      return (
                        <BrandFeatureCard
                          key={pillar.key}
                          icon={Icon}
                          title={pillar.title}
                          description={pillar.description}
                          variant="dark"
                          className="[&_.cu-chamfer-fill-tr]:!bg-[#141414] [&_.cu-chamfer-fill-tr]:text-white"
                        />
                      );
                    })}
                  </div>
                  <blockquote className="relative pl-5 border-l-2 border-cu-orange py-2">
                    <p className="text-sm sm:text-base text-white/80 font-josefin italic leading-relaxed">
                      {DEVELOPER_VISION}
                    </p>
                  </blockquote>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Brand alliances strip */}
        <motion.div
          className="mt-14 pt-10 border-t border-white/10"
          variants={brandReveal}
          initial="hidden"
          whileInView="visible"
          viewport={brandViewport}
        >
          <p className="text-center text-[11px] font-montserrat font-bold text-white/60 uppercase tracking-[0.25em] mb-5">
            Alianzas de calidad
          </p>
          <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
            {DEVELOPER_BRAND_ALLIANCES.map((brand) => (
              <span
                key={brand}
                className="px-4 py-2 text-sm font-montserrat font-semibold text-white/90 bg-white/5 border border-white/15 rounded-sm hover:border-cu-orange/50 hover:text-cu-orange transition-colors"
              >
                {brand}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
