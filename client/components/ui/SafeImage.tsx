import { useEffect, useState } from "react";
import { Building2 } from "lucide-react";

type SafeImageProps = {
  src: string | null | undefined;
  alt: string;
  className?: string;
  fallbackClassName?: string;
  showNameOnFallback?: boolean;
};

export function SafeImage({
  src,
  alt,
  className = "",
  fallbackClassName = "",
  showNameOnFallback = false,
}: SafeImageProps) {
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [src]);

  if (!src || failed) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-gradient-to-br from-cu-orange/20 via-cu-warm-white to-cu-stone/25 ${fallbackClassName}`}
        aria-hidden
      >
        <Building2 className="text-cu-orange/50 mb-2" size={40} strokeWidth={1.25} />
        {showNameOnFallback && (
          <span className="text-xs font-montserrat font-semibold text-cu-concrete/80 px-4 text-center">
            {alt}
          </span>
        )}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      loading="lazy"
      onError={() => setFailed(true)}
    />
  );
}
