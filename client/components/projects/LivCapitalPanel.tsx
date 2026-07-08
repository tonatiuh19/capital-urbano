import { ExternalLink, Layers, Building2, Sparkles } from "lucide-react";
import { SafeImage } from "@/components/ui/SafeImage";
import { SkeletonChamferCard } from "@/components/loading";
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
};

export function LivCapitalPanel({ feed, loading, error, externalUrl }: Props) {
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
  const gallery = (feed.gallery?.images ?? []).slice(0, 8);
  const models = (feed.models?.models ?? []).slice(0, 4);
  const heroImage = livAssetUrl(cfg.og_image_url, base);

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

      {heroImage && (
        <div className="cu-chamfer-border-tr max-h-[320px]">
          <div className="cu-chamfer-fill-tr overflow-hidden">
            <SafeImage
              src={heroImage}
              alt="LIV Capital"
              className="w-full h-48 sm:h-72 object-cover"
              fallbackClassName="w-full h-48 sm:h-72"
            />
          </div>
        </div>
      )}

      {amenities.length > 0 && (
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
                    {img && (
                      <SafeImage
                        src={img}
                        alt={a.name}
                        className="w-14 h-14 object-cover shrink-0"
                        fallbackClassName="w-14 h-14"
                      />
                    )}
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

      {gallery.length > 0 && (
        <div>
          <h4 className="font-montserrat font-bold text-cu-black mb-4">Galería</h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {gallery.map((img) => (
              <figure key={img.id} className="group">
                <SafeImage
                  src={livAssetUrl(img.image_url, base)}
                  alt={img.title}
                  className="w-full aspect-[4/3] object-cover rounded-sm"
                  fallbackClassName="w-full aspect-[4/3] rounded-sm"
                />
                <figcaption className="text-xs text-cu-concrete mt-1 line-clamp-1">
                  {img.title}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      )}

      {models.length > 0 && (
        <div>
          <h4 className="font-montserrat font-bold text-cu-black mb-4">
            Modelos ({feed.models?.models?.length ?? models.length})
          </h4>
          <div className="grid sm:grid-cols-2 gap-4">
            {models.map((m) => (
              <div key={m.id} className="flex gap-4 p-4 border border-cu-stone/15 bg-white min-w-0">
                <SafeImage
                  src={livAssetUrl(m.main_image_url, base)}
                  alt={m.name}
                  className="w-24 h-24 object-cover shrink-0"
                  fallbackClassName="w-24 h-24"
                />
                <div className="min-w-0 flex-1">
                  <p className="font-montserrat font-bold text-cu-black">{m.name}</p>
                  <p className="text-sm text-cu-concrete mt-1">
                    {m.bedrooms} rec · {m.area_sqm} m²
                    {m.terrace_m2 ? ` · terraza ${m.terrace_m2} m²` : ""}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
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
