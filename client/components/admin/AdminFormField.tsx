import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

const inputClass =
  "w-full border border-cu-stone/40 px-3 py-2 text-sm rounded-sm focus:border-cu-orange focus:outline-none focus:ring-1 focus:ring-cu-orange/30";

export function AdminCharCount({ value, max }: { value: string; max: number }) {
  const len = value.length;
  return (
    <p
      className={cn(
        "text-xs text-right tabular-nums",
        len > max ? "text-red-600" : "text-cu-concrete",
      )}
    >
      {len}/{max}
    </p>
  );
}

type AdminFormFieldProps = {
  id: string;
  label: string;
  hint?: string;
  required?: boolean;
  maxLength?: number;
  value?: string;
  children?: ReactNode;
  className?: string;
};

export function AdminFormField({
  id,
  label,
  hint,
  required,
  maxLength,
  value = "",
  children,
  className,
}: AdminFormFieldProps) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <div className="flex items-baseline justify-between gap-2">
        <label htmlFor={id} className="block text-sm font-montserrat font-semibold text-cu-black">
          {label}
          {required && <span className="text-cu-orange ml-0.5" aria-hidden>*</span>}
        </label>
        {maxLength != null && <AdminCharCount value={value} max={maxLength} />}
      </div>
      {hint && <p className="text-xs text-cu-concrete leading-relaxed">{hint}</p>}
      {children}
    </div>
  );
}

export function AdminFormSection({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <fieldset className="space-y-4 border-b border-cu-stone/15 pb-6 last:border-b-0 last:pb-0">
      <legend className="font-montserrat font-semibold text-base text-cu-black px-0 mb-1">
        {title}
      </legend>
      {description && (
        <p className="text-xs text-cu-concrete -mt-1 mb-3 leading-relaxed">{description}</p>
      )}
      <div className="space-y-4">{children}</div>
    </fieldset>
  );
}

export { inputClass };
