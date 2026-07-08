/**
 * Canonical homes for recurring themes — avoid duplicating full copy across pages.
 * Teasers on secondary pages should link to `canonical` routes.
 */
export const CONTENT_CANON = {
  tagline: {
    canonical: "/",
    field: "hero badge",
  },
  slogan: {
    canonical: "/",
    field: "hero headline",
  },
  voiceLead: {
    canonical: "/about",
    field: "historia CMS",
    short: "BRAND_VALUE_PROPOSITION",
  },
  dnaPillars: {
    canonical: "/",
    sectionId: "adn-marca",
    label: "ADN de marca",
  },
  qualityPillars: {
    canonical: "/quality",
    sectionId: "pilares-calidad",
    label: "Estándares de calidad",
    /** Home shows title-only teasers */
    teaserRoutes: ["/"],
  },
  stats: {
    canonical: "/about",
    sectionId: "trayectoria",
    label: "Trayectoria",
  },
  clientJourney: {
    canonical: "/experience",
    label: "Experiencia del cliente",
  },
  team: {
    canonical: "/about",
    sectionId: "equipo",
    label: "Equipo",
  },
  values: {
    canonical: "/about",
    sectionId: "valores",
    label: "Valores",
  },
} as const;

export type ContentCanonKey = keyof typeof CONTENT_CANON;

/** One-line pointer for cross-page CTAs */
export function canonLinkLabel(key: ContentCanonKey): string {
  const entry = CONTENT_CANON[key];
  if ("label" in entry && entry.label) {
    return `Ver ${entry.label.toLowerCase()}`;
  }
  return "Ver más";
}
