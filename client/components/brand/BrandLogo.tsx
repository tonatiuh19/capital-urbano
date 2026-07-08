import { useState } from "react";

/** Preferred brand assets in public/ (first match wins). */
const LOGO_SOURCES = ["/logo.png", "/logo.svg"] as const;

type BrandLogoProps = {
  className?: string;
  /** White logo on dark backgrounds (coming soon, admin sidebar, login) */
  variant?: "on-dark" | "on-light";
  alt?: string;
};

export function BrandLogo({
  className = "h-10 w-auto",
  variant = "on-light",
  alt = "Capital Urbano",
}: BrandLogoProps) {
  const [sourceIndex, setSourceIndex] = useState(0);
  const onDark = variant === "on-dark";
  const src = LOGO_SOURCES[sourceIndex];

  if (sourceIndex >= LOGO_SOURCES.length) {
    return (
      <p
        className={`font-montserrat font-bold leading-tight ${
          onDark ? "text-white text-lg" : "text-cu-black text-lg"
        } ${className.includes("h-") ? "" : className}`}
      >
        Capital <span className="text-cu-orange">Urbano</span>
      </p>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={`object-contain ${onDark ? "brightness-0 invert" : ""} ${className}`}
      onError={() => setSourceIndex((i) => i + 1)}
    />
  );
}
