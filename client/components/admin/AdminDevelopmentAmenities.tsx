import { useEffect, useState } from "react";
import { Loader2, Pencil, Plus, Trash2, X } from "lucide-react";
import adminAxios from "@/store/axiosAdmin";
import { getAdminApiError } from "@/lib/adminApi";
import { assetUrl } from "@/lib/api";
import type { DevelopmentAmenity } from "@shared/api";
import { AdminImageField } from "@/components/admin/AdminImageField";
import {
  AdminFormField,
  AdminFormSection,
  inputClass,
} from "@/components/admin/AdminFormField";
import { livAmenityIcon } from "@/lib/livAmenityIcons";

type Props = {
  developmentId: number;
  onUploadingChange?: (uploading: boolean) => void;
};

type AmenityForm = {
  name: string;
  description: string;
  icon: string;
  image_url: string;
  display_order: string;
};

const emptyForm: AmenityForm = {
  name: "",
  description: "",
  icon: "",
  image_url: "",
  display_order: "0",
};

const ICON_OPTIONS = [
  { value: "", label: "Sin icono" },
  { value: "paw-print", label: "Mascotas" },
  { value: "dumbbell", label: "Gym" },
  { value: "laptop", label: "Coworking" },
  { value: "flame", label: "Asador" },
  { value: "shirt", label: "Lavandería" },
  { value: "baby", label: "Playground" },
  { value: "sparkles", label: "General" },
  { value: "coffee", label: "Café" },
  { value: "book-open", label: "Lectura" },
  { value: "gamepad-2", label: "Juegos" },
];

