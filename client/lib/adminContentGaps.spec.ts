import { describe, expect, it } from "vitest";
import {
  analyzeAdminContentGaps,
  countGapsBySeverity,
  resolveTeamSection,
} from "./adminContentGaps";

const COMPLETE_SETTINGS = {
  stat_years_experience: "27",
  stat_sqm_built: "1000000",
  stat_families: "5000",
  contact_address: "Francisco J. Mujica 604, Guadalajara",
};

const COMPLETE_TEAM = [
  {
    name: "Gilberto Cordero Estrada",
    team_section: "leadership",
    role_title: "CEO",
    bio_short: "Líder",
    photo_url: "/uploads/team/g.jpg",
    is_active: 1,
  },
  {
    name: "Olaf Rodriguez Arroche",
    team_section: "technical",
    role_title: "Datos",
    bio_short: "Analista",
    photo_url: "/uploads/team/o.jpg",
    is_active: 1,
  },
  {
    name: "María Fernanda Ruiz",
    team_section: "general",
    role_title: "Comercial",
    bio: "Bio larga sin bio_short",
    photo_url: "/uploads/team/m.jpg",
    is_active: 1,
  },
] as const;

describe("resolveTeamSection", () => {
  it("uses team_section when set", () => {
    expect(resolveTeamSection({ team_section: "technical" })).toBe("technical");
  });

  it("falls back to is_leadership", () => {
    expect(resolveTeamSection({ is_leadership: 1 })).toBe("leadership");
    expect(resolveTeamSection({ is_leadership: 0 })).toBe("general");
  });
});

describe("analyzeAdminContentGaps — empty / no data", () => {
  it("flags all stats, team sections, and contact address", () => {
    const gaps = analyzeAdminContentGaps({ settings: {}, teamMembers: [] });

    expect(gaps.map((g) => g.id)).toEqual(
      expect.arrayContaining([
        "stat-stat_years_experience",
        "stat-stat_sqm_built",
        "stat-stat_families",
        "team-leadership-empty",
        "team-technical-empty",
        "team-general-empty",
        "contact-address",
      ]),
    );
    expect(countGapsBySeverity(gaps).warn).toBeGreaterThanOrEqual(5);
  });
});

describe("analyzeAdminContentGaps — stat edge cases", () => {
  it("flags whitespace-only stats as missing", () => {
    const gaps = analyzeAdminContentGaps({
      settings: { stat_families: "   " },
      teamMembers: [],
    });
    expect(gaps.some((g) => g.id === "stat-stat_families")).toBe(true);
  });

  it("flags non-numeric stat values", () => {
    const gaps = analyzeAdminContentGaps({
      settings: { stat_families: "cinco mil" },
      teamMembers: [],
    });
    expect(gaps.some((g) => g.id === "stat-invalid-stat_families")).toBe(true);
  });

  it("accepts zero as valid stat", () => {
    const gaps = analyzeAdminContentGaps({
      settings: { ...COMPLETE_SETTINGS, stat_families: "0" },
      teamMembers: [...COMPLETE_TEAM],
    });
    expect(gaps.some((g) => g.id.startsWith("stat-"))).toBe(false);
  });

  it("rejects stat with decimals", () => {
    const gaps = analyzeAdminContentGaps({
      settings: { stat_families: "5000.5" },
      teamMembers: [],
    });
    expect(gaps.some((g) => g.id === "stat-invalid-stat_families")).toBe(true);
  });
});

describe("analyzeAdminContentGaps — team edge cases", () => {
  it("ignores inactive members for section counts and member gaps", () => {
    const gaps = analyzeAdminContentGaps({
      settings: COMPLETE_SETTINGS,
      teamMembers: [
        {
          name: "Hidden Leader",
          team_section: "leadership",
          is_active: 0,
          role_title: "CEO",
        },
      ],
    });
    expect(gaps.some((g) => g.id === "team-leadership-empty")).toBe(true);
    expect(gaps.some((g) => g.id === "team-photo-Hidden Leader")).toBe(false);
  });

  it("uses legacy is_leadership when team_section missing", () => {
    const gaps = analyzeAdminContentGaps({
      settings: COMPLETE_SETTINGS,
      teamMembers: [
        {
          name: "Legacy CEO",
          is_leadership: 1,
          role_title: "CEO",
          bio_short: "Bio",
          photo_url: "/x.jpg",
          is_active: 1,
        },
        {
          name: "Legacy Staff",
          is_leadership: 0,
          role_title: "Ops",
          bio_short: "Bio",
          photo_url: "/y.jpg",
          is_active: 1,
        },
      ],
    });
    expect(gaps.some((g) => g.id === "team-leadership-empty")).toBe(false);
    expect(gaps.some((g) => g.id === "team-general-empty")).toBe(false);
    expect(gaps.some((g) => g.id === "team-technical-empty")).toBe(true);
  });

  it("flags missing photo, bio, and role per member", () => {
    const gaps = analyzeAdminContentGaps({
      settings: COMPLETE_SETTINGS,
      teamMembers: [
        {
          name: "Incomplete",
          team_section: "technical",
          is_active: 1,
        },
      ],
    });
    expect(gaps.some((g) => g.id === "team-photo-Incomplete")).toBe(true);
    expect(gaps.some((g) => g.id === "team-bio-Incomplete")).toBe(true);
    expect(gaps.some((g) => g.id === "team-role-Incomplete")).toBe(true);
  });

  it("accepts bio without bio_short", () => {
    const gaps = analyzeAdminContentGaps({
      settings: COMPLETE_SETTINGS,
      teamMembers: [
        {
          name: "Long Bio Only",
          team_section: "general",
          role_title: "Role",
          bio: "Solo bio larga",
          photo_url: "/z.jpg",
          is_active: 1,
        },
      ],
    });
    expect(gaps.some((g) => g.id === "team-bio-Long Bio Only")).toBe(false);
  });
});

describe("analyzeAdminContentGaps — complete data", () => {
  it("returns no gaps when stats, contact, and all sections are filled", () => {
    const gaps = analyzeAdminContentGaps({
      settings: COMPLETE_SETTINGS,
      teamMembers: [...COMPLETE_TEAM],
    });
    expect(gaps).toHaveLength(0);
    expect(countGapsBySeverity(gaps)).toEqual({ warn: 0, info: 0 });
  });
});

describe("countGapsBySeverity", () => {
  it("counts warn and info separately", () => {
    const gaps = analyzeAdminContentGaps({ settings: {}, teamMembers: [] });
    const counts = countGapsBySeverity(gaps);
    expect(counts.warn + counts.info).toBe(gaps.length);
    expect(counts.warn).toBeGreaterThan(0);
    expect(counts.info).toBeGreaterThan(0);
  });
});
