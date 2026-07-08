import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiPost } from "@/lib/api";

export const BYPASS_KEY = "cu_bypass";

export interface SiteConfig {
  under_construction?: boolean;
  site_name?: string;
  site_tagline?: string;
  coming_soon_title?: string;
  coming_soon_subtitle?: string;
  whatsapp_number?: string;
  instagram_url?: string;
  [key: string]: unknown;
}

interface SiteConfigState {
  config: SiteConfig;
  status: "loading" | "open" | "locked";
}

const initialState: SiteConfigState = {
  config: {},
  status: "loading",
};

export const fetchSiteConfig = createAsyncThunk("siteConfig/fetch", async () => {
  const res = await fetch("/api/site-config.php", {
    headers: { "Cache-Control": "no-store" },
  });
  const text = await res.text();
  if (!text.trim().startsWith("{")) {
    throw new Error("Invalid site-config response");
  }
  const data = JSON.parse(text) as { config?: SiteConfig; settings?: SiteConfig };
  return (data.config ?? data.settings ?? {}) as SiteConfig;
});

export const verifyBypassToken = createAsyncThunk(
  "siteConfig/verifyBypass",
  async (token: string) => {
    const data = await apiPost<{ valid: boolean }>("/api/bypass.php", {
      action: "verify",
      token,
    });
    return data.valid;
  },
);

const siteConfigSlice = createSlice({
  name: "siteConfig",
  initialState,
  reducers: {
    bypassGranted(state, action: { payload: string }) {
      localStorage.setItem(BYPASS_KEY, action.payload);
      state.status = "open";
    },
    setLocked(state) {
      state.status = "locked";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSiteConfig.fulfilled, (state, action) => {
        state.config = action.payload;
        if (!action.payload.under_construction) {
          state.status = "open";
        }
      })
      .addCase(fetchSiteConfig.rejected, (state) => {
        state.status = "open";
      })
      .addCase(verifyBypassToken.fulfilled, (state, action) => {
        if (action.payload) {
          state.status = "open";
        } else {
          localStorage.removeItem(BYPASS_KEY);
          state.status = "locked";
        }
      })
      .addCase(verifyBypassToken.rejected, (state) => {
        localStorage.removeItem(BYPASS_KEY);
        state.status = "locked";
      });
  },
});

export const { bypassGranted, setLocked } = siteConfigSlice.actions;
export default siteConfigSlice.reducer;
