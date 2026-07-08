import type { ReactNode } from "react";
import { motion, type HTMLMotionProps } from "framer-motion";
import { brandSlideIn } from "@/lib/motion";

type Variant = "orange" | "black" | "gray";

const variantClass: Record<Variant, string> = {
  orange: "cu-strategy-panel--orange",
  black: "cu-strategy-panel--black",
  gray: "cu-strategy-panel--gray",
};

export function BrandStrategyPanel({
  title,
  children,
  variant = "black",
  className = "",
  ...motionProps
}: {
  title: string;
  children: ReactNode;
  variant?: Variant;
} & Omit<HTMLMotionProps<"div">, "title" | "children">) {
  return (
    <motion.div
      variants={brandSlideIn}
      className={`cu-strategy-panel ${variantClass[variant]} ${className}`}
      {...motionProps}
    >
      <h3 className="font-montserrat font-bold text-lg sm:text-xl mb-3">{title}</h3>
      <div className="text-sm sm:text-base leading-relaxed font-josefin opacity-95">
        {children}
      </div>
    </motion.div>
  );
}

export function BrandBulletList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2.5">
      {items.map((item) => (
        <li key={item} className="flex gap-3 items-start">
          <span
            className="mt-2 w-1.5 h-1.5 rounded-full bg-cu-orange shrink-0"
            aria-hidden
          />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}
