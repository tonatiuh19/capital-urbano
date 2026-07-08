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
  stat_years_experience: { label: "Estadística: años de experiencia", hint: "Solo número." },
  stat_sqm_built: { label: "Estadística: m² construidos", hint: "Solo número." },
  stat_sqm_developed: { label: "Estadística: m² desarrollados", hint: "Solo número." },
  stat_families: { label: "Estadística: familias", hint: "Solo número." },
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
    keys: ["stat_years_experience", "stat_sqm_built", "stat_sqm_developed", "stat_families"],
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
    keys: ["experience_journey_title", "experience_journey_intro", "experience_journey_steps"],
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
      (s) => g.keys.includes(s.setting_key) && s.setting_key !== "under_construction",
    );
    items.forEach((s) => used.add(s.setting_key));
    if (items.length > 0) groups.push({ title: g.title, items });
  }

  const rest = settings.filter(
    (s) => !used.has(s.setting_key) && s.setting_key !== "under_construction",
  );
  if (rest.length > 0) {
    groups.push({ title: "Otros", items: rest });
  }

  return groups;
}
