import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, RefreshCw, Shield } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  checkAdminEmail,
  sendAdminOtp,
  verifyAdminOtp,
  resetAdminFlow,
  clearAdminError,
} from "@/store/slices/adminSlice";
import { ADMIN_TOKEN_KEY } from "@/store/axiosAdmin";
import { AdminMeta } from "@/components/seo/AdminMeta";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { BRAND_TAGLINE } from "@/lib/brand/copy";

type Step = "email" | "otp";

const ADMIN_FEATURES = [
  "Proyectos y portafolio en el mapa",
  "Contactos, clientes y newsletter",
  "Páginas, FAQ, equipo y configuración",
] as const;

function AdminBrandLogo({
  className = "h-12 w-auto",
  variant = "on-dark",
}: {
  className?: string;
  variant?: "on-dark" | "on-light";
}) {
  return <BrandLogo className={className} variant={variant} />;
}

export default function AdminLogin() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { status, otpSent, adminName, error, admin } = useAppSelector(
    (s) => s.admin,
  );

  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const year = new Date().getFullYear();

  useEffect(() => {
    if (localStorage.getItem(ADMIN_TOKEN_KEY)) {
      navigate("/admin/dashboard", { replace: true });
    }
  }, [navigate]);

  useEffect(() => {
    if (admin) navigate("/admin/dashboard", { replace: true });
  }, [admin, navigate]);

  useEffect(() => {
    if (adminName && !otpSent && step === "email") {
      dispatch(sendAdminOtp(email));
    }
    if (otpSent) setStep("otp");
  }, [adminName, otpSent, step, email, dispatch]);

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(clearAdminError());
    dispatch(checkAdminEmail(email.trim().toLowerCase()));
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(clearAdminError());
    dispatch(verifyAdminOtp({ email, code: otp }));
  };

  const isLoading = status === "loading";

  return (
    <div className="cu-page min-h-screen flex flex-col md:flex-row overflow-x-hidden">
      <AdminMeta title="Iniciar sesión — Admin" />
      {/* Branding column */}
      <motion.aside
        initial={{ opacity: 0, x: -24 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="hidden md:flex md:w-1/2 lg:w-[46%] bg-cu-black flex-col justify-between p-10 lg:p-12 relative overflow-hidden"
        aria-label="Capital Urbano — panel administrativo"
      >
        <div className="absolute inset-0 pointer-events-none opacity-[0.07]">
          <svg width="100%" height="100%" preserveAspectRatio="none" aria-hidden>
            <defs>
              <pattern
                id="cu-admin-grid"
                width="40"
                height="40"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 40 0 L 0 0 0 40"
                  fill="none"
                  stroke="#E87722"
                  strokeWidth="0.8"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#cu-admin-grid)" />
          </svg>
        </div>
        <div
          className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[28rem] h-[28rem] rounded-full pointer-events-none"
          style={{
            background:
              "radial-gradient(circle, rgba(232,119,34,0.12) 0%, transparent 70%)",
          }}
          aria-hidden
        />

        <div className="relative z-10">
          <AdminBrandLogo />
        </div>

        <div className="relative z-10 flex-1 flex flex-col justify-center py-10 lg:py-14">
          <div className="w-10 h-0.5 bg-cu-orange mb-8" aria-hidden />
          <h1 className="font-montserrat font-bold text-white text-3xl xl:text-4xl leading-tight mb-5">
            Bienvenido al
            <br />
            <span className="text-cu-orange">Panel Administrativo</span>
          </h1>
          <p className="font-montserrat text-white/55 text-base leading-relaxed max-w-md">
            Gestiona el sitio corporativo de Capital Urbano: desarrollos,
            contenido, contactos y configuración desde un solo lugar.
          </p>

          <ul className="mt-12 space-y-4 list-none m-0 p-0">
            {ADMIN_FEATURES.map((item) => (
              <li key={item} className="flex items-center gap-3">
                <span
                  className="w-1.5 h-1.5 rounded-full bg-cu-orange shrink-0"
                  aria-hidden
                />
                <span className="text-white/45 font-montserrat text-sm">
                  {item}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <p className="relative z-10 text-white/25 font-montserrat text-xs">
          © {year} Capital Urbano — {BRAND_TAGLINE}
        </p>
      </motion.aside>

      {/* Form column */}
      <div className="flex-1 flex flex-col items-center justify-center bg-cu-warm-white px-6 py-12 md:px-12 min-h-screen md:min-h-0">
        <div className="md:hidden w-full max-w-sm mb-10">
          <AdminBrandLogo className="h-10 w-auto" variant="on-light" />
        </div>

        <motion.div
          key={step}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="w-full max-w-md"
        >
          <div className="flex items-center gap-2 mb-8">
            <div className="w-9 h-9 bg-cu-black rounded-sm flex items-center justify-center">
              <Shield className="w-4 h-4 text-cu-orange" strokeWidth={1.75} />
            </div>
            <span className="font-montserrat text-cu-black font-semibold text-sm tracking-wide">
              Acceso administrativo
            </span>
          </div>

          <AnimatePresence mode="wait">
            {step === "email" ? (
              <motion.form
                key="email"
                onSubmit={handleEmailSubmit}
                className="space-y-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div>
                  <h2 className="font-montserrat text-2xl font-semibold text-cu-black">
                    Iniciar sesión
                  </h2>
                  <p className="text-cu-concrete text-sm mt-2 leading-relaxed">
                    Ingresa tu correo de administrador. Te enviaremos un código
                    de un solo uso.
                  </p>
                </div>
                <div>
                  <label
                    htmlFor="admin-email"
                    className="block text-xs font-montserrat font-medium text-cu-black mb-1.5 uppercase tracking-wide"
                  >
                    Correo electrónico
                  </label>
                  <input
                    id="admin-email"
                    type="email"
                    required
                    autoFocus
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@capitalurbano.mx"
                    className="w-full border border-cu-stone/50 bg-white px-4 py-3 text-sm rounded-sm focus:outline-none focus:border-cu-orange transition-colors"
                  />
                </div>
                {error && <p className="text-sm text-red-600">{error}</p>}
                <button
                  type="submit"
                  disabled={isLoading || !email.trim()}
                  className="w-full flex items-center justify-center gap-2 bg-cu-black text-white py-3 text-sm font-medium rounded-sm hover:bg-cu-black/90 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      Continuar
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </motion.form>
            ) : (
              <motion.form
                key="otp"
                onSubmit={handleOtpSubmit}
                className="space-y-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div>
                  <h2 className="font-montserrat text-2xl font-semibold text-cu-black">
                    {adminName ? `Hola, ${adminName}` : "Código de acceso"}
                  </h2>
                  <p className="text-cu-concrete text-sm mt-2 leading-relaxed">
                    Enviamos un código de 6 dígitos a{" "}
                    <span className="text-cu-black font-medium">{email}</span>
                  </p>
                </div>
                <div>
                  <label
                    htmlFor="admin-otp"
                    className="block text-xs font-montserrat font-medium text-cu-black mb-1.5 uppercase tracking-wide"
                  >
                    Código de verificación
                  </label>
                  <input
                    id="admin-otp"
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]{6}"
                    maxLength={6}
                    required
                    autoFocus
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                    placeholder="000000"
                    className="w-full border border-cu-stone/50 bg-white px-4 py-3 text-center text-xl sm:text-2xl tracking-[0.35em] sm:tracking-[0.5em] font-mono rounded-sm focus:outline-none focus:border-cu-orange"
                  />
                </div>
                {error && <p className="text-sm text-red-600">{error}</p>}
                <button
                  type="submit"
                  disabled={isLoading || otp.length !== 6}
                  className="w-full bg-cu-orange text-cu-black py-3 text-sm font-semibold rounded-sm hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Verificando…" : "Entrar al panel"}
                </button>
                <div className="flex flex-col gap-3 sm:flex-row sm:justify-between text-xs font-montserrat">
                  <button
                    type="button"
                    onClick={() => {
                      dispatch(resetAdminFlow());
                      setStep("email");
                      setOtp("");
                    }}
                    className="text-cu-concrete hover:text-cu-black"
                  >
                    ← Cambiar correo
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setOtp("");
                      dispatch(clearAdminError());
                      dispatch(sendAdminOtp(email));
                    }}
                    disabled={isLoading}
                    className="flex items-center gap-1 text-cu-concrete hover:text-cu-black disabled:opacity-50"
                  >
                    <RefreshCw className="w-3 h-3" />
                    Reenviar código
                  </button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>

          <p className="mt-10 text-center">
            <Link
              to="/"
              className="text-xs font-montserrat text-cu-concrete hover:text-cu-orange transition-colors"
            >
              ← Volver al sitio público
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
