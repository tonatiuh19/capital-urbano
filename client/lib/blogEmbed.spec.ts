import { describe, expect, it } from "vitest";
import {
  buildSocialEmbedFromUrl,
  resolveBlogEmbed,
} from "./blogEmbed";

describe("buildSocialEmbedFromUrl", () => {
  it("embeds YouTube watch URLs", () => {
    const r = buildSocialEmbedFromUrl(
      "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    );
    expect(r?.provider).toBe("youtube");
    expect(r?.iframeSrc).toBe("https://www.youtube.com/embed/dQw4w9WgXcQ");
  });

  it("embeds Instagram reels", () => {
    const r = buildSocialEmbedFromUrl(
      "https://www.instagram.com/reel/ABC123xyz/",
    );
    expect(r?.provider).toBe("instagram");
    expect(r?.iframeSrc).toContain("/reel/ABC123xyz/embed");
  });

  it("embeds X status URLs", () => {
    const r = buildSocialEmbedFromUrl(
      "https://x.com/user/status/1234567890123456789",
    );
    expect(r?.provider).toBe("x");
    expect(r?.iframeSrc).toContain("id=1234567890123456789");
  });

  it("embeds TikTok videos", () => {
    const r = buildSocialEmbedFromUrl(
      "https://www.tiktok.com/@user/video/7123456789012345678",
    );
    expect(r?.provider).toBe("tiktok");
    expect(r?.iframeSrc).toContain("/embed/v2/7123456789012345678");
  });

  it("embeds LinkedIn activity posts", () => {
    const r = buildSocialEmbedFromUrl(
      "https://www.linkedin.com/posts/jane-doe_hello-activity-7123456789012345678-AbCd",
    );
    expect(r?.provider).toBe("linkedin");
    expect(r?.iframeSrc).toContain("urn:li:activity:7123456789012345678");
  });

  it("returns null for unsupported hosts", () => {
    expect(buildSocialEmbedFromUrl("https://example.com/post/1")).toBeNull();
  });
});

describe("resolveBlogEmbed", () => {
  it("prefers url over html", () => {
    const r = resolveBlogEmbed({
      url: "https://www.instagram.com/p/CODE123/",
      html: "<iframe src='https://evil.example'></iframe>",
    });
    expect(r?.provider).toBe("instagram");
    expect(r?.iframeSrc).toContain("instagram.com");
  });

  it("accepts plain url stored in html field", () => {
    const r = resolveBlogEmbed({
      html: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    });
    expect(r?.provider).toBe("youtube");
  });

  it("keeps raw html fallback", () => {
    const r = resolveBlogEmbed({
      html: '<iframe src="https://www.youtube.com/embed/dQw4w9WgXcQ"></iframe>',
    });
    expect(r?.provider).toBe("html");
    expect(r?.iframeSrc).toContain("youtube.com/embed");
  });
});
