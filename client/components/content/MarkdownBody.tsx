/** Minimal markdown: headings, paragraphs, bold, lists */
export function MarkdownBody({ content }: { content: string }) {
  const normalized = content.replace(/\r\n/g, "\n").replace(/\n## /g, "\n\n## ");
  const blocks = normalized.split(/\n\n+/);
  return (
    <div className="prose-cu space-y-4 text-cu-concrete leading-relaxed">
      {blocks.map((block, i) => {
        const trimmed = block.trim();
        if (!trimmed) return null;
        if (trimmed.startsWith("### ")) {
          return (
            <h3 key={i} className="text-lg font-montserrat font-bold text-cu-black mt-6">
              {inline(trimmed.slice(4))}
            </h3>
          );
        }
        if (trimmed.startsWith("## ")) {
          return (
            <h2 key={i} className="text-xl font-montserrat font-bold text-cu-black mt-8">
              {inline(trimmed.slice(3))}
            </h2>
          );
        }
        if (trimmed.startsWith("# ")) {
          return (
            <h1 key={i} className="text-2xl font-montserrat font-bold text-cu-black">
              {inline(trimmed.slice(2))}
            </h1>
          );
        }
        if (trimmed.startsWith("- ")) {
          const items = trimmed.split("\n").filter((l) => l.startsWith("- "));
          return (
            <ul key={i} className="list-disc pl-6 space-y-2">
              {items.map((item, j) => (
                <li key={j}>{inline(item.slice(2))}</li>
              ))}
            </ul>
          );
        }
        if (trimmed.startsWith("> ")) {
          return (
            <blockquote
              key={i}
              className="border-l-4 border-cu-orange pl-4 italic text-cu-black/80"
            >
              {inline(trimmed.slice(2))}
            </blockquote>
          );
        }
        return (
          <p key={i} className="text-base">
            {inline(trimmed.replace(/\n/g, " "))}
          </p>
        );
      })}
    </div>
  );
}

function inline(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} className="font-semibold text-cu-black">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return <span key={i}>{part}</span>;
  });
}
