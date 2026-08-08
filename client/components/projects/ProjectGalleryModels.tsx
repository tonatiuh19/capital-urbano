import { useMemo, useState } from "react";
import { ExternalLink } from "lucide-react";
import { assetUrl } from "@/lib/api";
import type { DevelopmentMedia, DevelopmentModel } from "@shared/api";
import {
  ImageLightbox,
  type LightboxItem,
} from "@/components/media/ImageLightbox";

type GalleryProps = {
  media: DevelopmentMedia[];
  className?: string;
};

export function ProjectGalleryGrid({ media, className = "" }: GalleryProps) {
  const images = media.filter((m) => m.media_type !== "video" && m.url);
  const [index, setIndex] = useState<number | null>(null);
  const items: LightboxItem[] = useMemo(
    () =>
      images.map((m) => ({
        src: m.url,
        title: m.caption,
      })),
    [images],
  );

  if (!images.length) return null;

  return (
    <div className={className}>
      <h3 className="font-montserrat font-bold text-cu-black mb-4">Galería</h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {images.map((m, i) => (
          <button
            key={m.id}
            type="button"
            onClick={() => setIndex(i)}
            className="group text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-cu-orange rounded-sm"
          >
            <img
              src={assetUrl(m.url) ?? m.url}
              alt={m.caption ?? ""}
              className="w-full aspect-[4/3] object-cover rounded-sm transition-opacity group-hover:opacity-90"
              loading="lazy"
            />
            {m.caption && (
              <span className="block text-xs text-cu-concrete mt-1 line-clamp-1">
                {m.caption}
              </span>
            )}
          </button>
        ))}
      </div>
      <ImageLightbox
        items={items}
        index={index}
        onClose={() => setIndex(null)}
        onIndexChange={setIndex}
      />
    </div>
  );
}

type ModelsProps = {
  models: DevelopmentModel[];
  externalUrl?: string | null;
  className?: string;
};

export function ProjectModelsGrid({
  models,
  externalUrl,
  className = "",
}: ModelsProps) {
  const [index, setIndex] = useState<number | null>(null);
  const withImage = models.filter((m) => m.image_url);
  const items: LightboxItem[] = useMemo(
    () =>
      withImage.map((m) => ({
        src: m.image_url!,
        title: m.name,
        caption: [
          m.bedrooms != null ? `${m.bedrooms} rec` : null,
          m.area_sqm != null ? `${m.area_sqm} m²` : null,
        ]
          .filter(Boolean)
          .join(" · "),
      })),
    [withImage],
  );

  if (!models.length) return null;

  const openModel = (m: DevelopmentModel) => {
    const i = withImage.findIndex((x) => x.id === m.id);
    if (i >= 0) setIndex(i);
  };

  return (
    <div className={className}>
      <h3 className="font-montserrat font-bold text-cu-black mb-4">
        Modelos ({models.length})
      </h3>
      <div className="grid sm:grid-cols-2 gap-4">
        {models.map((m) => (
          <button
            key={m.id}
            type="button"
            onClick={() => openModel(m)}
            disabled={!m.image_url}
            className="flex gap-4 p-4 border border-cu-stone/15 bg-white min-w-0 text-left hover:border-cu-orange/40 transition-colors disabled:hover:border-cu-stone/15 disabled:cursor-default rounded-sm"
          >
            {m.image_url ? (
              <img
                src={assetUrl(m.image_url) ?? m.image_url}
                alt={m.name}
                className="w-24 h-24 object-cover shrink-0 rounded-sm"
                loading="lazy"
              />
            ) : (
              <div className="w-24 h-24 shrink-0 bg-cu-warm-white rounded-sm" />
            )}
            <div className="min-w-0 flex-1">
              <p className="font-montserrat font-bold text-cu-black">{m.name}</p>
              <p className="text-sm text-cu-concrete mt-1">
                {[
                  m.bedrooms != null ? `${m.bedrooms} rec` : null,
                  m.area_sqm != null ? `${m.area_sqm} m²` : null,
                  m.terrace_m2 != null && Number(m.terrace_m2) > 0
                    ? `terraza ${m.terrace_m2} m²`
                    : null,
                ]
                  .filter(Boolean)
                  .join(" · ")}
              </p>
              {m.image_url && (
                <p className="text-xs text-cu-orange font-semibold mt-2">
                  Ver imagen
                </p>
              )}
            </div>
          </button>
        ))}
      </div>

      {externalUrl && (
        <div className="mt-6 text-center">
          <a
            href={externalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-3 bg-cu-orange text-white font-montserrat font-semibold text-sm rounded-sm hover:bg-cu-orange-80"
          >
            Consulta más información de los modelos aquí
            <ExternalLink size={16} />
          </a>
        </div>
      )}

      <ImageLightbox
        items={items}
        index={index}
        onClose={() => setIndex(null)}
        onIndexChange={setIndex}
      />
    </div>
  );
}
