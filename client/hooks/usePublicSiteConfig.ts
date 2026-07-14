import { useQuery } from "@tanstack/react-query";
import { apiGet } from "@/lib/api";

export type PublicSiteConfig = Record<string, string | number | boolean>;

export function usePublicSiteConfig() {
  return useQuery({
    queryKey: ["site-config", "public"],
    queryFn: async () => {
      const res = await apiGet<{ config: PublicSiteConfig }>("/api/site-config.php");
      return res.config;
    },
  });
}

export function formatStat(value: string | number | boolean | undefined, suffix = ""): string {
  if (value === undefined || value === "") return "—";
  const raw = typeof value === "string" ? value.trim() : value;
  if (raw === "") return "—";
  const n = typeof raw === "number" ? raw : parseInt(String(raw).replace(/\D/g, ""), 10);
  if (Number.isNaN(n)) return String(raw);
  if (n >= 1_000_000) return `${Math.round(n / 100_000) / 10}M${suffix}`;
  if (n >= 1_000) return `${Math.round(n / 100) / 10}K${suffix}`;
  return `${n}${suffix}`;
}
