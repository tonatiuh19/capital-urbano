/** Live feed proxied from LIV Capital product sites (livcapitalgdl.mx). */

export type LivAmenity = {
  id: number;
  name: string;
  description?: string | null;
  icon?: string | null;
  image_url?: string | null;
  category?: string | null;
};

export type LivGalleryImage = {
  id: number;
  title: string;
  description?: string | null;
  image_url: string;
  category?: string | null;
};

export type LivModel = {
  id: number;
  name: string;
  slug: string;
  bedrooms: number;
  bathrooms: number;
  area_sqm: string;
  terrace_m2?: string | null;
  main_image_url?: string | null;
  matterport_url?: string | null;
};

export type LivSiteConfig = {
  site_title?: string;
  site_description?: string;
  total_floors?: number;
  total_units?: number;
  total_amenities?: number;
  delivery_estimate?: string;
  construction_stage?: string;
  contact_email?: string;
  contact_phone?: string;
  whatsapp_number?: string;
  og_image_url?: string;
  project_lat?: string;
  project_lng?: string;
};

export type LivFeedResponse = {
  slug: string;
  source: string;
  fetched_at: string;
  cached?: boolean;
  partial_errors?: string[] | null;
  config?: { config?: LivSiteConfig } | null;
  amenities?: { amenities?: LivAmenity[] } | null;
  gallery?: { images?: LivGalleryImage[] } | null;
  models?: { models?: LivModel[] } | null;
  location?: { center?: { lat: number; lng: number }; pois?: unknown[] } | null;
};

export function livAssetUrl(
  path: string | null | undefined,
  base: string,
): string | null {
  if (!path?.trim()) return null;
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  const origin = base.replace(/\/$/, "");
  return `${origin}${path.startsWith("/") ? path : `/${path}`}`;
}

export function livSiteConfig(feed: LivFeedResponse): LivSiteConfig {
  return feed.config?.config ?? {};
}
