import { describe, expect, it } from "vitest";
import { resolveTeamSection, TEAM_SECTION_LABELS } from "./teamSection";

describe("resolveTeamSection — edge cases", () => {
  it("prefers team_section over legacy is_leadership", () => {
    expect(resolveTeamSection({ team_section: "technical", is_leadership: 1 })).toBe(
      "technical",
    );
  });

  it("treats unknown team_section as general unless is_leadership", () => {
    expect(resolveTeamSection({ team_section: "unknown", is_leadership: 0 })).toBe(
      "general",
    );
    expect(resolveTeamSection({ team_section: "unknown", is_leadership: 1 })).toBe(
      "leadership",
    );
  });

  it("handles null/undefined section", () => {
    expect(resolveTeamSection({ team_section: null })).toBe("general");
    expect(resolveTeamSection({})).toBe("general");
  });

  it("handles boolean is_leadership", () => {
    expect(resolveTeamSection({ is_leadership: true })).toBe("leadership");
    expect(resolveTeamSection({ is_leadership: false })).toBe("general");
  });

  it("exports labels for all sections", () => {
    expect(TEAM_SECTION_LABELS.leadership).toBeTruthy();
    expect(TEAM_SECTION_LABELS.technical).toBeTruthy();
    expect(TEAM_SECTION_LABELS.general).toBeTruthy();
  });
});
