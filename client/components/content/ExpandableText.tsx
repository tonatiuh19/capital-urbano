import { useState } from "react";
import { cn } from "@/lib/utils";

export function ExpandableText({
  text,
  className,
  clampClass = "line-clamp-3",
  expandLabel = "Leer más",
  collapseLabel = "Ver menos",
  minLength = 180,
}: {
  text: string;
  className?: string;
  clampClass?: string;
  expandLabel?: string;
  collapseLabel?: string;
  minLength?: number;
}) {
  const [expanded, setExpanded] = useState(false);
  const canExpand = text.length > minLength;

  return (
    <div>
      <p className={cn(className, !expanded && canExpand && clampClass)}>{text}</p>
      {canExpand && (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="mt-2 text-sm font-montserrat font-semibold text-cu-orange hover:text-cu-orange-80 transition-colors"
        >
          {expanded ? collapseLabel : expandLabel}
        </button>
      )}
    </div>
  );
}
