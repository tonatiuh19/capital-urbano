import { useEffect, useMemo } from "react";
import { useLocation } from "react-router-dom";
import {
  SITE,
  formatDocumentTitle,
  resolveCanonicalUrl,
  resolveOgImageUrl,
  truncateMetaDescription,
  type TitleMode,
} from "@/lib/seo";

export interface MetaTagsProps {
  /** Page segment title; omit on home for default site title */
  title?: string;
  description?: string;
  /** Absolute or site-relative image for social cards */
  image?: string;
  imageAlt?: string;
  type?: "website" | "article" | "product";
  canonicalUrl?: string;
  canonicalPath?: string;
  keywords?: string;
  /** home = site default title; page = "Title | Brand"; full = use title as document title */
  titleMode?: TitleMode;
  structuredData?: Record<string, unknown> | Record<string, unknown>[];
  noIndex?: boolean;
  noFollow?: boolean;
  /** Override html lang on <html> (default es-MX) */
  htmlLang?: string;
}

function setMeta(attr: "name" | "property", key: string, content: string) {
  let el = document.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.content = content;
}

function removeMeta(attr: "name" | "property", key: string) {
  document.querySelector(`meta[${attr}="${key}"]`)?.remove();
}

function setLink(rel: string, href: string) {
  let el = document.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement("link");
    el.rel = rel;
    document.head.appendChild(el);
  }
  el.href = href;
}

function setJsonLd(id: string, data: Record<string, unknown>) {
  let el = document.getElementById(id) as HTMLScriptElement | null;
  if (!el) {
    el = document.createElement("script");
    el.id = id;
    el.type = "application/ld+json";
    document.head.appendChild(el);
  }
  el.textContent = JSON.stringify(data);
}

function removeJsonLd(id: string) {
  document.getElementById(id)?.remove();
}

export function MetaTags({
  title,
  description,
  image,
  imageAlt,
  type = "website",
  canonicalUrl,
  canonicalPath,
  keywords,
  titleMode = "page",
  structuredData,
  noIndex = false,
  noFollow = false,
  htmlLang = SITE.language,
}: MetaTagsProps) {
  const { pathname } = useLocation();

  const resolvedTitle = formatDocumentTitle(title, titleMode);
  const resolvedDescription = truncateMetaDescription(
    description ?? SITE.defaultDescription,
  );
  const resolvedImage = resolveOgImageUrl(image);
  const resolvedImageAlt = imageAlt?.trim() || SITE.name;
  const resolvedUrl =
    canonicalUrl ??
    (canonicalPath != null
      ? resolveCanonicalUrl(canonicalPath)
      : resolveCanonicalUrl(pathname));

  const robots = [
    noIndex ? "noindex" : "index",
    noFollow ? "nofollow" : "follow",
    "max-image-preview:large",
    "max-snippet:-1",
    "max-video-preview:-1",
  ].join(", ");

  const jsonLdPayload = useMemo(() => {
    if (!structuredData) return null;
    const nodes = Array.isArray(structuredData)
      ? structuredData
      : [structuredData];
    if (nodes.length === 1 && nodes[0]["@context"]) {
      return nodes[0];
    }
    return {
      "@context": "https://schema.org",
      "@graph": nodes,
    };
  }, [structuredData]);

  const jsonLdKey = useMemo(
    () => (jsonLdPayload ? JSON.stringify(jsonLdPayload) : ""),
    [jsonLdPayload],
  );

  useEffect(() => {
    document.documentElement.lang = htmlLang;
    document.title = resolvedTitle;

    setLink("canonical", resolvedUrl);
    setMeta("name", "robots", robots);
    setMeta("name", "description", resolvedDescription);
    setMeta("name", "author", SITE.name);
    setMeta("name", "theme-color", SITE.themeColor);

    if (keywords?.trim()) {
      setMeta("name", "keywords", keywords.trim());
    } else {
      removeMeta("name", "keywords");
    }

    setMeta("property", "og:site_name", SITE.name);
    setMeta("property", "og:type", type);
    setMeta("property", "og:title", resolvedTitle);
    setMeta("property", "og:description", resolvedDescription);
    setMeta("property", "og:url", resolvedUrl);
    setMeta("property", "og:image", resolvedImage);
    setMeta("property", "og:image:secure_url", resolvedImage);
    setMeta("property", "og:image:width", "1200");
    setMeta("property", "og:image:height", "630");
    setMeta("property", "og:image:alt", resolvedImageAlt);
    setMeta("property", "og:locale", SITE.locale);

    setMeta("name", "twitter:card", "summary_large_image");
    setMeta("name", "twitter:site", SITE.twitterHandle);
    setMeta("name", "twitter:title", resolvedTitle);
    setMeta("name", "twitter:description", resolvedDescription);
    setMeta("name", "twitter:image", resolvedImage);
    setMeta("name", "twitter:image:alt", resolvedImageAlt);

    if (jsonLdPayload) {
      setJsonLd("json-ld-schema", jsonLdPayload);
    } else {
      removeJsonLd("json-ld-schema");
    }

    return () => {
      removeJsonLd("json-ld-schema");
    };
  }, [
    resolvedTitle,
    resolvedDescription,
    resolvedImage,
    resolvedImageAlt,
    resolvedUrl,
    type,
    keywords,
    robots,
    htmlLang,
    jsonLdKey,
    jsonLdPayload,
  ]);

  return null;
}
