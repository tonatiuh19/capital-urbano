import { useState } from "react";
import { ArrowDown, ArrowUp, Plus, Trash2, Upload } from "lucide-react";
import { assetUrl } from "@/lib/api";
import type { AdminUploadFolder } from "@/lib/adminUpload";
import { inputClass } from "@/components/admin/AdminFormField";
import { SafeImage } from "@/components/ui/SafeImage";
import {
  isPendingUploadUrl,
  previewSrcForUpload,
  registerPendingUpload,
  unregisterPendingUpload,
} from "@/lib/pendingUploads";

type AdminGalleryFieldProps = {
  id: string;
  images: string[];
  onChange: (images: string[]) => void;
  folder?: AdminUploadFolder;
  /** When false (default), files stay local until the form is saved. */
  uploadOnSelect?: boolean;
};

export function AdminGalleryField({
  id,
  images,
  onChange,
  folder = "blog",
  uploadOnSelect = false,
}: AdminGalleryFieldProps) {
  const [urlDraft, setUrlDraft] = useState("");
  const [error, setError] = useState<string | null>(null);

  const setAt = (next: string[]) => onChange(next.filter(Boolean));

  const addUrl = () => {
    const url = urlDraft.trim();
    if (!url) return;
    if (images.includes(url)) {
      setError("Esa imagen ya está en la galería.");
      return;
    }
    setAt([...images, url]);
    setUrlDraft("");
    setError(null);
  };

  const move = (index: number, dir: -1 | 1) => {
    const j = index + dir;
    if (j < 0 || j >= images.length) return;
    const next = [...images];
    [next[index], next[j]] = [next[j], next[index]];
    setAt(next);
  };

  const remove = (index: number) => {
    const src = images[index];
    if (isPendingUploadUrl(src)) unregisterPendingUpload(src);
    setAt(images.filter((_, i) => i !== index));
  };

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    e.target.value = "";
    if (!files.length) return;
    setError(null);

    if (uploadOnSelect) {
      // Immediate upload path is unused for blog; keep gallery deferred-only.
      setError("La subida inmediata no está habilitada en galería.");
      return;
    }

    const added: string[] = [];
    for (const file of files) {
      const blobUrl = URL.createObjectURL(file);
      registerPendingUpload(blobUrl, file);
      added.push(blobUrl);
    }
    setAt([...images, ...added]);
  };

  return (
    <div className="space-y-3 min-w-0">
      <p className="text-sm font-montserrat font-medium text-cu-black">
        Imágenes de la galería
      </p>
      <p className="text-xs text-cu-concrete font-josefin leading-relaxed -mt-1">
        Agrega por URL o elige archivos. La vista previa es local; los archivos
        se suben al guardar el artículo.
      </p>

      {images.length > 0 && (
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {images.map((src, index) => {
            const pending = isPendingUploadUrl(src);
            const display = pending
              ? previewSrcForUpload(src)
              : assetUrl(src) || src;
            return (
              <li
                key={`${src}-${index}`}
                className="border border-cu-stone/25 rounded-sm bg-white overflow-hidden"
              >
                <div className="relative aspect-[16/10] bg-cu-warm-white">
                  <SafeImage
                    src={display || null}
                    alt={`Galería ${index + 1}`}
                    className="absolute inset-0 w-full h-full object-cover"
                    fallbackClassName="absolute inset-0 w-full h-full"
                  />
                  {pending && (
                    <span className="absolute bottom-2 left-2 text-[10px] font-montserrat font-semibold uppercase tracking-wide bg-black/60 text-white px-1.5 py-0.5 rounded-sm">
                      Pendiente de subir
                    </span>
                  )}
                </div>
                <div className="p-2 space-y-2">
                  <p
                    className="text-[11px] text-cu-concrete font-mono truncate"
                    title={pending ? "Archivo local (aún no en servidor)" : src}
                  >
                    {pending ? "Archivo local · se sube al guardar" : src}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    <button
                      type="button"
                      onClick={() => move(index, -1)}
                      disabled={index === 0}
                      className="inline-flex items-center gap-1 px-2 py-1 text-[11px] border border-cu-stone/30 rounded-sm disabled:opacity-40"
                    >
                      <ArrowUp size={12} /> Subir
                    </button>
                    <button
                      type="button"
                      onClick={() => move(index, 1)}
                      disabled={index === images.length - 1}
                      className="inline-flex items-center gap-1 px-2 py-1 text-[11px] border border-cu-stone/30 rounded-sm disabled:opacity-40"
                    >
                      <ArrowDown size={12} /> Bajar
                    </button>
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="inline-flex items-center gap-1 px-2 py-1 text-[11px] text-red-600 border border-red-200 rounded-sm"
                    >
                      <Trash2 size={12} /> Quitar
                    </button>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {images.length === 0 && (
        <p className="text-xs text-cu-concrete border border-dashed border-cu-stone/30 rounded-sm px-3 py-4 text-center">
          Aún no hay imágenes. Sube un archivo o agrega una URL.
        </p>
      )}

      <div className="flex flex-col sm:flex-row gap-2">
        <input
          id={`${id}-url`}
          type="text"
          className={`${inputClass} flex-1 min-w-0`}
          placeholder="https://… o /uploads/blog/…"
          value={urlDraft}
          onChange={(e) => setUrlDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addUrl();
            }
          }}
        />
        <button
          type="button"
          onClick={addUrl}
          className="inline-flex items-center justify-center gap-1.5 px-3 py-2 border border-cu-stone/30 rounded-sm text-xs font-montserrat font-semibold hover:bg-cu-warm-white"
        >
          <Plus size={14} /> Agregar URL
        </button>
        <label className="shrink-0 cursor-pointer inline-flex items-center justify-center gap-1.5 px-3 py-2 border border-cu-orange/40 bg-cu-orange/5 text-cu-orange rounded-sm text-xs font-montserrat font-semibold hover:bg-cu-orange/10">
          <Upload className="w-3.5 h-3.5" />
          Adjuntar archivo(s)
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            className="hidden"
            onChange={handleFiles}
          />
        </label>
      </div>

      <p className="text-[11px] text-cu-concrete">
        JPG, PNG o WebP · máx. 5 MB c/u · al guardar van a{" "}
        <code className="text-cu-black/80">/uploads/{folder}/</code>
      </p>

      {error && (
        <p className="text-xs text-red-600 bg-red-50 border border-red-200 px-2 py-1.5 rounded-sm">
          {error}
        </p>
      )}
    </div>
  );
}
