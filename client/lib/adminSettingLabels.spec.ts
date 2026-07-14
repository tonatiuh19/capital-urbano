import { describe, expect, it } from "vitest";
import { getSettingMeta, groupSettings, SETTING_GROUPS } from "./adminSettingLabels";

describe("adminSettingLabels", () => {
  it("groups stat_families under estadísticas", () => {
    const statsGroup = SETTING_GROUPS.find((g) => g.title.includes("Estadísticas"));
    expect(statsGroup?.keys).toContain("stat_families");
    expect(statsGroup?.keys).not.toContain("stat_sqm_developed");
  });

  it("groups about team section titles", () => {
    const teamGroup = SETTING_GROUPS.find((g) => g.title.includes("secciones de equipo"));
    expect(teamGroup?.keys).toContain("about_technical_title");
    expect(teamGroup?.keys).toContain("about_technical_subtitle");
  });

  it("puts unknown settings in Otros", () => {
    const grouped = groupSettings([
      { setting_key: "stat_families", setting_value: "5000" },
      { setting_key: "orphan_key", setting_value: "x" },
    ]);
    const otros = grouped.find((g) => g.title === "Otros");
    expect(otros?.items.some((i) => i.setting_key === "orphan_key")).toBe(true);
  });

  it("excludes under_construction from groups", () => {
    const grouped = groupSettings([
      { setting_key: "under_construction", setting_value: "1" },
      { setting_key: "stat_families", setting_value: "" },
    ]);
    const flat = grouped.flatMap((g) => g.items.map((i) => i.setting_key));
    expect(flat).not.toContain("under_construction");
    expect(flat).toContain("stat_families");
  });

  it("provides fallback meta for unknown keys", () => {
    const meta = getSettingMeta("some_new_key");
    expect(meta.label).toContain("Some New Key");
    expect(meta.hint).toContain("some_new_key");
  });

  it("stat_families hint mentions Edna", () => {
    const meta = getSettingMeta("stat_families");
    expect(meta.hint?.toLowerCase()).toContain("edna");
  });
});
