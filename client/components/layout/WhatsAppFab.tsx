import { MessageCircle } from "lucide-react";
import { useAppSelector } from "@/store/hooks";
import { useHomeHeroImmersive } from "@/hooks/useHomeHeroImmersive";
import { cn } from "@/lib/utils";

const DEFAULT_WHATSAPP = "526241234567";

type WhatsAppFabProps = {
  /** Hide on home hero until user scrolls past the intro sentinel (same as navbar). */
  hideInHomeHero?: boolean;
};

export function WhatsAppFab({ hideInHomeHero = true }: WhatsAppFabProps) {
  const { config } = useAppSelector((s) => s.siteConfig);
  const { isImmersive } = useHomeHeroImmersive(hideInHomeHero);

  const raw = (config?.whatsapp_number as string)?.replace(/\D/g, "") || DEFAULT_WHATSAPP;
  const href = `https://wa.me/${raw}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      title="WhatsApp"
      aria-label="Contactar por WhatsApp"
      className={cn(
        "fixed z-40 flex h-14 w-14 sm:h-[3.75rem] sm:w-[3.75rem] items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_8px_28px_rgba(37,211,102,0.45)] transition-all duration-500 ease-out hover:bg-[#20bd5a] hover:shadow-[0_10px_32px_rgba(37,211,102,0.55)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366] focus-visible:ring-offset-2 bottom-[max(1rem,env(safe-area-inset-bottom))] right-[max(1rem,env(safe-area-inset-right))] sm:bottom-[max(2rem,env(safe-area-inset-bottom))] sm:right-[max(2rem,env(safe-area-inset-right))]",
        isImmersive
          ? "opacity-0 pointer-events-none translate-y-3 scale-90"
          : "opacity-100 pointer-events-auto translate-y-0 scale-100 sm:hover:scale-110",
      )}
    >
      <MessageCircle size={28} className="fill-current" strokeWidth={1.5} aria-hidden />
    </a>
  );
}
