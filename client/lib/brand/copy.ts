/** Official brand messaging — aligned with client PDF (2026-07-09). */

export const BRAND_TAGLINE = "Desarrollamos vivienda conectada a la ciudad";

export const BRAND_SLOGAN = "Construimos Valor Que Permanece";

export const BRAND_VALUE_MANTRA = "Construimos hoy, generamos valor siempre.";

export const BRAND_CONCEPT = "Vivienda conectada a la ciudad";

export const BRAND_VOICE_LEAD =
  "Capital Urbano desarrolla proyectos verticales con una visión integral: ubicación estratégica, planeación técnica, control de calidad y procesos diseñados para proteger la experiencia del cliente a largo plazo.";

export const BRAND_VALUE_PROPOSITION =
  "Vivienda vertical construida con metodología técnica, control de calidad y visión de largo plazo.";

/** One-line blurbs for hero, footer, teasers (capa 1–2). */
export const BRAND_FOOTER_BLURB = BRAND_VALUE_PROPOSITION;

export const HOME_ABOUT_TEASER =
  "Vivienda vertical construida con metodología técnica, control de calidad y visión de largo plazo.";

export const HOME_ABOUT_BULLETS = [
  "Metodología BIM y control de calidad con inspecciones externas",
  "Alianzas con proveedores y materiales certificados",
  "Valor patrimonial a largo plazo",
] as const;

export const HOME_CTA_PROJECTS = "Conocer proyectos en construcción";

export const BRAND_CLOSING =
  "No construimos solo para entregar. Construimos para que cada proyecto funcione, se mantenga y conserve valor.";

/** Four DNA pillars (fifth removed per client feedback). */
export const BRAND_DNA_PILLARS = [
  {
    key: "metodo",
    title: "Método",
    description:
      "Planeación técnica, procesos controlados y decisiones fundamentadas desde el origen de cada desarrollo.",
  },
  {
    key: "calidad",
    title: "Calidad verificable",
    description:
      "Inspecciones externas, proveedores confiables y documentación de cada etapa de la construcción.",
  },
  {
    key: "permanencia",
    title: "Permanencia",
    description:
      "Arquitectura y operación pensadas para conservar funcionalidad, valor y vigencia a largo plazo.",
  },
  {
    key: "operacion",
    title: "Operación",
    description:
      "Proyectos preparados para funcionar bien después de la entrega y facilitar su administración futura.",
  },
] as const;

export const BRAND_WHY_IT_WORKS = [
  "Desarrollo vertical en corredores consolidados de Guadalajara.",
  "Control técnico en diseño, obra y entrega con protocolos verificables.",
  "Alianza con los mejores fabricantes y supervisión externa.",
  "Proyectos pensados para conservar funcionalidad y valor patrimonial.",
] as const;

/** General portfolio showcase (large file — gitignored; upload manually). */
export const PORTFOLIO_VIDEO_SRC = "/assets/videos/CapitalUrbano.mp4";

/** LIV Capital project promo — sourced from liv-capital `public/videos/recorrido.mp4`. */
export const LIV_PROMO_VIDEO_SRC = "/assets/videos/liv-capital-promo.mp4";
