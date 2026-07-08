import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import adminAxios from "@/store/axiosAdmin";
import { getAdminApiError } from "@/lib/adminApi";

export interface AdminMember {
  id: number;
  name: string;
  email: string;
  role: "superadmin" | "admin";
  is_active: number;
  created_at?: string;
}

export const fetchAdmins = createAsyncThunk("adminAdmins/fetch", async () => {
  const { data } = await adminAxios.get("/api/admin/admins.php");
  return data as { admins: AdminMember[] };
});

export const createAdmin = createAsyncThunk(
  "adminAdmins/create",
  async (
    payload: { name: string; email: string; role: "superadmin" | "admin" },
    { rejectWithValue },
  ) => {
    try {
      const { data } = await adminAxios.post("/api/admin/admins.php", payload);
      return {
        ...payload,
        id: data.id as number,
        is_active: 1,
      } as AdminMember;
    } catch (err) {
      return rejectWithValue(getAdminApiError(err, "Error al crear"));
    }
  },
);

export const updateAdmin = createAsyncThunk(
  "adminAdmins/update",
  async (
    payload: Partial<AdminMember> & { id: number },
    { rejectWithValue },
  ) => {
    try {
      await adminAxios.put("/api/admin/admins.php", payload);
      return payload;
    } catch (err) {
      return rejectWithValue(getAdminApiError(err, "Error al actualizar"));
    }
  },
);

export const deactivateAdmin = createAsyncThunk(
  "adminAdmins/deactivate",
  async (id: number, { rejectWithValue }) => {
    try {
      await adminAxios.delete("/api/admin/admins.php", { params: { id } });
      return id;
    } catch (err) {
      return rejectWithValue(getAdminApiError(err, "Error al desactivar"));
    }
  },
);

const slice = createSlice({
  name: "adminAdmins",
  initialState: {
    admins: [] as AdminMember[],
    loading: false,
    saving: false,
    error: null as string | null,
  },
  reducers: {
    clearAdminAdminsError(state) {
      state.error = null;
    },
  },
  extraReducers: (b) => {
    b.addCase(fetchAdmins.pending, (s) => {
      s.loading = true;
      s.error = null;
    })
      .addCase(fetchAdmins.fulfilled, (s, a) => {
        s.loading = false;
        s.admins = a.payload.admins;
      })
      .addCase(fetchAdmins.rejected, (s) => {
        s.loading = false;
        s.error = "Error al cargar administradores";
      })
      .addCase(createAdmin.pending, (s) => {
        s.saving = true;
      })
      .addCase(createAdmin.fulfilled, (s, a) => {
        s.saving = false;
        s.admins.push(a.payload);
      })
      .addCase(createAdmin.rejected, (s) => {
        s.saving = false;
      })
      .addCase(updateAdmin.pending, (s) => {
        s.saving = true;
      })
      .addCase(updateAdmin.fulfilled, (s, a) => {
        s.saving = false;
        const i = s.admins.findIndex((x) => x.id === a.payload.id);
        if (i !== -1) s.admins[i] = { ...s.admins[i], ...a.payload };
      })
      .addCase(updateAdmin.rejected, (s) => {
        s.saving = false;
      })
      .addCase(deactivateAdmin.fulfilled, (s, a) => {
        const i = s.admins.findIndex((x) => x.id === a.payload);
        if (i !== -1) s.admins[i].is_active = 0;
      });
  },
});

export const { clearAdminAdminsError } = slice.actions;
export default slice.reducer;
