import { inputClass } from "@/components/admin/AdminFormField";
import { useBlogFeatureEnabled } from "@/lib/featureFlags";

export type CtaProjectOption = {
  id: number;
  name: string;
  slug: string;
  is_active?: number | boolean;
};

const SITE_PAGES_BASE: { href: string; label: string }[] = [
  { href: "/contact", label: "Contacto" },
  { href: "/projects", label: "Proyectos (listado)" },
  { href: "/about", label: "Nosotros" },
  { href: "/experience", label: "Experiencia" },
  { href: "/blog", label: "Blog" },
];

const CUSTOM = "__custom__";
const EMPTY = "";

function projectHref(slug: string): string {
  return `/projects/${slug}`;
}

type AdminCtaHrefFieldProps = {
  value: string;
  onChange: (href: string) => void;
  projects: CtaProjectOption[];
};

export function AdminCtaHrefField({
  value,
  onChange,
  projects,
}: AdminCtaHrefFieldProps) {
  const { enabled: blogEnabled } = useBlogFeatureEnabled();
  const SITE_PAGES = SITE_PAGES_BASE.filter(
    (p) => p.href !== "/blog" || blogEnabled,
  );
  const href = value.trim();
  const activeProjects = projects
    .filter((p) => p.slug && (p.is_active === undefined || Number(p.is_active) !== 0))
    .slice()
    .sort((a, b) => a.name.localeCompare(b.name, "es"));

  const knownHrefs = new Set([
    ...SITE_PAGES.map((p) => p.href),
    ...activeProjects.map((p) => projectHref(p.slug)),
  ]);

  const isCustom = href !== "" && !knownHrefs.has(href);
  const selectValue = href === "" ? EMPTY : isCustom ? CUSTOM : href;

  return (
    <div className="space-y-2 min-w-0">
      <label className="block text-sm font-montserrat font-medium text-cu-black">
        Destino del botón
      </label>
      <select
        className={inputClass}
        value={selectValue}
        onChange={(e) => {
          const next = e.target.value;
          if (next === EMPTY) {
            onChange("");
            return;
          }
          if (next === CUSTOM) {
            onChange(href && !knownHrefs.has(href) ? href : "https://");
            return;
          }
          onChange(next);
        }}
      >
        <option value={EMPTY}>Contacto (por defecto)</option>
        <optgroup label="Páginas del sitio">
          {SITE_PAGES.map((p) => (
            <option key={p.href} value={p.href}>
              {p.label}
            </option>
          ))}
        </optgroup>
        {activeProjects.length > 0 && (
          <optgroup label="Proyectos">
            {activeProjects.map((p) => (
              <option key={p.id} value={projectHref(p.slug)}>
                {p.name}
              </option>
            ))}
          </optgroup>
        )}
        <option value={CUSTOM}>Otro enlace…</option>
      </select>

      {selectValue === CUSTOM && (
        <input
          className={inputClass}
          placeholder="https://… o /ruta-interna"
          value={href}
          onChange={(e) => onChange(e.target.value)}
        />
      )}

      <p className="text-[11px] text-cu-concrete font-josefin leading-relaxed">
        Elige una página del sitio, un proyecto publicado, o “Otro enlace” para
        una URL externa. Vacío = Contacto.
      </p>
    </div>
  );
}
