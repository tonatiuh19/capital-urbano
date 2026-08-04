/**
 * Build social/media embeds from a public post URL (or raw HTML).
 * Prefers iframes so public pages don't need third-party widget scripts.
 */

export type SocialEmbedAspect = "video" | "portrait" | "square" | "auto";

export type SocialEmbedResult = {
  provider: string;
  label: string;
  /** Canonical source URL the admin pasted (when known). */
  url: string;
  /** Preferred iframe src for React rendering. */
  iframeSrc: string | null;
  /** Sanitized-ish HTML for storage / legacy consumers. */
  html: string;
  aspect: SocialEmbedAspect;
};

const IFRAME =
  'loading="lazy" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"';

function iframeHtml(src: string, title: string): string {
  const safe = src.replace(/"/g, "&quot;");
  return `<iframe src="${safe}" title="${title}" ${IFRAME}></iframe>`;
}

function looksLikeHtml(value: string): boolean {
  return /^\s*</.test(value);
}

function youtubeId(raw: string): string | null {
  const v = raw.trim();
  if (/^[\w-]{11}$/.test(v)) return v;
  try {
    const u = new URL(v);
    const host = u.hostname.replace(/^www\./, "").toLowerCase();
    if (host === "youtu.be") {
      const id = u.pathname.split("/").filter(Boolean)[0] ?? "";
      return /^[\w-]{11}$/.test(id) ? id : null;
    }
    if (host.includes("youtube.com")) {
      if (u.pathname.startsWith("/embed/")) {
        const id = u.pathname.split("/")[2] ?? "";
        return /^[\w-]{11}$/.test(id) ? id : null;
      }
      if (u.pathname.startsWith("/shorts/")) {
        const id = u.pathname.split("/")[2] ?? "";
        return /^[\w-]{11}$/.test(id) ? id : null;
      }
      const vParam = u.searchParams.get("v");
      if (vParam && /^[\w-]{11}$/.test(vParam)) return vParam;
    }
  } catch {
    return null;
  }
  return null;
}

function parseUrl(raw: string): URL | null {
  try {
    return new URL(raw.trim());
  } catch {
    return null;
  }
}

function hostOf(u: URL): string {
  return u.hostname.replace(/^www\./, "").toLowerCase();
}

/** Build embed from a social/post URL. Returns null if unsupported. */
export function buildSocialEmbedFromUrl(rawUrl: string): SocialEmbedResult | null {
  const trimmed = rawUrl.trim();
  if (!trimmed || looksLikeHtml(trimmed)) return null;

  const yt = youtubeId(trimmed);
  if (yt) {
    const iframeSrc = `https://www.youtube.com/embed/${yt}`;
    return {
      provider: "youtube",
      label: "YouTube",
      url: trimmed,
      iframeSrc,
      html: iframeHtml(iframeSrc, "YouTube"),
      aspect: "video",
    };
  }

  const u = parseUrl(trimmed);
  if (!u || !/^https?:$/i.test(u.protocol)) return null;
  const host = hostOf(u);
  const path = u.pathname;

  // Vimeo
  if (host === "vimeo.com" || host.endsWith(".vimeo.com")) {
    const id = path.split("/").filter(Boolean).find((p) => /^\d+$/.test(p));
    if (id) {
      const iframeSrc = `https://player.vimeo.com/video/${id}`;
      return {
        provider: "vimeo",
        label: "Vimeo",
        url: trimmed,
        iframeSrc,
        html: iframeHtml(iframeSrc, "Vimeo"),
        aspect: "video",
      };
    }
  }

  // Instagram
  if (host === "instagram.com" || host.endsWith(".instagram.com")) {
    const m = path.match(/\/(p|reel|tv|reels)\/([A-Za-z0-9_-]+)/);
    if (m) {
      const kind = m[1] === "reels" ? "reel" : m[1];
      const code = m[2];
      const iframeSrc = `https://www.instagram.com/${kind}/${code}/embed`;
      return {
        provider: "instagram",
        label: "Instagram",
        url: trimmed,
        iframeSrc,
        html: iframeHtml(iframeSrc, "Instagram"),
        aspect: "portrait",
      };
    }
  }

  // TikTok
  if (host === "tiktok.com" || host.endsWith(".tiktok.com")) {
    const m = path.match(/\/video\/(\d+)/);
    if (m) {
      const iframeSrc = `https://www.tiktok.com/embed/v2/${m[1]}`;
      return {
        provider: "tiktok",
        label: "TikTok",
        url: trimmed,
        iframeSrc,
        html: iframeHtml(iframeSrc, "TikTok"),
        aspect: "portrait",
      };
    }
  }

  // X / Twitter
  if (
    host === "twitter.com" ||
    host === "x.com" ||
    host === "mobile.twitter.com"
  ) {
    const m = path.match(/\/status\/(\d+)/);
    if (m) {
      const iframeSrc = `https://platform.twitter.com/embed/Tweet.html?id=${m[1]}`;
      return {
        provider: "x",
        label: "X (Twitter)",
        url: trimmed,
        iframeSrc,
        html: iframeHtml(iframeSrc, "X"),
        aspect: "auto",
      };
    }
  }

  // Facebook
  if (
    host === "facebook.com" ||
    host === "fb.watch" ||
    host.endsWith(".facebook.com")
  ) {
    const isPost =
      host === "fb.watch" ||
      /\/(posts|videos|watch|permalink\.php|share|reel|photo)\b/i.test(path) ||
      u.searchParams.has("story_fbid") ||
      u.searchParams.has("v");
    if (isPost) {
      const href = encodeURIComponent(trimmed.split("#")[0]);
      const iframeSrc = `https://www.facebook.com/plugins/post.php?href=${href}&show_text=true&width=550`;
      return {
        provider: "facebook",
        label: "Facebook",
        url: trimmed,
        iframeSrc,
        html: iframeHtml(iframeSrc, "Facebook"),
        aspect: "auto",
      };
    }
  }

  // LinkedIn
  if (host === "linkedin.com" || host.endsWith(".linkedin.com")) {
    if (path.includes("/embed/feed/update/")) {
      const iframeSrc = trimmed.split("?")[0];
      return {
        provider: "linkedin",
        label: "LinkedIn",
        url: trimmed,
        iframeSrc,
        html: iframeHtml(iframeSrc, "LinkedIn"),
        aspect: "auto",
      };
    }
    const activity =
      path.match(/activity-(\d+)/)?.[1] ??
      u.searchParams.get("updateUrn")?.match(/(\d{10,})/)?.[1] ??
      null;
    if (activity) {
      const iframeSrc = `https://www.linkedin.com/embed/feed/update/urn:li:activity:${activity}`;
      return {
        provider: "linkedin",
        label: "LinkedIn",
        url: trimmed,
        iframeSrc,
        html: iframeHtml(iframeSrc, "LinkedIn"),
        aspect: "auto",
      };
    }
  }

  return null;
}

/**
 * Resolve embed for preview/public render from section meta.
 * Accepts a URL, raw HTML, or previously stored { url, html }.
 */
export function resolveBlogEmbed(input: {
  url?: string | null;
  html?: string | null;
  body?: string | null;
}): SocialEmbedResult | null {
  const url = (input.url ?? "").trim();
  const html = (input.html ?? input.body ?? "").trim();

  if (url) {
    const fromUrl = buildSocialEmbedFromUrl(url);
    if (fromUrl) return fromUrl;
  }

  if (html && !looksLikeHtml(html)) {
    const fromPlain = buildSocialEmbedFromUrl(html);
    if (fromPlain) return fromPlain;
  }

  if (html && looksLikeHtml(html)) {
    // Prefer extracting iframe src for safer React rendering
    const srcMatch = html.match(
      /<iframe\b[^>]*\bsrc\s*=\s*["']([^"']+)["']/i,
    );
    const iframeSrc = srcMatch?.[1] ?? null;
    return {
      provider: "html",
      label: "Embed",
      url: url || iframeSrc || "",
      iframeSrc,
      html,
      aspect: "auto",
    };
  }

  return null;
}

export function socialEmbedAspectClass(aspect: SocialEmbedAspect): string {
  switch (aspect) {
    case "video":
      return "aspect-video w-full";
    case "portrait":
      return "aspect-[9/16] max-w-sm mx-auto w-full";
    case "square":
      return "aspect-square max-w-md mx-auto w-full";
    default:
      return "min-h-[280px] w-full";
  }
}
