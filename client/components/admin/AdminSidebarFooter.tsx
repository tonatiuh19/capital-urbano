import { LogOut } from "lucide-react";
import type { AdminUser } from "@/store/slices/adminSlice";

export function AdminSidebarFooter({
  admin,
  onLogout,
}: {
  admin: AdminUser | null;
  onLogout: () => void;
}) {
  const initial = admin?.name?.trim().charAt(0).toUpperCase() ?? "A";
  const roleLabel =
    admin?.role === "superadmin"
      ? "Superadmin"
      : admin?.role === "admin"
        ? "Administrador"
        : "";

  return (
    <div className="p-4 border-t border-white/10">
      {admin && (
        <div className="flex items-center gap-3 min-w-0 mb-4">
          <div
            className="w-10 h-10 shrink-0 rounded-full bg-cu-orange/20 border border-cu-orange/30 flex items-center justify-center"
            aria-hidden
          >
            <span className="font-montserrat font-bold text-cu-orange text-sm">
              {initial}
            </span>
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-montserrat text-sm font-semibold text-white truncate">
              {admin.name}
            </p>
            {roleLabel && (
              <p className="text-[11px] text-cu-orange font-medium">{roleLabel}</p>
            )}
            <p className="text-[11px] text-white/45 truncate mt-0.5" title={admin.email}>
              {admin.email}
            </p>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={onLogout}
        className="w-full flex items-center gap-2 px-2 py-2.5 text-sm font-montserrat text-white/50 hover:text-white hover:bg-white/5 rounded-sm transition-colors"
      >
        <LogOut className="w-4 h-4 shrink-0" />
        Cerrar sesión
      </button>
    </div>
  );
}