export function AdminDevelopmentAmenities({
  developmentId,
  onUploadingChange,
}: Props) {
  const [amenities, setAmenities] = useState<DevelopmentAmenity[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<DevelopmentAmenity | null>(null);
  const [form, setForm] = useState<AmenityForm>(emptyForm);
  const [imageUploading, setImageUploading] = useState(false);

  useEffect(() => {
    onUploadingChange?.(imageUploading);
  }, [imageUploading, onUploadingChange]);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await adminAxios.get<{ amenities: DevelopmentAmenity[] }>(
        `/api/admin/development-amenities.php?development_id=${developmentId}`,
      );
      setAmenities(data.amenities ?? []);
    } catch (err) {
      setError(getAdminApiError(err, "Error al cargar amenidades"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- reload when project changes
  }, [developmentId]);

  const openCreate = () => {
    setEditTarget(null);
    setForm({
      ...emptyForm,
      display_order: String(amenities.length),
    });
    setModalOpen(true);
  };

  const openEdit = (a: DevelopmentAmenity) => {
    setEditTarget(a);
    setForm({
      name: a.name,
      description: a.description ?? "",
      icon: a.icon ?? "",
      image_url: a.image_url ?? "",
      display_order: String(a.display_order ?? 0),
    });
    setModalOpen(true);
  };

  const closeModal = () => {
    if (saving || imageUploading) return;
    setModalOpen(false);
    setEditTarget(null);
    setForm(emptyForm);
  };

  const handleSave = async () => {
    const name = form.name.trim();
    if (!name) {
      setError("Indica el nombre de la amenidad");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const payload = {
        name,
        description: form.description.trim() || null,
        icon: form.icon.trim() || null,
        image_url: form.image_url.trim() || null,
        display_order: Number(form.display_order) || 0,
      };
      if (editTarget) {
        await adminAxios.put("/api/admin/development-amenities.php", {
          id: editTarget.id,
          ...payload,
        });
      } else {
        await adminAxios.post("/api/admin/development-amenities.php", {
          development_id: developmentId,
          ...payload,
        });
      }
      setModalOpen(false);
      setEditTarget(null);
      setForm(emptyForm);
      await load();
    } catch (err) {
      setError(getAdminApiError(err, "Error al guardar amenidad"));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (a: DevelopmentAmenity) => {
    if (!confirm(`¿Eliminar «${a.name}»?`)) return;
    setError(null);
    try {
      await adminAxios.delete(
        `/api/admin/development-amenities.php?id=${a.id}`,
      );
      await load();
    } catch (err) {
      setError(getAdminApiError(err, "Error al eliminar"));
    }
  };

  return (
    <AdminFormSection
      title="Amenidades del proyecto"
      description="Cada proyecto tiene sus propias amenidades e imágenes (independiente del feed LIV). Sube fotos desde este panel."
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
          <Plus className="w-3.5 h-3.5" /> Agregar amenidad
        </button>
      </div>

      {loading ? (
        <p className="text-sm text-cu-concrete flex items-center gap-2">
          <Loader2 className="w-4 h-4 animate-spin" /> Cargando amenidades…
        </p>
      ) : amenities.length === 0 ? (
        <p className="text-sm text-cu-concrete border border-dashed border-cu-stone/30 rounded-sm px-4 py-6 text-center">
          Sin amenidades aún. Agrega gym, pet park, playground, etc. con su imagen.
        </p>
      ) : (
        <ul className="space-y-2">
          {amenities.map((a) => {
            const Icon = livAmenityIcon(a.icon);
            return (
              <li
                key={a.id}
                className="flex items-center gap-3 border border-cu-stone/20 rounded-sm bg-white p-2.5"
              >
                {a.image_url ? (
                  <img
                    src={assetUrl(a.image_url) ?? a.image_url}
                    alt=""
                    className="w-14 h-14 object-cover shrink-0 rounded-sm"
                  />
                ) : (
                  <div className="w-14 h-14 shrink-0 flex items-center justify-center bg-cu-warm-white rounded-sm">
                    <Icon className="w-5 h-5 text-cu-orange" strokeWidth={1.5} />
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-montserrat font-semibold text-cu-black truncate">
                    {a.name}
                  </p>
                  {a.description && (
                    <p className="text-xs text-cu-concrete line-clamp-1">
                      {a.description}
                    </p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => openEdit(a)}
                  className="p-2 text-cu-concrete hover:text-cu-black"
                  aria-label="Editar"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => void handleDelete(a)}
                  className="p-2 text-cu-concrete hover:text-red-600"
                  aria-label="Eliminar"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </li>
            );
          })}
        </ul>
      )}

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 p-0 sm:p-4">
          <div className="bg-white w-full sm:max-w-lg sm:rounded-sm shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-cu-stone/20 px-4 py-3">
              <h3 className="font-montserrat font-bold text-cu-black text-sm">
                {editTarget ? "Editar amenidad" : "Nueva amenidad"}
              </h3>
              <button type="button" onClick={closeModal} aria-label="Cerrar">
                <X className="w-5 h-5 text-cu-concrete" />
              </button>
            </div>
            <div className="p-4 space-y-4">
              <AdminFormField id="amenity-name" label="Nombre" required>
                <input
                  id="amenity-name"
                  value={form.name}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, name: e.target.value }))
                  }
                  className={inputClass}
                  placeholder="Ej. Gym"
                />
              </AdminFormField>
              <AdminFormField id="amenity-desc" label="Descripción">
                <textarea
                  id="amenity-desc"
                  rows={2}
                  value={form.description}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, description: e.target.value }))
                  }
                  className={inputClass}
                />
              </AdminFormField>
              <AdminFormField id="amenity-icon" label="Icono (si no hay imagen)">
                <select
                  id="amenity-icon"
                  value={form.icon}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, icon: e.target.value }))
                  }
                  className={inputClass}
                >
                  {ICON_OPTIONS.map((o) => (
                    <option key={o.value || "none"} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </AdminFormField>
              <AdminImageField
                id="amenity-image"
                label="Imagen"
                hint="JPG, PNG o WebP. Se guarda en /uploads/amenities/"
                folder="amenities"
                value={form.image_url}
                onChange={(url) => setForm((f) => ({ ...f, image_url: url }))}
                onUploadingChange={setImageUploading}
              />
              <AdminFormField id="amenity-order" label="Orden">
                <input
                  id="amenity-order"
                  type="number"
                  value={form.display_order}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, display_order: e.target.value }))
                  }
                  className={inputClass}
                />
              </AdminFormField>
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => void handleSave()}
                  disabled={saving || imageUploading || !form.name.trim()}
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
