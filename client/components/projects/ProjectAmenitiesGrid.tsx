import { assetUrl } from "@/lib/api";
import { livAmenityIcon } from "@/lib/livAmenityIcons";
import type { DevelopmentAmenity } from "@shared/api";
import { useState } from "react";

type Props = {
  amenities: DevelopmentAmenity[];
  className?: string;
};

export function ProjectAmenitiesGrid({ amenities, className = "" }: Props) {
  if (!amenities.length) return null;

  return (
    <div className={className}>
      <h3 className="font-montserrat font-bold text-cu-black mb-4">Amenidades</h3>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {amenities.map((a) => (
          <div key={a.id} className="cu-chamfer-border-tl">
            <div className="cu-chamfer-fill-tl bg-cu-warm-white p-4 flex gap-3 min-h-[5rem]">
              <AmenityThumb
                src={a.image_url ? assetUrl(a.image_url) : null}
                icon={a.icon}
                alt={a.name}
              />
              <div className="min-w-0">
                <p className="font-montserrat font-semibold text-sm text-cu-black">
                  {a.name}
                </p>
                {a.description && (
                  <p className="text-xs text-cu-concrete mt-1 line-clamp-2">
                    {a.description}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AmenityThumb({
  src,
  icon,
  alt,
}: {
  src: string | null;
  icon?: string | null;
  alt: string;
}) {
  const [failed, setFailed] = useState(false);
  const Icon = livAmenityIcon(icon);

  if (!src || failed) {
    return (
      <div
        className="w-14 h-14 shrink-0 flex items-center justify-center bg-gradient-to-br from-cu-orange/15 to-cu-stone/20"
        aria-hidden
      >
        <Icon className="w-6 h-6 text-cu-orange" strokeWidth={1.5} />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className="w-14 h-14 object-cover shrink-0"
      loading="lazy"
      onError={() => setFailed(true)}
    />
  );
}
