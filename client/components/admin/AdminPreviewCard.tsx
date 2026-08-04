import { EyeOff, Pencil, Trash2 } from "lucide-react";
import { SafeImage } from "@/components/ui/SafeImage";
import { assetUrl } from "@/lib/api";
import { pillarIcon } from "@/lib/pillarIcons";

type AdminPreviewCardProps = {
  title: string;
  subtitle?: string;
  description?: string;
  imageUrl?: string | null;
  iconName?: string | null;
  badges?: { label: string; className?: string }[];
  meta?: string[];
  inactive?: boolean;
  onEdit: () => void;
  onDelete: () => void;
  deleteLabel?: string;
  /** Soft-hide (e.g. archive published content). */
  onHide?: () => void;
  hideLabel?: string;
};

export function AdminPreviewCard({
  title,
  subtitle,
  description,
  imageUrl,
  iconName,
  badges = [],
  meta = [],
  inactive,
  onEdit,
  onDelete,
  deleteLabel = "Eliminar",
  onHide,
  hideLabel = "Ocultar",
}: AdminPreviewCardProps) {
  const src = assetUrl(imageUrl) || null;
  const Icon = iconName ? pillarIcon(iconName) : null;
  const hasMedia = Boolean(src || Icon);

  const badgeRow =
    badges.length > 0 ? (
      <div
        className={`flex flex-wrap gap-1.5 ${hasMedia ? "absolute top-2 left-2" : "mb-3"}`}
      >
        {badges.map((b) => (
          <span
            key={b.label}
            className={`text-[10px] font-montserrat font-semibold uppercase tracking-wide px-2 py-0.5 rounded-sm ${
              b.className ?? "bg-cu-black/75 text-white"
            }`}
          >
            {b.label}
          </span>
        ))}
      </div>
    ) : null;

  return (
    <article
      className={`bg-white rounded-sm border border-cu-stone/25 overflow-hidden flex flex-col shadow-sm hover:border-cu-orange/35 hover:shadow-md transition-all ${
        inactive ? "opacity-55" : ""
      }`}
    >
      {hasMedia ? (
        <div className="relative aspect-[16/10] bg-cu-warm-white">
          {Icon && !src ? (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-cu-orange/15 to-cu-warm-white">
              <Icon className="text-cu-orange" size={48} strokeWidth={1.25} />
            </div>
          ) : (
            <SafeImage
              src={src}
              alt={title}
              className="w-full h-full object-cover"
              fallbackClassName="w-full h-full"
              showNameOnFallback={!Icon}
            />
          )}
          {badgeRow}
        </div>
      ) : (
        <div className="px-4 pt-4 bg-gradient-to-r from-cu-warm-white to-white border-b border-cu-stone/10">
          {badgeRow}
        </div>
      )}

      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-montserrat font-bold text-cu-black text-base leading-snug">
          {title}
        </h3>
        {subtitle && (
          <p className="text-sm text-cu-orange font-medium mt-0.5">{subtitle}</p>
        )}
        {description && (
          <p className="text-xs text-cu-concrete mt-2 line-clamp-2 leading-relaxed flex-1">
            {description}
          </p>
        )}
        {meta.length > 0 && (
          <ul className="mt-3 space-y-0.5">
            {meta.map((line) => (
              <li key={line} className="text-xs text-cu-concrete">
                {line}
              </li>
            ))}
          </ul>
        )}

        <div className="flex flex-wrap gap-2 mt-4 pt-3 border-t border-cu-stone/15">
          <button
            type="button"
            onClick={onEdit}
            className="flex-1 min-w-[5.5rem] flex items-center justify-center gap-1.5 py-2 text-xs font-montserrat font-semibold text-cu-black bg-cu-warm-white hover:bg-cu-stone/15 rounded-sm transition-colors"
          >
            <Pencil size={14} />
            Editar
          </button>
          {onHide && (
            <button
              type="button"
              onClick={onHide}
              className="flex-1 min-w-[5.5rem] flex items-center justify-center gap-1.5 py-2 text-xs font-montserrat font-semibold text-cu-black border border-cu-stone/30 hover:bg-cu-warm-white rounded-sm transition-colors"
            >
              <EyeOff size={14} />
              {hideLabel}
            </button>
          )}
          <button
            type="button"
            onClick={onDelete}
            className="flex-1 min-w-[5.5rem] flex items-center justify-center gap-1.5 py-2 text-xs font-montserrat font-semibold text-red-600 hover:bg-red-50 rounded-sm transition-colors"
          >
            <Trash2 size={14} />
            {deleteLabel}
          </button>
        </div>
      </div>
    </article>
  );
}
