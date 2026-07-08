import { AdminSimpleCrud } from "@/components/admin/AdminSimpleCrud";

export default function AdminFaq() {
  return (
    <AdminSimpleCrud
      title="FAQ"
      formDescription="Preguntas que aparecen en la página de contacto y secciones públicas."
      apiPath="/api/admin/faq.php"
      listKey="items"
      card={{
        titleKey: "question",
        descriptionKey: "answer",
        subtitleKey: "category",
      }}
      fields={[
        { key: "question", label: "Pregunta", type: "textarea", required: true },
        { key: "answer", label: "Respuesta", type: "textarea", required: true },
        {
          key: "category",
          label: "Categoría",
          hint: "Ej. general, proyectos, pagos",
          placeholder: "general",
        },
        {
          key: "display_order",
          label: "Orden de aparición",
          type: "number",
          hint: "Menor número = más arriba.",
        },
        { key: "is_active", label: "Visible en el sitio", type: "checkbox" },
      ]}
    />
  );
}
