import { useEffect, useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { logoutAdmin, type AdminUser } from "@/store/slices/adminSlice";
import { AdminSidebarHeader } from "@/components/admin/AdminSidebarHeader";
import { AdminSidebarFooter } from "@/components/admin/AdminSidebarFooter";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { AdminMeta } from "@/components/seo/AdminMeta";

const nav = [
  { to: "/admin/dashboard", label: "Dashboard" },
  { to: "/admin/proyectos", label: "Proyectos" },
  { to: "/admin/contactos", label: "Contactos" },
  { to: "/admin/clientes", label: "Clientes" },
  { to: "/admin/faq", label: "FAQ" },
  { to: "/admin/equipo", label: "Equipo" },
  { to: "/admin/calidad", label: "Calidad" },
  { to: "/admin/newsletter", label: "Newsletter" },
  {
    to: "/admin/blog",
    label: "Blog",
    children: [
      { to: "/admin/blog", label: "Artículos", end: true },
      { to: "/admin/blog/autores", label: "Autores" },
      { to: "/admin/blog/categorias", label: "Categorías" },
      { to: "/admin/blog/etiquetas", label: "Etiquetas" },
    ],
  },
  { to: "/admin/configuracion", label: "Configuración" },
] as const;

function AdminSidebar({
  admin,
  onLogout,
  onNavigate,
}: {
  admin: AdminUser | null;
  onLogout: () => void;
  onNavigate?: () => void;
}) {
  const location = useLocation();

  return (
    <aside className="w-64 max-w-[85vw] bg-cu-black text-white flex flex-col h-full min-h-0 pb-[env(safe-area-inset-bottom,0px)]">
      <AdminSidebarHeader />
      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto overscroll-contain">
        {nav.map((item) => {
          const children = "children" in item ? item.children : undefined;
          const active = children
            ? location.pathname === item.to ||
              location.pathname.startsWith(`${item.to}/`)
            : location.pathname.startsWith(item.to);

          return (
            <div key={item.to}>
              <NavLink
                to={item.to}
                end={!children}
                onClick={onNavigate}
                className={`block px-3 py-2.5 text-sm rounded-sm transition-colors font-montserrat ${
                  active && !children
                    ? "bg-cu-orange text-cu-black font-semibold"
                    : active && children
                      ? "bg-white/10 text-white font-semibold"
                      : "text-white/70 hover:bg-white/10 hover:text-white"
                }`}
              >
                {item.label}
              </NavLink>
              {children && active && (
                <div className="ml-2 mt-0.5 mb-1 space-y-0.5 border-l border-white/15 pl-2">
                  {children.map((child) => {
                    const childEnd = "end" in child && child.end;
                    const childActive = childEnd
                      ? location.pathname === child.to
                      : location.pathname.startsWith(child.to);
                    return (
                      <NavLink
                        key={child.to}
                        to={child.to}
                        end={!!childEnd}
                        onClick={onNavigate}
                        className={`block px-2.5 py-1.5 text-xs rounded-sm font-montserrat ${
                          childActive
                            ? "bg-cu-orange text-cu-black font-semibold"
                            : "text-white/60 hover:bg-white/10 hover:text-white"
                        }`}
                      >
                        {child.label}
                      </NavLink>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
        {admin?.role === "superadmin" && (
          <NavLink
            to="/admin/administradores"
            onClick={onNavigate}
            className={`block px-3 py-2.5 text-sm rounded-sm font-montserrat ${
              location.pathname.startsWith("/admin/administradores")
                ? "bg-cu-orange text-cu-black font-semibold"
                : "text-white/70 hover:bg-white/10 hover:text-white"
            }`}
          >
            Administradores
          </NavLink>
        )}
      </nav>
      <AdminSidebarFooter admin={admin} onLogout={onLogout} />
    </aside>
  );
}

export default function AdminLayout() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { admin } = useAppSelector((s) => s.admin);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!sidebarOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [sidebarOpen]);

  const handleLogout = () => {
    setSidebarOpen(false);
    dispatch(logoutAdmin());
    navigate("/admin/login", { replace: true });
  };

  return (
    <div className="h-screen h-[100dvh] flex bg-cu-warm-white overflow-hidden max-w-[100vw]">
      <AdminMeta />
      {/* Desktop sidebar — fixed column; only main scrolls */}
      <div className="hidden md:flex md:shrink-0 h-full">
        <AdminSidebar admin={admin} onLogout={handleLogout} />
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/50 md:hidden"
              onClick={() => setSidebarOpen(false)}
              aria-hidden
            />
            <motion.div
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "tween", duration: 0.25 }}
              className="fixed inset-y-0 left-0 z-50 md:hidden"
            >
              <AdminSidebar
                admin={admin}
                onLogout={handleLogout}
                onNavigate={() => setSidebarOpen(false)}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div className="flex-1 flex flex-col min-h-0 min-w-0 overflow-hidden">
        <header className="md:hidden shrink-0 z-30 bg-white border-b border-cu-stone/20 px-4 py-3 flex items-center gap-3 pt-[max(0.75rem,env(safe-area-inset-top))]">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="p-2 -ml-1 text-cu-black hover:bg-cu-warm-white rounded-sm"
            aria-label="Abrir menú"
          >
            <Menu className="w-5 h-5" />
          </button>
          <BrandLogo variant="on-light" className="h-8 w-auto min-w-0" />
        </header>

        <main className="flex-1 min-h-0 p-4 sm:p-6 lg:p-8 overflow-x-hidden overflow-y-auto overscroll-contain min-w-0 w-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
