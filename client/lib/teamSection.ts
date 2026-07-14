import type { TeamSection } from "@shared/api";

export type TeamMemberSectionInput = {
  team_section?: TeamSection | string | null;
  is_leadership?: number | boolean;
};

export function resolveTeamSection(member: TeamMemberSectionInput): TeamSection {
  const section = member.team_section;
  if (section === "leadership" || section === "technical" || section === "general") {
    return section;
  }
  return member.is_leadership === 1 || member.is_leadership === true
    ? "leadership"
    : "general";
}

export const TEAM_SECTION_LABELS: Record<TeamSection, string> = {
  leadership: "Dirección",
  technical: "Staff técnico",
  general: "Equipo multidisciplinario",
};
