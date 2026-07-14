import { useCallback, useEffect, useState } from "react";
import adminAxios from "@/store/axiosAdmin";
import { getAdminApiError } from "@/lib/adminApi";
import { AdminTable } from "@/components/admin/AdminTable";
import { AdminPreviewCard } from "@/components/admin/AdminPreviewCard";
import { AdminImageField } from "@/components/admin/AdminImageField";
import { AdminFormField, inputClass } from "@/components/admin/AdminFormField";
import type { AdminUploadFolder } from "@/lib/adminUpload";
import { Plus } from "lucide-react";

export type Field = {
  key: string;
  label: string;
  hint?: string;
  placeholder?: string;
  required?: boolean;
  maxLength?: number;
  type?: "text" | "textarea" | "number" | "checkbox" | "image" | "select";
  uploadFolder?: AdminUploadFolder;
  options?: { value: string; label: string }[];
};

export type AdminCrudCardConfig = {
  titleKey: string;
  subtitleKey?: string;
  descriptionKey?: string;
  imageKey?: string;
  iconKey?: string;
};

export function AdminSimpleCrud({
  title,
  apiPath,
  listKey,
  fields,
  idKey = "id",
  card,
  formDescription,
  emptyStateMessage,
  emptyStateCtaLabel = "Agregar primer registro",
}: {
  title: string;
  apiPath: string;
  listKey: string;
  fields: Field[];
  idKey?: string;
  card?: AdminCrudCardConfig;
  formDescription?: string;
  emptyStateMessage?: string;
  emptyStateCtaLabel?: string;
}) {
  const [items, setItems] = useState<Record<string, unknown>[]>([]);
  const [form, setForm] = useState<Record<string, unknown>>({});
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [message, setMessage] = useState<{ type: "ok" | "err"; text: string } | null>(
    null,
  );

  const load = useCallback(() => {
    setLoading(true);
    setMessage(null);
    adminAxios
      .get(apiPath)
      .then((res) => setItems(res.data[listKey] ?? []))
      .catch((err) => setMessage({ type: "err", text: getAdminApiError(err, "Error al cargar") }))
      .finally(() => setLoading(false));
  }, [apiPath, listKey]);

  useEffect(() => {
    load();
  }, [load]);

  const buildPayload = (): Record<string, unknown> => {
    const payload: Record<string, unknown> = {};
    const id = form[idKey];
    if (id !== undefined && id !== null && id !== "") {
      payload[idKey] = Number(id);
    }
    for (const f of fields) {
      const raw = form[f.key];
      if (f.type === "checkbox") {
        payload[f.key] = raw === 1 || raw === true || raw === "1" ? 1 : 0;
      } else if (f.type === "number") {
        payload[f.key] =
          raw === "" || raw === undefined || raw === null ? 0 : Number(raw);
      } else {
        payload[f.key] = raw ?? "";
      }
    }
    return payload;
  };

  const openCreate = () => {
    const empty: Record<string, unknown> = {};
    for (const f of fields) {
      if (f.type === "checkbox") {
        empty[f.key] = 1;
      } else if (f.type === "number") {
        empty[f.key] = 0;
      } else if (f.type === "select") {
        empty[f.key] = f.options?.[0]?.value ?? "";
      } else {
        empty[f.key] = "";
      }
    }
    setForm(empty);
    setMessage(null);
    setShowForm(true);
  };

  const openEdit = (item: Record<string, unknown>) => {
    const next: Record<string, unknown> = { [idKey]: item[idKey] };
    for (const f of fields) {
      const v = item[f.key];
      if (f.type === "checkbox") {
        next[f.key] = v === 1 || v === true || v === "1" ? 1 : 0;
      } else if (f.type === "select") {
        next[f.key] = v ?? f.options?.[0]?.value ?? "";
      } else {
        next[f.key] = v ?? (f.type === "number" ? 0 : "");
      }
    }
    setForm(next);
    setMessage(null);
    setShowForm(true);
  };

  const save = async () => {
    for (const f of fields) {
      if (!f.required) continue;
      const raw = form[f.key];
      const empty =
        f.type === "checkbox"
          ? false
          : raw === undefined || raw === null || String(raw).trim() === "";
      if (empty) {
        setMessage({ type: "err", text: `«${f.label}» es obligatorio.` });
        return;
      }
    }

    setSaving(true);
    setMessage(null);
    const payload = buildPayload();
    try {
      if (payload[idKey]) {
        await adminAxios.put(apiPath, payload);
      } else {
        await adminAxios.post(apiPath, payload);
      }
      setShowForm(false);
      setForm({});
      setMessage({ type: "ok", text: "Guardado correctamente." });
      load();
    } catch (err) {
      setMessage({ type: "err", text: getAdminApiError(err) });
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: number) => {
    if (!confirm("¿Eliminar este registro?")) return;
    setMessage(null);
    try {
      await adminAxios.delete(`${apiPath}?id=${id}`);
      setMessage({ type: "ok", text: "Eliminado." });
      load();
    } catch (err) {
      setMessage({ type: "err", text: getAdminApiError(err, "Error al eliminar") });
    }
  };

  const renderField = (f: Field) => {
    const id = `crud-${f.key}`;
    if (f.type === "image") {
      return (
        <AdminImageField
          key={f.key}
          id={id}
          label={f.label}
          hint={f.hint}
          folder={f.uploadFolder ?? "team"}
          value={String(form[f.key] ?? "")}
          onChange={(url) => setForm({ ...form, [f.key]: url })}
          onUploadingChange={setImageUploading}
        />
      );
    }
    if (f.type === "checkbox") {
      return (
        <label
          key={f.key}
          className="flex items-center gap-2 text-sm font-montserrat cursor-pointer"
        >
          <input
            id={id}
            type="checkbox"
            checked={form[f.key] === 1 || form[f.key] === true}
            onChange={(e) =>
              setForm({ ...form, [f.key]: e.target.checked ? 1 : 0 })
            }
            className="accent-cu-orange"
          />
          <span>{f.label}</span>
        </label>
      );
    }
    if (f.type === "select") {
      return (
        <AdminFormField
          key={f.key}
          id={id}
          label={f.label}
          hint={f.hint}
          required={f.required}
          value={String(form[f.key] ?? "")}
        >
          <select
            id={id}
            value={String(form[f.key] ?? "")}
            onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
            className={inputClass}
          >
            {(f.options ?? []).map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </AdminFormField>
      );
    }

    return (
      <AdminFormField
        key={f.key}
        id={id}
        label={f.label}
        hint={f.hint}
        required={f.required}
        maxLength={f.maxLength}
        value={String(form[f.key] ?? "")}
      >
        {f.type === "textarea" ? (
          <textarea
            id={id}
            rows={4}
            maxLength={f.maxLength}
            value={String(form[f.key] ?? "")}
            onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
            className={inputClass}
            placeholder={f.placeholder}
          />
        ) : (
          <input
            id={id}
            type={f.type === "number" ? "number" : "text"}
            maxLength={f.maxLength}
            value={String(form[f.key] ?? "")}
            onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
            className={inputClass}
            placeholder={f.placeholder}
          />
        )}
      </AdminFormField>
    );
  };

  return (
    <div className="cu-admin-page space-y-6 min-w-0">
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div>
          <h1 className="font-montserrat font-bold text-2xl text-cu-black">{title}</h1>
          {!loading && items.length > 0 && card && (
            <p className="text-sm text-cu-concrete mt-1">{items.length} registros</p>
          )}
        </div>
        {!showForm && (
          <button
            type="button"
            onClick={openCreate}
            className="flex items-center gap-2 px-4 py-2 bg-cu-orange text-white text-sm font-semibold rounded-sm"
          >
            <Plus size={16} /> Nuevo
          </button>
        )}
      </div>

      {message && (
        <p
          className={`text-sm px-4 py-2 rounded-sm border ${
            message.type === "ok"
              ? "text-green-800 bg-green-50 border-green-200"
              : "text-red-700 bg-red-50 border-red-200"
          }`}
        >
          {message.text}
        </p>
      )}

      {showForm && (
        <div className="bg-white border border-cu-stone/30 p-6 rounded-sm space-y-4 max-w-xl shadow-sm">
          <h2 className="font-montserrat font-semibold text-lg text-cu-black">
            {form[idKey] ? "Editar registro" : "Nuevo registro"}
          </h2>
          {formDescription && (
            <p className="text-sm text-cu-concrete -mt-2">{formDescription}</p>
          )}
          <div className="space-y-4">{fields.map(renderField)}</div>
          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={save}
              disabled={saving || imageUploading}
              className="px-4 py-2 bg-cu-black text-white text-sm rounded-sm disabled:opacity-50"
            >
              {saving ? "Guardando…" : "Guardar"}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-2 border border-cu-stone/30 text-sm rounded-sm"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {loading ? (
        card ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="bg-white border border-cu-stone/20 rounded-sm overflow-hidden animate-pulse"
              >
                <div className="aspect-[16/10] bg-cu-stone/20" />
                <div className="p-4 h-20 bg-cu-stone/10" />
              </div>
            ))}
          </div>
        ) : (
          <p className="text-cu-concrete">Cargando…</p>
        )
      ) : items.length === 0 ? (
        <div className="border border-dashed border-cu-stone/30 rounded-sm p-8 text-center bg-cu-warm-white/50">
          <p className="text-cu-concrete text-sm mb-4">
            {emptyStateMessage ?? "Sin registros."}
          </p>
          <button
            type="button"
            onClick={openCreate}
            className="inline-flex items-center gap-2 px-4 py-2 bg-cu-orange text-white text-sm font-semibold rounded-sm"
          >
            <Plus size={16} /> {emptyStateCtaLabel}
          </button>
        </div>
      ) : card ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {items.map((item) => {
            const active =
              !("is_active" in item) ||
              item.is_active === 1 ||
              item.is_active === true;
            const badges: { label: string; className?: string }[] = [];
            if (!active) {
              badges.push({ label: "Inactivo", className: "bg-red-600/90 text-white" });
            }
            if (item.is_leadership === 1 || item.is_leadership === true) {
              badges.push({ label: "Liderazgo", className: "bg-cu-orange text-white" });
            }
            const section = String(item.team_section ?? "");
            if (section === "technical") {
              badges.push({ label: "Staff técnico", className: "bg-cu-black/75 text-white" });
            } else if (section === "general") {
              badges.push({ label: "Equipo", className: "bg-cu-stone/80 text-white" });
            }
            if (card.imageKey && !String(item[card.imageKey] ?? "").trim()) {
              badges.push({ label: "Sin foto", className: "bg-amber-600/90 text-white" });
            }
            if (item.category && card.subtitleKey !== "category") {
              badges.push({
                label: String(item.category),
                className: "bg-cu-black/75 text-white",
              });
            }

            return (
              <AdminPreviewCard
                key={String(item[idKey])}
                title={String(item[card.titleKey] ?? "")}
                subtitle={
                  card.subtitleKey ? String(item[card.subtitleKey] ?? "") : undefined
                }
                description={
                  card.descriptionKey
                    ? String(item[card.descriptionKey] ?? "").slice(0, 160)
                    : undefined
                }
                imageUrl={
                  card.imageKey ? String(item[card.imageKey] ?? "") : undefined
                }
                iconName={card.iconKey ? String(item[card.iconKey] ?? "") : undefined}
                badges={badges}
                meta={[`Orden: ${item.display_order ?? 0}`]}
                inactive={!active}
                onEdit={() => openEdit(item)}
                onDelete={() => remove(Number(item[idKey]))}
              />
            );
          })}
        </div>
      ) : (
        <AdminTable headers={[...fields.map((f) => f.label), ""]}>
          {items.map((item) => (
            <tr key={String(item[idKey])} className="border-b border-cu-stone/10">
              {fields.map((f) => (
                <td key={f.key} className="px-4 py-3 text-sm max-w-xs truncate">
                  {f.type === "checkbox"
                    ? item[f.key] === 1 || item[f.key] === true
                      ? "Sí"
                      : "No"
                    : String(item[f.key] ?? "").slice(0, 80)}
                </td>
              ))}
              <td className="px-4 py-3">
                <button
                  type="button"
                  className="text-xs text-cu-orange font-semibold mr-3"
                  onClick={() => openEdit(item)}
                >
                  Editar
                </button>
                <button
                  type="button"
                  onClick={() => remove(Number(item[idKey]))}
                  className="text-xs text-red-600 font-semibold"
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </AdminTable>
      )}
    </div>
  );
}
