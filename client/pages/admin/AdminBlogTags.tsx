import { AdminSimpleCrud } from "@/components/admin/AdminSimpleCrud";

export default function AdminBlogTags() {
  return (
    <AdminSimpleCrud
      title="Etiquetas del blog"
      backLink={{ to: "/admin/blog", label: "Volver al blog" }}
      legend={
        <>
          <p className="font-montserrat font-semibold text-cu-black text-sm mb-1.5">
            ¿Para qué sirven las etiquetas?
          </p>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>
              Son <strong className="font-semibold text-cu-black">temas transversales</strong>{" "}
              (más flexibles que una categoría): un artículo puede tener varias.
            </li>
            <li>
              En el sitio ayudan a <strong className="font-semibold text-cu-black">filtrar</strong>{" "}
              el blog y a enlazar artículos relacionados.
            </li>
            <li>
              Alimentan el <strong className="font-semibold text-cu-black">SEO</strong> (keywords
              y URLs amigables) cuando las asignas a una publicación.
            </li>
            <li>
              No sustituyen a las categorías: usa categoría para el tema principal y etiquetas
              para detalles (zona, tipología, campaña, etc.).
            </li>
          </ul>
        </>
      }
      formDescription="Escribe el nombre y pulsa Guardar. El slug se genera solo (puedes editarlo)."
      emptyStateMessage="Aún no hay etiquetas. Crea la primera para etiquetar artículos."
      emptyStateCtaLabel="Agregar etiqueta"
      autoSlugFrom="name"
      apiPath="/api/admin/blog-tags.php"
      listKey="tags"
      card={{
        titleKey: "name",
        subtitleKey: "slug",
      }}
      fields={[
        { key: "name", label: "Nombre", required: true, placeholder: "Ej. Guadalajara" },
        {
          key: "slug",
          label: "Slug URL",
          hint: "Opcional. Se genera del nombre; el servidor evita duplicados (-2, -3…).",
        },
      ]}
    />
  );
}
