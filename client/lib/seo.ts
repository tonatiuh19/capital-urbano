import type { CmsPage, Development } from "@shared/api";
import { BRAND_TAGLINE, BRAND_VALUE_PROPOSITION, BRAND_VOICE_LEAD } from "@/lib/brand/copy";

/** Public routes with stable SEO defaults (CMS meta_description overrides when loaded). */
export const PUBLIC_ROUTES = {
  home: {
    path: "/",
    title: null as string | null,
    description: BRAND_VOICE_LEAD,
    keywords:
      "Capital Urbano, desarrolladora inmobiliaria, vivienda conectada a la ciudad, bienes raíces Guadalajara, proyectos verticales, valor patrimonial",
  },
  about: {
    path: "/about",
    title: "Nosotros",
    description:
      "Historia y liderazgo de Capital Urbano: vivienda vertical construida con metodología técnica, control de calidad y visión de largo plazo en Guadalajara.",
    keywords:
      "Capital Urbano nosotros, desarrolladora Guadalajara, Gilberto Cordero, vivienda conectada a la ciudad",
  },
  quality: {
    path: "/quality",
    title: "Calidad",
    description:
      "Calidad verificable en Capital Urbano: alianzas estratégicas, BIM, inspecciones externas y automatización de procesos.",
    keywords:
      "calidad constructiva, BIM, desarrollo inmobiliaria, Capital Urbano, calidad verificable",
  },
  projects: {
    path: "/projects",
    title: "Proyectos",
    description: BRAND_VALUE_PROPOSITION,
    keywords:
      "proyectos inmobiliarios Guadalajara, desarrollos verticales, Capital Urbano, vivienda conectada a la ciudad",
  },
  experience: {
    path: "/experience",
    title: "Experiencia",
    description:
      "Experiencia de compra e inversión con Capital Urbano: asesoría, preventa, personalización y postventa.",
    keywords:
      "experiencia cliente, inversión inmobiliaria, preventa departamentos, Capital Urbano",
  },
  blog: {
    path: "/blog",
    title: "Blog",
    description:
      "Ideas, trayectoria y novedades de Capital Urbano sobre vivienda vertical e inversión en Guadalajara.",
    keywords:
      "blog Capital Urbano, noticias inmobiliarias Guadalajara, vivienda vertical, desarrollos",
  },
  contact: {
    path: "/contact",
    title: "Contacto",
    description:
      "Contacta a Capital Urbano: asesoría comercial, inversiones y alianzas en Guadalajara.",
    keywords:
      "contacto Capital Urbano, asesoría inmobiliaria, Guadalajara",
  },
  notFound: {
    path: "",
    title: "Página no encontrada",
    description: "La página que buscas no existe en Capital Urbano.",
    keywords: undefined as string | undefined,
  },
} as const;

export type PublicRouteKey = keyof typeof PUBLIC_ROUTES;

export const SITE = {
  name: "Capital Urbano",
  legalName: "Capital Urbano",
  defaultTitle: `Capital Urbano — ${BRAND_TAGLINE}`,
  defaultDescription: PUBLIC_ROUTES.home.description,
  defaultImagePath: "/logo.png",
  twitterHandle: "@capitalurbano",
  locale: "es_MX",
  language: "es-MX",
  themeColor: "#1a1a1a",
  region: "MX-JAL",
} as const;

export function getSiteOrigin(): string {
  const env = import.meta.env.VITE_SITE_URL?.trim().replace(/\/$/, "");
  if (env) return env;
  if (typeof window !== "undefined" && window.location?.origin) {
    return window.location.origin;
  }
  return "https://capitalurbanomx.com";
}

export function resolveCanonicalPath(pathname: string): string {
  const clean = pathname.split("?")[0].split("#")[0] || "/";
  if (clean !== "/" && clean.endsWith("/")) {
    return clean.slice(0, -1);
  }
  return clean;
}

export function resolveCanonicalUrl(pathname: string): string {
  return `${getSiteOrigin()}${resolveCanonicalPath(pathname)}`;
}

