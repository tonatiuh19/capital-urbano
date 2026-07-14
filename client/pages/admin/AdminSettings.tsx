import { useEffect, useMemo, useState } from "react";
import adminAxios from "@/store/axiosAdmin";
import { getAdminApiError } from "@/lib/adminApi";
import { AdminFormField, AdminFormSection, inputClass } from "@/components/admin/AdminFormField";
import { getSettingMeta, groupSettings } from "@/lib/adminSettingLabels";
import { PUBLIC_STAT_KEYS } from "@/lib/adminContentGaps";

type Setting = { setting_key: string; setting_value: string; is_public: number };

export default function AdminSettings() {
  const [settings, setSettings] = useState<Setting[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  useEffect(() => {
    adminAxios
      .get("/api/admin/settings.php")
      .then((res) => setSettings(res.data.settings))
      .catch((err) =>
        setMsg({ type: "err", text: getAdminApiError(err, "Error al cargar") }),
      )
      .finally(() => setLoading(false));
  }, []);

  const updateSetting = (key: string, value: string) => {
    setSettings((prev) =>
      prev.map((s) => (s.setting_key === key ? { ...s, setting_value: value } : s)),
    );
  };

  const save = () => {
    setSaving(true);
    setMsg(null);
    adminAxios
      .put("/api/admin/settings.php", {
        updates: settings.map((s) => ({
          key: s.setting_key,
          value: s.setting_value,
          is_public: s.is_public,
        })),
      })
      .then(() => setMsg({ type: "ok", text: "Configuración guardada." }))
      .catch((err) => setMsg({ type: "err", text: getAdminApiError(err) }))
      .finally(() => setSaving(false));
  };

  const gate = settings.find((s) => s.setting_key === "under_construction");
  const groups = groupSettings(settings);
  const statKeySet = useMemo(() => new Set(PUBLIC_STAT_KEYS.map((s) => s.key)), []);

  const statValidationErrors = useMemo(() => {
    const errors: string[] = [];
    for (const stat of PUBLIC_STAT_KEYS) {
      const row = settings.find((s) => s.setting_key === stat.key);
      const value = row?.setting_value?.trim() ?? "";
      if (!value) {
        errors.push(`Falta «${stat.label}» — en el sitio se mostrará como —.`);
      } else if (!/^\d+$/.test(value)) {
        errors.push(`«${stat.label}» debe ser solo números.`);
      }
    }
    return errors;
  }, [settings]);

  if (loading) {
    return <p className="text-cu-concrete">Cargando…</p>;
  }

  return (
    <div className="cu-admin-page space-y-6 max-w-2xl min-w-0 w-full">
      <div>
        <h1 className="font-montserrat font-bold text-2xl text-cu-black">
          Configuración del sitio
        </h1>
        <p className="text-sm text-cu-concrete mt-1">
          Textos públicos, contacto, estadísticas y modo próximamente.
        </p>
      </div>

      {msg && (
        <p
          className={`text-sm px-4 py-2 rounded-sm border ${
            msg.type === "ok"
              ? "text-green-800 bg-green-50 border-green-200"
              : "text-red-700 bg-red-50 border-red-200"
          }`}
        >
          {msg.text}
        </p>
      )}

      <div className="bg-cu-warm-white border border-cu-orange/40 p-6 rounded-sm">
        <h2 className="font-montserrat font-semibold text-cu-black mb-2">
          Modo próximamente
        </h2>
        <p className="text-sm text-cu-concrete mb-4">
          Si está activo, el público ve la página «Próximamente». El panel admin y el bypass
          siguen funcionando.
        </p>
        <label className="flex items-center gap-3 text-sm font-montserrat font-medium cursor-pointer">
          <input
            type="checkbox"
            checked={gate?.setting_value === "1"}
            onChange={(e) =>
              updateSetting("under_construction", e.target.checked ? "1" : "0")
            }
            className="accent-cu-orange"
          />
          Sitio en construcción
        </label>
      </div>

      {statValidationErrors.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-sm px-4 py-3 text-sm text-amber-900">
          <p className="font-semibold mb-1">Estadísticas incompletas</p>
          <ul className="list-disc pl-5 space-y-1">
            {statValidationErrors.map((err) => (
              <li key={err}>{err}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="bg-white border border-cu-stone/30 p-6 rounded-sm space-y-8 shadow-sm">
        {groups.map((group) => (
          <AdminFormSection key={group.title} title={group.title}>
            {group.items.map((s) => {
              const meta = getSettingMeta(s.setting_key);
              const id = `setting-${s.setting_key}`;
              const isStat = statKeySet.has(s.setting_key as (typeof PUBLIC_STAT_KEYS)[number]["key"]);
              const statEmpty = isStat && !s.setting_value?.trim();
              return (
                <AdminFormField
                  key={s.setting_key}
                  id={id}
                  label={meta.label}
                  hint={meta.hint}
                  maxLength={meta.maxLength}
                  value={s.setting_value ?? ""}
                >
                  {meta.multiline ? (
                    <textarea
                      id={id}
                      rows={meta.label.includes("JSON") ? 6 : 3}
                      maxLength={meta.maxLength}
                      className={`${inputClass} font-mono text-xs`}
                      value={s.setting_value ?? ""}
                      onChange={(e) => updateSetting(s.setting_key, e.target.value)}
                    />
                  ) : (
                    <input
                      id={id}
                      className={`${inputClass}${statEmpty ? " border-amber-400" : ""}`}
                      maxLength={meta.maxLength}
                      inputMode={isStat ? "numeric" : undefined}
                      pattern={isStat ? "[0-9]*" : undefined}
                      value={s.setting_value ?? ""}
                      onChange={(e) => updateSetting(s.setting_key, e.target.value)}
                    />
                  )}
                  {statEmpty && (
                    <p className="text-xs text-amber-700 mt-1">Vacío — el sitio mostrará «—».</p>
                  )}
                </AdminFormField>
              );
            })}
          </AdminFormSection>
        ))}
      </div>

      <button
        type="button"
        onClick={save}
        disabled={saving}
        className="px-6 py-2 bg-cu-orange text-white text-sm font-semibold rounded-sm disabled:opacity-50"
      >
        {saving ? "Guardando…" : "Guardar todo"}
      </button>
    </div>
  );
}
