import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef } from "react";
import { Instagram, X, Eye, EyeOff } from "lucide-react";
import type { SiteConfig } from "@/components/SiteGate";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { MetaTags } from "@/components/seo/MetaTags";
import { truncateMetaDescription } from "@/lib/seo";

interface Props {
  config: SiteConfig;
  onBypass: (token: string) => void;
}

export default function UnderConstruction({ config, onBypass }: Props) {
  const title =
    (config.coming_soon_title as string) ||
    (config.site_name as string) ||
    "Capital Urbano";
  const subtitle =
    (config.coming_soon_subtitle as string) ||
    (config.site_tagline as string) ||
    "Desarrollos verticales de excelencia en Guadalajara";
  const instagramUrl = (config.instagram_url as string) ?? "";
  const whatsappNumber = (config.whatsapp_number as string) ?? "";

  const clickCount = useRef(0);
  const clickTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [pwdState, setPwdState] = useState<"idle" | "loading" | "error">("idle");

  const handleLogoClick = () => {
    clickCount.current += 1;
    if (clickTimer.current) clearTimeout(clickTimer.current);
    if (clickCount.current >= 3) {
      clickCount.current = 0;
      setShowModal(true);
    } else {
      clickTimer.current = setTimeout(() => {
        clickCount.current = 0;
      }, 1800);
    }
  };

  const handleBypassSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwdState("loading");
    try {
      const res = await fetch("/api/bypass.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "login", password }),
      });
      const data = await res.json();
      if (data.valid && data.token) {
        onBypass(data.token);
      } else {
        setPwdState("error");
      }
    } catch {
      setPwdState("error");
    }
  };

  const letters = title.toUpperCase().split("");

  return (
    <div className="cu-page relative min-h-screen bg-cu-black overflow-x-hidden overflow-y-auto flex flex-col select-none">
      <MetaTags
        title={title}
        description={truncateMetaDescription(subtitle)}
        titleMode="full"
        canonicalPath="/"
        noIndex
        noFollow
      />
      <div className="absolute inset-0 pointer-events-none opacity-[0.06] cu-urban-pattern" aria-hidden />

      <div className="relative z-10 pt-8 flex justify-center">
        <button
          type="button"
          onClick={handleLogoClick}
          className="opacity-70 hover:opacity-100 transition-opacity focus:outline-none"
          aria-label={title}
        >
          <BrandLogo variant="on-dark" className="h-14 sm:h-16 w-auto" alt={title} />
        </button>
      </div>

      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 text-center">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: 48 }}
          className="h-0.5 bg-cu-orange mb-7"
        />
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-montserrat text-cu-orange text-xs uppercase tracking-[0.35em] mb-6"
        >
          Próximamente
        </motion.p>
        <h1 className="flex flex-wrap justify-center gap-0 mb-4">
          {letters.map((letter, i) =>
            letter === " " ? (
              <span key={i} className="w-3 sm:w-4" />
            ) : (
              <span key={i} className="overflow-hidden inline-block">
                <motion.span
                  className="inline-block font-montserrat font-extrabold text-white text-3xl sm:text-5xl md:text-6xl lg:text-7xl leading-none"
                  initial={{ y: "100%", opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.15 + i * 0.04, duration: 0.5 }}
                >
                  {letter}
                </motion.span>
              </span>
            ),
          )}
        </h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="font-montserrat text-white/50 text-sm sm:text-base max-w-md"
        >
          {subtitle}
        </motion.p>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="relative z-10 pb-8 px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-white/30 text-xs font-montserrat"
      >
        <span>© {new Date().getFullYear()} Capital Urbano</span>
        <div className="flex items-center gap-4">
          {instagramUrl && (
            <a href={instagramUrl} target="_blank" rel="noopener noreferrer" className="hover:text-cu-orange">
              <Instagram className="w-4 h-4" />
            </a>
          )}
          {whatsappNumber && (
            <a
              href={`https://wa.me/${whatsappNumber.replace(/\D/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-cu-orange uppercase tracking-wider"
            >
              WhatsApp
            </a>
          )}
        </div>
      </motion.div>

      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/70 backdrop-blur-sm"
            onClick={(e) => {
              if (e.target === e.currentTarget) setShowModal(false);
            }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-cu-black border border-white/10 p-8 w-full max-w-sm relative"
            >
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="absolute top-4 right-4 text-white/40 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
              <h2 className="font-montserrat font-bold text-white mb-4">Acceso</h2>
              <form onSubmit={handleBypassSubmit} className="space-y-4">
                <div className="relative">
                  <input
                    type={showPwd ? "text" : "password"}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setPwdState("idle");
                    }}
                    className="w-full bg-white/5 border border-white/10 px-4 py-3 pr-10 text-white text-sm"
                    placeholder="Clave de acceso"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => setShowPwd((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40"
                  >
                    {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {pwdState === "error" && (
                  <p className="text-red-400 text-xs">Clave incorrecta</p>
                )}
                <button
                  type="submit"
                  disabled={pwdState === "loading"}
                  className="w-full bg-cu-orange text-cu-black font-semibold py-3 text-sm disabled:opacity-50"
                >
                  {pwdState === "loading" ? "…" : "Entrar"}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
