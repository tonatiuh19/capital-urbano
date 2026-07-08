import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PageMeta } from "@/components/seo/PageMeta";
import { PageHero } from "@/components/content/PageHero";
import { ContentAccordion } from "@/components/content/ContentAccordion";
import { apiGet, apiPost } from "@/lib/api";
import type { ContactPageData } from "@shared/api";
import { Mail, MapPin, Phone, Clock } from "lucide-react";
import { DevelopmentsMap } from "@/components/projects/DevelopmentsMap";
import { SkeletonContactSection } from "@/components/loading";
import { useShowQuerySkeleton } from "@/hooks/useShowQuerySkeleton";

export default function Contact() {
  const contactQ = useQuery({
    queryKey: ["contact-page"],
    queryFn: () => apiGet<ContactPageData>("/api/contact-page.php"),
  });

  const loading = useShowQuerySkeleton(contactQ);
  const settings = contactQ.data?.settings ?? {};
  const faq = contactQ.data?.faq ?? [];
  const developments = contactQ.data?.developments ?? [];
  const page = contactQ.data?.page;

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
    development_id: "",
    interest: "general",
    newsletter_opt_in: false,
  });
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");
    try {
      await apiPost("/api/contact.php", {
        ...form,
        development_id: form.development_id
          ? Number(form.development_id)
          : undefined,
        source_page: "/contact",
      });
      setStatus("ok");
      setForm({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
        development_id: "",
        interest: "general",
        newsletter_opt_in: false,
      });
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Error al enviar");
    }
  };

  return (
    <div className="cu-page min-h-screen bg-white">
      <PageMeta route="contact" page={page} />
      <Header />
      <section className="pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <PageHero
            label="Capital Urbano"
            title={page?.title ?? "Contacto"}
            subtitle={page?.meta_description ?? "Estamos listos para asesorarte"}
          />

          {loading ? (
            <SkeletonContactSection />
          ) : (
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 max-w-6xl mx-auto min-w-0">
            <div className="space-y-6">
              <h2 className="font-montserrat font-bold text-xl text-cu-black">
                Información general
              </h2>
              <ul className="space-y-4 text-cu-concrete">
                {settings.contact_email && (
                  <li className="flex gap-3">
                    <Mail className="text-cu-orange shrink-0" size={20} />
                    <a href={`mailto:${settings.contact_email}`} className="hover:text-cu-orange">
                      {settings.contact_email}
                    </a>
                  </li>
                )}
                {settings.contact_phone && (
                  <li className="flex gap-3">
                    <Phone className="text-cu-orange shrink-0" size={20} />
                    <span>{settings.contact_phone}</span>
                  </li>
                )}
                {settings.contact_address && (
                  <li className="flex gap-3">
                    <MapPin className="text-cu-orange shrink-0" size={20} />
                    <span>{settings.contact_address}</span>
                  </li>
                )}
                {settings.contact_hours && (
                  <li className="flex gap-3">
                    <Clock className="text-cu-orange shrink-0" size={20} />
                    <span>{settings.contact_hours}</span>
                  </li>
                )}
              </ul>

              {developments.length > 0 && (
                <div>
                  <h3 className="font-montserrat font-semibold text-cu-black mb-3">
                    Nuestros desarrollos
                  </h3>
                  <ul className="space-y-2 text-sm text-cu-concrete">
                    {developments.map((d) => (
                      <li key={d.id}>
                        <strong className="text-cu-black">{d.name}</strong>
                        {d.location_label && ` — ${d.location_label}`}
                        {d.delivery_estimate && (
                          <span className="block text-cu-stone">
                            Entrega: {d.delivery_estimate}
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <form
              onSubmit={handleSubmit}
              className="bg-cu-warm-white p-4 sm:p-8 rounded-sm border border-cu-stone/20 space-y-4 min-w-0"
            >
              <input
                required
                placeholder="Nombre *"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-4 py-3 border border-cu-stone/30 bg-white text-sm focus:border-cu-orange outline-none"
              />
              <input
                required
                type="email"
                placeholder="Correo *"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full px-4 py-3 border border-cu-stone/30 bg-white text-sm focus:border-cu-orange outline-none"
              />
              <input
                placeholder="Teléfono"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full px-4 py-3 border border-cu-stone/30 bg-white text-sm focus:border-cu-orange outline-none"
              />
              <select
                value={form.development_id}
                onChange={(e) => setForm({ ...form, development_id: e.target.value })}
                className="w-full px-4 py-3 border border-cu-stone/30 bg-white text-sm"
              >
                <option value="">Proyecto de interés (opcional)</option>
                {developments.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
              <select
                value={form.interest}
                onChange={(e) => setForm({ ...form, interest: e.target.value })}
                className="w-full px-4 py-3 border border-cu-stone/30 bg-white text-sm"
              >
                <option value="general">Consulta general</option>
                <option value="investment">Inversión</option>
                <option value="partnership">Alianza</option>
                <option value="press">Prensa</option>
                <option value="acquisition">Adquisición</option>
                <option value="other">Otro</option>
              </select>
              <input
                placeholder="Asunto"
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                className="w-full px-4 py-3 border border-cu-stone/30 bg-white text-sm focus:border-cu-orange outline-none"
              />
              <textarea
                required
                rows={5}
                placeholder="Mensaje *"
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="w-full px-4 py-3 border border-cu-stone/30 bg-white text-sm focus:border-cu-orange outline-none resize-none"
              />
              <label className="flex items-center gap-2 text-sm text-cu-concrete">
                <input
                  type="checkbox"
                  checked={form.newsletter_opt_in}
                  onChange={(e) =>
                    setForm({ ...form, newsletter_opt_in: e.target.checked })
                  }
                />
                Suscribirme a novedades de proyectos
              </label>
              <button
                type="submit"
                disabled={status === "loading"}
                className="w-full py-4 bg-cu-orange text-white font-montserrat font-semibold rounded-sm hover:bg-cu-orange-80 disabled:opacity-60"
              >
                {status === "loading" ? "Enviando…" : "Enviar mensaje"}
              </button>
              {status === "ok" && (
                <p className="text-sm text-green-700">Mensaje enviado. Te contactaremos pronto.</p>
              )}
              {status === "error" && (
                <p className="text-sm text-red-600">{errorMsg}</p>
              )}
            </form>
            </div>
          )}

          <div className="mt-20 mb-4 relative z-0">
            <DevelopmentsMap
              className="h-[400px] sm:h-[440px]"
              title="Nuestros desarrollos en el mapa"
              subtitle="Haz clic en un pin para ver el detalle de cada proyecto"
            />
          </div>

          {faq.length > 0 && (
            <div className="relative z-20 max-w-3xl mx-auto pt-8 pb-4 bg-white">
              <h2 className="text-3xl font-montserrat font-bold text-cu-black text-center mb-8 leading-tight">
                Preguntas frecuentes
              </h2>
              <ContentAccordion
                items={faq.map((item) => ({
                  id: String(item.id),
                  title: item.question,
                  content: item.answer,
                }))}
                variant="warm"
                defaultOpen={faq[0] ? String(faq[0].id) : undefined}
              />
            </div>
          )}
        </div>
      </section>
      <Footer />
    </div>
  );
}
