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
  const n = typeof value === "number" ? value : parseInt(String(value).replace(/\D/g, ""), 10);
  if (Number.isNaN(n)) return String(value);
  if (n >= 1_000_000) return `${Math.round(n / 100_000) / 10}M${suffix}`;
  if (n >= 1_000) return `${Math.round(n / 100) / 10}K${suffix}`;
  return `${n}${suffix}`;
}
