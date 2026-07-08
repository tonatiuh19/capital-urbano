import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { PageMeta } from "@/components/seo/PageMeta";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname,
    );
  }, [location.pathname]);

  return (
    <div className="cu-page min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <PageMeta route="notFound" noIndex />
      <div className="text-center px-4 w-full max-w-sm">
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-4">Página no encontrada</p>
        <a href="/" className="text-cu-orange hover:underline font-medium">
          Volver al inicio
        </a>
      </div>
    </div>
  );
};

export default NotFound;
