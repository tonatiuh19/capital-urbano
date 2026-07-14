import { AdminSimpleCrud } from "@/components/admin/AdminSimpleCrud";
import { ADMIN_FIELD_LIMITS } from "@/lib/adminFieldLimits";
import { TEAM_SECTION_LABELS } from "@/lib/teamSection";

const TEAM_SECTION_OPTIONS = [
  { value: "leadership", label: TEAM_SECTION_LABELS.leadership },
  { value: "technical", label: TEAM_SECTION_LABELS.technical },
  { value: "general", label: TEAM_SECTION_LABELS.general },
] as const;

export default function AdminTeam() {
  return (
    <AdminSimpleCrud
      title="Equipo"
      formDescription="Miembros visibles en /about. Asigna cada persona a Dirección, Staff técnico o Equipo multidisciplinario. Sube foto cuadrada (mín. 400×400 px) para evitar iniciales en el sitio."
      emptyStateMessage="Aún no hay miembros del equipo. Agrega dirección, staff técnico y equipo con foto, cargo y biografía."
      emptyStateCtaLabel="Agregar primer miembro"
      apiPath="/api/admin/team.php"
      listKey="members"
      card={{
        titleKey: "name",
        subtitleKey: "role_title",
        descriptionKey: "bio_short",
        imageKey: "photo_url",
      }}
      fields={[
        { key: "name", label: "Nombre completo", required: true },
        { key: "role_title", label: "Cargo / puesto", required: true, maxLength: 120 },
        {
          key: "team_section",
          label: "Sección en Nosotros",
          type: "select",
          required: true,
          hint: "Dirección = liderazgo · Staff técnico = especialistas técnicos · Equipo = resto del equipo.",
          options: [...TEAM_SECTION_OPTIONS],
        },
        {
          key: "bio_short",
          label: "Bio corta (tarjeta)",
          hint: "Teaser en la tarjeta. Máx. 160 caracteres.",
          maxLength: ADMIN_FIELD_LIMITS.bio_short,
        },
        {
          key: "bio",
          label: "Biografía completa",
          type: "textarea",
          maxLength: ADMIN_FIELD_LIMITS.bio,
        },
        {
          key: "photo_url",
          label: "Foto del miembro",
          hint: "Sube una imagen o pega una URL. Recomendado: retrato cuadrado, mínimo 400×400 px.",
          type: "image",
          uploadFolder: "team",
        },
        {
          key: "linkedin_url",
          label: "Perfil de LinkedIn",
          placeholder: "https://linkedin.com/in/…",
        },
        { key: "display_order", label: "Orden", type: "number" },
        { key: "is_active", label: "Visible en el sitio", type: "checkbox" },
      ]}
    />
  );
}
