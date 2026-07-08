import { useEffect, useState } from "react";
import adminAxios from "@/store/axiosAdmin";
import { getAdminApiError } from "@/lib/adminApi";
import { AdminTable } from "@/components/admin/AdminTable";
import { AdminListCard } from "@/components/admin/AdminListCard";
import { AdminResponsiveList } from "@/components/admin/AdminResponsiveList";

export default function AdminNewsletter() {
  const [rows, setRows] = useState<
    { email: string; status: string; source: string; subscribed_at: string }[]
  >([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    adminAxios
      .get("/api/admin/newsletter.php")
      .then((res) => {
        setRows(res.data.subscribers ?? []);
        setTotal(res.data.total ?? 0);
      })
      .catch((err) => setError(getAdminApiError(err, "Error al cargar")))
      .finally(() => setLoading(false));
  }, []);

  const tableRows = rows.map((r) => (
    <tr key={r.email} className="border-b border-cu-stone/10">
      <td className="px-4 py-3 cu-cell-email">{r.email}</td>
      <td className="px-4 py-3">{r.status}</td>
      <td className="px-4 py-3">{r.source}</td>
      <td className="px-4 py-3 text-xs">
        {new Date(r.subscribed_at).toLocaleDateString("es-MX")}
      </td>
    </tr>
  ));

  const mobileCards = rows.map((r) => (
    <AdminListCard
      key={r.email}
      title={r.email}
      fields={[
        { label: "Estado", value: r.status },
        { label: "Origen", value: r.source },
        {
          label: "Fecha",
          value: new Date(r.subscribed_at).toLocaleDateString("es-MX", {
            day: "numeric",
            month: "short",
            year: "numeric",
          }),
        },
      ]}
    />
  ));

  return (
    <div className="cu-admin-page space-y-6 min-w-0">
      <h1 className="font-montserrat font-bold text-2xl text-cu-black">Newsletter</h1>
      <p className="text-sm text-cu-concrete">{total} suscriptores (solo lectura)</p>
      {error && (
        <p className="text-sm text-red-700 bg-red-50 border border-red-200 px-4 py-2 rounded-sm">
          {error}
        </p>
      )}
      <AdminResponsiveList
        loading={loading}
        isEmpty={rows.length === 0}
        empty="No hay suscriptores registrados."
        desktop={
          <AdminTable headers={["Correo", "Estado", "Origen", "Fecha"]}>
            {tableRows}
          </AdminTable>
        }
        mobile={mobileCards}
      />
    </div>
  );
}
