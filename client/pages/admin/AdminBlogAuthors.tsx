import { AdminSimpleCrud } from "@/components/admin/AdminSimpleCrud";

export default function AdminBlogAuthors() {
  return (
    <AdminSimpleCrud
      title="Autores del blog"
      backLink={{ to: "/admin/blog", label: "Volver al blog" }}
      formDescription="Autores que puedes asignar a cada artículo."
      emptyStateMessage="Aún no hay autores. Crea al menos uno para firmar publicaciones."
      emptyStateCtaLabel="Agregar autor"
      autoSlugFrom="name"
      apiPath="/api/admin/blog-authors.php"
      listKey="authors"
      card={{
        titleKey: "name",
        subtitleKey: "role_title",
        descriptionKey: "bio",
        imageKey: "photo_url",
      }}
      fields={[
        { key: "name", label: "Nombre", required: true },
        { key: "slug", label: "Slug URL", hint: "Se genera del nombre si lo dejas vacío al guardar (el servidor lo normaliza)." },
        { key: "role_title", label: "Cargo / rol", maxLength: 120 },
        { key: "bio", label: "Biografía", type: "textarea" },
        {
          key: "photo_url",
          label: "Foto",
          type: "image",
          uploadFolder: "blog",
        },
        { key: "display_order", label: "Orden", type: "number" },
        { key: "is_active", label: "Activo", type: "checkbox" },
      ]}
    />
  );
}
