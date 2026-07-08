import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MetaTags } from "@/components/seo/MetaTags";
import { apiGet, assetUrl } from "@/lib/api";
import {
  buildBreadcrumbSchema,
  buildDevelopmentSchema,
  buildOrganizationSchema,
  toJsonLdGraph,
  truncateMetaDescription,
} from "@/lib/seo";
import { SkeletonProjectDetail } from "@/components/loading";
import { useShowQuerySkeleton } from "@/hooks/useShowQuerySkeleton";
import { ExpandableText } from "@/components/content/ExpandableText";
import { ProjectLocationMap } from "@/components/projects/ProjectLocationMap";
import { SafeImage } from "@/components/ui/SafeImage";
import { LivCapitalPanel } from "@/components/projects/LivCapitalPanel";
import { useLivFeed } from "@/hooks/useLivFeed";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Development } from "@shared/api";
import { ArrowLeft, MapPin, Mail, Phone, ExternalLink, FileDown } from "lucide-react";

const TAB_TRIGGER =
  "flex-1 min-w-0 basis-[calc(50%-0.25rem)] sm:basis-auto sm:min-w-[5rem] py-2.5 px-2 sm:px-3 text-cu-concrete font-montserrat font-semibold text-xs sm:text-sm transition-colors hover:text-cu-black data-[state=active]:bg-white data-[state=active]:text-cu-orange data-[state=active]:shadow-sm whitespace-normal text-center leading-snug";

