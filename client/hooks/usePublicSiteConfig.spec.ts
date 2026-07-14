import { describe, expect, it } from "vitest";
import { formatStat } from "./usePublicSiteConfig";

describe("formatStat — empty and edge values", () => {
  it("returns em dash for empty values", () => {
    expect(formatStat(undefined)).toBe("—");
    expect(formatStat("")).toBe("—");
  });

  it("formats millions and thousands", () => {
    expect(formatStat("1000000", "+")).toBe("1M+");
    expect(formatStat(900000, "+")).toBe("900K+");
    expect(formatStat("5000", "+")).toBe("5K+");
  });

  it("handles invalid numeric strings gracefully", () => {
    expect(formatStat("abc")).toBe("abc");
    expect(formatStat("  ")).toBe("—");
  });

  it("strips non-digits before formatting", () => {
    expect(formatStat("1,000,000")).toBe("1M");
  });
});
