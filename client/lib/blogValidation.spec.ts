import { describe, expect, it } from "vitest";
import type { BlogPostSection } from "@shared/api";
import {
  plainTextFromHtml,
  validateBlogEditor,
  validateBlogSection,
} from "./blogValidation";

const baseForm = {
  title: "Artículo de prueba",
  author_id: "1",
  status: "draft",
  scheduled_at: "",
  sections: [] as BlogPostSection[],
};

describe("plainTextFromHtml", () => {
  it("treats empty rich text as blank", () => {
    expect(plainTextFromHtml("<p></p>")).toBe("");
    expect(plainTextFromHtml("<p><br></p>")).toBe("");
  });

  it("keeps real text", () => {
    expect(plainTextFromHtml("<p>Hola <strong>mundo</strong></p>")).toBe(
      "Hola mundo",
    );
  });
});

describe("validateBlogSection", () => {
  it("requires gallery images", () => {
    const issues = validateBlogSection(
      {
        section_type: "gallery",
        meta_json: { images: [] },
        display_order: 0,
      },
      0,
    );
    expect(issues.some((i) => i.field === "images")).toBe(true);
  });

  it("accepts a filled gallery", () => {
    const issues = validateBlogSection(
      {
        section_type: "gallery",
        meta_json: { images: ["/uploads/blog/a.jpg"] },
        display_order: 0,
      },
      0,
    );
    expect(issues).toHaveLength(0);
  });

  it("requires a valid youtube url", () => {
    expect(
      validateBlogSection(
        {
          section_type: "youtube",
          meta_json: { youtube: "https://example.com/not-youtube" },
          display_order: 0,
        },
        0,
      ).length,
    ).toBeGreaterThan(0);
    expect(
      validateBlogSection(
        {
          section_type: "youtube",
          meta_json: {
            youtube: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
          },
          display_order: 0,
        },
        0,
      ),
    ).toHaveLength(0);
  });

  it("requires embed url or html", () => {
    expect(
      validateBlogSection(
        { section_type: "embed", meta_json: {}, display_order: 0 },
        0,
      ).length,
    ).toBeGreaterThan(0);
    expect(
      validateBlogSection(
        {
          section_type: "embed",
          meta_json: {
            url: "https://www.instagram.com/reel/ABC123xyz/",
            html: "<iframe src='https://www.instagram.com/reel/ABC123xyz/embed'></iframe>",
            provider: "instagram",
          },
          display_order: 0,
        },
        0,
      ),
    ).toHaveLength(0);
  });
});

describe("validateBlogEditor", () => {
  it("blocks incomplete posts", () => {
    const result = validateBlogEditor({
      ...baseForm,
      title: "",
      author_id: "",
      sections: [
        { section_type: "text", body: "<p></p>", display_order: 0 },
        { section_type: "gallery", meta_json: { images: [] }, display_order: 1 },
      ],
    });
    expect(result.ok).toBe(false);
    expect(result.issues.some((i) => i.field === "title")).toBe(true);
    expect(result.issues.some((i) => i.field === "author_id")).toBe(true);
    expect(result.issues.some((i) => i.field === "body")).toBe(true);
    expect(result.issues.some((i) => i.field === "images")).toBe(true);
  });

  it("passes a complete draft", () => {
    const result = validateBlogEditor({
      ...baseForm,
      sections: [
        {
          section_type: "text",
          body: "<p>Contenido real</p>",
          display_order: 0,
        },
      ],
    });
    expect(result.ok).toBe(true);
    expect(result.summary).toBeNull();
  });
});

describe("blogIssueJumpTargets", () => {
  it("dedupes section issues into one jump target", async () => {
    const { blogIssueJumpTargets } = await import("./blogValidation");
    const targets = blogIssueJumpTargets([
      {
        sectionIndex: 0,
        field: "images",
        message: "Sección 1 (Galería): agrega al menos una imagen.",
      },
      {
        sectionIndex: null,
        field: "title",
        message: "El título es obligatorio.",
      },
    ]);
    expect(targets.map((t) => t.id)).toEqual([
      "blog-section-0",
      "blog-field-title",
    ]);
    expect(targets[0].label).toBe("Sección 1");
    expect(targets[1].label).toBe("Título");
  });
});
