export type SettingMeta = {
  label: string;
  hint?: string;
  /** textarea for long / JSON values */
  multiline?: boolean;
  maxLength?: number;
};

const SETTING_LABELS: Record<string, SettingMeta> = {
  site_name: { label: "Nombre del sitio", hint: "Aparece en títulos y metadatos." },
  site_tagline: { label: "Eslogan", hint: "Frase corta de marca.", maxLength: 80 },
  contact_email: { label: "Correo de contacto", hint: "Formulario y pie de página." },
  contact_phone: { label: "Teléfono de contacto" },
  contact_address: { label: "Dirección", hint: "Página de contacto." },
  contact_hours: { label: "Horario de atención" },
  whatsapp_number: {
    label: "WhatsApp (solo números)",
    hint: "Código de país sin +, ej. 523312345678. Usado en el botón flotante.",
  },
  newsletter_heading: { label: "Título newsletter (footer)" },
  newsletter_subcopy: { label: "Texto newsletter (footer)", multiline: true },
  stat_years_experience: {
    label: "Estadística: años de experiencia",
    hint: "Solo número entero. Ej: 27. Se muestra en inicio y nosotros.",
  },
  stat_sqm_built: {
    label: "Estadística: m² construidos",
    hint: "Solo número entero sin comas. Ej: 1000000 (se formatea con + en el sitio).",
  },
  stat_families: {
    label: "Estadística: familias",
    hint: "Solo número entero. Confirmar cifra con Edna. Se muestra en inicio y nosotros.",
  },
  about_leadership_title: { label: "Nosotros — título sección Dirección", maxLength: 80 },
  about_leadership_subtitle: {
    label: "Nosotros — subtítulo Dirección",
    multiline: true,
    maxLength: 320,
  },
  about_technical_title: { label: "Nosotros — título Staff técnico", maxLength: 80 },
  about_technical_subtitle: {
    label: "Nosotros — subtítulo Staff técnico",
    multiline: true,
    maxLength: 320,
  },
  about_team_title: { label: "Nosotros — título Equipo multidisciplinario", maxLength: 80 },
  about_team_subtitle: {
    label: "Nosotros — subtítulo Equipo multidisciplinario",
    multiline: true,
    maxLength: 320,
  },
  about_hero_subtitle: { label: "Subtítulo hero — Nosotros", maxLength: 160 },
  quality_hero_subtitle: { label: "Subtítulo hero — Calidad", maxLength: 160 },
  experience_hero_subtitle: { label: "Subtítulo hero — Experiencia", maxLength: 160 },
  experience_journey_title: { label: "Título — recorrido experiencia" },
  experience_journey_intro: { label: "Intro — recorrido experiencia", multiline: true },
  experience_journey_steps: {
    label: "Pasos del recorrido (JSON)",
    hint: 'Arreglo JSON con icon, title, description. No editar sin conocimiento técnico.',
    multiline: true,
  },
  experience_owners_integration: {
    label: "Integración de propietarios",
    hint: "Texto bajo el recorrido en /experience.",
    multiline: true,
  },
  coming_soon_title: { label: "Título — página Próximamente" },
  coming_soon_subtitle: { label: "Subtítulo — Próximamente", multiline: true },
  instagram_url: { label: "URL de Instagram", hint: "Enlace completo https://…" },
  linkedin_url: { label: "URL de LinkedIn", hint: "Enlace completo https://…" },
  map_lat: { label: "Mapa: latitud (centro)", hint: "Solo administradores." },
  map_lng: { label: "Mapa: longitud (centro)", hint: "Solo administradores." },
  under_construction: { label: "Sitio en construcción" },
};

export function getSettingMeta(key: string): SettingMeta {
  return (
    SETTING_LABELS[key] ?? {
      label: key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
      hint: `Clave técnica: ${key}`,
    }
  );
}

/** Group order for settings UI */
export const SETTING_GROUPS: { title: string; keys: string[] }[] = [
  {
    title: "Marca y contacto",
    keys: [
      "site_name",
      "site_tagline",
      "contact_email",
      "contact_phone",
      "contact_address",
      "contact_hours",
      "whatsapp_number",
      "instagram_url",
      "linkedin_url",
    ],
  },
  {
    title: "Estadísticas (inicio y nosotros)",
    keys: ["stat_years_experience", "stat_sqm_built", "stat_families"],
  },
  {
    title: "Nosotros — secciones de equipo",
    keys: [
      "about_leadership_title",
      "about_leadership_subtitle",
      "about_technical_title",
      "about_technical_subtitle",
      "about_team_title",
      "about_team_subtitle",
    ],
  },
  {
    title: "Textos de páginas",
    keys: [
      "about_hero_subtitle",
      "quality_hero_subtitle",
      "experience_hero_subtitle",
      "newsletter_heading",
      "newsletter_subcopy",
    ],
  },
  {
    title: "Experiencia — recorrido",
    keys: [
      "experience_journey_title",
      "experience_journey_intro",
      "experience_journey_steps",
      "experience_owners_integration",
    ],
  },
  {
    title: "Próximamente",
    keys: ["coming_soon_title", "coming_soon_subtitle"],
  },
  {
    title: "Mapa (admin)",
    keys: ["map_lat", "map_lng"],
  },
];

export function groupSettings<T extends { setting_key: string }>(
  settings: T[],
): { title: string; items: T[] }[] {
  const used = new Set<string>();
  const groups: { title: string; items: T[] }[] = [];

  for (const g of SETTING_GROUPS) {
    const items = settings.filter(
      (s) =>
        g.keys.includes(s.setting_key) &&
        s.setting_key !== "under_construction" &&
        s.setting_key !== "feature_blog_enabled",
    );
    items.forEach((s) => used.add(s.setting_key));
    if (items.length > 0) groups.push({ title: g.title, items });
  }

  const rest = settings.filter(
    (s) =>
      !used.has(s.setting_key) &&
      s.setting_key !== "under_construction" &&
      s.setting_key !== "feature_blog_enabled",
  );
  if (rest.length > 0) {
    groups.push({ title: "Otros", items: rest });
  }

  return groups;
}
