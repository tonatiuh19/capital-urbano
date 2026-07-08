import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { Provider } from "react-redux";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { store } from "@/store/store";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminDevelopments from "./pages/admin/AdminDevelopments";
import AdminContacts from "./pages/admin/AdminContacts";
import AdminClients from "./pages/admin/AdminClients";
import AdminFaq from "./pages/admin/AdminFaq";
import AdminTeam from "./pages/admin/AdminTeam";
import AdminQuality from "./pages/admin/AdminQuality";
import AdminNewsletter from "./pages/admin/AdminNewsletter";
import AdminSettings from "./pages/admin/AdminSettings";
import AdminAdmins from "./pages/admin/AdminAdmins";
import AdminGuard from "./components/admin/AdminGuard";
import AdminLayout from "./components/admin/AdminLayout";
import Index from "./pages/Index";
import About from "./pages/About";
import Quality from "./pages/Quality";
import Projects from "./pages/Projects";
import ProjectDetail from "./pages/ProjectDetail";
import Experience from "./pages/Experience";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import SiteGate from "./components/SiteGate";
import { ScrollToTop } from "@/components/layout/ScrollToTop";
import { BrandClipDefs } from "@/components/brand/BrandClipDefs";

const App = () => (
  <Provider store={store}>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <BrandClipDefs />
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminGuard />}>
              <Route element={<AdminLayout />}>
                <Route index element={<Navigate to="dashboard" replace />} />
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="proyectos" element={<AdminDevelopments />} />
                <Route path="contactos" element={<AdminContacts />} />
                <Route path="clientes" element={<AdminClients />} />
                <Route path="faq" element={<AdminFaq />} />
                <Route path="equipo" element={<AdminTeam />} />
                <Route path="calidad" element={<AdminQuality />} />
                <Route path="newsletter" element={<AdminNewsletter />} />
                <Route path="configuracion" element={<AdminSettings />} />
                <Route path="administradores" element={<AdminAdmins />} />
              </Route>
            </Route>

            <Route
              path="/*"
              element={
                <SiteGate>
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/quality" element={<Quality />} />
                    <Route path="/projects" element={<Projects />} />
                    <Route path="/projects/:slug" element={<ProjectDetail />} />
                    <Route path="/experience" element={<Experience />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </SiteGate>
              }
            />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </Provider>
);

createRoot(document.getElementById("root")!).render(<App />);
