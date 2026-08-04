import { AdminSimpleCrud } from "@/components/admin/AdminSimpleCrud";

export default function AdminBlogCategories() {
  return (
    <AdminSimpleCrud
      title="Categorías del blog"
      backLink={{ to: "/admin/blog", label: "Volver al blog" }}
      formDescription="Organiza los artículos por categoría."
      emptyStateCtaLabel="Agregar categoría"
      autoSlugFrom="name"
      apiPath="/api/admin/blog-categories.php"
      listKey="categories"
      card={{
        titleKey: "name",
        subtitleKey: "slug",
        descriptionKey: "description",
      }}
      fields={[
        { key: "name", label: "Nombre", required: true },
        { key: "slug", label: "Slug URL" },
        { key: "description", label: "Descripción", type: "textarea", maxLength: 320 },
        { key: "display_order", label: "Orden", type: "number" },
        { key: "is_active", label: "Activa", type: "checkbox" },
      ]}
    />
  );
}
