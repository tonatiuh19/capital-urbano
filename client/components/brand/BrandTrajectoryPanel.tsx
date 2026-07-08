import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type BrandTrajectoryStat = {
  key: string;
  value: ReactNode;
  label: string;
};

export function BrandTrajectoryPanel({
  label,
  title,
  subtitle,
  icon: Icon,
  stats,
  className,
}: {
  label: string;
  title: string;
  subtitle?: string;
  icon: LucideIcon;
  stats: BrandTrajectoryStat[];
  className?: string;
}) {
  return (
    <aside className={cn("cu-chamfer-card relative pb-1", className)}>
      <div className="cu-chamfer-border-tr shadow-[0_20px_60px_-24px_rgba(0,0,0,0.12)]">
        <div className="cu-chamfer-fill-tr bg-gradient-to-br from-cu-warm-white to-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-[0.04] bg-[linear-gradient(90deg,#000_1px,transparent_1px),linear-gradient(0deg,#000_1px,transparent_1px)] bg-[size:32px_32px]" />
          <div className="relative p-8 sm:p-10">
            <div className="flex items-start gap-4 mb-8 pb-8 border-b border-cu-stone/15">
              <div className="cu-chamfer-border-tl w-14 h-14 shrink-0">
                <div className="cu-chamfer-fill-tl bg-cu-orange w-full h-full flex items-center justify-center shadow-lg shadow-cu-orange/25">
                  <Icon className="text-white w-6 h-6" />
                </div>
              </div>
              <div>
                <p className="text-xs font-montserrat font-bold text-cu-orange uppercase tracking-[0.2em] mb-1">
                  {label}
                </p>
                <p className="text-lg font-montserrat font-bold text-cu-black leading-snug">
                  {title}
                </p>
                {subtitle && (
                  <p className="text-sm text-cu-concrete mt-2 leading-relaxed">{subtitle}</p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-8">
              {stats.map((s) => (
                <div key={s.key} className="min-w-0">
                  <p className="text-3xl sm:text-4xl font-montserrat font-bold text-cu-orange tabular-nums leading-none mb-2">
                    {s.value}
                  </p>
                  <p className="text-sm text-cu-concrete leading-snug">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="h-1 bg-gradient-to-r from-cu-orange via-orange-400 to-cu-orange/40" />
        </div>
      </div>
      <div className="cu-chamfer-accent" aria-hidden />
    </aside>
  );
}
