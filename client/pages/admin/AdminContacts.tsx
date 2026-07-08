import { Fragment, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  fetchAdminContacts,
  updateContact,
  type ContactSubmission,
} from "@/store/slices/adminContactsSlice";
import { AdminTable } from "@/components/admin/AdminTable";
import { AdminListCard } from "@/components/admin/AdminListCard";
import { AdminResponsiveList } from "@/components/admin/AdminResponsiveList";
import { AdminFormField, inputClass } from "@/components/admin/AdminFormField";

const STATUS = [
  { v: "", l: "Todos los estados" },
  { v: "new", l: "Nuevos" },
  { v: "read", l: "Leídos" },
  { v: "replied", l: "Respondidos" },
  { v: "archived", l: "Archivados" },
];

function ContactExpandedPanel({
  contact,
  notes,
  onNotesChange,
  onSaveNotes,
}: {
  contact: ContactSubmission;
  notes: string;
  onNotesChange: (value: string) => void;
  onSaveNotes: () => void;
}) {
  return (
    <div className="mt-3 pt-3 border-t border-cu-stone/15 space-y-3 bg-cu-warm-white/60 -mx-4 px-4 pb-1 sm:mx-0 sm:px-0 sm:bg-transparent">
      <AdminFormField id={`subject-${contact.id}`} label="Asunto">
        <p className="text-sm text-cu-black break-words">{contact.subject || "—"}</p>
      </AdminFormField>
      <AdminFormField id={`message-${contact.id}`} label="Mensaje">
        <p className="text-sm text-cu-concrete whitespace-pre-wrap break-words">
          {contact.message}
        </p>
      </AdminFormField>
      <AdminFormField id={`notes-${contact.id}`} label="Notas internas (CRM)">
        <textarea
          id={`notes-${contact.id}`}
          className={inputClass}
          rows={3}
          value={notes}
          onChange={(e) => onNotesChange(e.target.value)}
        />
      </AdminFormField>
      <button
        type="button"
        className="px-4 py-2.5 bg-cu-black text-white text-xs font-semibold rounded-sm min-h-[44px]"
        onClick={onSaveNotes}
      >
        Guardar notas
      </button>
    </div>
  );
}

function ContactStatusSelect({
  contact,
  saving,
  onChange,
  className = "",
}: {
  contact: ContactSubmission;
  saving: boolean;
  onChange: (status: string) => void;
  className?: string;
}) {
  return (
    <>
      <label className="sr-only" htmlFor={`status-${contact.id}`}>
        Estado del contacto
      </label>
      <select
        id={`status-${contact.id}`}
        value={contact.status}
        disabled={saving}
        onChange={(e) => onChange(e.target.value)}
        className={`text-sm border border-cu-stone/30 rounded-sm px-3 py-2 min-h-[44px] w-full bg-white ${className}`}
        aria-label={`Estado de ${contact.name}`}
      >
        {STATUS.filter((s) => s.v).map((s) => (
          <option key={s.v} value={s.v}>
            {s.l}
          </option>
        ))}
      </select>
    </>
  );
}

export default function AdminContacts() {
  const dispatch = useAppDispatch();
  const { contacts, total, loading, saving } = useAppSelector((s) => s.adminContacts);
  const [filter, setFilter] = useState("");
  const [expanded, setExpanded] = useState<number | null>(null);
  const [notes, setNotes] = useState("");

  useEffect(() => {
    dispatch(fetchAdminContacts({ status: filter }));
  }, [dispatch, filter]);

  const toggleExpanded = (c: ContactSubmission) => {
    if (expanded === c.id) {
      setExpanded(null);
      return;
    }
    setExpanded(c.id);
    setNotes(c.client_notes ?? "");
  };

  const contactTableRows = contacts.map((c) => (
    <Fragment key={c.id}>
      <tr className="border-b border-cu-stone/10 hover:bg-cu-warm-white/50">
        <td className="px-4 py-3 font-medium">{c.name}</td>
        <td className="px-4 py-3 cu-cell-email">{c.email}</td>
        <td className="px-4 py-3 text-cu-concrete">{c.development_name ?? "—"}</td>
        <td className="px-4 py-3">
          <ContactStatusSelect
            contact={c}
            saving={saving}
            onChange={(status) => dispatch(updateContact({ id: c.id, status }))}
            className="text-xs sm:text-sm py-2 sm:py-1 min-h-[44px] sm:min-h-0 max-w-[10rem]"
          />
        </td>
        <td className="px-4 py-3 text-xs text-cu-concrete">
          {new Date(c.created_at).toLocaleDateString("es-MX")}
        </td>
        <td className="px-4 py-3">
          <button
            type="button"
            className="text-xs text-cu-orange font-semibold"
            onClick={() => toggleExpanded(c)}
          >
            {expanded === c.id ? "Cerrar" : "Ver mensaje"}
          </button>
        </td>
      </tr>
      {expanded === c.id && (
        <tr>
          <td colSpan={6} className="px-4 py-4 bg-cu-warm-white">
            <ContactExpandedPanel
              contact={c}
              notes={notes}
              onNotesChange={setNotes}
              onSaveNotes={() =>
                dispatch(updateContact({ id: c.id, client_notes: notes }))
              }
            />
          </td>
        </tr>
      )}
    </Fragment>
  ));

  const contactMobileCards = contacts.map((c) => (
    <AdminListCard
      key={c.id}
      title={c.name}
      fields={[
        { label: "Correo", value: c.email },
        { label: "Proyecto", value: c.development_name ?? "—" },
        {
          label: "Estado",
          value: (
            <ContactStatusSelect
              contact={c}
              saving={saving}
              onChange={(status) => dispatch(updateContact({ id: c.id, status }))}
            />
          ),
        },
        {
          label: "Fecha",
          value: new Date(c.created_at).toLocaleDateString("es-MX", {
            day: "numeric",
            month: "short",
            year: "numeric",
          }),
        },
      ]}
      footer={
        <button
          type="button"
          className="w-full text-sm text-cu-orange font-semibold min-h-[44px] text-left"
          onClick={() => toggleExpanded(c)}
        >
          {expanded === c.id ? "Cerrar mensaje" : "Ver mensaje"}
        </button>
      }
      expanded={
        expanded === c.id ? (
          <ContactExpandedPanel
            contact={c}
            notes={notes}
            onNotesChange={setNotes}
            onSaveNotes={() =>
              dispatch(updateContact({ id: c.id, client_notes: notes }))
            }
          />
        ) : undefined
      }
    />
  ));

  return (
    <div className="cu-admin-page space-y-6 min-w-0">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-montserrat font-bold text-2xl text-cu-black">Contactos</h1>
          <p className="text-sm text-cu-concrete mt-1">
            Mensajes del formulario de contacto. {total} solicitudes en total.
          </p>
        </div>
        <AdminFormField id="contact-filter" label="Filtrar por estado" className="w-full sm:min-w-[12rem] sm:w-auto">
          <select
            id="contact-filter"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className={inputClass}
          >
            {STATUS.map((s) => (
              <option key={s.v || "all"} value={s.v}>
                {s.l}
              </option>
            ))}
          </select>
        </AdminFormField>
      </div>

      <AdminResponsiveList
        loading={loading}
        isEmpty={contacts.length === 0}
        empty="No hay contactos con este filtro."
        desktop={
          <AdminTable headers={["Nombre", "Correo", "Proyecto", "Estado", "Fecha", ""]}>
            {contactTableRows}
          </AdminTable>
        }
        mobile={contactMobileCards}
      />
    </div>
  );
}
