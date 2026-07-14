/** Content from «Experiencia del desarrollador Capital Urbano» (2025-11-26). */

export const DEVELOPER_EXPERIENCE_INTRO =
  "Fundada en 2021, con la trayectoria de Gilberto Cordero Estrada al frente: 27 años, cerca de 1M m² construidos y método probado en Guadalajara.";

export const DEVELOPER_LEADER = {
  name: "Gilberto Cordero Estrada",
  role: "Socio fundador y CEO",
} as const;

export const DEVELOPER_STATS = [
  { key: "years", value: "27+", label: "Años de experiencia" },
  { key: "built", value: "1M+", label: "m² construidos" },
  { key: "gdl", value: "500K", label: "m² desarrollados en GDL (15 años)" },
  { key: "founded", value: "2021", label: "Fundación Capital Urbano" },
] as const;

export const DEVELOPER_CREDENTIALS = [
  "Ing. Civil — Universidad de Guadalajara",
  "Maestría en valuación inmobiliaria — UNIVA",
  "Posgrado en finanzas — Universidad Panamericana",
] as const;

export const DEVELOPER_COMPANIES = ["Rocher Holdings", "Gerbera Capital"] as const;

export const DEVELOPER_ZONES = ["Punto Sao Paulo", "San Javier", "Andares", "Providencia", "Country"] as const;

export const DEVELOPER_PORTFOLIO = [
  "Moralta",
  "Corporativo Vista Acueducto",
  "Torres Myth del Country",
  "Vista Magna",
  "Fraccionamiento Villa Colomos",
  "Citela",
  "Vista Lomas (etapas 1–5)",
  "Neruda Providencia",
  "Entorno México",
] as const;

export const DEVELOPER_PORTFOLIO_DETAIL =
  "En los últimos 15 años desarrolló 500,000 m² en Guadalajara como director de proyectos y encargado de desarrollo de producto para Rocher Holdings y Gerbera Capital, en desarrollos verticales premium y mixtos con oficinas triple A y áreas comerciales en zonas icónicas de la ciudad.";

export const DEVELOPER_METHOD_ITEMS = [
  {
    key: "quality",
    icon: "shield-check",
    title: "Calidad y alianzas",
    summary:
      "Protocolos de inspección por fase y alianzas con marcas que garantizan durabilidad, refacciones y posventa.",
    detail:
      "Como encargado de desarrollo de producto, estableció protocolos de inspección y pruebas por fase, alianzas con marcas que garantizan calidad exhaustiva, refacciones y posventa robusta — entre ellas Urrea, Rinnai, Rehau, Pegaduro, Arauco y Vitromex.",
  },
  {
    key: "postventa",
    icon: "headphones",
    title: "Posventa y operación",
    summary:
      "Tickets en Procore, conservación anual, rendición de cuentas mensual y KPIs del administrador.",
    detail:
      "En posventa implementó gestión de tickets en Procore, programas de conservación, rendición de cuentas mensual y evaluación de desempeño del administrador con KPIs.",
  },
  {
    key: "ingenieria",
    icon: "layers",
    title: "Ingeniería y legal",
    summary:
      "Diseño, licencias, régimen de condominio y memorias técnicas para contratos y operación.",
    detail:
      "Coordinó diseño e ingenierías, licencias, régimen de condominio y memorias técnicas para contratos y operación de cada desarrollo.",
  },
] as const;

export const DEVELOPER_MISSION_PILLARS = [
  {
    key: "alianzas",
    icon: "handshake",
    title: "Alianzas de largo plazo",
    description:
      "Marcas con materiales durables, control de calidad, refacciones y excelente soporte posventa.",
  },
  {
    key: "bim",
    icon: "boxes",
    title: "Metodología BIM",
    description:
      "Ingenierías y planos predictivos y preventivos ante fallas en obra.",
  },
  {
    key: "inspeccion",
    icon: "clipboard-check",
    title: "Control verificable",
    description:
      "Inspectores externos y protocolos con evidencia fotográfica en cada etapa crítica.",
  },
  {
    key: "digital",
    icon: "cpu",
    title: "Procesos digitales",
    description:
      "Automatización con programas, aplicaciones y herramientas para cada fase.",
  },
] as const;

export const DEVELOPER_VISION =
  "Ser referencia en desarrollos intraurbanos de vivienda media plus, con el volumen de proyectos que podamos controlar — sin sacrificar la experiencia del cliente ni la calidad del producto.";

/** Landmark brands cited in developer credentials. */
export const DEVELOPER_BRAND_ALLIANCES = [
  "Urrea",
  "Rinnai",
  "Rehau",
  "Pegaduro",
  "Arauco",
  "Vitromex",
] as const;

/** @deprecated Panels kept for reference — UI uses structured data above. */
export type DeveloperExperiencePanel = {
  key: string;
  title: string;
  paragraphs: readonly string[];
  bullets?: readonly string[];
  bulletsLabel?: string;
};

export const DEVELOPER_EXPERIENCE_PANELS: readonly DeveloperExperiencePanel[] = [];
