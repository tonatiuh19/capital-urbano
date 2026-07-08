import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type AdminListCardField = {
  label: string;
  value: ReactNode;
  hideLabel?: boolean;
};

export function AdminListCard({
  title,
  titleExtra,
  fields,
  footer,
  expanded,
  inactive = false,
  className,
}: {
  title: string;
  titleExtra?: ReactNode;
  fields?: AdminListCardField[];
  footer?: ReactNode;
  expanded?: ReactNode;
  inactive?: boolean;
  className?: string;
}) {
  return (
    <article
      className={cn(
        "bg-white border border-cu-stone/30 rounded-sm p-4 min-w-0 max-w-full",
        inactive && "opacity-55",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3 min-w-0 mb-3">
        <h3 className="font-montserrat font-semibold text-cu-black break-words min-w-0 flex-1">
          {title}
        </h3>
        {titleExtra}
      </div>

      {fields && fields.length > 0 && (
        <dl className="space-y-2.5 text-sm">
          {fields.map((field) => (
            <div key={field.label} className="min-w-0">
              {!field.hideLabel && (
                <dt className="text-[10px] font-montserrat font-semibold text-cu-concrete uppercase tracking-wide">
                  {field.label}
                </dt>
              )}
              <dd
                className={cn(
                  "text-cu-black break-words",
                  !field.hideLabel && "mt-0.5",
                )}
              >
                {field.value}
              </dd>
            </div>
          ))}
        </dl>
      )}

      {footer && (
        <div className="mt-3 pt-3 border-t border-cu-stone/15 flex flex-wrap items-center gap-2">
          {footer}
        </div>
      )}

      {expanded}
    </article>
  );
}
