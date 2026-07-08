import { MetaTags } from "@/components/seo/MetaTags";

/** Blocks indexing of admin and login routes. */
export function AdminMeta({ title = "Panel de administración" }: { title?: string }) {
  return (
    <MetaTags
      title={title}
      description="Área privada de Capital Urbano."
      titleMode="full"
      noIndex
      noFollow
    />
  );
}
