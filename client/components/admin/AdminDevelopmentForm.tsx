import { useState } from "react";
import type { Development } from "@shared/api";
import { slugify } from "@/lib/slugify";
import { AdminImageField } from "@/components/admin/AdminImageField";
import { AdminFileField } from "@/components/admin/AdminFileField";
import { AdminDevelopmentAmenities } from "@/components/admin/AdminDevelopmentAmenities";
import { AdminDevelopmentGallery } from "@/components/admin/AdminDevelopmentGallery";
import { AdminDevelopmentModels } from "@/components/admin/AdminDevelopmentModels";
import { ADMIN_FIELD_LIMITS } from "@/lib/adminFieldLimits";
import {
  AdminFormField,
  AdminFormSection,
  inputClass,
} from "@/components/admin/AdminFormField";

type Props = {
  form: Partial<Development>;
  setForm: React.Dispatch<React.SetStateAction<Partial<Development>>>;
  highlightsText: string;
  setHighlightsText: (v: string) => void;
  highlightsError: string | null;
  onClearHighlightsError: () => void;
  saving: boolean;
  imageUploading?: boolean;
  onUploadingChange?: (uploading: boolean) => void;
  onSave: () => void;
  onCancel: () => void;
};

export function AdminDevelopmentForm({
  form,
  setForm,
  highlightsText,
  setHighlightsText,
  highlightsError,
  onClearHighlightsError,
  saving,
  imageUploading = false,
  onUploadingChange,
  onSave,
  onCancel,
}: Props) {
  const [slugTouched, setSlugTouched] = useState(!!form.id);

  const update = (patch: Partial<Development>) => {
    setForm((prev) => ({ ...prev, ...patch }));
  };

  const onNameChange = (name: string) => {
    setForm((prev) => {
      const next = { ...prev, name };
      if (!slugTouched) {
        next.slug = slugify(name);
      }
      return next;
    });
  };

  const regenerateSlug = () => {
    update({ slug: slugify(form.name ?? "") });
    setSlugTouched(false);
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <AdminFormSection
        title="Información general"
        description="Nombre público del desarrollo y datos que aparecen en la ficha del sitio."
      >
        <AdminFormField id="dev-name" label="Nombre del proyecto" required>
          <input
            id="dev-name"
            value={form.name ?? ""}
            onChange={(e) => onNameChange(e.target.value)}
            className={inputClass}
            placeholder="Ej. Punto Sao Paulo"
          />
        </AdminFormField>

        <AdminFormField
          id="dev-slug"
          label="URL amigable (slug)"
          hint="Se genera automáticamente del nombre. La ruta será /projects/tu-slug"
        >
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              id="dev-slug"
              value={form.slug ?? ""}
              onChange={(e) => {
                setSlugTouched(true);
                update({ slug: e.target.value });
              }}
              className={inputClass}
              placeholder="punto-sao-paulo"
            />
            <button
              type="button"
              onClick={regenerateSlug}
              className="shrink-0 px-3 py-2 text-xs font-montserrat font-semibold border border-cu-stone/30 rounded-sm hover:border-cu-orange text-cu-black"
            >
              Regenerar del nombre
            </button>
          </div>
        </AdminFormField>

        <AdminFormField
          id="dev-tagline"
          label="Frase destacada (tagline)"
          hint="Aparece en hero y fichas. Máx. 120 caracteres."
          maxLength={ADMIN_FIELD_LIMITS.tagline}
          value={form.tagline ?? ""}
        >
          <input
            id="dev-tagline"
            value={form.tagline ?? ""}
            maxLength={ADMIN_FIELD_LIMITS.tagline}
            onChange={(e) => update({ tagline: e.target.value })}
            className={inputClass}
            placeholder="Vida vertical en el corazón de la ciudad"
          />
        </AdminFormField>

        <AdminFormField
          id="dev-description-short"
          label="Resumen corto (tarjetas)"
          hint="Teaser en listados y portafolio. Máx. 280 caracteres."
          maxLength={ADMIN_FIELD_LIMITS.description_short}
          value={form.description_short ?? ""}
        >
          <textarea
            id="dev-description-short"
            rows={2}
            maxLength={ADMIN_FIELD_LIMITS.description_short}
            value={form.description_short ?? ""}
            onChange={(e) => update({ description_short: e.target.value })}
            className={inputClass}
            placeholder="Una o dos líneas para tarjetas y previews"
          />
        </AdminFormField>

        <AdminFormField
          id="dev-description"
          label="Descripción completa"
          hint="Texto largo para la ficha del proyecto."
          maxLength={ADMIN_FIELD_LIMITS.description}
          value={form.description ?? ""}
        >
          <textarea
            id="dev-description"
            rows={4}
            maxLength={ADMIN_FIELD_LIMITS.description}
            value={form.description ?? ""}
            onChange={(e) => update({ description: e.target.value })}
            className={inputClass}
            placeholder="Texto largo para la página del proyecto"
          />
        </AdminFormField>

        <AdminFormField id="dev-status" label="Estatus del proyecto">
          <select
            id="dev-status"
            value={form.status ?? "construction"}
            onChange={(e) => update({ status: e.target.value })}
            className={inputClass}
          >
            <option value="planning">Planeación</option>
            <option value="construction">En construcción</option>
            <option value="delivered">Entregado</option>
            <option value="sold_out">Agotado</option>
          </select>
        </AdminFormField>

        <AdminFormField
          id="dev-order"
          label="Orden en listados"
          hint="Número menor = aparece primero en mapa y portafolio."
        >
          <input
            id="dev-order"
            type="number"
            value={form.display_order ?? 0}
            onChange={(e) => update({ display_order: Number(e.target.value) })}
            className={inputClass}
          />
        </AdminFormField>
      </AdminFormSection>

      <AdminFormSection title="Ubicación y mapa">
        <AdminFormField id="dev-location" label="Zona / colonia (etiqueta)">
          <input
            id="dev-location"
            value={form.location_label ?? ""}
            onChange={(e) => update({ location_label: e.target.value })}
            className={inputClass}
            placeholder="Guadalajara Centro"
          />
        </AdminFormField>

        <AdminFormField id="dev-address" label="Dirección">
          <input
            id="dev-address"
            value={form.address_line ?? ""}
            onChange={(e) => update({ address_line: e.target.value })}
            className={inputClass}
            placeholder="Av. Juárez 500, Zona Centro"
          />
        </AdminFormField>

        <div className="grid sm:grid-cols-2 gap-4">
          <AdminFormField id="dev-lat" label="Latitud" hint="Para el pin en el mapa.">
            <input
              id="dev-lat"
              value={form.latitude != null ? String(form.latitude) : ""}
              onChange={(e) =>
                update({
                  latitude:
                    e.target.value === "" ? undefined : Number(e.target.value),
                })
              }
              className={inputClass}
              placeholder="20.6772"
            />
          </AdminFormField>
          <AdminFormField id="dev-lng" label="Longitud">
            <input
              id="dev-lng"
              value={form.longitude != null ? String(form.longitude) : ""}
              onChange={(e) =>
                update({
                  longitude:
                    e.target.value === "" ? undefined : Number(e.target.value),
                })
              }
              className={inputClass}
              placeholder="-103.3472"
            />
          </AdminFormField>
        </div>
      </AdminFormSection>

      <AdminFormSection title="Entrega y unidades">
        <AdminFormField id="dev-delivery" label="Fecha estimada de entrega">
          <input
            id="dev-delivery"
            value={form.delivery_estimate ?? ""}
            onChange={(e) => update({ delivery_estimate: e.target.value })}
            className={inputClass}
            placeholder="Segundo semestre 2027"
          />
        </AdminFormField>

        <div className="grid sm:grid-cols-2 gap-4">
          <AdminFormField id="dev-units" label="Total de unidades">
            <input
              id="dev-units"
              type="number"
              value={form.total_units ?? ""}
              onChange={(e) =>
                update({
                  total_units: e.target.value === "" ? undefined : Number(e.target.value),
                })
              }
              className={inputClass}
              placeholder="220"
            />
          </AdminFormField>
          <AdminFormField id="dev-units-label" label="Etiqueta de unidades (opcional)">
            <input
              id="dev-units-label"
              value={form.units_label ?? ""}
              onChange={(e) => update({ units_label: e.target.value })}
              className={inputClass}
              placeholder="220 departamentos"
            />
          </AdminFormField>
        </div>
      </AdminFormSection>

      <AdminFormSection
        title="Imagen y enlaces"
        description="Sube la foto principal del proyecto o pega una URL. Se muestra en tarjetas y en la ficha pública."
      >
        <AdminImageField
          id="dev-hero"
          label="Imagen principal (hero)"
          hint="Recomendado: horizontal 16:9, mínimo 1200 px de ancho."
          folder="developments"
          value={form.hero_image_url ?? ""}
          onChange={(url) => update({ hero_image_url: url })}
          onUploadingChange={onUploadingChange}
        />

        <AdminFileField
          id="dev-brochure"
          label="Dossier / brochure (PDF)"
          hint="Aparece como «Descargar dossier» en la ficha del proyecto. Puedes reemplazarlo cuando actualices el documento."
          folder="brochures"
          value={form.brochure_url ?? ""}
          onChange={(url) => update({ brochure_url: url || null })}
          onUploadingChange={onUploadingChange}
        />

        <AdminFormField id="dev-external" label="Sitio web del proyecto (opcional)">
          <input
            id="dev-external"
            type="url"
            value={form.external_site_url ?? ""}
            onChange={(e) => update({ external_site_url: e.target.value })}
            className={inputClass}
            placeholder="https://"
          />
        </AdminFormField>
      </AdminFormSection>

      <AdminFormSection title="Contacto del proyecto">
        <AdminFormField id="dev-email" label="Correo de contacto">
          <input
            id="dev-email"
            type="email"
            value={form.contact_email ?? ""}
            onChange={(e) => update({ contact_email: e.target.value })}
            className={inputClass}
          />
        </AdminFormField>
        <AdminFormField id="dev-phone" label="Teléfono de contacto">
          <input
            id="dev-phone"
            value={form.contact_phone ?? ""}
            onChange={(e) => update({ contact_phone: e.target.value })}
            className={inputClass}
          />
        </AdminFormField>
      </AdminFormSection>

      <AdminFormSection
        title="Destacados (texto)"
        description='Lista corta en JSON para chips del resumen. Ejemplo: ["Roof garden", "Gimnasio"]. Las amenidades con foto se gestionan abajo.'
      >
        <AdminFormField id="dev-highlights" label="Destacados (JSON)">
          <textarea
            id="dev-highlights"
            rows={4}
            value={highlightsText}
            onChange={(e) => {
              setHighlightsText(e.target.value);
              onClearHighlightsError();
            }}
            className={`${inputClass} font-mono text-xs`}
          />
          {highlightsError && (
            <p className="text-xs text-red-600 mt-1">{highlightsError}</p>
          )}
        </AdminFormField>
      </AdminFormSection>

      {form.id != null && form.id > 0 ? (
        <>
          <AdminDevelopmentAmenities
            developmentId={form.id}
            onUploadingChange={onUploadingChange}
          />
          <AdminDevelopmentGallery
            developmentId={form.id}
            onUploadingChange={onUploadingChange}
          />
          <AdminDevelopmentModels
            developmentId={form.id}
            onUploadingChange={onUploadingChange}
          />
        </>
      ) : (
        <AdminFormSection
          title="Amenidades, galería y modelos"
          description="Guarda el proyecto primero; después podrás agregar amenidades, imágenes y tipologías."
        >
          <p className="text-sm text-cu-concrete">
            Se editan al abrir un proyecto existente.
          </p>
        </AdminFormSection>
      )}

      <AdminFormSection title="Visibilidad en el sitio">
        <label className="flex items-center gap-2 text-sm font-montserrat">
          <input
            type="checkbox"
            checked={!!form.is_featured}
            onChange={(e) => update({ is_featured: e.target.checked ? 1 : 0 })}
            className="accent-cu-orange"
          />
          Destacado en página de inicio
        </label>
        <label className="flex items-center gap-2 text-sm font-montserrat">
          <input
            type="checkbox"
            checked={form.is_active !== 0}
            onChange={(e) => update({ is_active: e.target.checked ? 1 : 0 })}
            className="accent-cu-orange"
          />
          Activo y visible en el sitio público
        </label>
      </AdminFormSection>

      <div className="flex flex-wrap gap-2 pt-2">
        <button
          type="button"
          onClick={onSave}
          disabled={saving || imageUploading || !form.name?.trim()}
          title={!form.name?.trim() ? "Indica el nombre del proyecto" : undefined}
          className="px-6 py-2 bg-cu-orange text-white text-sm font-semibold rounded-sm disabled:opacity-50"
        >
          {saving ? "Guardando…" : "Guardar proyecto"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2 border border-cu-stone/30 text-sm rounded-sm"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}
