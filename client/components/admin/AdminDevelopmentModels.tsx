import { useEffect, useState } from "react";
import { Loader2, Pencil, Plus, Trash2, X } from "lucide-react";
import adminAxios from "@/store/axiosAdmin";
import { getAdminApiError } from "@/lib/adminApi";
import { assetUrl } from "@/lib/api";
import type { DevelopmentModel } from "@shared/api";
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
  name: string;
  bedrooms: string;
  bathrooms: string;
  area_sqm: string;
  terrace_m2: string;
  image_url: string;
  display_order: string;
};

const empty: FormState = {
  name: "",
  bedrooms: "",
  bathrooms: "",
  area_sqm: "",
  terrace_m2: "",
  image_url: "",
  display_order: "0",
};

export function AdminDevelopmentModels({
  developmentId,
  onUploadingChange,
}: Props) {
  const [models, setModels] = useState<DevelopmentModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<DevelopmentModel | null>(null);
  const [form, setForm] = useState<FormState>(empty);
  const [imageUploading, setImageUploading] = useState(false);

  useEffect(() => {
    onUploadingChange?.(imageUploading);
  }, [imageUploading, onUploadingChange]);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await adminAxios.get<{ models: DevelopmentModel[] }>(
        `/api/admin/development-models.php?development_id=${developmentId}`,
      );
      setModels(data.models ?? []);
    } catch (err) {
      setError(getAdminApiError(err, "Error al cargar modelos"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, [developmentId]);

  const openCreate = () => {
    setEditTarget(null);
    setForm({ ...empty, display_order: String(models.length) });
    setModalOpen(true);
  };

  const openEdit = (m: DevelopmentModel) => {
    setEditTarget(m);
    setForm({
      name: m.name,
      bedrooms: m.bedrooms != null ? String(m.bedrooms) : "",
      bathrooms: m.bathrooms != null ? String(m.bathrooms) : "",
      area_sqm: m.area_sqm != null ? String(m.area_sqm) : "",
      terrace_m2: m.terrace_m2 != null ? String(m.terrace_m2) : "",
      image_url: m.image_url ?? "",
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
    if (!form.name.trim()) {
      setError("Indica el nombre del modelo");
      return;
    }
    setSaving(true);
    setError(null);
    const payload = {
      name: form.name.trim(),
      bedrooms: form.bedrooms === "" ? null : Number(form.bedrooms),
      bathrooms: form.bathrooms === "" ? null : Number(form.bathrooms),
      area_sqm: form.area_sqm === "" ? null : Number(form.area_sqm),
      terrace_m2: form.terrace_m2 === "" ? null : Number(form.terrace_m2),
      image_url: form.image_url.trim() || null,
      display_order: Number(form.display_order) || 0,
    };
    try {
      if (editTarget) {
        await adminAxios.put("/api/admin/development-models.php", {
          id: editTarget.id,
          ...payload,
        });
      } else {
        await adminAxios.post("/api/admin/development-models.php", {
          development_id: developmentId,
          ...payload,
        });
      }
      setModalOpen(false);
      await load();
    } catch (err) {
      setError(getAdminApiError(err, "Error al guardar modelo"));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (m: DevelopmentModel) => {
    if (!confirm(`¿Eliminar «${m.name}»?`)) return;
    try {
      await adminAxios.delete(`/api/admin/development-models.php?id=${m.id}`);
      await load();
    } catch (err) {
      setError(getAdminApiError(err, "Error al eliminar"));
    }
  };

  return (
    <AdminFormSection
      title="Modelos / tipologías"
      description="Departamentos de este proyecto con imagen. Se muestran todos en la ficha; el CTA puede llevar al micrositio para más detalle."
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
          <Plus className="w-3.5 h-3.5" /> Agregar modelo
        </button>
      </div>
      {loading ? (
        <p className="text-sm text-cu-concrete flex items-center gap-2">
          <Loader2 className="w-4 h-4 animate-spin" /> Cargando modelos…
        </p>
      ) : models.length === 0 ? (
        <p className="text-sm text-cu-concrete border border-dashed border-cu-stone/30 rounded-sm px-4 py-6 text-center">
          Sin modelos. Agrega tipologías con plano o render.
        </p>
      ) : (
        <ul className="space-y-2">
          {models.map((m) => (
            <li
              key={m.id}
              className="flex items-center gap-3 border border-cu-stone/20 rounded-sm bg-white p-2.5"
            >
              {m.image_url ? (
                <img
                  src={assetUrl(m.image_url) ?? m.image_url}
                  alt=""
                  className="w-14 h-14 object-cover shrink-0 rounded-sm"
                />
              ) : (
                <div className="w-14 h-14 shrink-0 bg-cu-warm-white rounded-sm" />
              )}
              <div className="min-w-0 flex-1">
                <p className="text-sm font-montserrat font-semibold text-cu-black">
                  {m.name}
                </p>
                <p className="text-xs text-cu-concrete">
                  {[
                    m.bedrooms != null ? `${m.bedrooms} rec` : null,
                    m.area_sqm != null ? `${m.area_sqm} m²` : null,
                    m.terrace_m2 != null && Number(m.terrace_m2) > 0
                      ? `terraza ${m.terrace_m2} m²`
                      : null,
                  ]
                    .filter(Boolean)
                    .join(" · ")}
                </p>
              </div>
              <button
                type="button"
                onClick={() => openEdit(m)}
                className="p-2 text-cu-concrete hover:text-cu-black"
                aria-label="Editar"
              >
                <Pencil className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => void handleDelete(m)}
                className="p-2 text-cu-concrete hover:text-red-600"
                aria-label="Eliminar"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </li>
          ))}
        </ul>
      )}

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 p-0 sm:p-4">
          <div className="bg-white w-full sm:max-w-lg sm:rounded-sm shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-cu-stone/20 px-4 py-3">
              <h3 className="font-montserrat font-bold text-cu-black text-sm">
                {editTarget ? "Editar modelo" : "Nuevo modelo"}
              </h3>
              <button type="button" onClick={closeModal} aria-label="Cerrar">
                <X className="w-5 h-5 text-cu-concrete" />
              </button>
            </div>
            <div className="p-4 space-y-4">
              <AdminFormField id="model-name" label="Nombre" required>
                <input
                  id="model-name"
                  value={form.name}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, name: e.target.value }))
                  }
                  className={inputClass}
                  placeholder="Modelo A"
                />
              </AdminFormField>
              <div className="grid grid-cols-2 gap-3">
                <AdminFormField id="model-bed" label="Recámaras">
                  <input
                    id="model-bed"
                    type="number"
                    value={form.bedrooms}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, bedrooms: e.target.value }))
                    }
                    className={inputClass}
                  />
                </AdminFormField>
                <AdminFormField id="model-bath" label="Baños">
                  <input
                    id="model-bath"
                    type="number"
                    step="0.5"
                    value={form.bathrooms}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, bathrooms: e.target.value }))
                    }
                    className={inputClass}
                  />
                </AdminFormField>
                <AdminFormField id="model-area" label="m²">
                  <input
                    id="model-area"
                    type="number"
                    step="0.01"
                    value={form.area_sqm}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, area_sqm: e.target.value }))
                    }
                    className={inputClass}
                  />
                </AdminFormField>
                <AdminFormField id="model-terrace" label="Terraza m²">
                  <input
                    id="model-terrace"
                    type="number"
                    step="0.01"
                    value={form.terrace_m2}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, terrace_m2: e.target.value }))
                    }
                    className={inputClass}
                  />
                </AdminFormField>
              </div>
              <AdminImageField
                id="model-image"
                label="Imagen / plano"
                folder="models"
                value={form.image_url}
                onChange={(url) => setForm((f) => ({ ...f, image_url: url }))}
                onUploadingChange={setImageUploading}
              />
              <AdminFormField id="model-order" label="Orden">
                <input
                  id="model-order"
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
