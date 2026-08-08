import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import {
  MapPin,
  Phone,
  Mail,
  Instagram,
  Linkedin,
  Facebook,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setLocked, BYPASS_KEY } from "@/store/slices/siteConfigSlice";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { BRAND_TAGLINE, BRAND_FOOTER_BLURB } from "@/lib/brand/copy";
import { isBlogFeatureEnabled } from "@/lib/featureFlags";

export function Footer() {
  const dispatch = useAppDispatch();
  const { config } = useAppSelector((s) => s.siteConfig);
  const blogEnabled = isBlogFeatureEnabled(config);
  const currentYear = new Date().getFullYear();
  const [logoClicks, setLogoClicks] = useState(0);
  const logoClickTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  /** Triple-click logo while site is in preview (bypass) → back to Próximamente (liv-capital pattern). */
  const handleLogoClick = () => {
    if (!config.under_construction) return;
    const next = logoClicks + 1;
    setLogoClicks(next);
    if (logoClickTimer.current) clearTimeout(logoClickTimer.current);
    if (next >= 3) {
      setLogoClicks(0);
      localStorage.removeItem(BYPASS_KEY);
      dispatch(setLocked());
      return;
    }
    logoClickTimer.current = setTimeout(() => setLogoClicks(0), 1500);
  };
  const instagramUrl = (config?.instagram_url as string)?.trim();
  const linkedinUrl = (config?.linkedin_url as string)?.trim();
  const facebookUrl = (config?.facebook_url as string)?.trim();
  const contactPhone = (config?.contact_phone as string)?.trim();
  const contactEmail = (config?.contact_email as string)?.trim();
  const contactAddress = (config?.contact_address as string)?.trim();
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterStatus, setNewsletterStatus] = useState<
    "idle" | "loading" | "ok" | "error"
  >("idle");
  const [newsletterMessage, setNewsletterMessage] = useState("");

  const handleNewsletter = async () => {
    const email = newsletterEmail.trim().toLowerCase();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setNewsletterStatus("error");
      setNewsletterMessage("Ingresa un correo válido.");
      return;
    }
    setNewsletterStatus("loading");
    setNewsletterMessage("");
    try {
      const res = await fetch("/api/newsletter.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "footer" }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error ?? "Error al suscribir");
      }
      setNewsletterStatus("ok");
      setNewsletterMessage("¡Listo! Te mantendremos informado.");
      setNewsletterEmail("");
    } catch (e) {
      setNewsletterStatus("error");
      setNewsletterMessage(
        e instanceof Error ? e.message : "No se pudo completar la suscripción.",
      );
    }
  };

  return (
    <footer className="bg-cu-black text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Company Info */}
          <div>
            <div
              className="mb-4 cursor-default select-none inline-block"
              onClick={handleLogoClick}
              role="presentation"
            >
              <BrandLogo variant="on-dark" className="h-10 w-auto" />
            </div>
            <p className="text-cu-black-40 text-sm font-josefin leading-relaxed mb-1">
              {BRAND_TAGLINE}
            </p>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              {BRAND_FOOTER_BLURB}
            </p>
            <div className="flex gap-4">
              {instagramUrl && (
                <a
                  href={instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-cu-orange transition-colors duration-300"
                  aria-label="Instagram"
                >
                  <Instagram size={20} />
                </a>
              )}
              {linkedinUrl && (
                <a
                  href={linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-cu-orange transition-colors duration-300"
                  aria-label="LinkedIn"
                >
                  <Linkedin size={20} />
                </a>
              )}
              {facebookUrl && (
                <a
                  href={facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-cu-orange transition-colors duration-300"
                  aria-label="Facebook"
                >
                  <Facebook size={20} />
                </a>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-montserrat font-bold uppercase tracking-widest mb-4">
              Navegación
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/"
                  className="text-gray-400 hover:text-cu-orange transition-colors text-sm"
                >
                  Inicio
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="text-gray-400 hover:text-cu-orange transition-colors text-sm"
                >
                  Nosotros
                </Link>
              </li>
              <li>
                <Link
                  to="/projects"
                  className="text-gray-400 hover:text-cu-orange transition-colors text-sm"
                >
                  Proyectos
                </Link>
              </li>
              <li>
                <Link
                  to="/quality"
                  className="text-gray-400 hover:text-cu-orange transition-colors text-sm"
                >
                  Calidad
                </Link>
              </li>
              {blogEnabled && (
                <li>
                  <Link
                    to="/blog"
                    className="text-gray-400 hover:text-cu-orange transition-colors text-sm"
                  >
                    Blog
                  </Link>
                </li>
              )}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-sm font-montserrat font-bold uppercase tracking-widest mb-4">
              Contacto
            </h4>
            <ul className="space-y-3">
              {contactPhone && (
                <li className="flex gap-3 text-sm text-gray-400">
                  <Phone
                    size={16}
                    className="text-cu-orange flex-shrink-0 mt-0.5"
                  />
                  <span>{contactPhone}</span>
                </li>
              )}
              {contactEmail && (
                <li className="flex gap-3 text-sm text-gray-400">
                  <Mail
                    size={16}
                    className="text-cu-orange flex-shrink-0 mt-0.5"
                  />
                  <a
                    href={`mailto:${contactEmail}`}
                    className="hover:text-cu-orange transition-colors"
                  >
                    {contactEmail}
                  </a>
                </li>
              )}
              {contactAddress && (
                <li className="flex gap-3 text-sm text-gray-400">
                  <MapPin
                    size={16}
                    className="text-cu-orange flex-shrink-0 mt-0.5"
                  />
                  <span>{contactAddress}</span>
                </li>
              )}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-sm font-montserrat font-bold uppercase tracking-widest mb-4">
              Mantente Actualizado
            </h4>
            <p className="text-gray-400 text-sm mb-4">
              Suscríbete para recibir información sobre nuestros nuevos
              proyectos.
            </p>
            <div className="flex flex-col sm:flex-row gap-2 min-w-0">
              <input
                type="email"
                placeholder="Tu correo"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleNewsletter()}
                disabled={newsletterStatus === "loading"}
                className="flex-1 min-w-0 px-4 py-2 bg-gray-800 border border-gray-700 text-white text-sm rounded-sm focus:outline-none focus:border-cu-orange transition-colors disabled:opacity-60"
              />
              <button
                type="button"
                onClick={handleNewsletter}
                disabled={newsletterStatus === "loading"}
                className="px-4 py-3 bg-cu-orange text-white font-montserrat font-semibold rounded-sm hover:bg-cu-orange-80 transition-colors min-w-[48px] disabled:opacity-60"
              >
                {newsletterStatus === "loading" ? "…" : "OK"}
              </button>
            </div>
            {newsletterMessage && (
              <p
                className={`text-xs mt-2 ${newsletterStatus === "ok" ? "text-green-400" : "text-red-400"}`}
              >
                {newsletterMessage}
              </p>
            )}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-gray-400">
            <p>
              &copy; {currentYear} Capital Urbano. Todos los derechos
              reservados.
            </p>
            <div className="flex flex-wrap justify-center sm:justify-end gap-6">
              <Link
                to="/admin/login"
                className="text-white/25 hover:text-white/50 transition-colors"
              >
                Admin
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
