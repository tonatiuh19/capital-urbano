import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAppSelector } from "@/store/hooks";
import adminAxios from "@/store/axiosAdmin";

interface DashData {
  stats: Record<string, number>;
  recent_contacts: { id: number; name: string; email: string; subject?: string; status: string; created_at: string }[];
}

export default function AdminDashboard() {
  const { admin } = useAppSelector((s) => s.admin);
  const [data, setData] = useState<DashData | null>(null);

  useEffect(() => {
    adminAxios.get("/api/admin/dashboard.php").then((res) => setData(res.data));
  }, []);

  const s = data?.stats;

  return (
    <div className="cu-admin-page">
      <h1 className="font-montserrat text-xl sm:text-2xl font-semibold text-cu-black mb-2 break-words">
        Hola, {admin?.name}
      </h1>
      <p className="text-cu-concrete text-sm mb-8">Resumen del sitio corporativo</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
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

      <h2 className="font-montserrat font-semibold text-lg mb-4">Contactos recientes</h2>
      <ul className="bg-white border border-cu-stone/30 rounded-sm divide-y">
        {(data?.recent_contacts ?? []).map((c) => (
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
        ))}
      </ul>
    </div>
  );
}
