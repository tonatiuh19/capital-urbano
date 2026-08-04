import { describe, expect, it } from "vitest";
import { buildBlogEditorTestData, isLocalAdminDev } from "./blogTestData";

describe("buildBlogEditorTestData", () => {
  const authors = [{ id: 1, slug: "equipo", name: "Equipo" }];
  const categories = [{ id: 2, slug: "noticias", name: "Noticias" }];
  const tags = [
    { id: 3, slug: "gdl", name: "GDL" },
    { id: 4, slug: "vivienda", name: "Vivienda" },
  ];

  it("fills all section types and assigns author/category/tags", () => {
    const data = buildBlogEditorTestData({ authors, categories, tags, flow: "draft" });
    expect(data.title).toContain("(draft)");
    expect(data.author_id).toBe("1");
    expect(data.category_id).toBe("2");
    expect(data.tag_ids).toEqual([3, 4]);
    expect(data.status).toBe("draft");
    expect(data.sections.map((s) => s.section_type)).toEqual([
      "heading",
      "text",
      "quote",
      "image",
      "gallery",
      "youtube",
      "embed",
      "cta",
    ]);
  });

  it("sets scheduled_at for scheduled flow", () => {
    const data = buildBlogEditorTestData({
      authors,
      categories,
      tags: [],
      flow: "scheduled",
    });
    expect(data.status).toBe("scheduled");
    expect(data.scheduled_at).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/);
    expect(data.published_at).toBe("");
  });

  it("sets published_at for published flow", () => {
    const data = buildBlogEditorTestData({
      authors,
      categories,
      tags: [],
      flow: "published",
    });
    expect(data.status).toBe("published");
    expect(data.published_at).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/);
    expect(data.is_featured).toBe(false);
  });
});

describe("isLocalAdminDev", () => {
  it("reflects Vite DEV flag", () => {
    expect(typeof isLocalAdminDev()).toBe("boolean");
  });
});
