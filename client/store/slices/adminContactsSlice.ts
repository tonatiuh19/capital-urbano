import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import adminAxios from "@/store/axiosAdmin";
import { getAdminApiError } from "@/lib/adminApi";

export interface ContactSubmission {
  id: number;
  name: string;
  email: string;
  phone?: string;
  interest: string;
  subject?: string;
  message: string;
  source: string;
  status: string;
  development_name?: string;
  client_notes?: string;
  created_at: string;
}

export const fetchAdminContacts = createAsyncThunk(
  "adminContacts/fetch",
  async (params: { status?: string; page?: number }) => {
    const q = new URLSearchParams();
    if (params.status) q.set("status", params.status);
    if (params.page) q.set("page", String(params.page));
    const { data } = await adminAxios.get(`/api/admin/contacts.php?${q}`);
    return data as {
      contacts: ContactSubmission[];
      total: number;
      page: number;
      total_pages: number;
    };
  },
);

export const updateContact = createAsyncThunk(
  "adminContacts/update",
  async (
    payload: { id: number; status?: string; client_notes?: string },
    { rejectWithValue },
  ) => {
    try {
      await adminAxios.put("/api/admin/contacts.php", payload);
      return payload;
    } catch (err) {
      return rejectWithValue(getAdminApiError(err, "Error al actualizar"));
    }
  },
);

const slice = createSlice({
  name: "adminContacts",
  initialState: {
    contacts: [] as ContactSubmission[],
    total: 0,
    page: 1,
    totalPages: 0,
    loading: false,
    saving: false,
  },
  reducers: {},
  extraReducers: (b) => {
    b.addCase(fetchAdminContacts.pending, (s) => {
      s.loading = true;
    })
      .addCase(fetchAdminContacts.fulfilled, (s, a) => {
        s.loading = false;
        s.contacts = a.payload.contacts;
        s.total = a.payload.total;
        s.page = a.payload.page;
        s.totalPages = a.payload.total_pages;
      })
      .addCase(fetchAdminContacts.rejected, (s) => {
        s.loading = false;
      })
      .addCase(updateContact.pending, (s) => {
        s.saving = true;
      })
      .addCase(updateContact.fulfilled, (s, a) => {
        s.saving = false;
        const c = s.contacts.find((x) => x.id === a.payload.id);
        if (c) {
          if (a.payload.status) c.status = a.payload.status;
          if (a.payload.client_notes !== undefined)
            c.client_notes = a.payload.client_notes;
        }
      })
      .addCase(updateContact.rejected, (s) => {
        s.saving = false;
      });
  },
});

export default slice.reducer;
