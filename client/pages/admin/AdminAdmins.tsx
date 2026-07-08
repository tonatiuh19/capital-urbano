import { useEffect, useState } from "react";
import { Plus, Pencil, UserX, X } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  fetchAdmins,
  createAdmin,
  updateAdmin,
  deactivateAdmin,
  clearAdminAdminsError,
  type AdminMember,
} from "@/store/slices/adminAdminsSlice";
import { AdminTable } from "@/components/admin/AdminTable";
import { AdminListCard } from "@/components/admin/AdminListCard";
import { AdminResponsiveList } from "@/components/admin/AdminResponsiveList";
import { AdminFormField, inputClass } from "@/components/admin/AdminFormField";

const emptyForm = {
  name: "",
  email: "",
  role: "admin" as "admin" | "superadmin",
  is_active: true,
};

function AdminRowActions({
  admin,
  currentAdminId,
  onEdit,
  onDeactivate,
  mobile = false,
}: {
  admin: AdminMember;
  currentAdminId?: number;
  onEdit: () => void;
  onDeactivate: () => void;
  mobile?: boolean;
}) {
  const canDeactivate = admin.id !== currentAdminId && admin.is_active;

  if (mobile) {
    return (
      <div className="flex gap-2 w-full">
        <button
          type="button"
          onClick={onEdit}
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-sm font-semibold text-cu-black bg-cu-warm-white rounded-sm min-h-[44px]"
        >
          <Pencil size={16} />
          Editar
        </button>
        {canDeactivate && (
          <button
            type="button"
            onClick={onDeactivate}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-sm font-semibold text-red-600 bg-red-50 rounded-sm min-h-[44px]"
          >
            <UserX size={16} />
            Desactivar
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="flex gap-2">
      <button type="button" onClick={onEdit} className="text-cu-orange" aria-label="Editar">
        <Pencil size={16} />
      </button>
      {canDeactivate && (
        <button
          type="button"
          onClick={onDeactivate}
          className="text-red-600"
          aria-label="Desactivar"
        >
          <UserX size={16} />
        </button>
      )}
    </div>
  );
}

export default function AdminAdmins() {
  const dispatch = useAppDispatch();
  const { admins, loading, saving } = useAppSelector((s) => s.adminAdmins);
  const currentAdmin = useAppSelector((s) => s.admin.admin);

  const [open, setOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<AdminMember | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchAdmins());
  }, [dispatch]);

  const openCreate = () => {
    setSaveError(null);
    setEditTarget(null);
    setForm(emptyForm);
    setOpen(true);
  };

  const openEdit = (a: AdminMember) => {
    setSaveError(null);
    setEditTarget(a);
    setForm({
      name: a.name,
      email: a.email,
      role: a.role,
      is_active: !!a.is_active,
    });
    setOpen(true);
  };

  const handleDeactivate = (a: AdminMember) => {
    if (confirm(`¿Desactivar a ${a.name}?`)) {
      dispatch(deactivateAdmin(a.id));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveError(null);
    dispatch(clearAdminAdminsError());
    const result = editTarget
      ? await dispatch(
          updateAdmin({
            id: editTarget.id,
            name: form.name,
            role: form.role,
            is_active: form.is_active ? 1 : 0,
          }),
        )
      : await dispatch(
          createAdmin({
            name: form.name,
            email: form.email.trim().toLowerCase(),
            role: form.role,
          }),
        );
    if (createAdmin.fulfilled.match(result) || updateAdmin.fulfilled.match(result)) {
      setOpen(false);
    } else {
      setSaveError((result.payload as string) ?? "No se pudo guardar");
    }
  };

  const tableRows = admins.map((a) => (
    <tr key={a.id} className={`border-b ${!a.is_active ? "opacity-50" : ""}`}>
      <td className="px-4 py-3 font-medium">
        {a.name}
        {a.id === currentAdmin?.id && (
          <span className="text-xs text-cu-orange ml-2">(tú)</span>
        )}
      </td>
      <td className="px-4 py-3 cu-cell-email">{a.email}</td>
      <td className="px-4 py-3 text-sm">{a.role}</td>
      <td className="px-4 py-3 text-sm">{a.is_active ? "Sí" : "No"}</td>
      <td className="px-4 py-3">
        <AdminRowActions
          admin={a}
          currentAdminId={currentAdmin?.id}
          onEdit={() => openEdit(a)}
          onDeactivate={() => handleDeactivate(a)}
        />
      </td>
    </tr>
  ));

  const mobileCards = admins.map((a) => (
    <AdminListCard
      key={a.id}
      title={a.name}
      titleExtra={
        a.id === currentAdmin?.id ? (
          <span className="text-xs text-cu-orange font-semibold shrink-0">(tú)</span>
        ) : undefined
      }
      inactive={!a.is_active}
      fields={[
        { label: "Correo", value: a.email },
        { label: "Rol", value: a.role },
        { label: "Activo", value: a.is_active ? "Sí" : "No" },
      ]}
      footer={
        <AdminRowActions
          admin={a}
          currentAdminId={currentAdmin?.id}
          onEdit={() => openEdit(a)}
          onDeactivate={() => handleDeactivate(a)}
          mobile
        />
      }
    />
  ));

  return (
    <div className="cu-admin-page space-y-6 min-w-0">
      <div className="flex flex-wrap justify-between items-start gap-4">
        <div className="min-w-0">
          <h1 className="font-montserrat font-bold text-2xl text-cu-black">
            Administradores
          </h1>
          <p className="text-sm text-cu-concrete">
            Acceso con código OTP. Al crear un usuario se envía un correo de bienvenida en español.
          </p>
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-cu-orange text-white text-sm font-semibold rounded-sm min-h-[44px] w-full sm:w-auto"
        >
          <Plus size={16} /> Nuevo admin
        </button>
      </div>

      <AdminResponsiveList
        loading={loading}
        isEmpty={admins.length === 0}
        empty="No hay administradores registrados."
        desktop={
          <AdminTable headers={["Nombre", "Correo", "Rol", "Activo", ""]}>
            {tableRows}
          </AdminTable>
        }
        mobile={mobileCards}
      />

      {open && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-end sm:items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-t-lg sm:rounded-sm w-full max-w-md border border-cu-stone/30 max-h-[90dvh] overflow-y-auto">
            <div className="flex justify-between items-center px-6 py-4 border-b">
              <h3 className="font-montserrat font-semibold">
                {editTarget ? "Editar administrador" : "Nuevo administrador"}
              </h3>
              <button type="button" onClick={() => setOpen(false)} aria-label="Cerrar">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <AdminFormField id="admin-name" label="Nombre completo" required>
                <input
                  id="admin-name"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className={inputClass}
                />
              </AdminFormField>

              {!editTarget && (
                <AdminFormField
                  id="admin-email"
                  label="Correo electrónico"
                  hint="Recibirá el código OTP en este correo."
                  required
                >
                  <input
                    id="admin-email"
                    required
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className={inputClass}
                  />
                </AdminFormField>
              )}

              <AdminFormField id="admin-role" label="Rol en el panel">
                <select
                  id="admin-role"
                  value={form.role}
                  onChange={(e) =>
                    setForm({ ...form, role: e.target.value as "admin" | "superadmin" })
                  }
                  className={inputClass}
                >
                  <option value="admin">Administrador</option>
                  <option value="superadmin">Superadmin</option>
                </select>
              </AdminFormField>

              {editTarget && editTarget.id !== currentAdmin?.id && (
                <label className="flex items-center gap-2 text-sm font-montserrat cursor-pointer min-h-[44px]">
                  <input
                    type="checkbox"
                    checked={form.is_active}
                    onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                    className="accent-cu-orange"
                  />
                  Cuenta activa
                </label>
              )}

              {saveError && (
                <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-sm border border-red-200">
                  {saveError}
                </p>
              )}

              <div className="flex flex-col sm:flex-row gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="flex-1 border border-cu-stone/30 py-2.5 text-sm rounded-sm min-h-[44px]"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 bg-cu-black text-white py-2.5 text-sm rounded-sm disabled:opacity-50 min-h-[44px]"
                >
                  {saving ? "Guardando…" : "Guardar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
