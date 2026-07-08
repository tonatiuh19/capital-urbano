import type { CmsPage } from "@shared/api";
import { MetaTags, type MetaTagsProps } from "@/components/seo/MetaTags";
import {
  PUBLIC_ROUTES,
  buildBreadcrumbSchema,
  buildOrganizationSchema,
  buildWebPageSchema,
  buildWebSiteSchema,
  seoFromCmsPage,
  toJsonLdGraph,
  type PublicRouteKey,
} from "@/lib/seo";

type PageMetaProps = {
  route: PublicRouteKey;
  page?: CmsPage | null;
  image?: string;
  imageAlt?: string;
  noIndex?: boolean;
  /** Extra schema.org nodes merged into @graph */
  extraSchema?: Record<string, unknown>[];
} & Pick<MetaTagsProps, "type" | "canonicalPath" | "titleMode" | "title">;

export function PageMeta({
  route,
  page,
  image,
  imageAlt,
  noIndex,
  extraSchema = [],
  titleMode,
  title: titleOverride,
  type,
  canonicalPath,
}: PageMetaProps) {
  const defaults = PUBLIC_ROUTES[route];
  const seo = seoFromCmsPage(route, page);
  const path = canonicalPath ?? (defaults.path || undefined);
  const title = titleOverride ?? seo.title;
  const description = seo.description;

  const includeSiteGraph = route === "home";
  const graph = [
    ...(includeSiteGraph
      ? [buildOrganizationSchema(), buildWebSiteSchema()]
      : [buildOrganizationSchema()]),
    ...(path
      ? [
          buildWebPageSchema({
            path,
            title: titleMode === "home" ? seo.description : title,
            description,
          }),
        ]
      : []),
    ...(path && path !== "/"
      ? [
          buildBreadcrumbSchema([
            { name: "Inicio", path: "/" },
            { name: title, path },
          ]),
        ]
      : []),
    ...extraSchema,
  ];

  return (
    <MetaTags
      title={titleMode === "home" ? undefined : title}
      description={description}
      keywords={seo.keywords}
      image={image}
      imageAlt={imageAlt}
      titleMode={titleMode ?? (route === "home" ? "home" : "page")}
      canonicalPath={path}
      type={type}
      noIndex={noIndex}
      structuredData={toJsonLdGraph(graph)}
    />
  );
}
