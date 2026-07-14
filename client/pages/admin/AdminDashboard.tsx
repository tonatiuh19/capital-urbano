import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useAppSelector } from "@/store/hooks";
import adminAxios from "@/store/axiosAdmin";
import { analyzeAdminContentGaps, countGapsBySeverity } from "@/lib/adminContentGaps";
import { AlertTriangle, CheckCircle2, Info } from "lucide-react";

interface DashData {
  stats: Record<string, number>;
  recent_contacts: {
    id: number;
    name: string;
    email: string;
    subject?: string;
    status: string;
    created_at: string;
  }[];
}

type GapPayload = {
  settings: Record<string, string>;
  team_members: Parameters<typeof analyzeAdminContentGaps>[0]["teamMembers"];
};

export default function AdminDashboard() {
  const { admin } = useAppSelector((s) => s.admin);
  const [data, setData] = useState<DashData | null>(null);
  const [gapPayload, setGapPayload] = useState<GapPayload | null>(null);

  useEffect(() => {
    adminAxios.get("/api/admin/dashboard.php").then((res) => setData(res.data));
    adminAxios
      .get("/api/admin/content-gaps.php")
      .then((res) => setGapPayload(res.data))
      .catch(() => setGapPayload(null));
  }, []);

  const gaps = useMemo(
    () =>
      gapPayload
        ? analyzeAdminContentGaps({
            settings: gapPayload.settings,
            teamMembers: gapPayload.team_members,
          })
        : [],
    [gapPayload],
  );
  const gapCounts = countGapsBySeverity(gaps);
  const s = data?.stats;

  return (
    <div className="cu-admin-page space-y-10">
      <div>
        <h1 className="font-montserrat text-xl sm:text-2xl font-semibold text-cu-black mb-2 break-words">
          Hola, {admin?.name}
        </h1>
        <p className="text-cu-concrete text-sm">Resumen del sitio corporativo</p>
      </div>

      <section aria-labelledby="content-gaps-heading">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <h2 id="content-gaps-heading" className="font-montserrat font-semibold text-lg">
            Contenido pendiente
          </h2>
          {gaps.length === 0 ? (
            <span className="inline-flex items-center gap-1.5 text-sm text-green-700">
              <CheckCircle2 size={16} /> Todo listo para publicar
            </span>
          ) : (
            <span className="text-xs text-cu-concrete">
              {gapCounts.warn > 0 && `${gapCounts.warn} importante${gapCounts.warn > 1 ? "s" : ""}`}
              {gapCounts.warn > 0 && gapCounts.info > 0 && " · "}
              {gapCounts.info > 0 && `${gapCounts.info} sugerencia${gapCounts.info > 1 ? "s" : ""}`}
            </span>
          )}
        </div>

        {gaps.length === 0 ? (
          <p className="text-sm text-cu-concrete bg-green-50 border border-green-200 rounded-sm px-4 py-3">
            Estadísticas, equipo y contacto tienen la información mínima. Revisa periódicamente en{" "}
            <Link to="/admin/configuracion" className="text-cu-orange font-semibold hover:underline">
              Configuración
            </Link>{" "}
            y{" "}
            <Link to="/admin/equipo" className="text-cu-orange font-semibold hover:underline">
              Equipo
            </Link>
            .
          </p>
        ) : (
          <ul className="bg-white border border-cu-stone/30 rounded-sm divide-y max-h-[28rem] overflow-y-auto">
            {gaps.map((gap) => (
              <li key={gap.id} className="px-4 py-3 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                <div className="flex items-start gap-2 min-w-0 flex-1">
                  {gap.severity === "warn" ? (
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  ) : (
                    <Info className="w-4 h-4 text-cu-concrete shrink-0 mt-0.5" />
                  )}
                  <p className="text-sm text-cu-black leading-relaxed">{gap.message}</p>
                </div>
                <Link
                  to={gap.link}
                  className="shrink-0 text-xs font-semibold text-cu-orange hover:underline"
                >
                  {gap.actionLabel}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          { label: "Proyectos activos", value: s?.developments_active, link: "/admin/proyectos" },
          { label: "Contactos nuevos", value: s?.contacts_new, link: "/admin/contactos" },
          { label: "Total contactos", value: s?.contacts_total, link: "/admin/contactos" },
          { label: "Clientes CRM", value: s?.clients_total, link: "/admin/clientes" },
          { label: "Newsletter", value: s?.newsletter_active, link: "/admin/newsletter" },
          { label: "FAQ activas", value: s?.faq_active, link: "/admin/faq" },
        ].map((card) => (
          <Link
            key={card.label}
            to={card.link}
            className="bg-white border border-cu-stone/30 p-6 rounded-sm hover:border-cu-orange/50 transition-colors"
          >
            <p className="text-xs text-cu-concrete uppercase tracking-wider">{card.label}</p>
            <p className="text-3xl font-montserrat font-bold mt-2">{card.value ?? "—"}</p>
          </Link>
        ))}
      </div>

      <div>
        <h2 className="font-montserrat font-semibold text-lg mb-4">Contactos recientes</h2>
        <ul className="bg-white border border-cu-stone/30 rounded-sm divide-y">
          {(data?.recent_contacts ?? []).length === 0 ? (
            <li className="px-4 py-6 text-sm text-cu-concrete text-center">Sin contactos aún.</li>
          ) : (
            data!.recent_contacts.map((c) => (
              <li
                key={c.id}
                className="px-4 py-3 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 text-sm min-w-0"
              >
                <span className="min-w-0 break-words">
                  <strong>{c.name}</strong>
                  <span className="text-cu-concrete"> — {c.email}</span>
                </span>
                <span className="text-cu-concrete shrink-0">{c.status}</span>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}
