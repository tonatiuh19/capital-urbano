import { MarkdownBody } from "@/components/content/MarkdownBody";
import { PageMarkdownPanels } from "@/components/content/PageMarkdownPanels";
import { SkeletonChamferCard } from "@/components/loading";
import { cn } from "@/lib/utils";

export type PageContentMode = "panels" | "prose" | "hidden";

const SLUG_DEFAULT_MODE: Record<string, PageContentMode> = {
  quality: "panels",
  experience: "panels",
  contact: "hidden",
  about: "hidden",
};

export function PageContentRenderer({
  slug,
  markdown,
  loading = false,
  mode,
  className,
  skeletonCount = 3,
}: {
  slug: string;
  markdown?: string;
  loading?: boolean;
  mode?: PageContentMode;
  className?: string;
  skeletonCount?: number;
}) {
  const resolved = mode ?? SLUG_DEFAULT_MODE[slug] ?? "panels";

  if (resolved === "hidden") return null;

  if (loading) {
    return (
      <div className={cn("space-y-4 max-w-3xl mx-auto", className)} aria-busy>
        {Array.from({ length: skeletonCount }).map((_, i) => (
          <SkeletonChamferCard key={i} tone="warm" showIcon={false} lines={3} />
        ))}
      </div>
    );
  }

  if (!markdown?.trim()) return null;

  if (resolved === "prose") {
    return (
      <div className={cn("max-w-3xl mx-auto", className)}>
        <MarkdownBody content={markdown} />
      </div>
    );
  }

  return (
    <PageMarkdownPanels
      markdown={markdown}
      loading={false}
      skeletonCount={skeletonCount}
      className={className}
    />
  );
}
