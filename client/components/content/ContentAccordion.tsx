import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";

export type ContentAccordionItem = {
  id: string;
  title: string;
  content: ReactNode;
  icon?: LucideIcon;
};

export function ContentAccordion({
  items,
  variant = "light",
  className,
  defaultOpen,
}: {
  items: ContentAccordionItem[];
  variant?: "light" | "dark" | "warm";
  className?: string;
  /** First item open by default */
  defaultOpen?: string;
}) {
  if (items.length === 0) return null;

  const fillClass = {
    light: "bg-white text-cu-black",
    dark: "bg-[#111111] text-white",
    warm: "bg-cu-warm-white text-cu-black",
  }[variant];

  const bodyClass = {
    light: "text-cu-concrete",
    dark: "text-gray-400",
    warm: "text-cu-concrete",
  }[variant];

  return (
    <Accordion
      type="single"
      collapsible
      defaultValue={defaultOpen ?? items[0]?.id}
      className={cn("space-y-3", className)}
    >
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <AccordionItem
            key={item.id}
            value={item.id}
            className="cu-chamfer-card relative pb-1 border-0"
          >
            <div className="cu-chamfer-border-tr">
              <div className={cn("cu-chamfer-fill-tr", fillClass)}>
                <AccordionTrigger
                  className={cn(
                    "px-5 sm:px-6 py-4 hover:no-underline font-montserrat font-bold text-left text-base sm:text-lg",
                    "[&[data-state=open]]:text-cu-orange",
                  )}
                >
                  <span className="flex items-center gap-3 sm:gap-4 min-w-0">
                    {Icon && (
                      <span className="cu-chamfer-border-tl w-10 h-10 shrink-0">
                        <span className="cu-chamfer-fill-tl bg-cu-orange w-full h-full flex items-center justify-center">
                          <Icon className="w-5 h-5 text-white" strokeWidth={1.5} />
                        </span>
                      </span>
                    )}
                    <span className="min-w-0 break-words text-balance">{item.title}</span>
                  </span>
                </AccordionTrigger>
                <AccordionContent className={cn("px-5 sm:px-6 pb-5 text-sm leading-relaxed", bodyClass)}>
                  {item.content}
                </AccordionContent>
              </div>
            </div>
            <div className="cu-chamfer-accent opacity-60" aria-hidden />
          </AccordionItem>
        );
      })}
    </Accordion>
  );
}
