/** Detect missing or incomplete CMS content for the admin dashboard. */

import { resolveTeamSection, type TeamMemberSectionInput } from "@/lib/teamSection";

export type { TeamSection } from "@shared/api";
export { resolveTeamSection } from "@/lib/teamSection";

export type GapSeverity = "warn" | "info";

export type ContentGap = {
  id: string;
  severity: GapSeverity;
  message: string;
  link: string;
  actionLabel: string;
};

export type TeamMemberGapInput = TeamMemberSectionInput & {
  name: string;
  role_title?: string | null;
  bio_short?: string | null;
  bio?: string | null;
  photo_url?: string | null;
  is_active?: number | boolean;
};

const STAT_KEYS = [
  { key: "stat_years_experience", label: "Años de experiencia" },
  { key: "stat_sqm_built", label: "m² construidos" },
  { key: "stat_families", label: "Familias" },
] as const;

export const PUBLIC_STAT_KEYS = STAT_KEYS;

function isActive(member: TeamMemberGapInput): boolean {
  return member.is_active === undefined || member.is_active === 1 || member.is_active === true;
}

export function analyzeAdminContentGaps(input: {
  settings: Record<string, string | undefined>;
  teamMembers: TeamMemberGapInput[];
  blog?: {
    published_count?: number;
    author_count?: number;
    category_count?: number;
    scheduled_count?: number;
  };
}): ContentGap[] {
  const gaps: ContentGap[] = [];
  const settings = input.settings ?? {};
  const teamMembers = Array.isArray(input.teamMembers) ? input.teamMembers : [];
  const blog = input.blog;
  const activeMembers = teamMembers.filter(isActive);

  for (const stat of STAT_KEYS) {
    const value = settings[stat.key]?.trim() ?? "";
    if (!value) {
      gaps.push({
        id: `stat-${stat.key}`,
        severity: "warn",
        message: `Falta la estadística «${stat.label}» (se muestra como — en inicio y nosotros).`,
        link: "/admin/configuracion",
        actionLabel: "Completar estadísticas",
      });
    } else if (!/^\d+$/.test(value)) {
      gaps.push({
        id: `stat-invalid-${stat.key}`,
        severity: "warn",
        message: `«${stat.label}» debe ser solo números (valor actual: «${value}»).`,
        link: "/admin/configuracion",
        actionLabel: "Corregir estadística",
      });
    }
  }

  const bySection = {
    leadership: activeMembers.filter((m) => resolveTeamSection(m) === "leadership"),
    technical: activeMembers.filter((m) => resolveTeamSection(m) === "technical"),
    general: activeMembers.filter((m) => resolveTeamSection(m) === "general"),
  };

  if (bySection.leadership.length === 0) {
    gaps.push({
      id: "team-leadership-empty",
      severity: "warn",
      message: "No hay miembros en la sección Dirección (/about).",
      link: "/admin/equipo",
      actionLabel: "Agregar dirección",
    });
  }

  if (bySection.technical.length === 0) {
    gaps.push({
      id: "team-technical-empty",
      severity: "info",
      message: "Staff técnico vacío — la sección no se mostrará en Nosotros hasta agregar miembros.",
      link: "/admin/equipo",
      actionLabel: "Agregar staff técnico",
    });
  }

  if (bySection.general.length === 0) {
    gaps.push({
      id: "team-general-empty",
      severity: "info",
      message: "Equipo multidisciplinario vacío — la sección no se mostrará en Nosotros.",
      link: "/admin/equipo",
      actionLabel: "Agregar equipo",
    });
  }

  for (const member of activeMembers) {
    const section = resolveTeamSection(member);
    const sectionLabel =
      section === "leadership"
        ? "Dirección"
        : section === "technical"
          ? "Staff técnico"
          : "Equipo";

    if (!member.photo_url?.trim()) {
      gaps.push({
        id: `team-photo-${member.name}`,
        severity: "info",
        message: `${member.name} (${sectionLabel}) no tiene foto — se mostrarán iniciales.`,
        link: "/admin/equipo",
        actionLabel: "Subir foto",
      });
    }

    if (!member.bio_short?.trim() && !member.bio?.trim()) {
      gaps.push({
        id: `team-bio-${member.name}`,
        severity: "info",
        message: `${member.name} no tiene biografía — la tarjeta quedará sin descripción.`,
        link: "/admin/equipo",
        actionLabel: "Agregar bio",
      });
    }

    if (!member.role_title?.trim()) {
      gaps.push({
        id: `team-role-${member.name}`,
        severity: "info",
        message: `${member.name} no tiene cargo definido.`,
        link: "/admin/equipo",
        actionLabel: "Agregar cargo",
      });
    }
  }

  if (!settings.contact_address?.trim()) {
    gaps.push({
      id: "contact-address",
      severity: "warn",
      message: "Falta la dirección de oficina en Contacto.",
      link: "/admin/configuracion",
      actionLabel: "Agregar dirección",
    });
  }

  if (blog) {
    const authors = blog.author_count ?? 0;
    const categories = blog.category_count ?? 0;
    const published = blog.published_count ?? 0;

    if (authors === 0) {
      gaps.push({
        id: "blog-authors-empty",
        severity: "warn",
        message: "El blog no tiene autores activos — no podrás firmar artículos.",
        link: "/admin/blog/autores",
        actionLabel: "Crear autor",
      });
    }
    if (categories === 0) {
      gaps.push({
        id: "blog-categories-empty",
        severity: "warn",
        message: "El blog no tiene categorías — organiza el contenido antes de publicar.",
        link: "/admin/blog/categorias",
        actionLabel: "Crear categoría",
      });
    }
    if (published === 0) {
      gaps.push({
        id: "blog-posts-empty",
        severity: "info",
        message: "Aún no hay artículos publicados en /blog.",
        link: "/admin/blog",
        actionLabel: "Escribir artículo",
      });
    }
  }

  return gaps;
}

export function countGapsBySeverity(gaps: ContentGap[]): { warn: number; info: number } {
  return gaps.reduce(
    (acc, gap) => {
      acc[gap.severity] += 1;
      return acc;
    },
    { warn: 0, info: 0 },
  );
}
