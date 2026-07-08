import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  fetchAdminDevelopments,
  fetchAdminDevelopment,
  saveDevelopment,
  deleteDevelopment,
  clearCurrent,
  clearDevError,
} from "@/store/slices/adminDevelopmentsSlice";
import type { Development } from "@shared/api";
import { AdminPreviewCard } from "@/components/admin/AdminPreviewCard";
import { AdminDevelopmentForm } from "@/components/admin/AdminDevelopmentForm";
import { slugify } from "@/lib/slugify";
import { Plus } from "lucide-react";

const empty: Partial<Development> = {
  name: "",
  slug: "",
  tagline: "",
  description: "",
  location_label: "",
  status: "construction",
  is_featured: 1,
  is_active: 1,
  display_order: 0,
};

const STATUS_LABELS: Record<string, string> = {
  planning: "Planeación",
  construction: "En construcción",
  delivered: "Entregado",
  sold_out: "Agotado",
};

export default function AdminDevelopments() {
  const dispatch = useAppDispatch();
  const { list, current, loading, saving, error } = useAppSelector(
    (s) => s.adminDevelopments,
  );
  const [form, setForm] = useState<Partial<Development>>(empty);
  const [editing, setEditing] = useState(false);
  const [highlightsText, setHighlightsText] = useState("[]");
  const [highlightsError, setHighlightsError] = useState<string | null>(null);
  const [imageUploading, setImageUploading] = useState(false);

  useEffect(() => {
    dispatch(fetchAdminDevelopments());
  }, [dispatch]);

  useEffect(() => {
    if (current) {
      setForm(current);
      setHighlightsText(
        JSON.stringify(
          Array.isArray(current.highlights) ? current.highlights : [],
          null,
          2,
        ),
      );
    }
  }, [current]);

  const openNew = () => {
    dispatch(clearDevError());
    dispatch(clearCurrent());
    setForm({ ...empty, slug: "" });
    setHighlightsText("[]");
    setEditing(true);
  };

  const openEdit = (id: number) => {
    dispatch(clearDevError());
    dispatch(fetchAdminDevelopment(id));
    setEditing(true);
  };

  const handleSave = async () => {
    let highlights: string[] | undefined;
    try {
      const parsed = JSON.parse(highlightsText);
      if (!Array.isArray(parsed)) throw new Error("Debe ser un arreglo JSON");
      highlights = parsed.map(String);
    } catch {
      setHighlightsError('JSON inválido. Usa un arreglo, ej. ["Gimnasio","Roof garden"]');
      return;
    }
    setHighlightsError(null);

    const slug =
      form.slug?.trim() || slugify(form.name ?? "");
    const payload = { ...form, slug, highlights };
    const result = await dispatch(saveDevelopment(payload));
    if (saveDevelopment.fulfilled.match(result)) {
      setEditing(false);
      dispatch(fetchAdminDevelopments());
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("¿Desactivar este proyecto? Ya no aparecerá en el sitio público.")) return;
    await dispatch(deleteDevelopment(id));
    dispatch(fetchAdminDevelopments());
  };

  const sorted = [...list].sort(
    (a, b) => (a.display_order ?? 0) - (b.display_order ?? 0) || a.name.localeCompare(b.name),
  );

  return (
    <div className="cu-admin-page space-y-6 min-w-0">
      <div className="flex flex-wrap justify-between items-start gap-4">
        <div>
          <h1 className="font-montserrat font-bold text-2xl text-cu-black">Proyectos</h1>
          <p className="text-sm text-cu-concrete mt-1">
            {sorted.length} en portafolio · vista previa como en el sitio
          </p>
        </div>
        {!editing && (
          <button
            type="button"
            onClick={openNew}
            className="flex items-center gap-2 px-4 py-2 bg-cu-orange text-white text-sm font-semibold rounded-sm"
          >
            <Plus size={16} /> Nuevo
          </button>
        )}
      </div>

      {error && (
        <p className="text-sm text-red-700 bg-red-50 border border-red-200 px-4 py-2 rounded-sm">
          {error}
        </p>
      )}

      {editing ? (
        <div className="bg-white border border-cu-stone/30 p-6 rounded-sm space-y-4 max-w-2xl shadow-sm">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="font-montserrat font-bold text-lg text-cu-black">
              {form.id ? "Editar proyecto" : "Nuevo proyecto"}
            </h2>
            <button
              type="button"
              onClick={() => {
                setEditing(false);
                dispatch(clearDevError());
              }}
              className="text-sm text-cu-concrete hover:text-cu-black"
            >
              ← Volver a tarjetas
            </button>
          </div>
          {loading && form.id && !form.name ? (
            <p className="text-cu-concrete text-sm">Cargando proyecto…</p>
          ) : (
            <AdminDevelopmentForm
              key={form.id ?? "new"}
              form={form}
              setForm={setForm}
              highlightsText={highlightsText}
              setHighlightsText={setHighlightsText}
              highlightsError={highlightsError}
              onClearHighlightsError={() => setHighlightsError(null)}
              saving={saving}
              imageUploading={imageUploading}
              onUploadingChange={setImageUploading}
              onSave={handleSave}
              onCancel={() => {
                setEditing(false);
                dispatch(clearDevError());
              }}
            />
          )}
        </div>
      ) : loading && list.length === 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="bg-white border border-cu-stone/20 rounded-sm overflow-hidden animate-pulse"
            >
              <div className="aspect-[16/10] bg-cu-stone/20" />
              <div className="p-4 space-y-2">
                <div className="h-4 bg-cu-stone/20 rounded w-3/4" />
                <div className="h-3 bg-cu-stone/15 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : sorted.length === 0 ? (
        <div className="bg-white border border-dashed border-cu-stone/40 rounded-sm p-12 text-center">
          <p className="text-cu-concrete text-sm mb-4">No hay proyectos activos en el panel.</p>
          <button
            type="button"
            onClick={openNew}
            className="px-4 py-2 bg-cu-orange text-white text-sm font-semibold rounded-sm"
          >
            Crear primer proyecto
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {sorted.map((d) => {
            const badges = [
              {
                label: STATUS_LABELS[d.status] ?? d.status,
                className: "bg-cu-black/80 text-white",
              },
            ];
            if (d.is_featured) {
              badges.push({
                label: "Destacado",
                className: "bg-cu-orange text-white",
              });
            }
            if (!d.is_active) {
              badges.push({
                label: "Inactivo",
                className: "bg-red-600/90 text-white",
              });
            }

            return (
              <AdminPreviewCard
                key={d.id}
                title={d.name}
                subtitle={d.tagline ?? undefined}
                description={d.location_label ?? undefined}
                imageUrl={d.hero_image_url}
                badges={badges}
                meta={[
                  d.delivery_estimate ? `Entrega: ${d.delivery_estimate}` : "",
                  `Orden: ${d.display_order ?? 0}`,
                  d.slug ? `/${d.slug}` : "",
                ].filter(Boolean)}
                inactive={!d.is_active}
                onEdit={() => openEdit(d.id)}
                onDelete={() => handleDelete(d.id)}
                deleteLabel="Desactivar"
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
