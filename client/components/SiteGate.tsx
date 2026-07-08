import { useEffect } from "react";
import UnderConstruction from "@/pages/UnderConstruction";
import { WhatsAppFab } from "@/components/layout/WhatsAppFab";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  fetchSiteConfig,
  verifyBypassToken,
  bypassGranted,
  setLocked,
  BYPASS_KEY,
} from "@/store/slices/siteConfigSlice";

export type { SiteConfig } from "@/store/slices/siteConfigSlice";

export default function SiteGate({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const { status, config } = useAppSelector((s) => s.siteConfig);

  useEffect(() => {
    async function check() {
      const result = await dispatch(fetchSiteConfig());

      if (fetchSiteConfig.rejected.match(result)) {
        return;
      }

      const cfg = result.payload;
      if (!cfg.under_construction) {
        return;
      }

      const stored = localStorage.getItem(BYPASS_KEY);
      if (stored) {
        await dispatch(verifyBypassToken(stored));
        return;
      }

      dispatch(setLocked());
    }

    check();
  }, [dispatch]);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-cu-black flex items-center justify-center">
        <div className="w-5 h-5 border-2 border-cu-orange border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (status === "locked") {
    return (
      <UnderConstruction
        config={config}
        onBypass={(token) => dispatch(bypassGranted(token))}
      />
    );
  }

  return (
    <>
      {children}
      <WhatsAppFab />
    </>
  );
}
