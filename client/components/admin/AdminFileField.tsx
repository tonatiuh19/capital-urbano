import { useEffect, useState } from "react";
import { FileText, Loader2, Upload, X } from "lucide-react";
import { assetUrl } from "@/lib/api";
import { uploadAdminFile, type AdminUploadFolder } from "@/lib/adminUpload";
import { AdminFormField, inputClass } from "@/components/admin/AdminFormField";

type AdminFileFieldProps = {
  id: string;
  label: string;
  hint?: string;
  value: string;
  onChange: (url: string) => void;
  folder: AdminUploadFolder;
  /** MIME types for the file picker, e.g. "application/pdf" */
  accept?: string;
  acceptHint?: string;
  onUploadingChange?: (uploading: boolean) => void;
};

function fileNameFromUrl(url: string): string {
  try {
    const path = url.split("?")[0] ?? url;
    const parts = path.split("/");
    return parts[parts.length - 1] || url;
  } catch {
    return url;
  }
}

export function AdminFileField({
  id,
  label,
  hint,
  value,
  onChange,
  folder,
  accept = "application/pdf",
  acceptHint = "PDF · máximo 10 MB",
  onUploadingChange,
}: AdminFileFieldProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    onUploadingChange?.(uploading);
  }, [uploading, onUploadingChange]);

  const clearValue = () => {
    onChange("");
    setError(null);
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    setUploading(true);
    setError(null);
    try {
      const url = await uploadAdminFile(file, folder);
      onChange(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al subir");
    } finally {
      setUploading(false);
    }
  };

  const previewHref = value ? assetUrl(value) ?? value : "";

  return (
    <AdminFormField id={id} label={label} hint={hint}>
      {value && (
        <div className="relative mb-3 flex items-center gap-3 rounded-sm border border-cu-stone/25 bg-cu-warm-white px-3 py-2.5">
          <FileText className="w-5 h-5 text-cu-orange shrink-0" />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-montserrat font-medium text-cu-black truncate">
              {fileNameFromUrl(value)}
            </p>
            {previewHref && (
              <a
                href={previewHref}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-cu-orange font-semibold hover:underline"
              >
                Ver archivo actual
              </a>
            )}
          </div>
          <button
            type="button"
            onClick={clearValue}
            className="shrink-0 p-2 text-cu-concrete hover:text-cu-black min-h-[44px] min-w-[44px] sm:min-h-0 sm:min-w-0 sm:p-1 flex items-center justify-center"
            aria-label="Quitar archivo"
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
          {uploading ? "Subiendo…" : value ? "Reemplazar PDF" : "Subir PDF"}
          <input
            type="file"
            accept={accept}
            className="hidden"
            onChange={handleFileSelect}
            disabled={uploading}
          />
        </label>
      </div>

      <p className="text-[11px] text-cu-concrete">
        {acceptHint}. Se guarda en{" "}
        <code className="text-cu-black/80">/uploads/{folder}/</code>. Sube uno
        nuevo para actualizar el dossier público.
      </p>

      {error && (
        <p className="text-xs text-red-600 bg-red-50 border border-red-200 px-2 py-1.5 rounded-sm">
          {error}
        </p>
      )}
    </AdminFormField>
  );
}
