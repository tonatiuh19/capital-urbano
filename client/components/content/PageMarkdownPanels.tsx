import { motion } from "framer-motion";
import { BrandStrategyPanel } from "@/components/brand/BrandStrategyPanel";
import { SkeletonChamferCard } from "@/components/loading";
import { parseMarkdownSections } from "@/lib/markdownSections";
import { brandStaggerParent, brandViewport } from "@/lib/motion";
import { cn } from "@/lib/utils";

const panelVariants = ["orange", "black", "gray"] as const;

function renderMarkdownInline(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} className="font-semibold text-inherit">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return <span key={i}>{part}</span>;
  });
}

/** CMS ## sections → scannable strategy panels (Quality, Experience, etc.). */
export function PageMarkdownPanels({
  markdown,
  loading = false,
  skeletonCount = 3,
  className,
}: {
  markdown?: string;
  loading?: boolean;
  skeletonCount?: number;
  className?: string;
}) {
  if (loading) {
    return (
      <div
        className={cn("space-y-4 max-w-3xl mx-auto", className)}
        aria-busy
        aria-label="Cargando contenido"
      >
        {Array.from({ length: skeletonCount }).map((_, i) => (
          <SkeletonChamferCard key={i} tone="warm" showIcon={false} lines={3} />
        ))}
      </div>
    );
  }

  if (!markdown?.trim()) return null;

  const sections = parseMarkdownSections(markdown);
  if (sections.length === 0) return null;

  return (
    <motion.div
      className={cn("space-y-4 max-w-3xl mx-auto", className)}
      variants={brandStaggerParent}
      initial="hidden"
      whileInView="visible"
      viewport={brandViewport}
    >
      {sections.map((section, index) => (
        <BrandStrategyPanel
          key={section.title}
          variant={panelVariants[index % panelVariants.length]}
          title={section.title}
        >
          {section.body.split(/\n\n+/).map((paragraph) => (
            <p key={paragraph.slice(0, 40)} className="mb-3 last:mb-0">
              {renderMarkdownInline(paragraph.replace(/\n/g, " "))}
            </p>
          ))}
        </BrandStrategyPanel>
      ))}
    </motion.div>
  );
}
