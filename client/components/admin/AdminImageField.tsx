import { useEffect, useState } from "react";
import { Loader2, Upload, X } from "lucide-react";
import { assetUrl } from "@/lib/api";
import { uploadAdminImage, type AdminUploadFolder } from "@/lib/adminUpload";
import { AdminFormField, inputClass } from "@/components/admin/AdminFormField";
import { SafeImage } from "@/components/ui/SafeImage";

type AdminImageFieldProps = {
  id: string;
  label: string;
  hint?: string;
  value: string;
  onChange: (url: string) => void;
  folder: AdminUploadFolder;
  /** Upload immediately when a file is picked (liv-capital: preview first, upload on save optional). */
  uploadOnSelect?: boolean;
  onUploadingChange?: (uploading: boolean) => void;
};

export function AdminImageField({
  id,
  label,
  hint,
  value,
  onChange,
  folder,
  uploadOnSelect = true,
  onUploadingChange,
}: AdminImageFieldProps) {
  const [uploading, setUploading] = useState(false);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [localPreview, setLocalPreview] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    onUploadingChange?.(uploading);
  }, [uploading, onUploadingChange]);

  useEffect(() => {
    return () => {
      if (localPreview) URL.revokeObjectURL(localPreview);
    };
  }, [localPreview]);

  const clearPending = () => {
    if (localPreview) URL.revokeObjectURL(localPreview);
    setPendingFile(null);
    setLocalPreview("");
  };

  const runUpload = async (file: File) => {
    setUploading(true);
    setError(null);
    try {
      const url = await uploadAdminImage(file, folder);
      onChange(url);
      clearPending();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al subir");
    } finally {
      setUploading(false);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    if (localPreview) URL.revokeObjectURL(localPreview);
    setPendingFile(file);
    setLocalPreview(URL.createObjectURL(file));
    setError(null);

    if (uploadOnSelect) {
      await runUpload(file);
    }
  };

  const previewSrc = localPreview || (value ? assetUrl(value) : "");

  return (
    <AdminFormField id={id} label={label} hint={hint}>
      {previewSrc && (
        <div className="relative mb-3 group rounded-sm overflow-hidden border border-cu-stone/25">
          <SafeImage
            src={previewSrc}
            alt="Vista previa"
            className="w-full h-40 object-cover"
            fallbackClassName="w-full h-40 bg-cu-warm-white"
          />
          <button
            type="button"
            onClick={() => {
              clearPending();
              onChange("");
            }}
            className="absolute top-2 right-2 bg-black/55 text-white rounded-full opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity p-2 min-h-[44px] min-w-[44px] flex items-center justify-center sm:min-h-0 sm:min-w-0 sm:p-1"
            aria-label="Quitar imagen"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-2">
        <input
          id={id}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`${inputClass} flex-1 min-w-0`}
          placeholder="https://… o /uploads/…"
        />
        <label
          className={`shrink-0 cursor-pointer inline-flex items-center justify-center gap-1.5 px-3 py-2 border border-cu-stone/30 rounded-sm text-xs font-montserrat font-semibold text-cu-black hover:border-cu-orange/50 hover:bg-cu-warm-white ${
            uploading ? "pointer-events-none opacity-60" : ""
          }`}
        >
          {uploading ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Upload className="w-3.5 h-3.5" />
          )}
          {uploading ? "Subiendo…" : "Subir archivo"}
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={handleFileSelect}
            disabled={uploading}
          />
        </label>
      </div>

      {!uploadOnSelect && pendingFile && (
        <button
          type="button"
          onClick={() => runUpload(pendingFile)}
          disabled={uploading}
          className="text-xs font-montserrat font-semibold text-cu-orange hover:underline disabled:opacity-50"
        >
          Confirmar subida del archivo seleccionado
        </button>
      )}

      <p className="text-[11px] text-cu-concrete">
        JPG, PNG o WebP · máximo 5 MB. Se guarda en{" "}
        <code className="text-cu-black/80">/uploads/{folder}/</code>
      </p>

      {error && (
        <p className="text-xs text-red-600 bg-red-50 border border-red-200 px-2 py-1.5 rounded-sm">
          {error}
        </p>
      )}
    </AdminFormField>
  );
}

/** Call before save when uploadOnSelect is false and a file is still pending. */
export async function flushPendingImageUpload(
  pendingFile: File | null,
  folder: AdminUploadFolder,
): Promise<string | null> {
  if (!pendingFile) return null;
  return uploadAdminImage(pendingFile, folder);
}
