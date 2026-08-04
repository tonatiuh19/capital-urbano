import { describe, expect, it } from "vitest";
import { isBlogFeatureEnabled } from "./featureFlags";

describe("isBlogFeatureEnabled", () => {
  it("defaults to enabled when setting missing", () => {
    expect(isBlogFeatureEnabled(undefined)).toBe(true);
    expect(isBlogFeatureEnabled({})).toBe(true);
  });

  it("reads boolean and string values", () => {
    expect(isBlogFeatureEnabled({ feature_blog_enabled: true })).toBe(true);
    expect(isBlogFeatureEnabled({ feature_blog_enabled: false })).toBe(false);
    expect(isBlogFeatureEnabled({ feature_blog_enabled: "1" })).toBe(true);
    expect(isBlogFeatureEnabled({ feature_blog_enabled: "0" })).toBe(false);
  });
});
