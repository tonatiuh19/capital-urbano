import type { DevelopmentsMapResponse } from "@shared/api";

function parseJsonBody<T>(text: string, status: number): T {
  const trimmed = text.trim();
  if (!trimmed.startsWith("{") && !trimmed.startsWith("[")) {
    throw new Error(`Invalid API response (${status})`);
  }
  try {
    return JSON.parse(trimmed) as T;
  } catch {
    throw new Error(`Invalid API response (${status})`);
  }
}

export async function apiGet<T>(path: string): Promise<T> {
  const res = await fetch(path);
  const text = await res.text();
  const data = parseJsonBody<{ error?: string; detail?: string } & T>(text, res.status);
  if (!res.ok) {
    const msg = data.error ?? `Error ${res.status}`;
    throw new Error(data.detail ? `${msg}: ${data.detail}` : msg);
  }
  return data;
}

export async function apiPost<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error((data as { error?: string }).error ?? `Error ${res.status}`);
  }
  return data as T;
}

export function fetchDevelopmentsMap(): Promise<DevelopmentsMapResponse> {
  return apiGet<DevelopmentsMapResponse>("/api/developments.php?map=1");
}

export function assetUrl(path: string | null | undefined): string {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  return path;
}
