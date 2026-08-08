import adminAxios from "@/store/axiosAdmin";
import { getAdminApiError } from "@/lib/adminApi";

export type AdminUploadFolder =
  | "developments"
  | "team"
  | "brochures"
  | "blog"
  | "amenities"
  | "gallery"
  | "models";

export async function uploadAdminFile(
  file: File,
  folder: AdminUploadFolder,
): Promise<string> {
  const form = new FormData();
  form.append("file", file);
  form.append("folder", folder);
  try {
    const { data } = await adminAxios.post<{ url: string }>(
      "/api/admin/upload.php",
      form,
      { headers: { "Content-Type": "multipart/form-data" } },
    );
    if (!data.url) {
      throw new Error("El servidor no devolvió la URL del archivo");
    }
    return data.url;
  } catch (err) {
    throw new Error(getAdminApiError(err, "Error al subir el archivo"));
  }
}

export async function uploadAdminImage(
  file: File,
  folder: AdminUploadFolder,
): Promise<string> {
  return uploadAdminFile(file, folder);
}
