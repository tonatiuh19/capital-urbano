import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { useHomeHeroImmersive } from "@/hooks/useHomeHeroImmersive";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Inicio", href: "/" },
  { label: "Nosotros", href: "/about" },
  { label: "Calidad", href: "/quality" },
  { label: "Proyectos", href: "/projects" },
  { label: "Experiencia", href: "/experience" },
  { label: "Contacto", href: "/contact" },
] as const;

function navClassName(isActive: boolean, mobile = false) {
  const base =
    "font-montserrat font-medium transition-colors duration-300 rounded-sm";
  if (mobile) {
    return `${base} block px-4 py-3 text-sm ${
      isActive
        ? "text-cu-orange bg-cu-orange/10 font-semibold"
        : "text-cu-black hover:text-cu-orange hover:bg-cu-warm-white"
    }`;
  }
  return `${base} px-4 py-2 text-sm ${
    isActive
      ? "text-cu-orange bg-cu-orange/10 font-semibold"
      : "text-cu-black hover:text-cu-orange"
  }`;
}

type HeaderProps = {
  /** Home only: logo-only bar until user scrolls past the hero intro sentinel. */
  immersiveUntilScroll?: boolean;
};

export function Header({ immersiveUntilScroll = false }: HeaderProps) {
  const { isImmersive: immersive, pastHeroIntro } =
    useHomeHeroImmersive(immersiveUntilScroll);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    if (pastHeroIntro) setIsMenuOpen(false);
  }, [pastHeroIntro]);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 w-full overflow-x-hidden pt-[env(safe-area-inset-top,0px)] transition-[background-color,border-color,box-shadow] duration-500 ease-out",
        immersive
          ? "bg-transparent border-b border-transparent shadow-none"
          : "bg-white/95 backdrop-blur-lg border-b border-cu-stone/20 shadow-sm",
      )}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between min-w-0 gap-2">
        <NavLink
          to="/"
          className="flex items-center shrink-0 min-w-0 max-w-[45vw] sm:max-w-none z-10"
          end
        >
          <BrandLogo
            variant={immersive ? "on-dark" : "on-light"}
            className="h-9 sm:h-10 w-auto max-w-full"
          />
        </NavLink>

        <div
          className={cn(
            "hidden lg:flex items-center gap-1 transition-all duration-500 ease-out",
            immersive
              ? "opacity-0 invisible pointer-events-none -translate-y-2 max-w-0 overflow-hidden"
              : "opacity-100 visible pointer-events-auto translate-y-0 max-w-none",
          )}
          aria-hidden={immersive}
        >
          {navItems.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              end={item.href === "/"}
              className={({ isActive }) => navClassName(isActive)}
            >
              {item.label}
            </NavLink>
          ))}
        </div>

        <div
          className={cn(
            "hidden lg:block transition-all duration-500 ease-out",
            immersive
              ? "opacity-0 invisible pointer-events-none -translate-y-2 w-0 overflow-hidden"
              : "opacity-100 visible pointer-events-auto translate-y-0 w-auto",
          )}
          aria-hidden={immersive}
        >
          <NavLink
            to="/contact"
            className={({ isActive }) =>
              `inline-flex items-center gap-2 px-6 py-3 font-montserrat font-semibold rounded-sm transition-colors duration-300 ${
                isActive
                  ? "bg-cu-black text-white hover:bg-cu-black/90"
                  : "bg-cu-orange text-white hover:bg-cu-orange-80"
              }`
            }
          >
            Contáctanos
          </NavLink>
        </div>

        <button
          type="button"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className={cn(
            "lg:hidden p-2 rounded-sm transition-colors duration-300 shrink-0",
            immersive ? "text-white hover:text-cu-orange" : "text-cu-black hover:text-cu-orange",
          )}
          aria-label={isMenuOpen ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={isMenuOpen}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {isMenuOpen && (
        <div className="lg:hidden bg-white border-b border-cu-stone/20 max-h-96 overflow-y-auto">
          <div className="px-4 py-3 space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.href}
                to={item.href}
                end={item.href === "/"}
                onClick={() => setIsMenuOpen(false)}
                className={({ isActive }) => navClassName(isActive, true)}
              >
                {item.label}
              </NavLink>
            ))}
            <div className="pt-3 border-t border-cu-stone/20">
              <NavLink
                to="/contact"
                onClick={() => setIsMenuOpen(false)}
                className={({ isActive }) =>
                  `block w-full px-4 py-3 font-montserrat font-semibold text-center rounded-sm transition-colors ${
                    isActive
                      ? "bg-cu-black text-white"
                      : "bg-cu-orange text-white hover:bg-cu-orange-80"
                  }`
                }
              >
                Contáctanos
              </NavLink>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
