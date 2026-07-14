import {
  MessageCircle,
  FileCheck,
  KeyRound,
  Headphones,
  type LucideIcon,
} from "lucide-react";

export type ExperienceJourneyStep = {
  icon: string;
  title: string;
  description: string;
};

const iconMap: Record<string, LucideIcon> = {
  "message-circle": MessageCircle,
  "file-check": FileCheck,
  "key-round": KeyRound,
  headphones: Headphones,
};

export const DEFAULT_EXPERIENCE_JOURNEY: ExperienceJourneyStep[] = [
  {
    icon: "message-circle",
    title: "Asesoría inicial",
    description:
      "Entendemos tu perfil, respondemos dudas y te orientamos sobre el desarrollo que mejor se adapta a ti.",
  },
  {
    icon: "file-check",
    title: "Reserva y documentación",
    description:
      "Contrato supervisado por PROFECO y reportes mensuales de avance durante la construcción.",
  },
  {
    icon: "key-round",
    title: "Entrega",
    description:
      "Recorrido de entrega de tu unidad con protocolos de revisión de la calidad de tus acabados y entrega de llaves.",
  },
  {
    icon: "headphones",
    title: "Postventa",
    description:
      "Canal dedicado para garantías, dudas y soporte después de la escrituración.",
  },
];

export const DEFAULT_EXPERIENCE_OWNERS_INTEGRATION =
  "Integramos a los propietarios desde el día 1 del inicio de operación del edificio, en comisiones de inspección y vigilancia para que se vigile el correcto gasto de los recursos.";

export function journeyStepIcon(name: string | null | undefined): LucideIcon {
  if (!name) return MessageCircle;
  return iconMap[name.toLowerCase()] ?? MessageCircle;
}

export function parseExperienceJourneySteps(
  raw: string | number | boolean | undefined,
): ExperienceJourneyStep[] {
  if (typeof raw !== "string" || !raw.trim()) {
    return DEFAULT_EXPERIENCE_JOURNEY;
  }
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return DEFAULT_EXPERIENCE_JOURNEY;
    const steps = parsed
      .filter(
        (item): item is ExperienceJourneyStep =>
          item !== null &&
          typeof item === "object" &&
          typeof (item as ExperienceJourneyStep).title === "string" &&
          typeof (item as ExperienceJourneyStep).description === "string",
      )
      .map((item) => ({
        icon: typeof item.icon === "string" ? item.icon : "message-circle",
        title: item.title.trim(),
        description: item.description.trim(),
      }))
      .filter((s) => s.title && s.description);
    return steps.length > 0 ? steps : DEFAULT_EXPERIENCE_JOURNEY;
  } catch {
    return DEFAULT_EXPERIENCE_JOURNEY;
  }
}
