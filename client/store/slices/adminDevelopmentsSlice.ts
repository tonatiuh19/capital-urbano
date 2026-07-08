import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import adminAxios from "@/store/axiosAdmin";
import { getAdminApiError } from "@/lib/adminApi";
import type { Development } from "@shared/api";

export const fetchAdminDevelopments = createAsyncThunk(
  "adminDev/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await adminAxios.get("/api/admin/developments.php");
      return data.developments as Development[];
    } catch (err) {
      return rejectWithValue(getAdminApiError(err, "Error al cargar proyectos"));
    }
  },
);

export const fetchAdminDevelopment = createAsyncThunk(
  "adminDev/fetchOne",
  async (id: number, { rejectWithValue }) => {
    try {
      const { data } = await adminAxios.get(`/api/admin/developments.php?id=${id}`);
      return data.development as Development;
    } catch (err) {
      return rejectWithValue(getAdminApiError(err, "Proyecto no encontrado"));
    }
  },
);

export const saveDevelopment = createAsyncThunk(
  "adminDev/save",
  async (payload: Partial<Development> & { id?: number }, { rejectWithValue }) => {
    try {
      const body = { ...payload } as Record<string, unknown>;
      if (body.latitude !== undefined && body.latitude !== null && body.latitude !== "") {
        body.latitude = Number(body.latitude);
      } else if (body.latitude === "") {
        body.latitude = null;
      }
      if (body.longitude !== undefined && body.longitude !== null && body.longitude !== "") {
        body.longitude = Number(body.longitude);
      } else if (body.longitude === "") {
        body.longitude = null;
      }
      if (body.id) {
        await adminAxios.put("/api/admin/developments.php", body);
        return payload as Development;
      }
      const { data } = await adminAxios.post("/api/admin/developments.php", body);
      return { ...payload, id: data.id as number } as Development;
    } catch (err) {
      return rejectWithValue(getAdminApiError(err));
    }
  },
);

export const deleteDevelopment = createAsyncThunk(
  "adminDev/delete",
  async (id: number, { rejectWithValue }) => {
    try {
      await adminAxios.delete(`/api/admin/developments.php?id=${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(getAdminApiError(err, "Error al desactivar"));
    }
  },
);

const slice = createSlice({
  name: "adminDevelopments",
  initialState: {
    list: [] as Development[],
    current: null as Development | null,
    loading: false,
    saving: false,
    error: null as string | null,
  },
  reducers: {
    clearCurrent(state) {
      state.current = null;
    },
    clearDevError(state) {
      state.error = null;
    },
  },
  extraReducers: (b) => {
    b.addCase(fetchAdminDevelopments.pending, (s) => {
      s.loading = true;
      s.error = null;
    })
      .addCase(fetchAdminDevelopments.fulfilled, (s, a) => {
        s.list = a.payload;
        s.loading = false;
      })
      .addCase(fetchAdminDevelopments.rejected, (s, a) => {
        s.loading = false;
        s.error = (a.payload as string) ?? "Error";
      })
      .addCase(fetchAdminDevelopment.pending, (s) => {
        s.loading = true;
        s.error = null;
      })
      .addCase(fetchAdminDevelopment.fulfilled, (s, a) => {
        s.current = a.payload;
        s.loading = false;
      })
      .addCase(fetchAdminDevelopment.rejected, (s, a) => {
        s.loading = false;
        s.error = (a.payload as string) ?? "Error";
      })
      .addCase(saveDevelopment.pending, (s) => {
        s.saving = true;
        s.error = null;
      })
      .addCase(saveDevelopment.fulfilled, (s) => {
        s.saving = false;
        s.current = null;
      })
      .addCase(saveDevelopment.rejected, (s, a) => {
        s.saving = false;
        s.error = (a.payload as string) ?? "Error";
      })
      .addCase(deleteDevelopment.fulfilled, (s, a) => {
        s.list = s.list.filter((d) => d.id !== a.payload);
      });
  },
});

export const { clearCurrent, clearDevError } = slice.actions;
export default slice.reducer;
