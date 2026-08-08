import { useState } from "react";
import { ExternalLink, Layers, Building2, Sparkles } from "lucide-react";
import { BrandVideoPreview } from "@/components/media/BrandVideoPreview";
import { SafeImage } from "@/components/ui/SafeImage";
import { SkeletonChamferCard } from "@/components/loading";
import { LIV_PROMO_VIDEO_SRC } from "@/lib/brand/copy";
import { livAmenityIcon } from "@/lib/livAmenityIcons";
import {
  ImageLightbox,
  type LightboxItem,
} from "@/components/media/ImageLightbox";
import {
  livAssetUrl,
  livSiteConfig,
  type LivFeedResponse,
} from "@shared/liv";

type Props = {
  feed?: LivFeedResponse;
  loading: boolean;
  error: boolean;
  externalUrl?: string | null;
  /** When true, skip LIV feed amenities (project has its own in Capital Urbano). */
  hideAmenities?: boolean;
  hideGallery?: boolean;
  hideModels?: boolean;
};

export function LivCapitalPanel({
  feed,
  loading,
  error,
  externalUrl,
  hideAmenities = false,
  hideGallery = false,
  hideModels = false,
}: Props) {
  if (loading) {
    return (
      <div className="space-y-4" aria-busy>
        <SkeletonChamferCard tone="warm" showIcon={false} lines={2} />
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="aspect-[4/3] bg-cu-warm-white animate-pulse rounded-sm" />
          ))}
        </div>
      </div>
    );
  }

  if (error || !feed) {
    return (
      <div className="text-center py-12 px-6 bg-cu-warm-white border border-cu-stone/15 rounded-sm">
        <p className="text-cu-concrete mb-4">
          No pudimos cargar el contenido en vivo de LIV Capital.
        </p>
        {externalUrl && (
          <a
            href={externalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-cu-orange font-montserrat font-semibold"
          >
            Ver sitio LIV Capital <ExternalLink size={16} />
          </a>
        )}
      </div>
    );
  }

  const base = feed.source;
  const cfg = livSiteConfig(feed);
  const amenities = feed.amenities?.amenities ?? [];
  const gallery = feed.gallery?.images ?? [];
  const models = feed.models?.models ?? [];
  const heroCandidates = [
    livAssetUrl(cfg.og_image_url, base),
    livAssetUrl(gallery[0]?.image_url, base),
    livAssetUrl(models[0]?.main_image_url, base),
    livAssetUrl("/images/Torre_Kino_Frontal_Peatonal.jpg", base),
  ].filter((url, i, arr): url is string => !!url && arr.indexOf(url) === i);

  return (
    <div className="space-y-10">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <p className="text-xs font-montserrat font-bold text-cu-orange uppercase tracking-[0.2em] mb-2">
            Contenido en vivo
          </p>
          <h3 className="text-xl sm:text-2xl font-montserrat font-bold text-cu-black">
            {cfg.site_title ?? "LIV Capital"}
          </h3>
          {cfg.site_description && (
            <p className="mt-3 text-cu-concrete font-josefin leading-relaxed max-w-2xl">
              {cfg.site_description}
            </p>
          )}
        </div>
        <a
          href={externalUrl ?? base}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 inline-flex items-center gap-2 px-5 py-3 bg-cu-orange text-white font-montserrat font-semibold text-sm rounded-sm hover:bg-cu-orange-80"
        >
          Abrir LIV Capital <ExternalLink size={16} />
        </a>
      </div>

      <BrandVideoPreview
        src={LIV_PROMO_VIDEO_SRC}
        title={cfg.site_title ?? "LIV Capital"}
        caption="Video promocional del proyecto"
        variant="cinema"
        className="min-h-[14rem] sm:min-h-[18rem]"
      />

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {cfg.total_floors != null && (
          <StatChip icon={Layers} label="Plantas" value={String(cfg.total_floors)} />
        )}
        {cfg.total_units != null && (
          <StatChip icon={Building2} label="Departamentos" value={String(cfg.total_units)} />
        )}
        {cfg.total_amenities != null && (
          <StatChip icon={Sparkles} label="Amenidades" value={String(cfg.total_amenities)} />
        )}
        {cfg.delivery_estimate && (
          <StatChip icon={Building2} label="Entrega" value={cfg.delivery_estimate} />
        )}
      </div>

      {heroCandidates.length > 0 && (
        <div className="cu-chamfer-border-tr max-h-[320px]">
          <div className="cu-chamfer-fill-tr overflow-hidden">
            <LivHeroImage candidates={heroCandidates} alt="LIV Capital" />
          </div>
        </div>
      )}

      {!hideAmenities && amenities.length > 0 && (
        <div>
          <h4 className="font-montserrat font-bold text-cu-black mb-4">Amenidades</h4>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {amenities.slice(0, 6).map((a) => {
              const img = livAssetUrl(a.image_url, base);
              return (
                <div
                  key={a.id}
                  className="cu-chamfer-border-tl"
                >
                  <div className="cu-chamfer-fill-tl bg-cu-warm-white p-4 flex gap-3 min-h-[5rem]">
                    <AmenityThumb src={img} icon={a.icon} alt={a.name} />
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
              );
            })}
          </div>
        </div>
      )}

      {!hideGallery && gallery.length > 0 && (
        <LivGallerySection
          images={gallery.map((img) => ({
            id: img.id,
            src: livAssetUrl(img.image_url, base) ?? img.image_url,
            title: img.title,
          }))}
        />
      )}

      {!hideModels && models.length > 0 && (
        <LivModelsSection
          models={models.map((m) => ({
            id: m.id,
            name: m.name,
            src: livAssetUrl(m.main_image_url, base),
            meta: [
              `${m.bedrooms} rec`,
              `${m.area_sqm} m²`,
              m.terrace_m2 ? `terraza ${m.terrace_m2} m²` : null,
            ]
              .filter(Boolean)
              .join(" · "),
          }))}
          total={models.length}
          externalUrl={externalUrl ?? base}
        />
      )}

      {feed.cached && (
        <p className="text-xs text-cu-stone text-center">
          Datos en caché (actualización cada 5 min).{" "}
          <a
            href={externalUrl ?? base}
            target="_blank"
            rel="noopener noreferrer"
            className="text-cu-orange hover:underline"
          >
            Ver sitio completo
          </a>
        </p>
      )}
    </div>
  );
}

