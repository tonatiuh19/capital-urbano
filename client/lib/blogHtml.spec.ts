import { describe, expect, it } from "vitest";
import { looksLikeHtml, plainTextToBlogHtml } from "./blogHtml";

describe("looksLikeHtml", () => {
  it("detects tags", () => {
    expect(looksLikeHtml("<p>Hola</p>")).toBe(true);
    expect(looksLikeHtml("Hola\nmundo")).toBe(false);
  });
});

describe("plainTextToBlogHtml", () => {
  it("keeps existing html", () => {
    expect(plainTextToBlogHtml("<p>Ya html</p>")).toBe("<p>Ya html</p>");
  });

  it("wraps plain paragraphs", () => {
    expect(plainTextToBlogHtml("Uno\n\nDos")).toBe("<p>Uno</p><p>Dos</p>");
  });
});
