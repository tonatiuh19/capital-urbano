import { describe, expect, it } from "vitest";
import { autoBlogSeo, slugifyBlog } from "./blog";

describe("slugifyBlog", () => {
  it("slugifies accents and punctuation", () => {
    expect(slugifyBlog("¡Hola Guadalajara! — Vivienda")).toBe(
      "hola-guadalajara-vivienda",
    );
  });

  it("falls back when empty", () => {
    expect(slugifyBlog("   ")).toBe("articulo");
    expect(slugifyBlog("@@@")).toBe("articulo");
  });

  it("truncates long slugs", () => {
    const long = "a".repeat(200);
    expect(slugifyBlog(long).length).toBeLessThanOrEqual(160);
  });

  it("collapses multiple separators", () => {
    expect(slugifyBlog("foo   bar___baz")).toBe("foo-bar-baz");
  });
});

describe("autoBlogSeo", () => {
  it("builds title, description, keywords, and slug", () => {
    const seo = autoBlogSeo({
      title: "Nuevo desarrollo en Providencia",
      excerpt: "Conoce el proyecto.",
      tags: ["Providencia", "preventa"],
    });
    expect(seo.meta_title).toBe("Nuevo desarrollo en Providencia");
    expect(seo.meta_description).toBe("Conoce el proyecto.");
    expect(seo.slug).toBe("nuevo-desarrollo-en-providencia");
    expect(seo.meta_keywords).toContain("Capital Urbano");
    expect(seo.meta_keywords).toContain("Providencia");
    expect(seo.meta_keywords).toContain("preventa");
  });

  it("truncates long titles and descriptions", () => {
    const seo = autoBlogSeo({
      title: "T".repeat(100),
      excerpt: "D".repeat(300),
    });
    expect(seo.meta_title.length).toBeLessThanOrEqual(60);
    expect(seo.meta_description.length).toBeLessThanOrEqual(160);
  });

  it("falls back description when excerpt missing", () => {
    const seo = autoBlogSeo({ title: "Solo título" });
    expect(seo.meta_description).toContain("Solo título");
    expect(seo.meta_description).toContain("Capital Urbano");
  });

  it("dedupes blank tags", () => {
    const seo = autoBlogSeo({
      title: "X",
      tags: ["", "  ", "Guadalajara", "Guadalajara"],
    });
    const parts = seo.meta_keywords.split(", ");
    expect(parts.filter((p) => p === "Guadalajara")).toHaveLength(1);
  });
});