function LivGallerySection({
  images,
}: {
  images: { id: number; src: string; title: string }[];
}) {
  const [index, setIndex] = useState<number | null>(null);
  const items: LightboxItem[] = images.map((img) => ({
    src: img.src,
    title: img.title,
  }));

  return (
    <div>
      <h4 className="font-montserrat font-bold text-cu-black mb-4">Galería</h4>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {images.map((img, i) => (
          <button
            key={img.id}
            type="button"
            onClick={() => setIndex(i)}
            className="group text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-cu-orange rounded-sm"
          >
            <SafeImage
              src={img.src}
              alt={img.title}
              className="w-full aspect-[4/3] object-cover rounded-sm transition-opacity group-hover:opacity-90"
              fallbackClassName="w-full aspect-[4/3] rounded-sm"
            />
            <span className="block text-xs text-cu-concrete mt-1 line-clamp-1">
              {img.title}
            </span>
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

function LivModelsSection({
  models,
  total,
  externalUrl,
}: {
  models: { id: number; name: string; src: string | null; meta: string }[];
  total: number;
  externalUrl: string;
}) {
  const withImage = models.filter((m) => m.src);
  const [index, setIndex] = useState<number | null>(null);
  const items: LightboxItem[] = withImage.map((m) => ({
    src: m.src!,
    title: m.name,
    caption: m.meta,
  }));

  return (
    <div>
      <h4 className="font-montserrat font-bold text-cu-black mb-4">
        Modelos ({total})
      </h4>
      <div className="grid sm:grid-cols-2 gap-4">
        {models.map((m) => (
          <button
            key={m.id}
            type="button"
            disabled={!m.src}
            onClick={() => {
              const i = withImage.findIndex((x) => x.id === m.id);
              if (i >= 0) setIndex(i);
            }}
            className="flex gap-4 p-4 border border-cu-stone/15 bg-white min-w-0 text-left hover:border-cu-orange/40 transition-colors disabled:hover:border-cu-stone/15 rounded-sm"
          >
            <SafeImage
              src={m.src}
              alt={m.name}
              className="w-24 h-24 object-cover shrink-0"
              fallbackClassName="w-24 h-24"
            />
            <div className="min-w-0 flex-1">
              <p className="font-montserrat font-bold text-cu-black">{m.name}</p>
              <p className="text-sm text-cu-concrete mt-1">{m.meta}</p>
              {m.src && (
                <p className="text-xs text-cu-orange font-semibold mt-2">
                  Ver imagen
                </p>
              )}
            </div>
          </button>
        ))}
      </div>
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
      <ImageLightbox
        items={items}
        index={index}
        onClose={() => setIndex(null)}
        onIndexChange={setIndex}
      />
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

function LivHeroImage({
  candidates,
  alt,
}: {
  candidates: string[];
  alt: string;
}) {
  const [index, setIndex] = useState(0);
  const src = candidates[index] ?? null;

  if (!src) {
    return (
      <SafeImage
        src={null}
        alt={alt}
        className="w-full h-48 sm:h-72 object-cover"
        fallbackClassName="w-full h-48 sm:h-72"
      />
    );
  }

  return (
    <img
      key={src}
      src={src}
      alt={alt}
      className="w-full h-48 sm:h-72 object-cover"
      loading="lazy"
      onError={() => setIndex((i) => i + 1)}
    />
  );
}

function StatChip({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Layers;
  label: string;
  value: string;
}) {
  return (
    <div className="text-center p-4 bg-cu-warm-white border border-cu-stone/10">
      <Icon className="w-5 h-5 text-cu-orange mx-auto mb-2" strokeWidth={1.5} />
      <p className="text-lg font-montserrat font-bold text-cu-black">{value}</p>
      <p className="text-xs text-cu-concrete mt-0.5">{label}</p>
    </div>
  );
}
