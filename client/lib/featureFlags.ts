import {
  usePublicSiteConfig,
} from "@/hooks/usePublicSiteConfig";

export const FEATURE_BLOG_SETTING_KEY = "feature_blog_enabled";

/** Blog module on unless explicitly disabled in site settings. */
export function isBlogFeatureEnabled(
  config: Record<string, unknown> | null | undefined,
): boolean {
  if (!config || !(FEATURE_BLOG_SETTING_KEY in config)) return true;
  const value = config[FEATURE_BLOG_SETTING_KEY];
  if (typeof value === "boolean") return value;
  if (typeof value === "number") return value !== 0;
  if (typeof value === "string") {
    const v = value.trim().toLowerCase();
    return v === "1" || v === "true" || v === "yes";
  }
  return Boolean(value);
}

/** Public + admin: resolve blog feature flag from site-config. */
export function useBlogFeatureEnabled(): {
  enabled: boolean;
  isLoading: boolean;
  isFetched: boolean;
} {
  const { data, isLoading, isFetched } = usePublicSiteConfig();
  return {
    enabled: isBlogFeatureEnabled(data),
    isLoading,
    isFetched,
  };
}
