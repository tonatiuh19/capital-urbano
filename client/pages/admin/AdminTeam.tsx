import { AdminSimpleCrud } from "@/components/admin/AdminSimpleCrud";
import { ADMIN_FIELD_LIMITS } from "@/lib/adminFieldLimits";

export default function AdminTeam() {
  return (
    <AdminSimpleCrud
      title="Equipo"
      formDescription="Miembros del equipo en la página Nosotros. Marca «Liderazgo» para la sección de dirección."
      apiPath="/api/admin/team.php"
      listKey="members"
      card={{
        titleKey: "name",
        subtitleKey: "role_title",
        descriptionKey: "bio",
        imageKey: "photo_url",
      }}
      fields={[
        { key: "name", label: "Nombre completo", required: true },
        { key: "role_title", label: "Cargo / puesto", maxLength: 120 },
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
        {
          key: "is_leadership",
          label: "Mostrar en sección Dirección",
          type: "checkbox",
        },
        { key: "is_active", label: "Visible en el sitio", type: "checkbox" },
      ]}
    />
  );
}