/** Absolute URL for Open Graph / Twitter (supports /uploads and https). */
export function resolveOgImageUrl(image?: string | null): string {
  const path = image?.trim() || SITE.defaultImagePath;
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }
  return `${getSiteOrigin()}${path.startsWith("/") ? path : `/${path}`}`;
}

export function truncateMetaDescription(
  text: string | null | undefined,
  max = 160,
): string {
  if (!text) return SITE.defaultDescription;
  const plain = text
    .replace(/\s+/g, " ")
    .replace(/[#*_`[\]]/g, "")
    .trim();
  if (plain.length <= max) return plain;
  const cut = plain.slice(0, max - 1);
  const lastSpace = cut.lastIndexOf(" ");
  return `${(lastSpace > 80 ? cut.slice(0, lastSpace) : cut).trim()}…`;
}

export type TitleMode = "home" | "page" | "full";

export function formatDocumentTitle(
  title: string | null | undefined,
  mode: TitleMode = "page",
): string {
  if (mode === "home" || !title?.trim()) {
    return SITE.defaultTitle;
  }
  if (mode === "full") {
    return title.trim();
  }
  return `${title.trim()} | ${SITE.name}`;
}

export function seoFromCmsPage(
  route: PublicRouteKey,
  page?: CmsPage | null,
): { title: string; description: string; keywords?: string } {
  const defaults = PUBLIC_ROUTES[route];
  return {
    title: page?.title?.trim() || defaults.title || SITE.name,
    description: truncateMetaDescription(
      page?.meta_description ?? defaults.description,
    ),
    keywords: defaults.keywords,
  };
}

export function buildOrganizationSchema(): Record<string, unknown> {
  const origin = getSiteOrigin();
  return {
    "@type": "RealEstateAgent",
    "@id": `${origin}/#organization`,
    name: SITE.legalName,
    url: origin,
    logo: resolveOgImageUrl(SITE.defaultImagePath),
    image: resolveOgImageUrl(SITE.defaultImagePath),
    areaServed: {
      "@type": "City",
      name: "Guadalajara",
      containedInPlace: { "@type": "State", name: "Jalisco" },
    },
  };
}

export function buildWebSiteSchema(): Record<string, unknown> {
  const origin = getSiteOrigin();
  return {
    "@type": "WebSite",
    "@id": `${origin}/#website`,
    name: SITE.name,
    url: origin,
    inLanguage: SITE.language,
    publisher: { "@id": `${origin}/#organization` },
  };
}

export function buildWebPageSchema(opts: {
  path: string;
  title: string;
  description: string;
}): Record<string, unknown> {
  const origin = getSiteOrigin();
  const url = `${origin}${opts.path}`;
  return {
    "@type": "WebPage",
    "@id": `${url}#webpage`,
    url,
    name: opts.title,
    description: opts.description,
    isPartOf: { "@id": `${origin}/#website` },
    about: { "@id": `${origin}/#organization` },
    inLanguage: SITE.language,
  };
}

export function buildBreadcrumbSchema(
  items: { name: string; path: string }[],
): Record<string, unknown> {
  const origin = getSiteOrigin();
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${origin}${item.path}`,
    })),
  };
}

export function buildDevelopmentSchema(
  d: Development,
  canonicalPath: string,
): Record<string, unknown> {
  const url = resolveCanonicalUrl(canonicalPath);
  const schema: Record<string, unknown> = {
    "@type": "Residence",
    "@id": `${url}#development`,
    name: d.name,
    description: truncateMetaDescription(d.tagline ?? d.description),
    url,
    image: d.hero_image_url ? resolveOgImageUrl(d.hero_image_url) : undefined,
  };

  if (d.address_line || d.city || d.state) {
    schema.address = {
      "@type": "PostalAddress",
      streetAddress: d.address_line ?? undefined,
      addressLocality: d.city ?? "Guadalajara",
      addressRegion: d.state ?? "Jalisco",
      addressCountry: "MX",
    };
  }

  if (d.latitude != null && d.longitude != null) {
    schema.geo = {
      "@type": "GeoCoordinates",
      latitude: d.latitude,
      longitude: d.longitude,
    };
  }

  return schema;
}

export function toJsonLdGraph(
  nodes: Record<string, unknown>[],
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@graph": nodes,
  };
}
