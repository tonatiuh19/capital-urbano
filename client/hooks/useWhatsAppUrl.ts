import { useAppSelector } from "@/store/hooks";

const DEFAULT_WHATSAPP = "526241234567";

/** wa.me link from public site settings (same source as WhatsAppFab). */
export function useWhatsAppUrl(): string {
  const { config } = useAppSelector((s) => s.siteConfig);
  const raw = (config?.whatsapp_number as string)?.replace(/\D/g, "") || DEFAULT_WHATSAPP;
  return `https://wa.me/${raw}`;
}
