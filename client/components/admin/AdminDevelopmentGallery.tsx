import { useEffect, useState } from "react";
import { Loader2, Pencil, Plus, Trash2, X } from "lucide-react";
import adminAxios from "@/store/axiosAdmin";
import { getAdminApiError } from "@/lib/adminApi";
import { assetUrl } from "@/lib/api";
import type { DevelopmentMedia } from "@shared/api";
import { AdminImageField } from "@/components/admin/AdminImageField";
import {
  AdminFormField,
  AdminFormSection,
  inputClass,
} from "@/components/admin/AdminFormField";

type Props = {
  developmentId: number;
  onUploadingChange?: (uploading: boolean) => void;
};

type FormState = {
  url: string;
  caption: string;
  display_order: string;
};

const empty: FormState = { url: "", caption: "", display_order: "0" };

export function AdminDevelopmentGallery({
  developmentId,
  onUploadingChange,
}: Props) {
  const [items, setItems] = useState<DevelopmentMedia[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<DevelopmentMedia | null>(null);
  const [form, setForm] = useState<FormState>(empty);
  const [imageUploading, setImageUploading] = useState(false);

  useEffect(() => {
    onUploadingChange?.(imageUploading);
  }, [imageUploading, onUploadingChange]);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await adminAxios.get<{ media: DevelopmentMedia[] }>(
        `/api/admin/development-media.php?development_id=${developmentId}`,
      );
      setItems((data.media ?? []).filter((m) => m.media_type !== "video"));
    } catch (err) {
      setError(getAdminApiError(err, "Error al cargar galería"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, [developmentId]);

  const openCreate = () => {
    setEditTarget(null);
    setForm({ ...empty, display_order: String(items.length) });
    setModalOpen(true);
  };

  const openEdit = (m: DevelopmentMedia) => {
    setEditTarget(m);
    setForm({
      url: m.url,
      caption: m.caption ?? "",
      display_order: String(m.display_order ?? 0),
    });
    setModalOpen(true);
  };

  const closeModal = () => {
    if (saving || imageUploading) return;
    setModalOpen(false);
    setEditTarget(null);
    setForm(empty);
  };

  const handleSave = async () => {
    if (!form.url.trim()) {
      setError("Sube o pega la URL de la imagen");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      if (editTarget) {
        await adminAxios.put("/api/admin/development-media.php", {
          id: editTarget.id,
          url: form.url.trim(),
          caption: form.caption.trim() || null,
          media_type: "image",
          display_order: Number(form.display_order) || 0,
        });
      } else {
        await adminAxios.post("/api/admin/development-media.php", {
          development_id: developmentId,
          url: form.url.trim(),
          caption: form.caption.trim() || null,
          media_type: "image",
          display_order: Number(form.display_order) || 0,
        });
      }
      setModalOpen(false);
      await load();
    } catch (err) {
      setError(getAdminApiError(err, "Error al guardar imagen"));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (m: DevelopmentMedia) => {
    if (!confirm("¿Eliminar esta imagen de la galería?")) return;
    try {
      await adminAxios.delete(`/api/admin/development-media.php?id=${m.id}`);
      await load();
    } catch (err) {
      setError(getAdminApiError(err, "Error al eliminar"));
    }
  };

  return (
    <AdminFormSection
      title="Galería del proyecto"
      description="Imágenes propias de este proyecto (independiente del feed LIV). El visitante puede ampliarlas en la ficha."
    >
      {error && (
        <p className="text-xs text-red-600 bg-red-50 border border-red-200 px-2 py-1.5 rounded-sm">
          {error}
        </p>
      )}
      <div className="flex justify-end">
        <button
          type="button"
          onClick={openCreate}
          className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-montserrat font-semibold bg-cu-orange text-white rounded-sm"
        >
          <Plus className="w-3.5 h-3.5" /> Agregar imagen
        </button>
      </div>
      {loading ? (
        <p className="text-sm text-cu-concrete flex items-center gap-2">
          <Loader2 className="w-4 h-4 animate-spin" /> Cargando galería…
        </p>
      ) : items.length === 0 ? (
        <p className="text-sm text-cu-concrete border border-dashed border-cu-stone/30 rounded-sm px-4 py-6 text-center">
          Sin imágenes. Agrega renders, interiores o avances de obra.
        </p>
      ) : (
        <ul className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {items.map((m) => (
            <li
              key={m.id}
              className="relative border border-cu-stone/20 rounded-sm overflow-hidden group"
            >
              <img
                src={assetUrl(m.url) ?? m.url}
                alt={m.caption ?? ""}
                className="w-full aspect-[4/3] object-cover"
              />
              {m.caption && (
                <p className="absolute bottom-0 inset-x-0 bg-black/55 text-white text-[10px] px-1.5 py-1 truncate">
                  {m.caption}
                </p>
              )}
              <div className="absolute top-1 right-1 flex gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100">
                <button
                  type="button"
                  onClick={() => openEdit(m)}
                  className="p-1.5 bg-white/90 rounded-sm"
                  aria-label="Editar"
                >
                  <Pencil className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => void handleDelete(m)}
                  className="p-1.5 bg-white/90 rounded-sm text-red-600"
                  aria-label="Eliminar"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 p-0 sm:p-4">
          <div className="bg-white w-full sm:max-w-lg sm:rounded-sm shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-cu-stone/20 px-4 py-3">
              <h3 className="font-montserrat font-bold text-cu-black text-sm">
                {editTarget ? "Editar imagen" : "Nueva imagen"}
              </h3>
              <button type="button" onClick={closeModal} aria-label="Cerrar">
                <X className="w-5 h-5 text-cu-concrete" />
              </button>
            </div>
            <div className="p-4 space-y-4">
              <AdminImageField
                id="gallery-image"
                label="Imagen"
                folder="gallery"
                value={form.url}
                onChange={(url) => setForm((f) => ({ ...f, url }))}
                onUploadingChange={setImageUploading}
              />
              <AdminFormField id="gallery-caption" label="Título / pie">
                <input
                  id="gallery-caption"
                  value={form.caption}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, caption: e.target.value }))
                  }
                  className={inputClass}
                  placeholder="Ej. Cocina Modelo CT"
                />
              </AdminFormField>
              <AdminFormField id="gallery-order" label="Orden">
                <input
                  id="gallery-order"
                  type="number"
                  value={form.display_order}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, display_order: e.target.value }))
                  }
                  className={inputClass}
                />
              </AdminFormField>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => void handleSave()}
                  disabled={saving || imageUploading || !form.url.trim()}
                  className="px-4 py-2 bg-cu-orange text-white text-sm font-semibold rounded-sm disabled:opacity-50"
                >
                  {saving ? "Guardando…" : "Guardar"}
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 border border-cu-stone/30 text-sm rounded-sm"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminFormSection>
  );
}
