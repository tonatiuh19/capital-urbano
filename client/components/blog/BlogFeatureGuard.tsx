import { Navigate } from "react-router-dom";
import { useBlogFeatureEnabled } from "@/lib/featureFlags";

/** Public routes: /blog and /blog/:slug → home when feature is off. */
export function BlogPublicGuard({ children }: { children: React.ReactNode }) {
  const { enabled, isLoading, isFetched } = useBlogFeatureEnabled();
  if (isLoading || !isFetched) {
    return (
      <div className="min-h-[40vh] flex items-center justify-center text-cu-concrete text-sm">
        Cargando…
      </div>
    );
  }
  if (!enabled) return <Navigate to="/" replace />;
  return <>{children}</>;
}
