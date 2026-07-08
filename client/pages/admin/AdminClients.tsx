import { useEffect, useState } from "react";
import adminAxios from "@/store/axiosAdmin";
import { getAdminApiError } from "@/lib/adminApi";
import { AdminTable } from "@/components/admin/AdminTable";
import { AdminListCard } from "@/components/admin/AdminListCard";
import { AdminResponsiveList } from "@/components/admin/AdminResponsiveList";
import { AdminFormField, inputClass } from "@/components/admin/AdminFormField";

interface Client {
  id: number;
  name: string;
  email: string;
  phone?: string;
  interest: string;
  development_name?: string;
  newsletter_opt_in: number;
  last_contact_at?: string;
}

export default function AdminClients() {
  const [clients, setClients] = useState<Client[]>([]);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Client | null>(null);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  const load = () => {
    setLoading(true);
    const q = search ? `?search=${encodeURIComponent(search)}` : "";
    adminAxios
      .get(`/api/admin/clients.php${q}`)
      .then((res) => setClients(res.data.clients))
      .catch((err) =>
        setMessage({ type: "err", text: getAdminApiError(err, "Error al cargar") }),
      )
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const openClient = (id: number) => {
    adminAxios
      .get(`/api/admin/clients.php?id=${id}`)
      .then((res) => {
        setSelected(res.data.client);
        setNotes(res.data.client.admin_notes ?? "");
        setMessage(null);
      })
      .catch((err) =>
        setMessage({ type: "err", text: getAdminApiError(err, "Error al abrir cliente") }),
      );
  };

  const saveNotes = () => {
    if (!selected) return;
    adminAxios
      .put("/api/admin/clients.php", { id: selected.id, admin_notes: notes })
      .then(() => {
        setMessage({ type: "ok", text: "Notas guardadas." });
        load();
      })
      .catch((err) =>
        setMessage({ type: "err", text: getAdminApiError(err, "Error al guardar notas") }),
      );
  };

  const clientTableRows = clients.map((c) => (
    <tr key={c.id} className="border-b border-cu-stone/10">
      <td className="px-4 py-3">{c.name}</td>
      <td className="px-4 py-3 cu-cell-email">{c.email}</td>
      <td className="px-4 py-3">{c.interest}</td>
      <td className="px-4 py-3">{c.development_name ?? "—"}</td>
      <td className="px-4 py-3">
        <button
          type="button"
          className="text-cu-orange text-xs font-semibold"
          onClick={() => openClient(c.id)}
        >
          Ver detalle
        </button>
      </td>
    </tr>
  ));

  const clientMobileCards = clients.map((c) => (
    <AdminListCard
      key={c.id}
      title={c.name}
      fields={[
        { label: "Correo", value: c.email },
        { label: "Interés", value: c.interest },
        { label: "Proyecto", value: c.development_name ?? "—" },
      ]}
      footer={
        <button
          type="button"
          className="w-full py-2.5 text-sm font-semibold text-cu-orange min-h-[44px] text-left"
          onClick={() => openClient(c.id)}
        >
          Ver detalle
        </button>
      }
    />
  ));

  return (
    <div className="cu-admin-page space-y-6 min-w-0">
      <div>
        <h1 className="font-montserrat font-bold text-2xl text-cu-black">Clientes</h1>
        <p className="text-sm text-cu-concrete mt-1">
          CRM de contactos con interés en proyectos. Solo lectura excepto notas internas.
        </p>
      </div>

      {message && (
        <p
          className={`text-sm px-4 py-2 rounded-sm border ${
            message.type === "ok"
              ? "text-green-800 bg-green-50 border-green-200"
              : "text-red-700 bg-red-50 border-red-200"
          }`}
        >
          {message.text}
        </p>
      )}

      <div className="flex flex-col sm:flex-row gap-2 max-w-xl min-w-0">
        <AdminFormField
          id="client-search"
          label="Buscar cliente"
          hint="Nombre, correo o teléfono. Presiona Enter o clic en Buscar."
          className="flex-1 min-w-0"
        >
          <input
            id="client-search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && load()}
            className={inputClass}
            placeholder="Ej. María o @correo.com"
          />
        </AdminFormField>
        <button
          type="button"
          onClick={load}
          className="sm:self-end px-4 py-2.5 bg-cu-black text-white text-sm font-semibold rounded-sm shrink-0 min-h-[44px]"
        >
          Buscar
        </button>
      </div>

      <AdminResponsiveList
        loading={loading}
        isEmpty={clients.length === 0}
        empty="No se encontraron clientes."
        desktop={
          <AdminTable headers={["Nombre", "Correo", "Interés", "Proyecto", ""]}>
            {clientTableRows}
          </AdminTable>
        }
        mobile={clientMobileCards}
      />

      {selected && (
        <div className="bg-white border border-cu-stone/30 p-4 sm:p-6 rounded-sm max-w-lg shadow-sm space-y-4 min-w-0">
          <h3 className="font-montserrat font-bold text-lg text-cu-black break-words">
            {selected.name}
          </h3>
          <dl className="text-sm space-y-2 text-cu-concrete">
            <div className="min-w-0">
              <dt className="font-semibold text-cu-black">Correo</dt>
              <dd className="break-words">{selected.email}</dd>
            </div>
            {selected.phone && (
              <div>
                <dt className="font-semibold text-cu-black">Teléfono</dt>
                <dd>{selected.phone}</dd>
              </div>
            )}
            <div>
              <dt className="font-semibold text-cu-black">Interés</dt>
              <dd>{selected.interest}</dd>
            </div>
            {selected.development_name && (
              <div>
                <dt className="font-semibold text-cu-black">Proyecto</dt>
                <dd>{selected.development_name}</dd>
              </div>
            )}
          </dl>
          <AdminFormField
            id="client-notes"
            label="Notas internas (CRM)"
            hint="Solo visible en el panel admin."
          >
            <textarea
              id="client-notes"
              className={inputClass}
              rows={4}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </AdminFormField>
          <button
            type="button"
            onClick={saveNotes}
            className="w-full sm:w-auto px-4 py-2.5 bg-cu-orange text-white text-sm font-semibold rounded-sm min-h-[44px]"
          >
            Guardar notas
          </button>
        </div>
      )}
    </div>
  );
}