export default function ProjectDetail() {
  const { slug } = useParams<{ slug: string }>();
  const devQ = useQuery({
    queryKey: ["development", slug],
    queryFn: () =>
      apiGet<{ development: Development | null }>(
        `/api/developments.php?slug=${encodeURIComponent(slug!)}`,
      ),
    enabled: !!slug,
  });

  const loading = useShowQuerySkeleton(devQ);
  const d = devQ.data?.development;

  const livSlug =
    d?.liv_project_slug ||
    (d?.external_site_url?.includes("livcapitalgdl.mx") ? "liv-capital" : null);
  const livQ = useLivFeed(livSlug);
  const hasLiv = !!livSlug;

  if (loading) {
    return <SkeletonProjectDetail />;
  }

  if (!d) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <MetaTags
          title="Proyecto no encontrado"
          description="El desarrollo solicitado no existe o ya no está disponible."
          noIndex
          canonicalPath="/projects"
        />
        <p className="text-cu-black font-montserrat font-bold">Proyecto no encontrado</p>
        <Link to="/projects" className="text-cu-orange hover:underline">
          Ver todos los proyectos
        </Link>
      </div>
    );
  }

  const highlights = Array.isArray(d.highlights) ? d.highlights : [];
  const canonicalPath = `/projects/${d.slug}`;
  const metaDescription = truncateMetaDescription(
    d.description_short ?? d.tagline ?? d.description,
  );
  const hasGallery = !hasLiv && !!(d.media && d.media.length > 0);
  const hasLocation = d.latitude != null && d.longitude != null;
  const hasContact =
    d.contact_email || d.contact_phone || d.external_site_url || d.brochure_url;

  return (
    <div className="cu-page min-h-screen bg-white">
      <MetaTags
        title={d.name}
        description={metaDescription}
        image={d.hero_image_url ?? undefined}
        imageAlt={`${d.name} — Capital Urbano`}
        type="product"
        canonicalPath={canonicalPath}
        structuredData={toJsonLdGraph([
          buildOrganizationSchema(),
          buildDevelopmentSchema(d, canonicalPath),
          buildBreadcrumbSchema([
            { name: "Inicio", path: "/" },
            { name: "Proyectos", path: "/projects" },
            { name: d.name, path: canonicalPath },
          ]),
        ])}
      />
      <Header />
      <article className="pt-28 pb-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            to="/projects"
            className="inline-flex items-center gap-2 text-sm text-cu-concrete hover:text-cu-orange mb-8"
          >
            <ArrowLeft size={16} /> Proyectos
          </Link>

          <div className="aspect-[16/9] cu-chamfer-border-tr mb-10">
            <div className="cu-chamfer-fill-tr overflow-hidden bg-cu-warm-white relative h-full">
              <SafeImage
                src={assetUrl(d.hero_image_url) || null}
                alt={d.name}
                className="w-full h-full object-cover"
                fallbackClassName="w-full h-full min-h-[240px]"
                showNameOnFallback
              />
            </div>
          </div>

          <h1 className="text-3xl sm:text-5xl font-montserrat font-bold text-cu-black mb-2 break-words">
            {d.name}
          </h1>
          {(d.tagline || d.description_short) && (
            <p className="text-xl text-cu-orange font-medium mb-6">
              {d.tagline ?? d.description_short}
            </p>
          )}

          <div className="flex flex-wrap gap-4 text-sm text-cu-concrete mb-8 min-w-0">
            {d.location_label && (
              <span className="flex items-start gap-1 min-w-0 max-w-full break-words">
                <MapPin size={16} className="text-cu-orange shrink-0 mt-0.5" />
                <span>
                  {d.location_label}
                  {d.address_line ? ` · ${d.address_line}` : ""}
                </span>
              </span>
            )}
            {d.delivery_estimate && <span>Entrega: {d.delivery_estimate}</span>}
            {d.total_units && <span>{d.total_units} unidades</span>}
            {d.units_label && <span>{d.units_label}</span>}
          </div>

          <Tabs defaultValue="resumen" className="mb-10">
            <TabsList className="w-full flex flex-wrap h-auto gap-1 bg-cu-warm-white border border-cu-stone/20 p-1.5 rounded-sm text-cu-concrete">
              <TabsTrigger value="resumen" className={TAB_TRIGGER}>
                Resumen
              </TabsTrigger>
              {hasLiv && (
                <TabsTrigger value="liv" className={TAB_TRIGGER}>
                  LIV Capital
                </TabsTrigger>
              )}
              {hasGallery && (
                <TabsTrigger value="galeria" className={TAB_TRIGGER}>
                  Galería
                </TabsTrigger>
              )}
              {hasLocation && (
                <TabsTrigger value="ubicacion" className={TAB_TRIGGER}>
                  Ubicación
                </TabsTrigger>
              )}
              {hasContact && (
                <TabsTrigger value="contacto" className={TAB_TRIGGER}>
                  Contacto
                </TabsTrigger>
              )}
            </TabsList>

            <TabsContent value="resumen" className="mt-8">
              {d.description && (
                <ExpandableText
                  text={d.description}
                  className="text-lg text-cu-concrete leading-relaxed mb-10"
                  clampClass="line-clamp-4"
                />
              )}
              {highlights.length > 0 && (
                <ul className="grid sm:grid-cols-2 gap-3">
                  {highlights.map((h) => (
                    <li
                      key={h}
                      className="px-4 py-3 bg-cu-warm-white border border-cu-stone/20 text-sm text-cu-black"
                    >
                      {h}
                    </li>
                  ))}
                </ul>
              )}
            </TabsContent>

            {hasLiv && (
              <TabsContent value="liv" className="mt-8">
                <LivCapitalPanel
                  feed={livQ.data}
                  loading={livQ.isPending}
                  error={livQ.isError}
                  externalUrl={d.external_site_url ?? "https://livcapitalgdl.mx"}
                />
              </TabsContent>
            )}

            {hasGallery && (
              <TabsContent value="galeria" className="mt-8">
                <div className="grid grid-cols-2 gap-4">
                  {d.media!.map((m) =>
                    m.media_type === "video" ? (
                      <div key={m.id} className="col-span-2 aspect-video">
                        <iframe
                          src={m.url}
                          title={m.caption ?? "Video"}
                          className="w-full h-full rounded-sm"
                          allowFullScreen
                        />
                      </div>
                    ) : (
                      <SafeImage
                        key={m.id}
                        src={assetUrl(m.url) || null}
                        alt={m.caption ?? m.url}
                        className="w-full h-48 object-cover rounded-sm"
                        fallbackClassName="w-full h-48 rounded-sm"
                      />
                    ),
                  )}
                </div>
              </TabsContent>
            )}

            {hasLocation && (
              <TabsContent value="ubicacion" className="mt-8 space-y-4">
                {(d.address_line || d.city) && (
                  <p className="text-cu-concrete text-sm">
                    {[d.address_line, d.city, d.state].filter(Boolean).join(", ")}
                  </p>
                )}
                <ProjectLocationMap
                  name={d.name}
                  lat={d.latitude!}
                  lng={d.longitude!}
                />
              </TabsContent>
            )}

            {hasContact && (
              <TabsContent value="contacto" className="mt-8">
                <div className="flex flex-wrap gap-4">
                  {d.contact_email && (
                    <a
                      href={`mailto:${d.contact_email}`}
                      className="inline-flex items-center gap-2 text-sm text-cu-black hover:text-cu-orange"
                    >
                      <Mail size={16} /> {d.contact_email}
                    </a>
                  )}
                  {d.contact_phone && (
                    <a
                      href={`tel:${d.contact_phone}`}
                      className="inline-flex items-center gap-2 text-sm text-cu-black hover:text-cu-orange"
                    >
                      <Phone size={16} /> {d.contact_phone}
                    </a>
                  )}
                  {d.external_site_url && (
                    <a
                      href={d.external_site_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm text-cu-orange font-semibold"
                    >
                      <ExternalLink size={16} /> Sitio del proyecto
                    </a>
                  )}
                  {d.brochure_url && (
                    <a
                      href={assetUrl(d.brochure_url) ?? d.brochure_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm text-cu-orange font-semibold"
                    >
                      <FileDown size={16} /> Descargar dossier
                    </a>
                  )}
                  <Link
                    to="/contact"
                    className="px-6 py-3 bg-cu-orange text-white font-montserrat font-semibold text-sm rounded-sm hover:bg-cu-orange-80"
                  >
                    Solicitar información
                  </Link>
                </div>
              </TabsContent>
            )}
          </Tabs>
        </div>
      </article>
      <Footer />
    </div>
  );
}
