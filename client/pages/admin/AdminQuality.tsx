import { AdminSimpleCrud } from "@/components/admin/AdminSimpleCrud";
import { ADMIN_FIELD_LIMITS } from "@/lib/adminFieldLimits";

export default function AdminQuality() {
  return (
    <AdminSimpleCrud
      title="Pilares de calidad"
      formDescription="Iconos de la página Calidad e inicio. Valores permitidos para icono:"
      apiPath="/api/admin/quality-pillars.php"
      listKey="pillars"
      card={{
        titleKey: "title",
        descriptionKey: "description",
        iconKey: "icon",
      }}
      fields={[
        {
          key: "title",
          label: "Título del pilar",
          required: true,
          maxLength: ADMIN_FIELD_LIMITS.pillar_title,
        },
        {
          key: "description_short",
          label: "Resumen (inicio)",
          hint: "Teaser en home. Máx. 120 caracteres.",
          maxLength: ADMIN_FIELD_LIMITS.pillar_description_short,
        },
        {
          key: "description",
          label: "Descripción completa",
          type: "textarea",
          required: true,
          maxLength: ADMIN_FIELD_LIMITS.pillar_description,
        },
        {
          key: "icon",
          label: "Icono",
          hint: "handshake · grid-3x3 · clipboard-check · cog",
          placeholder: "handshake",
        },
        { key: "display_order", label: "Orden", type: "number" },
        { key: "is_active", label: "Visible en el sitio", type: "checkbox" },
      ]}
    />
  );
}
