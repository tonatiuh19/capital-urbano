import { PageContentRenderer } from "./PageContentRenderer";

/** @deprecated Use PageContentRenderer with slug="quality" */
export function QualityIntroSection({
  markdown,
  loading = false,
}: {
  markdown?: string;
  loading?: boolean;
}) {
  return (
    <PageContentRenderer
      slug="quality"
      markdown={markdown}
      loading={loading}
      skeletonCount={3}
    />
  );
}
