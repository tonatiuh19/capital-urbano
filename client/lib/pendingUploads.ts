import { uploadAdminImage, type AdminUploadFolder } from "@/lib/adminUpload";

/** blob: URL → File, kept until save resolves the upload. */
const pendingByBlobUrl = new Map<string, File>();

export function isPendingUploadUrl(url: string | null | undefined): boolean {
  return Boolean(url && url.startsWith("blob:"));
}

export function registerPendingUpload(blobUrl: string, file: File): void {
  pendingByBlobUrl.set(blobUrl, file);
}

export function unregisterPendingUpload(blobUrl: string | null | undefined): void {
  if (!blobUrl || !blobUrl.startsWith("blob:")) return;
  pendingByBlobUrl.delete(blobUrl);
  URL.revokeObjectURL(blobUrl);
}

export function previewSrcForUpload(url: string | null | undefined): string {
  if (!url) return "";
  return url;
}

/**
 * If `url` is a local blob pending upload, upload it and return the remote path.
 * Otherwise return the URL unchanged.
 */
export async function resolvePendingUploadUrl(
  url: string | null | undefined,
  folder: AdminUploadFolder,
): Promise<string> {
  if (!url) return "";
  if (!url.startsWith("blob:")) return url;
  const file = pendingByBlobUrl.get(url);
  if (!file) {
    throw new Error(
      "Hay una imagen pendiente que ya no está disponible. Vuelve a seleccionar el archivo.",
    );
  }
  const remote = await uploadAdminImage(file, folder);
  pendingByBlobUrl.delete(url);
  URL.revokeObjectURL(url);
  return remote;
}

export async function resolvePendingUploadUrls(
  urls: string[],
  folder: AdminUploadFolder,
): Promise<string[]> {
  const out: string[] = [];
  for (const url of urls) {
    out.push(await resolvePendingUploadUrl(url, folder));
  }
  return out;
}
