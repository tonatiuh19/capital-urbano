import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import { parseMarkdownSections } from "@/lib/markdownSections";
import { BrandBulletList } from "@/components/brand/BrandStrategyPanel";
import { brandReveal, brandStaggerChild, brandStaggerParent, brandViewport } from "@/lib/motion";

type Section = { title: string; body: string; type: "text" | "list" };

function parseAboutMarkdown(raw: string): { sections: Section[]; quote: string | null } {
  let quote: string | null = null;
  const blocks = raw
    .replace(/\r\n/g, "\n")
    .trim()
    .split(/\n\n+/)
    .map((b) => b.trim())
    .filter(Boolean);

  const contentBlocks: string[] = [];
  for (const block of blocks) {
    if (block.startsWith("> ")) {
      quote = block.replace(/^>\s*/gm, "").replace(/\*\*/g, "").trim();
    } else if (!block.startsWith("# ") || block.startsWith("## ")) {
      contentBlocks.push(block);
    }
  }

  const parsed = parseMarkdownSections(contentBlocks.join("\n\n"));

  const sections: Section[] = parsed.map((block) => {
    const lines = block.body.split("\n").filter((l) => l.trim());
    const listLines = lines.filter((l) => l.trim().startsWith("- "));
    if (listLines.length > 0 && listLines.length === lines.length) {
      return {
        title: block.title,
        type: "list" as const,
        body: listLines.map((l) => l.replace(/^-\s+/, "").replace(/\*\*/g, "")).join("\n"),
      };
    }
    return {
      title: block.title,
      type: "text" as const,
      body: block.body.replace(/\*\*/g, (m) => m),
    };
  });

  return { sections, quote };
}

function renderInline(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) =>
    part.startsWith("**") && part.endsWith("**") ? (
      <strong key={i} className="font-semibold text-cu-black">
        {part.slice(2, -2)}
      </strong>
    ) : (
      <span key={i}>{part}</span>
    ),
  );
}

export function AboutIntroSection({ markdown }: { markdown: string }) {
  const { sections, quote } = parseAboutMarkdown(markdown);

  return (
    <div className="max-w-4xl mx-auto min-w-0">
      <motion.div
        className="space-y-6 sm:space-y-8"
        variants={brandStaggerParent}
        initial="hidden"
        whileInView="visible"
        viewport={brandViewport}
      >
        {sections.map((section, index) => (
          <motion.article
            key={`${section.title}-${index}`}
            variants={brandStaggerChild}
            className="cu-chamfer-card relative pb-1"
          >
            <div className="cu-chamfer-border-tr">
              <div className="cu-chamfer-fill-tr bg-white px-6 py-8 sm:px-10 sm:py-10">
                <div className="flex items-start gap-5 sm:gap-8">
                  <span
                    className="shrink-0 font-montserrat font-bold text-3xl sm:text-4xl text-cu-orange/25 leading-none tabular-nums select-none"
                    aria-hidden
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div className="flex-1 min-w-0 pt-1">
                    {section.title && (
                      <h2 className="text-xl sm:text-2xl font-montserrat font-bold text-cu-black mb-4 leading-snug">
                        {section.title}
                      </h2>
                    )}
                    {section.type === "list" ? (
                      <BrandBulletList items={section.body.split("\n").filter(Boolean)} />
                    ) : (
                      <p className="text-base sm:text-lg text-cu-concrete font-josefin leading-relaxed">
                        {renderInline(section.body)}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="cu-chamfer-accent opacity-70" aria-hidden />
          </motion.article>
        ))}
      </motion.div>

      {quote && (
        <motion.div
          className="mt-10 sm:mt-12 cu-chamfer-border-br"
          variants={brandReveal}
          initial="hidden"
          whileInView="visible"
          viewport={brandViewport}
        >
          <div className="cu-chamfer-fill-br relative overflow-hidden bg-cu-black text-white px-8 py-10 sm:px-12 sm:py-12">
            <div className="absolute top-0 right-0 w-48 h-48 bg-cu-orange/15 rounded-full blur-3xl" />
            <Quote className="text-cu-orange mb-5 relative z-10" size={28} strokeWidth={1.5} />
            <p className="relative z-10 text-lg sm:text-xl font-montserrat leading-relaxed text-white/95">
              {quote}
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
}
